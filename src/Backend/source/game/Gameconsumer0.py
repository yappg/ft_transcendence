import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .MatchMaking import MatchMakingSystem
from accounts.models import Player, PlayerProfile
from game.models import Game

matchmake_system = MatchMakingSystem()

RED = '\033[31m'
GREEN = '\033[32m'
YELLOW = '\033[33m'
BLUE = '\033[34m'
RESET = '\033[0m'
#TODO handle the unexpected disconnects and game state details

class GameConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        self.game = None
        self.game_tick = None
        super().__init__(*args, **kwargs)

    async def connect(self):
        if not self.scope["user"].is_authenticated:
            await self.close()
            return

        self.user = self.scope["user"]
        self.profile = await database_sync_to_async(PlayerProfile.objects.get)(player=self.user)
        self.opponent = None
        self.Gameplayer = None
        print(f'\n{GREEN}[User Authenticated {self.user}]{RESET}\n')

        if not matchmake_system._running:
            await matchmake_system.start()
        #TODO to fix 
        # self.profile.status = 'waiting'
        # await database_sync_to_async(self.profile.save)()

        await self.accept()

        if not self.player_in_QG():
            print(f'\n{YELLOW}[Adding Player to Queue]{RESET}\n')
            await matchmake_system.add_player_to_queue(self.user.id, self.user.username, self.channel_name)
        else:
            print(f'\n{YELLOW}[User Already in a Game]{RESET}\n')

    def player_in_QG(self):
        return (self.user.id in matchmake_system.players_in_game) or (self.user.id in matchmake_system.players_queue)

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            action  = data.get('action')
            print(f'\n{YELLOW}data: [{data}]{RESET}\n')

            if action == 'ready':
                game_id = data.get('game_id', None)
                if not game_id :
                    return
                self.game_id = game_id 
                self.game = matchmake_system.games[int(data.get('game_id'))]
                if not self.game:
                    return
                await self.set_Gameplayers_to_consumer()
                self.Gameplayer.status = 'ready'
                self.broadcast_ready()
                #TODO Am not sure if we still need this sleep for synchronization or not[CHECK with the Noredin]
                await asyncio.sleep(2)

                if self.game.status == 'waiting':
                    print(f'\n{BLUE}[Game Ready to Start]{RESET}\n')
                    self.game.start_game()
                    await self.broadcast_ready()

                    self.game_tick = asyncio.create_task(self.start_game_loop())
            elif action == 'move_paddle':
                if not self.game or self.game.status != 'playing' :
                    return
                if self.game:
                    new_x = data.get('new_x')#, 50)
                    await self.game.move_paddle(self.user.id, new_x)
                    await self.share_paddle_move(new_x)
        except Exception as e:
            print(f'\n{RED}[Error in Receive {str(e)}]{RESET}\n')
            #TODO handle the exception
            pass
    
    #------------------------------------>>>>>Game loop<<<<<<<------------------------------
    async def start_game_loop(self):
        try :
            await self.broadcast_ball_move()
            while self.game and self.game.status == 'playing'\
                and self.game.player1.status == 'ready' and self.game.player2.status == 'ready':
                delta_time = 0.016 #60 FPS
                if await self.game.update(delta_time):
                    await self.broadcast_ball_move()
                    print(f'\n{YELLOW}players score : [{self.game.player1.score}, {self.game.player2.score}]{RESET}\n')
                await asyncio.sleep(delta_time)
            if self.game and self.game.status == 'finished':
                await self.broadcast_ball_move()
                await self.handle_game_end()
        except Exception as e:
            print(f'\n{RED}[Error in Game Loop {str(e)}]{RESET}\n')
        finally :
            self.game_tick = None

    #------------------------------------>>>>>broadcast Events<<<<<<<------------------------------
    async def game_found(self, event):
        await self.send(text_data=json.dumps( 
            {
                "type": "acknowledgeOpponent",
                "data": { 
                    'message': event['message'],
                    'opponent': event['opponent'],
                    'top_paddle': event['top_paddle'],
                    'game_id': event['game_id']
                }
            }))

    async def paddle_move(self, event):
        await self.send(text_data=json.dumps({
            'type': 'UpdatePaddle',
            'new_x': event['new_x']
        }))
    async def share_paddle_move(self, new_x):
        await matchmake_system.channel_layer.send(
            self.opponent.channel_name,
            {
                'type': 'paddle_move',
                'new_x': new_x
            })

    async def ball_move(self, event):
        await self.send(text_data=json.dumps({
            'type': 'UpdateBall',
            'ball_position': event['ball_position']
        }))
    async def broadcast_ball_move(self):
        if not self.game:
            return
        await matchmake_system.channel_layer.group_send(
            f'game_{self.game_id}',
            {
                'type': 'ball_move',
                'ball_position': await self.game.ball_update()
            }
        )

    async def set_Gameplayers_to_consumer(self):
        if self.game.player1.id != self.user.id :
            self.opponent = self.game.player1 
            self.Gameplayer = self.game.player2
        else :
            self.opponent = self.game.player2 
            self.Gameplayer = self.game.player1

    async def broadcast_ready(self): # broadcast ready to players then start the game
        await matchmake_system.channel_layer.send(
            self.game.player1.channel_name,
            {
                'type': 'acknowledge.ready',
                'state': "start"
            }
        )
        await matchmake_system.channel_layer.send(
            self.game.player2.channel_name,
            {
                'type': 'acknowledge.ready',
                'state': "start"
            }
        )

    async def acknowledge_ready(self, event):
        await self.send(text_data=json.dumps({
            'type': 'gameState',
            'state': event['state']
        }))

    async def handle_game_end(self):
        if not self.game:
            return
        try:
            print (f'\n{RED}[Game End {self.game_id}]{RESET}\n')
            self.game.status = 'finished'
            del matchmake_system.games[self.game_id]
            matchmake_system.players_in_game.remove(self.user.id)
        except Exception as e:
            print(f'\n{RED}[Error in Game End {str(e)}]{RESET}\n')
        self.game = None
        self.game_id = None

    @database_sync_to_async
    def save_game_result(self, game_state):
        pass

    # Implement game result saving logic here
    async def disconnect(self, close_code):
    # TODO handle the unexpeted disconnects or cleanup after normal disconnect
        if self.game:
            self.game.status = 'finished'
            self.game.player1.status = 'waiting'
            self.game.player2.status = 'waiting'
            del matchmake_system.games[self.game_id]
            self.channel_layer.send(
                self.opponent.channel_name,
                {
                    'type': 'game_end',
                }
            )
            #TODO update PlayerProfile
            print(f'\n{RED}[Disconnect {self.user.username}]{RESET}\n')
        await self.close()

    async def game_end(self, event):
        print(f'disconnect {self.user.username}')
        self.close()


#TODO handle asyncrounous ball movs [DONE]?????????????
#TODO handle the paddle movs [About to be done]
#TODO handle the game end and disconnections