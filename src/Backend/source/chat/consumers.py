import json
from channels.generic.websocket import AsyncWebsocketConsumer, WebsocketConsumer
from accounts.models import Player, PlayerProfile
from .models import ChatRoom, Message
from django.contrib.auth import get_user_model
from asgiref.sync import sync_to_async

Player = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        if not self.user.is_authenticated:
            await self.close()
        await self.accept()
        self.chatId = self.scope['url_route']['kwargs']['chatId']
        self.chat_group_name = f'chat_{self.chatId}'

        print("chatId: " , self.chatId)
        await self.channel_layer.group_add(
            self.chat_group_name,
            self.channel_name
        )
        print(f"-----------------[DEBUG] Added to group: {self.chat_group_name}")

        await self.send(text_data=json.dumps({
            'type':'connection_establish',
            'message':'you\'re now connected'
        }))
        print(f"-----------------[DEBUG] WebSocket connection established for chat ID: {self.chatId}")


    async def disconnect(self, close_code):
        print(f"WebSocket connection closed for chat ID: {self.chatId}, Close code: {close_code}")
        if close_code == 1006:
            print(f"Abnormal closure for chat ID: {self.chatId}, Close code: {close_code}")
        await self.channel_layer.group_discard(
            self.chat_group_name,
            self.channel_name
        )
        print(f"-----------------[DEBUG] WebSocket connection closed for chat ID: {self.chatId}, Close code: {close_code}")

    async def receive(self, text_data):
        print(f"-----------------[DEBUG] Received message data: {text_data}")

        text_data_json = json.loads(text_data)
        content = text_data_json.get('content')
        sender_id = text_data_json.get('sender')
        receiver_id = text_data_json.get('receiver')

        print(f"-----------------[DEBUG] Parsed message: {content}, Sender ID: {sender_id}, receiver ID: {receiver_id} |")

        try:
            sender = await sync_to_async(PlayerProfile.objects.get)(id=sender_id)
            receiver = await sync_to_async(PlayerProfile.objects.get)(id=receiver_id)
            chat = await sync_to_async(ChatRoom.objects.get)(id=self.chatId)
            
            sender_player = await sync_to_async(getattr)(sender, 'player')
            receiver_player = await sync_to_async(getattr)(receiver, 'player')

            new_message = await sync_to_async(Message.objects.create)(
                chatroom=chat,
                sender=sender_player,
                receiver=receiver_player,
                content=content
            )
        except PlayerProfile.DoesNotExist:
            print(f"-----------------[DEBUG] Sender or Reciever with ID {sender_id} does not exist")
            return
        except ChatRoom.DoesNotExist:
            print(f"-----------------[DEBUG] Chat with ID {self.chatId} does not exist")
            return

        print(f"-----------------[DEBUG] ==================== Valid sender {sender.display_name} and chat {self.chatId} found")


        print(f"-----------------[DEBUG] =============================================dssss")

        await self.channel_layer.group_send(
            self.chat_group_name,
            {
                'type': 'chat_message',
                'content': new_message.content,
                'sender': sender.display_name,
                'receiver': receiver.display_name,
                'chatId': chat.id,
            }
        )
    
    async def user_blocked(self, event):
        chat_id = event['chat_id']
        print(f"-----------------[DEBUG] User blocked in chat: {chat_id}")
        await self.send(text_data=json.dumps({
            'type': 'user_blocked',
            'chat_id': chat_id
        }))
        
    async def chat_message(self, event):
        content = event['content']
        sender_id = event['sender']
        chatId = event['chatId']
        receiver_id = event['receiver']

        print(f"-----------------[[DEBUG] Sending message [---|---]to WebSocket: {content} from sender {sender_id} to receiver {receiver_id}")
        await self.send(text_data=json.dumps({
            'content': content,
            'chatId': chatId,
            'sender': sender_id,
            'receiver': receiver_id,
        }))
        print(f"-----------------[[DEBUG] Message sent to WebSocket: {event['content']} from sender {event['sender']}")
