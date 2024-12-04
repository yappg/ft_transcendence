import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Notification
from channels.db import database_sync_to_async



class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        self.group_name = f'notifications_{self.user.id}'

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json.get('action')

        if action == 'mark_as_read':
            notification_id = text_data_json.get('notification_id')
            await self.mark_notification_as_read(notification_id)

    @database_sync_to_async
    def get_notification(self, notification_id):
        return Notification.objects.get(id=notification_id, recipient=self.user)

    @database_sync_to_async
    def save_notification(self, notification):
        notification.save()

    async def mark_notification_as_read(self, notification_id):
        try:
            notification = await self.get_notification(notification_id)
            notification.read = True
            await self.save_notification(notification)
            await self.send(text_data=json.dumps({
                'status': 'success',
                'message': 'Notification marked as read'
            }))
        except Notification.DoesNotExist:
            await self.send(text_data=json.dumps({
                'status': 'error',
                'message': 'Notification not found'
            }))

    async def send_notification(self, event):
        await self.send(text_data=json.dumps(event['notification']))