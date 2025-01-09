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
        self.game_id = None
        super().__init__(*args, **kwargs)

    async def connect(self):
        if not self.scope["user"].is_authenticated:
            await self.close()
            return
        try:
            self.user = self.scope["user"]
            self.opponent = None
            self.Gameplayer = None

            if not matchmake_system._running:
                await matchmake_system.start()
            await self.accept()
            if self.scope.get('url_route').get('kwargs').get('game_id', None):
                self.game_id = self.scope.get('url_route').get('kwargs').get('game_id', None)
                self.game =  matchmake_system.games[self.game_id]
                if self.game and self.game.status == 'waiting':
                    print(f'\n{YELLOW}[Game MOLLALALA{self.scope.get('url_route')} Found]{RESET}\n')
                    self.game.start_game()
                    return

            await self.channel_layer.group_add(f'selfGroup_{self.user.id}', self.channel_name)
            if  not self.player_in_QG():
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
                game_id = data.get('game_id', None)
                if not game_id :
                    return
                self.game_id = game_id 
                self.game = matchmake_system.games[int(data.get('game_id'))]
                if not self.game:
                    return
                await self.set_Gameplayers_to_consumer()
                self.Gameplayer.status = 'ready'
                if data.get('map'):
                    await self.set_players_map(data.get('map'))
                self.broadcast_ready()
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
            elif action == 'invite':
                if not data.get('opponent_id'):
                    return
                matchmake_system.invite_player(self.user.id, data.get('opponent_id'))
            elif action == 'disconnect':
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
                    await self.broadcast_ball_move()
                if await self.game.check_for_rounds():
                    await self.broadcast_score_update()
                    await self.broadcast_end_round()
                    if self.game.round <= 2:
                        print(f'\n{RED}[Round {self.game.round}]{RESET}\n')
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
        await self.safe_send(
            {
                "type": "acknowledgeOpponent",
                "data": { 
                    'message': event['message'],
                    'opponent': event['opponent'],
                    'opponent_avatar': event['opponent_avatar'],
                    'top_paddle': event['top_paddle'],
                    'game_id': event['game_id']
                }
            })

    async def score_update(self, event):
        await self.safe_send({
            'type': 'UpdateScore',
            'data': event['data']
        })
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
        except Exception as e:
            print(f'\n{RED}[Error in Score Update {str(e)}]{RESET}\n')

    async def paddle_move(self, event):
        await self.safe_send({
            'type': 'UpdatePaddle',
            'new_x': event['new_x']
        })
    async def share_paddle_move(self, new_x):
        await matchmake_system.channel_layer.send(
            self.opponent.channel_name,
            {
                'type': 'paddle_move',
                'new_x': new_x
            })

    async def ball_move(self, event):
        await self.safe_send({
            'type': 'UpdateBall',
            'ball_position': event['ball_position']
        })
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
        await self.safe_send({
            'type': 'gameState',
            'state': event['state']
        })
    async def broadcast_ready(self):# broadcast ready to players then start the game
        await matchmake_system.channel_layer.group_send(
            f'game_{self.game_id}',
            {
                'type': 'acknowledge.ready',
                'state': 'start'
            })

    async def start_round(self, event):
        await self.safe_send({
            'type': 'gameState',
            'state': event['state'],
            'round': event['round']
        })
    async def broadcast_start_round(self):
        await matchmake_system.channel_layer.group_send(
            f'game_{self.game_id}',
            {
                'type': 'start_round',
                'state': 'start',
                'round': self.game.round
            })

    async def end_round(self, event):
        await self.safe_send({
            'type': 'gameState',
            'state': event['state'],
            'round': event['round']
        })
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
            await self.broadcast_game_end()
            if self.game.winner :
                await self.save_game_result(self.game.player1.id, self.game.player2.id, self.game.winner)
            # if self.user.id in matchmake_system.players_in_game:
            #     matchmake_system.players_in_game.remove(self.user.id)
            # if self.opponent.id in matchmake_system.players_in_game:
            #     matchmake_system.players_in_game.remove(self.opponent.id)
            # if self.game_id in matchmake_system.games:
            #     del matchmake_system.games[self.game_id]
        except Exception as e:
            print(f'{RED}[Error in Game End {str(e)}]{RESET}')
        finally:
            print (f'{RED}[Game End {self.game_id}]{RESET}')
            await self.close()

    @database_sync_to_async
    def save_game_result(self, player1_id, player2_id, result_value):
        try:
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
            return True
        except Exception as e:
            print(f'\n{RED}[Error in Saving Game Result {str(e)}]{RESET}\n')
            #TODO handle the exception
            return False

    async def game_over(self, event):
        await self.safe_send({
            'type': 'gameState',
            'state': event['state'],
            'winner': event['winner']
        })
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
        try:
            if self.game:
                async with self.game.score_update_lock:
                    if self.game.status == 'playing':
                        print (f'{RED}[Unexpected Disconnection l; {self.user.username}]{RESET}')
                        winner =  'player1' if self.user.id == self.game.player2.id else 'player2'
                        await self.unexpected_disconnect(self.user.id, self.opponent.id, winner) #TODO kifach 'player2'?
                    self.game.status = 'over'
                    print(f'\n{RED}[Disconnect {self.user.username}]{RESET}\n')
                    
                    if self.game_id in matchmake_system.games:
                        del matchmake_system.games[self.game_id]
            else:
                print(f'\n{RED} [Disconnect in GP {self.user.username}]{RESET}\n')
                if self.user.id in matchmake_system.players_in_game:
                    matchmake_system.players_in_game.remove(self.user.id)
                if self.user.id in matchmake_system.players_queue:
                    del matchmake_system.players_queue[self.user.id]
            await self.broadcast_disconnection()
            if self.game_id:
                await self.channel_layer.group_discard(f'game_{self.game_id}', self.channel_name)
            await super().disconnect(close_code)
        except Exception as e:
            print(f'\n{RED}[Error in Disconnect {str(e)}]{RESET}\n')

    async def broadcast_disconnection(self):
        await matchmake_system.channel_layer.group_send(
            f'game_{self.game_id}',
            {
                'type': 'force_disconnect',
            })
    async def force_disconnect(self, event):
        await self.safe_send({
            'type': 'GameEnd',
            'action': 'disconnect',
        })

    #------------------------------------>>>>>util functions<<<<<<<------------------------------
    async def set_players_map(self, map):
        if self.user.id == self.game.player1.id:
            self.game.player1.map = map
        else:
            self.game.player2.map = map

    async def set_Gameplayers_to_consumer(self):
        if self.game.player1.id != self.user.id:
            self.opponent = self.game.player1 
            self.Gameplayer = self.game.player2
        else :
            self.opponent = self.game.player2 
            self.Gameplayer = self.game.player1

    async def unexpected_disconnect(self, player1_id, player2_id, result_value):
        print(f'\n{RED}[Unexpected Disconnection]{RESET}\n')

        result_saved = await self.save_game_result(player1_id, player2_id, result_value)
        if result_saved:
            print(f'\n{RED}[Result Saved]{RESET}\n')
        else:
            print(f'\n{RED}[Result Not Saved]{RESET}\n')

        if self.user.id in matchmake_system.players_in_game:
            matchmake_system.players_in_game.remove(self.user.id)
        if self.opponent.id in matchmake_system.players_in_game:
            matchmake_system.players_in_game.remove(self.opponent.id)

    #------------------------------------>>>>>util functions<<<<<<<------------------------------
    async def safe_send(self, data):
        try:
            #check if the connection is still open
            if self.channel_layer is None or not self.channel_name:
                return
            await self.send(text_data=json.dumps(data))
        except Exception as e:
            print(f'\n{RED}[Error in Safe Send {str(e)}]{RESET}\n')
    
    #------------------------------------>>>>>util functions<<<<<<<------------------------------

#TODO handle the game end and disconnections
#TODO reset the jwt duration to normal
#TODO GameInvite

    #_______________________________Sbject requirements _______________________________________
# 1- the app should be protected against XSS attacks
