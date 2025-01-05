from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.utils import timezone
from .models import PlayerProfile

# TODO need the frontend to trigger this conusmer for setting the online status and last login

class OnlineStatusConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.user = self.scope["user"]
        if self.user.is_authenticated:
            await self.set_logging_status(self.user, True)
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, 'user') and self.user.is_authenticated:
            await self.set_logging_status(self.user, False)

    @sync_to_async
    def set_logging_status(self, user, is_online):
        try:
            profile = PlayerProfile.objects.get(player=user)
            profile.is_online = is_online
            if is_online:
                profile.last_login = timezone.now()
            profile.save(update_fields=['is_online', 'last_login'] if is_online else ['is_online'])
        except PlayerProfile.DoesNotExist:
            pass

