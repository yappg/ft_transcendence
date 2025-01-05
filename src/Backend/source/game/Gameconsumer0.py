import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .MatchMaking import MatchMakingSystem
from accounts.models import Player, PlayerProfile
from game.models import Game
from accounts.models import MatchHistory
matchmake_system = MatchMakingSystem()

RED = '\033[31m'
GREEN = '\033[32m'
YELLOW = '\033[33m'
BLUE = '\033[34m'
VIOLET = '\033[35m'
ORANGE = '\033[36m'
PINK = '\033[37m'
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
        try:
            self.user = self.scope["user"]
            self.profile = await database_sync_to_async(PlayerProfile.objects.get)(player=self.user)
            self.opponent = None
            self.Gameplayer = None
            print(f'\n{GREEN}[User Authenticated {self.user}]{RESET}\n')

            if not matchmake_system._running:
                await matchmake_system.start()
            #TODO to fix 
            # self.profile.status = 'waiting'
            # await database_sync_to_async(self.profile.save)(update_fields=['status'])

            await self.accept()

            #TODO self.profile.status
            # (self.profile.status == 'waiting') and
            if  not self.player_in_QG():
                print(f'\n{YELLOW}[Adding Player to Queue]{RESET}\n')
                await matchmake_system.add_player_to_queue(self.user.id, self.user.username, self.channel_name)
            else:
                print(f'\n{YELLOW}[User Already in a Game]{RESET}\n')
        except Exception as e:
            print(f'\n{RED}[Error in Connect {str(e)}]{RESET}\n')
            await self.close()

    def player_in_QG(self):
        return (self.user.id in matchmake_system.players_in_game) and (self.user.id in matchmake_system.players_queue)

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            action  = data.get('action')
            print(f'\n{YELLOW}data: [{data}]{RESET}\n')

            if action == 'ready':
                print(f'\n{YELLOW}[Player ReadyYYYYYYYYYY]{RESET}\n')
                game_id = data.get('game_id', None)
                if not game_id :
                    return
                self.game_id = game_id 
                self.game = matchmake_system.games[int(data.get('game_id'))]
                if not self.game:
                    return
                await self.set_Gameplayers_to_consumer()
                self.Gameplayer.status = 'ready'
                #TODO Include the game map in the ready event
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
            elif action == 'disconnect':
                print(f'\n{RED}[Disconnecting]{RESET}\n')
                # await self.disconnect(1000)
                await self.close()
        except Exception as e:
            print(f'\n{RED}[Error in Receive {str(e)}]{RESET}\n')
            #TODO handle the exception
            pass
    
    #------------------------------------>>>>> Game loop <<<<<<<------------------------------
    async def start_game_loop(self):
        try :
            await self.broadcast_ball_move()
            
            while self.game and self.game.status == 'playing'\
                and self.game.player1.status == 'ready'\
                and self.game.player2.status == 'ready':

                delta_time = 0.016 #60 FPS
                if self.game.update(delta_time):
                    await self.broadcast_ball_move()
                if await self.game.check_scoring():
                    print(f'\n{YELLOW}[Scoring herrrrreeee ] {self.game.round} player1({self.game.player1.username}):{self.game.player1.score}, player2({self.game.player2.username}):{self.game.player2.score} {RESET}\n')
                    # await self.broadcast_score_update()
                    await self.broadcast_ball_move()
                if await self.game.check_for_rounds():
                    await self.broadcast_score_update()
                    await self.broadcast_end_round()
                    if self.game.round <= 2:
                        await asyncio.sleep(5)
                    else:
                        break
                    await self.broadcast_start_round()
                    await self.broadcast_ball_move()

                await asyncio.sleep(delta_time)
        except Exception as e:
            print(f'\n{RED}[Error in Game Loop {str(e)} {self.game.round}]{RESET}\n')
        finally :
            print(f'\n{YELLOW}[Game Over]{RESET}\n')
            await self.handle_game_end()
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
    async def set_Gameplayers_to_consumer(self):
        if self.game.player1.id != self.user.id :
            self.opponent = self.game.player1 
            self.Gameplayer = self.game.player2
        else :
            self.opponent = self.game.player2 
            self.Gameplayer = self.game.player1

    async def score_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'UpdateScore',
            'data': event['data']
        }))
    async def broadcast_score_update(self):
        if not self.game:
            return
        try:
            await matchmake_system.channel_layer.group_send(
                f'game_{self.game_id}',
                {
                    'type': 'score_update',
                    'data':{
                        'round': self.game.round - 1,
                        'top': self.game.player2.score,
                        'bottom': self.game.player1.score,
                    }
                }
            )
            # await matchmake_system.channel_layer.send(
            #     self.Gameplayer.channel_name,
            #     {
            #         'type': 'score_update',
            #         'data':{
            #             'round': self.game.round,
            #             'self_score': self.Gameplayer.score,
            #             'opponent_score': self.opponent.score
            #         }
            #     }
            # )
            # await matchmake_system.channel_layer.send(
            #     self.opponent.channel_name,
            #     {
            #         'type': 'update_score',
            #         'data':{
            #             'round': self.game.round,
            #             'player1': self.Gameplayer.username,
            #             str(self.Gameplayer.username): self.opponent.score,
            #             'player2': self.Gameplayer.username,
            #             str(self.Gameplayer.username): self.opponent.score,
            #             'opponent_score': self.Gameplayer.score
            #         }
            #     }
            # )
        except Exception as e:
            print(f'\n{RED}[Error in Score Update {str(e)}]{RESET}\n')

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

    async def acknowledge_ready(self, event):
        await self.send(text_data=json.dumps({
            'type': 'gameState',
            'state': event['state']
        }))
    async def broadcast_ready(self):# broadcast ready to players then start the game
        await matchmake_system.channel_layer.group_send(
            f'game_{self.game_id}',
            {
                'type': 'acknowledge.ready',
                'state': 'start'
            })

    async def start_round(self, event):
        await self.send(text_data=json.dumps({
            'type': 'gameState',
            'state': event['state'],
            'round': event['round']
        }))
    async def broadcast_start_round(self):
        await matchmake_system.channel_layer.group_send(
            f'game_{self.game_id}',
            {
                'type': 'start_round',
                'state': 'start',
                'round': self.game.round
            })

    async def end_round(self, event):
        await self.send(text_data=json.dumps({
            'type': 'gameState',
            'state': event['state'],
            'round': event['round']
        }))
    async def broadcast_end_round(self):
        await matchmake_system.channel_layer.group_send(
            f'game_{self.game_id}',
            {
                'type': 'end_round',
                'state': 'waiting',
                'round': self.game.round
            })

    async def handle_game_end(self):
        if not self.game:
            return
        try:
            # await self.broadcast_end_round()
            
            await self.save_game_result(self.game.player1.id, self.game.player2.id, self.game.winner)
            matchmake_system.players_in_game.remove(self.user.id)
            matchmake_system.players_in_game.remove(self.opponent.id)
            if self.game_id in matchmake_system.games:
                del matchmake_system.games[self.game_id]
            await self.getBack_To_WaitingStatus()
        except Exception as e:
            #TODO self.close()
            print(f'\n{RED}[Error in Game End {str(e)}]{RESET}\n')
        finally:
            print (f'\n{RED}[Game End {self.game_id}]{RESET}\n')
            await self.broadcast_game_end()
            await self.broadcast_disconnection()
            await self.disconnect(1000)
            # await self.close()
            self.game = None
            self.game_id = None

    @database_sync_to_async
    def save_game_result(self, player1_id, player2_id, result_value):
        
        player1_m = Player.objects.select_related('profile').get(id=player1_id)
        player2_m = Player.objects.select_related('profile').get(id=player2_id)
        MatchHistory.objects.create(
            player1=player1_m.profile,
            player2=player2_m.profile,
            player1_score=sum(self.game.player1.score),
            player2_score=sum(self.game.player2.score),
            result=str(result_value),
            map_played=self.game.map
        )

    async def unexpected_disconnect(self, player1_id, player2_id, result_value):
        print(f'\n{RED}[Unexpected Disconnection]{RESET}\n')
        await self.save_game_result(player1_id, player2_id, result_value)

        matchmake_system.players_in_game.remove(self.user.id)
        matchmake_system.players_in_game.remove(self.opponent.id)

    async def game_over(self, event):
        await self.send(text_data=json.dumps({
            'type': 'gameState',
            'state': event['state'],
            'winner': event['winner']
        }))
    #TODO 'winner': self.game.winner to be altered to username or smthg else
    async def broadcast_game_end(self):
        await matchmake_system.channel_layer.group_send(
            f'game_{self.game_id}',
            {
                'type': 'game_over',
                'state': 'over',
                'winner': self.game.winner
            })

    async def disconnect(self, close_code):
    # TODO handle the unexpeted disconnects or cleanup after normal disconnect
        try:
            if self.game:
                self.game.status = 'over'
                print(f'\n{RED}[Disconnect {self.user.username} AMAMAMAMM HERERERER]{RESET}\n')
                await self.getBack_To_WaitingStatus()
                # await self.broadcast_game_end()
                if self.game.status == 'playing':
                    await self.unexpected_disconnect(self.user.id, self.opponent.id, 'player2')
                if self.game and self.game_id in matchmake_system.games:
                    del matchmake_system.games[self.game_id]
                print(f'\n{RED}[Disconnect {self.user.username}]{RESET}\n')
                #check opponent status if its cinsumer still connected then send a disconnect event
                # if 
                await self.broadcast_disconnection()
                await self.channel_layer.group_discard(f'game_{self.game_id}', self.channel_name)
            await super().disconnect(close_code)
        except Exception as e:
            print(f'\n{RED}[Error in Disconnect {str(e)}]{RESET}\n')

    #force disconnection from both sides
    async def broadcast_disconnection(self):
        await matchmake_system.channel_layer.group_send(
            f'game_{self.game_id}',
            {
                'type': 'force_disconnect',
                'winner': 'draw'
            })
    async def force_disconnect(self, event):
        await self.send(text_data=json.dumps({
            'type': 'GameEnd',
            'action': 'disconnect',
            'winner': event['winner']
        }))

    #------------------------------------>>>>>util functions<<<<<<<------------------------------
    async def getBack_To_WaitingStatus(self):
        self.profile.status = 'waiting'
        await database_sync_to_async(self.profile.save)(update_fields=['status'])
    #------------------------------------>>>>>util functions<<<<<<<------------------------------

#TODO check with nouredine to send the game map in ready event 
#TODO handle the paddle movs [About to be done] {NEED to implement the paddle effect}!!!!!!!!
#TODO CLose the connection in frontend
#TODO handle the force disconnect if unexpected disconnect 
#TODO handle the game end and disconnections
#TODO handle the game maps


#_______________________________Sbject requirements _______________________________________
# 1- the app should be protected against XSS attacks