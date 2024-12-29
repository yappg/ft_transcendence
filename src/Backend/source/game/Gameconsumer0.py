# consumers0.py
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
        super().__init__(*args, **kwargs)

    async def connect(self):
        if not self.scope["user"].is_authenticated:
            await self.close()
            return

        self.user = self.scope["user"]
        self.profile = await database_sync_to_async(PlayerProfile.objects.get)(player=self.user)
        self.game = None
        self.opponent = None
        self.Gameplayer = None
        print(f'\n{GREEN}[User Authenticated {self.user}]{RESET}\n')

        if not matchmake_system._running:
            await matchmake_system.start()

        await self.accept()
        # await self.channel_layer.group_add(
        #     f'game_{self.user.id}',
        #     self.channel_name
        # )

        #TODO ths two lines are temporary must be deleted later 
        self.profile.status = 'waiting'
        await database_sync_to_async(self.profile.save)()

        # print(f'\n{GREEN}[User Profile {self.profile.status}]{RESET}\n')
        if self.profile.status == 'waiting':
            print(f'\n{YELLOW}[Adding Player to Queue]{RESET}\n')
            await matchmake_system.add_player_to_queue(self.user.id, self.user.username, self.channel_name)
            # self.profile.status = 'inqueue'
            # await database_sync_to_async(self.profile.save)()
        else:
            print(f'\n{YELLOW}[User Already in a Game]{RESET}\n')
        # else:
        #     await self.send(text_data=json.dumps({
        #         'message': 'You are already in a game'
        #     })) 

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            print(f'\n{BLUE}[Received Data {data}]{RESET}\n')  
            action  = data.get('action')
            # print (f'\n{YELLOW}[Received Data {data}]{RESET}\n')

            if action == 'ready':
                game_id = data.get('game_id', None)
                print(f'\n{YELLOW}data: [{data}]{RESET}\n')
                if not game_id :
                    return
                self.game_id = game_id 
                self.game = matchmake_system.games[int(data.get('game_id'))]
                if not self.game:
                    return
                await self.set_Gameplayers_to_consumer()
                self.Gameplayer.status = 'ready' 
                # self.broadcast_ready()
                if self.user.id == self.game.player1.id:
                    print(f'\n{YELLOW}[Player 1 Ready]{RESET}\n')
                else:
                    print(f'\n{RED}[Player 2 Ready]{RESET}\n')
                await asyncio.sleep(2)

                # players_ready = self.players_ready()
                # print(players_ready)
                if self.game.status == 'waiting':
                    print(f'\n{BLUE}[Game Ready to Start]{RESET}\n')
                    self.game.start_game()
                    await self.broadcast_ready()
                    await self.self_send_start_game()
                    await asyncio.sleep(2)
                    await self.start_game_loop()
                    # await matchmake_system.broadcast_game_state()
            elif action == 'move_paddle':
                print(self.game)
                if not self.game or self.game.status != 'playing' :
                    return
                if self.game.player1.status != 'ready' or self.game.player2.status != 'ready':
                    return
                print(f'\n{BLUE}[Moving Paddle Position[{data.get('new_x')}]]{RESET}\n')
                if self.game:
                    new_x = data.get('new_x')#, 50)
                    self.game.move_paddle(self.user.id, new_x)
                    # await self.broadcast_game_state()
        except Exception as e:
            print(f'\n{RED}[Error in Receive {str(e)}]{RESET}\n')
            #TODO handle the exception
            pass

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

    def get_opponent_id(self):
        return ( self.game.player1 if self.game.player1.id != self.user.id else self.game.player2).id

    async def set_Gameplayers_to_consumer(self):
        if self.game.player1.id != self.user.id :
            self.opponent = self.game.player1 
            self.Gameplayer = self.game.player2
        else :
            self.opponent = self.game.player2 
            self.Gameplayer = self.game.player1
   
    async def start_game_loop(self): 
        # import time
        while self.game and self.game.status == 'playing':
            # delta_time = time.perf_counter()
            delta_time = 0.1 #1/60  # 60 FPS
            await self.game.update(delta_time)
            await asyncio.create_task(self.broadcast_game_state(self.get_opponent_id()))
            # await self.broadcast_game_state(self.get_opponent_id())
            await asyncio.create_task(self.self_send_game_state())
            # await self.self_send_game_state()
            await asyncio.sleep(delta_time)
        if self.game and self.game.status == 'finished':
            await self.broadcast_game_state(self.get_opponent_id())
            await self.self_send_game_state()
            await self.handle_game_end()

    async def self_send_game_state(self):
        if not self.game:
            return
        await self.send(text_data=json.dumps({
            'type': 'gameUpdate',
            'game_state': self.game.get_state(self.user.id)
        }))

    async def broadcast_game_state(self, opponent_id):
        if not self.game:
            return
        await matchmake_system.channel_layer.group_send(
            f'game_{self.game_id}',
            {
                'type': 'game.update',
                'game_state': self.game.get_state(opponent_id)
            }
        )

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
    async def self_send_start_game(self):
        if not self.game:
            return
        await self.send(text_data=json.dumps({
            'type': 'gameState',
            'state': 'start'
        }))


    async def game_update(self, event):
        # print (event)  
        await self.send(text_data=json.dumps({
            'type': 'gameUpdate',
            'game_state': event['game_state']
        }))

    async def handle_game_end(self):
        if not self.game:
            return

        # await self.save_game_result(self.game.get_state(self.user.id))

        # await matchmake_system.channel_layer.group_send(
        #     f'game_{self.game_id}',
        #     {
        #         'type': 'game.update',
        #         'game_state': self.game.get_state()
        #     }
        # )
        try:
            print (f'\n{RED}[Game End {self.game_id}]{RESET}\n')
            self.game.status = 'finished'
            del matchmake_system.games[self.game_id]
        except Exception as e:
            print(f'\n{RED}[Error in Game End {str(e)}]{RESET}\n')
        self.game = None
        self.game_id = None

    @database_sync_to_async
    def save_game_result(self, game_state):
        pass

    # Implement game result saving lo   gic here
    async def disconnect(self, close_code):
    # TODO handle the unexpeted disconnects or cleanup after normal disconnect 
        if self.game:
            self.game.status = 'finished'
        #     del matchmake_system.games[self.game_id]
        # self.profile.status = 'waiting'
        # await database_sync_to_async(self.profile.save)()
        await self.close()

# {"username":"kad","password":"qwe123"}
