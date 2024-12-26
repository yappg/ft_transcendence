from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.utils import timezone
from .models import PlayerProfile

# TODO need the frontend to trigger this conusmer for setting the online status and last login
class OnlineStatusConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        user = self.scope["user"]
        # print(f" the user auth status is {user.is_authenticated}")
        if user.is_authenticated:
            await self.set_logging_status(user, True)
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        user = self.scope["user"]
        # print(f" the user auth status is {user.is_authenticated}")
        if user.is_authenticated:
            await self.set_logging_status(user, False)

    @sync_to_async
    def set_logging_status(self, user, is_online):
        profile = PlayerProfile.objects.get(player=user)
        profile.is_online = is_online
        if is_online:
            profile.last_login = timezone.now()
        profile.save()
 
