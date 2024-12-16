# consumers0.py
import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .game_engine import GameManager

game_manager = GameManager()

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if not self.scope["user"].is_authenticated:
            await self.close()
            return
        
        self.user = self.scope["user"]
        self.game = None
        self.game_id = None

        await self.accept()
        await self.add_to_matchmaking()

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            action = data.get('action')
            
            if action == 'move_paddle':
                if self.game:
                    new_y = data.get('position', 50)
                    self.game.move_paddle(self.user.id, new_y)
                    await self.broadcast_game_state()
            
            elif action == 'ready':
                if self.game and self.game.status == 'waiting':
                    self.game.start_game()
                    await self.start_game_loop()
                    await self.broadcast_game_state()
        except json.JSONDecodeError:
            pass
        except Exception as e:
            pass

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
        # Implement game result saving logic here
        pass