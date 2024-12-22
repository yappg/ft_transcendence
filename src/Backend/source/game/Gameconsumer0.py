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
        self.InGame = False

    async def connect(self):
        if not self.scope["user"].is_authenticated:
            await self.close()
            return

        self.user = self.scope["user"]
        self.game = None
        print(f'\n{GREEN}------------>>>>>[User Authenticated {self.user}]<<<<<<<<<----------------------{RESET}\n')

        # Start the matchmaking system if it's not already running
        if not matchmake_system._running:
            await matchmake_system.start()

        await self.accept()
        if not self.InGame:
            await matchmake_system.add_player_to_queue(self.user.id, self.user.username, self.channel_name)
            self.InGame = True
        # else:
        #     await self.send(text_data=json.dumps({
        #         'message': 'You are already in a game'
        #     }))

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            # Actions = {
            #     'move_paddle': self.move_paddle,
            #     'ready': self.ready
            # }
            action  = data.get('action')
            # if !action:
            #     return

            if action == 'ready':
                game_id = data.get('game_id')
                self.game = matchmake_system.games.get(data.get('game_id'))
                if self.game and self.game.status == 'waiting'\
                        and self.game.player1.id == self.user.id:
                    self.game.start_game()
                    await self.start_game_loop()
                    await self.broadcast_game_state()
            elif action == 'move_paddle':
                if self.game:
                    new_y = data.get('position', 50)
                    self.game.move_paddle(self.user.id, new_y)
                    await self.broadcast_game_state()
        except Exception as e:
            #TODO handle the exception
            pass

    async def game_found(self, event):
        # Send a message to the player that a game has been found
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'opponent': event['opponent'],
            'game_id': event['game_id']
        }))

    async def start_game_loop(self):
        while self.game and self.game.status == 'playing':
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
            
        # Save game result to database
        await self.save_game_result(self.game.get_state())
        
        # Clean up
        game_manager.remove_game(self.game_id)
        self.game = None
        self.game_id = None

    @database_sync_to_async
    def save_game_result(self, game_state):
        pass

    # Implement game result saving logic here
    async def disconnect(self, close_code):
    # TODO handle the unexpeted disconnects or cleanup after normal disconnect 
        # self.channel_layer.group_discard(self.groupe_name, self.channel_name)
        await self.close()

# {"username":"kad","password":"qwe123"}
