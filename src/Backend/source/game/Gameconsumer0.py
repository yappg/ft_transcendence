# consumers0.py
import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .GameEngine import GameManager
from .MatchMaking import MatchMakingSystem
from accounts.models import Player, PlayerProfile
from game.models import Game

game_manager = GameManager()
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
        print(f'\n{GREEN}[User Authenticated {self.user}]{RESET}\n')

        if not matchmake_system._running:
            await matchmake_system.start()

        await self.accept()
        await self.channel_layer.group_add(
            f'game_{self.user.id}',
            self.channel_name
        )
        #TODO ths two lines are temporary must be deleted later
        self.profile.status = 'waiting'
        await database_sync_to_async(self.profile.save)()
        

        print(f'\n{GREEN}[User Profile {self.profile.status}]{RESET}\n')
        if self.profile.status == 'waiting':
            print(f'\n{YELLOW}[Adding Player to Queue]{RESET}\n')
            await matchmake_system.add_player_to_queue(self.user.id, self.user.username, self.channel_name)
            self.profile.status = 'inqueue'
            await database_sync_to_async(self.profile.save)()
        else:
            print(f'\n{YELLOW}[User Already in a Game]{RESET}\n')
        # else:
        #     await self.send(text_data=json.dumps({
        #         'message': 'You are already in a game'
        #     }))
   
    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            print (f'\n{YELLOW}[Received Data {data}]{RESET}\n')
            print(f'\n{YELLOW}[Game Status {self.game.status}]{RESET}\n')

            action  = data.get('action')
            print(f'\n{YELLOW}[Action {action}]{RESET}\n')

            if action == 'ready':

                game_id = data.get('game_id', None)
                print('game_id', game_id)
                if not game_id or not self.game:
                    return
                self.game = matchmake_system.games.get(data.get('game_id'))

                if self.players_ready() and self.game.status == 'waiting':
                    print(f'\n{BLUE}[Game Ready to Start]{RESET}\n')
                    self.game.start_game()
                    await self.start_game_loop()
                    await self.broadcast_game_state()
            elif action == 'move_paddle':
                print(self.game)
                if not self.game or self.game.status != 'playing' :
                    return
                if self.game.player1.status != 'ready' or self.game.player2.status != 'ready':
                    return
                print(f'\n{BLUE}[Moving Paddle Position[{data.get('position')}]]{RESET}\n')
                if self.game:
                    new_y = data.get('position', 50)
                    self.game.move_paddle(self.user.id, new_y)
                    await self.broadcast_game_state()
        except Exception as e:
            print(f'\n{RED}[Error in Receive {str(e)}]{RESET}\n')
            #TODO handle the exception
            pass

    async def game_found(self, event):
        # Send a message to the player that a game has been found
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'opponent': event['opponent'],
            'game_id': event['game_id']
        }))

    async def get_oppoent_PlayerProfile(self):
        # (
        #     self.game.player1 if self.game.player1.id == self.user.id else self.game.player2
        # ).status = 'ready'
        opponent_id = self.game.player1.id if self.game.player1.id == self.user.id else self.game.player2.id 
        return await database_sync_to_async(Player.objects.select_related('profile').get)(id=opponent_id)

    async def players_ready(self):
        opponent_profile = await self.get_oppoent_PlayerProfile()
        if self.profile.status == 'ready' and opponent_profile.status == 'ready':
            return True
        return False

    async def start_game_loop(self):
        import time
        while self.game and self.game.status == 'playing':
            print(f'\n{YELLOW}[Game Loop Running]{RESET}\n')
            # delta_time = time.perf_counter()
            delta_time = 1/60  # 60 FPS
            if self.game.update(delta_time):
                await self.broadcast_game_state()
            await asyncio.sleep(delta_time)
        if self.game and self.game.status == 'finished':
            await self.broadcast_game_state()
            await self.handle_game_end()

    async def broadcast_game_state(self):
        if not self.game:
            return
        await self.channel_layer.group_send(
            f'game_{self.game_id}',
            {
                'type': 'game.update',
                'game_state': self.game.get_state()
            }
        )

    async def handle_game_end(self):
        if not self.game:
            return

        await self.save_game_result(self.game.get_state())

        game_manager.remove_game(self.game_id)
        self.game = None
        self.game_id = None

    @database_sync_to_async
    def save_game_result(self, game_state):
        pass

    # Implement game result saving logic here
    async def disconnect(self, close_code):
    # TODO handle the unexpeted disconnects or cleanup after normal disconnect 
        self.profile.status = 'waiting'
        await database_sync_to_async(self.profile.save)()
        await self.close()

# {"username":"kad","password":"qwe123"}
