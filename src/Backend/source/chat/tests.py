import json
from channels.testing import WebsocketCommunicator
from django.test import TestCase
from django.contrib.auth import get_user_model
from channels.layers import get_channel_layer
from .models import ChatRoom, Message
from .consumers import ChatConsumer
from rest_framework.test import APIClient
from _1Config.asgi import application
from channels.db import database_sync_to_async

User = get_user_model()

class ChatConsumerTestCase(TestCase):
    def setUp(self):
        # Create two users for testing
        self.user1 = User.objects.create_user(username='user1', password='password')
        self.user2 = User.objects.create_user(username='user2', password='password')
        self.client = APIClient()

    @database_sync_to_async
    def create_user(self, username, password):
        return User.objects.create_user(username=username, password=password)

    @database_sync_to_async
    def create_chat_room(self, name, users):
        chat_room = ChatRoom.objects.create(name=name)
        chat_room.senders.add(*users)
        return chat_room

    @database_sync_to_async
    def get_last_message(self):
        return Message.objects.last()

    async def asyncSetUp(self):
        self.user1 = await self.create_user('user1', 'password')
        self.user2 = await self.create_user('user2', 'password')
        self.client = APIClient()
        self.chat_room = await self.create_chat_room("user1_user2_room", [self.user1, self.user2])

    async def test_chat_connect(self):
        communicator = WebsocketCommunicator(application, "/ws/chat/1/")
        communicator.scope['url_route'] = {'kwargs': {'chatId': '1'}}
        connected, subprotocol = await communicator.connect()
        self.assertTrue(connected)
        response = await communicator.receive_json_from()
        self.assertEqual(response['type'], 'connection_establish')
        self.assertEqual(response['message'], "you're now connected")
        await communicator.disconnect()

    async def test_send_message(self):
        communicator = WebsocketCommunicator(application, "/ws/chat/1/")
        communicator.scope['url_route'] = {'kwargs': {'chatId': '1'}}
        connected, subprotocol = await communicator.connect()
        self.assertTrue(connected)

        message_content = "Hello from user1"
        message_data = {
            'content': message_content,
            'sender': self.user1.id
        }

        await communicator.send_json_to(message_data)
        response = await communicator.receive_json_from()
        self.assertEqual(response['content'], message_content)
        self.assertEqual(response['sender'], self.user1.username)
        self.assertEqual(response['chatId'], self.chat_room.id)

        message = await self.get_last_message()
        self.assertEqual(message.content, message_content)
        self.assertEqual(message.sender, self.user1)

        await communicator.disconnect()

    # async def test_message_persistence(self):
    #     # Ensure the message gets saved in the database and can be fetched
    #     chat_room = self.chat_room
    #     sender = self.user1
    #     content = "Test message persistence"

    #     # Send a message using the API (as a normal user would)
    #     response = self.client.post(f'/chat/{chat_room.id}/messages/', {
    #         'content': content,
    #         'receiver': self.user2.username
    #     }, format='json', HTTP_AUTHORIZATION=f'Bearer {self.user1.token}')
        
    #     self.assertEqual(response.status_code, 201)
    #     message = Message.objects.last()
    #     self.assertEqual(message.content, content)
    #     self.assertEqual(message.sender, sender)

    # def test_create_chat(self):
    #     # Use the API client to create a chat
    #     data = {
    #         'senders': 'user2'
    #     }
    #     self.client.force_authenticate(user=self.user1)

    #     response = self.client.post('/chat/ch/', data, format='json')

    #     self.assertEqual(response.status_code, 200)
    #     self.assertIn('name', response.data)
    #     self.assertEqual(response.data['name'], "user1_user2_room")

    # def test_create_chat_with_non_existent_user(self):
    #     # Test that we can't create a chat with a non-existent user
    #     data = {
    #         'senders': 'nonexistentuser'
    #     }
    #     self.client.force_authenticate(user=self.user1)

    #     response = self.client.post('/chat/ch/', data, format='json')

    #     self.assertEqual(response.status_code, 404)
    #     self.assertEqual(response.data['error'], 'User not found')

    # def test_chat_list_view(self):
    #     # Test the chat list view API endpoint
    #     self.client.force_authenticate(user=self.user1)

    #     response = self.client.get('/chat/list/')

    #     self.assertEqual(response.status_code, 200)
    #     self.assertEqual(len(response.data), 1)  # user1 should have one chat with user2
    #     self.assertEqual(response.data[0]['name'], "user1_user2_room")

    # def test_message_get_view(self):
    #     # Test fetching messages from a chat
    #     self.client.force_authenticate(user=self.user1)

    #     response = self.client.get(f'/chat/{self.chat_room.id}/messages/')

    #     self.assertEqual(response.status_code, 200)
    #     self.assertGreater(len(response.data), 0)  # Assuming there are messages in the chat

    # def test_message_post_view(self):
    #     # Test posting a message via API
    #     self.client.force_authenticate(user=self.user1)

    #     response = self.client.post(f'/chat/{self.chat_room.id}/messages/', {
    #         'content': 'New message via API',
    #         'receiver': self.user2.username
    #     }, format='json')

    #     self.assertEqual(response.status_code, 201)
    #     self.assertEqual(response.data['content'], 'New message via API')


# Add any additional tests for specific edge cases if needed

