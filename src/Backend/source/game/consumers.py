import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from .services import GameService, LeaderboardService
from .models import Game, PlayerProfile
from django_redis import get_redis_connection

# working with logging for tracking errors and infos realtime..

class GameConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        # Reject connection if user is not authenticated
        user = self.scope["user"]
        if not user.is_authenticated:
            await self.close()
            return
        try:
            await self.accept()
            self.redis = get_redis_connection("default")
            #self.redis = get_redis_connection("matchmaking")
            self.groupe_name = f'game_{user.username}'
            self.channel_layer.group_add(self.groupe_name, self.channel_layer)
            self.add_player_to_queue(user.id)
        except:
            await self.close()
            return

    @database_sync_to_async
    async def add_player_to_queue(self, user_id):
        self.redis.rpush('game_queue', user_id)

    # @database_sync_to_async
    # async def remove_player_from_queue(self):
    #     userID = self.redis.lpop('game_queue')

    async def receive(self, text_data):
        pass

    async def disconnect(self, close_code):
        self.channel_layer.group_discard(self.groupe_name, self.channel_name)
        await self.close()
