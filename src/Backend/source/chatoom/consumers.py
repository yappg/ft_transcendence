import json 
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from accounts.models import Player
from .models import ChatRoom, Message

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        # Join the group
        async_to_sync(self.channel_layer.group_add)(
            "chat_group",
            self.channel_name
        )
        self.accept()
        
        self.send(
            text_data=json.dumps({
                'type': 'chat',
                'message': 'Hello first connection'
            })
        )

    def disconnect(self, close_code):
        # Leave the group
        async_to_sync(self.channel_layer.group_discard)(
            "chat_group",
            self.channel_name
        )

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        print('Message:', message)
        
        # Broadcast the message to the group
        async_to_sync(self.channel_layer.group_send)(
            "chat_group",
            {
                'type': 'chat_message',
                'message': message
            }
        )
    
    # Handler for messages sent to the group
    def chat_message(self, event):
        message = event['message']
        
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'type': 'chat',
            'message': message
        }))
            