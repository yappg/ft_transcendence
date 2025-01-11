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

class GameConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        self.game = None
        self.game_tick = None
        self.game_id = None
        self.result_saved = False
        super().__init__(*args, **kwargs)

    async def connect(self):
        if not self.scope.get("user") or not self.scope["user"].is_authenticated:
            # print(f'{RED}[Unauthenticated connection attempt]{RESET}')
            await self.close()
            return

        try:
            self.user = self.scope["user"]
            self.opponent = None
            self.Gameplayer = None
            self.game_id = None

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
                print(f'{YELLOW}[User Already in a Game]{RESET}')
                await self.already_inQG() # this one in the case of the user try to connect to a new game while already in a game[close socket and redirect to home page]
                await self.close()
        except Exception as e:
            print(f'{RED}[Error in Connect: {str(e)}]{RESET}')
            await self.close()
            return

    async def already_inQG(self):
        await self.safe_send(
            {
                'type': 'AlreadyInQorG',
                'action': 'close connection',
            })

    def player_in_QG(self):
        return (self.user.id in matchmake_system.players_in_game) and (self.user.id in matchmake_system.players_queue)

    async def receive(self, text_data):
        if not text_data:
            return

        try:
            data = json.loads(text_data)
            if not isinstance(data, dict):
                raise ValueError("Invalid message format")

            action = data.get('action')
            if not action:
                return

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
                    print(f'setting map  {data.get("map")} to {self.Gameplayer.map}')
                    await self.set_players_map(data.get('map'))
                self.broadcast_ready()
                await asyncio.sleep(2)

                if self.game.status == 'waiting':
                    print(f'\n{BLUE}[Game Ready to Start]{RESET}\n')
                    await self.game.start_game()
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
                    # await self.broadcast_score_update() #TODO score update to check if it works 
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
            await self.close()
            # await self.handle_game_end()
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

    async def game_over(self, event):
        await self.safe_send({
            'type': 'gameState',
            'state': event['state'],
            'winner': event['winner']
        })
    async def broadcast_game_over(self):
        if not self.game:
            return
        await matchmake_system.channel_layer.group_send(
            f'game_{self.game_id}',
            {
                'type': 'game_over',
                'state': 'over',
                'winner': self.game.winner
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

    #------------------------------------>>>>>save game result<<<<<<<------------------------------
    @database_sync_to_async
    def save_game_result(self, player1_id, player2_id, result_value):
        if self.result_saved:
            return True
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
            self.result_saved = True
            return True
        except Exception as e:
            print(f'\n{RED}[Error in Saving Game Result {str(e)}]{RESET}\n')
            self.result_saved = False
            return False

    async def disconnect(self, close_code):
        try:
            if self.game:
                if self.game.status == 'playing':
                    await self.broadcast_disconnection()
                    await asyncio.sleep(0.1)
                async with self.game.lock:
                    if self.game.status == 'playing':
                        self.game.status = 'over'
                        winner =  'player1' if self.user.id == self.game.player2.id else 'player2'

                        if hasattr(self.game, 'winner'):
                            try:
                                await self.save_game_result(self.user.id, self.opponent.id, winner)
                            except Exception as e:
                                print(f'\n{RED}[Error in Saving Game Result {str(e)}]{RESET}\n')
                    await self.broadcast_game_over()
                print(f'\n{RED}[Disconnect {self.user.username}]{RESET}\n')
        except Exception as e:
            print(f'\n{RED}[Error in Disconnect {str(e)}]{RESET}\n')
        finally:
            try:
                if self.user.id in matchmake_system.players_in_game:
                    matchmake_system.players_in_game.remove(self.user.id)
                if self.user.id in matchmake_system.players_queue:
                    del matchmake_system.players_queue[self.user.id]
                async with matchmake_system.games_lock:
                    if self.game_id in matchmake_system.games:
                        del matchmake_system.games[self.game_id]
            except Exception as e:
                print(f'\n{RED}[Error in Disconnect {str(e)}]{RESET}\n')
            if self.game_id:
                await self.channel_layer.group_discard(f'game_{self.game_id}', self.channel_name)
            await super().disconnect(close_code)
            print(f'\n{RED}[Disconnected {self.user.username}]{RESET}\n')

    async def broadcast_disconnection(self):
        await matchmake_system.channel_layer.send(
            self.opponent.channel_name,
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
        if not self.channel_layer or not self.channel_name:
            return

        try:
            if not isinstance(data, dict):
                raise ValueError("Invalid data format for sending")

            await self.send(text_data=json.dumps(data))
        except Exception as e:
            print(f'{RED}[Error in Safe Send: {str(e)}]{RESET}')

#TODO handle the disconnect from both users connected to the same game []
#TODO figure out why the ball doesnt start moving when the game is first started when running the project for the first time (actually when i first start the page in the browser)
#TODO score update 
#TODO game responsiveness
#TODO reset paddle position to the center of the screen at each goal
#TODO if the user opens a new tab and the game is still running, the game should be closed and the user should be redirected to the game arena
#TODO fix the map they played in its set always too default 
