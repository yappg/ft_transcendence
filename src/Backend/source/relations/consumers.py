import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Notification
from channels.db import database_sync_to_async

from asgiref.sync import async_to_sync


from urllib.parse import parse_qs

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        query_string = self.scope['query_string'].decode()
        query_params = parse_qs(query_string)
        user_id = query_params.get('user_id', [None])[0]

        if user_id is not None:
            self.group_name = f"user_{user_id}"
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
            print(f'Connected to group: {self.group_name}')
        else:
            await self.close()
            print('User ID not provided')

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
    