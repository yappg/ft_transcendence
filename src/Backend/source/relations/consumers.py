import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Notification
from channels.db import database_sync_to_async

from asgiref.sync import async_to_sync


from urllib.parse import parse_qs

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope['user']
        if (user.is_authenticated):
            await self.accept()
        else:
            await self.close()
        user_id = user.id
        if user_id is not None:
            self.group_name = f"user_{user_id}"
            await self.channel_layer.group_add(self.group_name, self.channel_name)
        else:
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def send_notification(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message']
        }))

    # async def mark_notification_as_read(self, notification_id):
    #     try:
    #         notification = await self.get_notification(notification_id)
    #         notification.read = True
    #         await self.save_notification(notification)
    #         await self.send(text_data=json.dumps({
    #             'status': 'success',
    #             'message': 'Notification marked as read'
    #         }))
    #     except Notification.DoesNotExist:
    #         await self.send(text_data=json.dumps({
    #             'status': 'error',
    #             'message': 'Notification not found'
    #         }))
