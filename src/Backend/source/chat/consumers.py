import json
from channels.generic.websocket import AsyncWebsocketConsumer, WebsocketConsumer
from accounts.models import Player
from .models import ChatRoom, Message
from django.contrib.auth import get_user_model
from asgiref.sync import sync_to_async

Player = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chatId = self.scope['url_route']['kwargs']['chatId']
        self.chat_group_name = f'chat_{self.chatId}'
        print("chatId: " , self.chatId)

        await self.channel_layer.group_add(
            self.chat_group_name,
            self.channel_name
        )

        await self.accept()

        await self.send(text_data=json.dumps({
            'type':'connection_establish',
            'message':'you\'re now connected'
        }))
        # print(f"-----------------[DEBUG] WebSocket connection established for chat ID: {self.chatId}")


    async def disconnect(self, close_code):
        # Leave the chat group
        await self.channel_layer.group_discard(
            self.chat_group_name,
            self.channel_name
        )

        # Debug: Print when the WebSocket is disconnected
        # print(f"-----------------[DEBUG] WebSocket connection closed for chat ID: {self.chatId}, Close code: {close_code}")

    async def receive(self, text_data):
        # Debug: Print the received WebSocket message data
        print(f"-----------------[DEBUG] Received message data: {text_data}")

        text_data_json = json.loads(text_data)
        content = text_data_json.get('content')
        sender_id = text_data_json.get('sender')

        print(f"-----------------[DEBUG] Parsed message: {content}, Sender ID: {sender_id}")

        try:
            sender = await sync_to_async(Player.objects.get)(id=sender_id)
            # reciever = await Player.objects.get(id=reciever_id)
            chat = await sync_to_async(Chat.objects.get)(id=self.chatId)
        except Player.DoesNotExist:
            print(f"-----------------[DEBUG] Sender or Reciever with ID {sender_id} does not exist")
            return
        except Chat.DoesNotExist:
            print(f"-----------------[DEBUG] Chat with ID {self.chatId} does not exist")
            return

        print(f"-----------------[DEBUG] Valid sender {sender.username} and chat {self.chatId} found")

        # Save the message to the database
        new_message = await sync_to_async(Message.objects.create)(
            chat=chat, sender=sender, content=content
        )

        # Debug: Print after the message is saved
        print(f"-----------------[DEBUG] Message saved: {content} from {sender.username}")

        await self.channel_layer.group_send(
            self.chat_group_name,
            {
                'type': 'chat_message',
                'content': new_message.content,
                'sender': sender.username,
                'chatId': chat.id,
                # 'reciever': reciever_id,
            }
        )
    async def chat_message(self, event):
        content = event['content']
        sender_id = event['sender']
        chatId = event['chatId']
        # reciever_id = event['reciever']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'content': content,
            'sender': sender_id,
            'chatId': chatId
            # 'reciever': reciever_id
        }))
        print(f"-----------------[[DEBUG] Message sent to WebSocket: {event['content']} from sender {event['sender']}")
