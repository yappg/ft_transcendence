# consumers.py
import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django_redis import get_redis_connection
from .game_engine import GameManager

game_manager = GameManager()

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if not self.scope["user"].is_authenticated:
            await self.close()
            return

        self.user = self.scope["user"]
        self.redis = get_redis_connection("default")
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

    async def add_to_matchmaking(self):
        self.redis.rpush('game_queue', self.user.id)
        await self.matchmake()

    async def matchmake(self):
        while True:
            if self.game:
                return #already in a game
            if self.redis.llen('game_queue') < 2:
                await asyncio.sleep(1)
                continue
            player1_id = self.redis.lpop('game_queue').decode('utf-8')
    async def find_opponent(self):
        pass
        # while True:
        #     if self.game:
        #         return
        #     player_id = self.redis.lpop('game_queue')
        #     if player_id:
        #         player_id = player_id.decode('utf-8')
        #         if player_id != self.user.id:
        #             player = await self.get_player(player_id)
        #             if player:
        #                 self.game = game_manager.create_game(
        #                     self.user.id, self.user.username,
        #                     player.id, player.username
        #                 )
        #                 self.game_id = self.game.game_id
        #                 await self.channel_layer.group_add(
        #                     f'game_{self.game_id}',
        #                     self.channel_name
        #                 )
        #                 await self.broadcast_game_state()
        #                 return
        #     await asyncio.sleep(1)

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