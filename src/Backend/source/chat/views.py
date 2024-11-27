from rest_framework.views import APIView
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import ChatRoom, Message
from .serializers import MessageSerializer, ChatRoomSerializer
from accounts.models import Player
from django.db import transaction
from drf_yasg.utils import swagger_auto_schema


class ChatView(APIView):
    
    @swagger_auto_schema(request_body=ChatRoomSerializer)
    # def get(self, request):
    def post(self, request):
        current_user = request.user
        friend_username = request.data.get('senders')

        # Ensure the friend exists
        try:
            friend = Player.objects.get(username=friend_username)
        except Player.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        # Stop the user from chatting with themselves
        if current_user == friend:
            return Response({"error": "You cannot start a chat with yourself"}, status=400)
        # Check if a chat between the two participants already exists
        chat_name = f"{current_user}_{friend}_room"
        chat = ChatRoom.objects.filter(name=chat_name).first()
        print("ddddddddddddddddd1")
 
        # Create a new chat and add both senders
        if chat is None:
            chat = ChatRoom.objects.create(name=chat_name)
            chat.senders.add(current_user, friend)

        print("ddddddddddddddddd2")
        # Serialize and return the chat
        serializer = ChatRoomSerializer(chat)
        return Response(serializer.data)


class ChatListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        chats = ChatRoom.objects.filter(senders=user)
        serializer = ChatRoomSerializer(chats, many=True)
        return Response(serializer.data)
    
    
class ChatMessagesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request , chatId):
        try:
            chat = ChatRoom.objects.get(id=chatId)
        except ChatRoom.DoesNotExist:
            return Response({"error": "Chat se7ra"}, status=404)
        # obtain all the history
        messages = Message.objects.filter(chatroom=chat).order_by('send_at')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    @swagger_auto_schema(request_body=MessageSerializer)
    def post(self, request, chatId):
        sender = request.user
        print(f"-----------------{sender}-----------------------------------1")
        receiverId = request.data.get('receiver')
        print(f"-----------------{receiverId}-----------------------------------2")
        content = request.data.get('content')
        print(f"-----------------{content}-----------------------------------3")
        
        #validate that chat exists
        try:
            chat = ChatRoom.objects.get(id=chatId)
        except ChatRoom.DoesNotExist:
            return Response({"error": "Chat makynsh"}, status=404)
        
        print(f"-----------------{chat}-----------------------------------4")
        #validate that receiver exists and is a participants of the chat
        
        try:
            receiver = Player.objects.get(username=receiverId)
        except Player.DoesNotExist:
            return Response({"error": "Receiver makynsh"}, status=404)
        print(f"-----------------{receiver}-----------------------------------5")
        
        if receiver not in chat.senders.all():
            return Response({"error": "Receiver is not a sender of this chat"}, status=404)
        #create save
        message = Message.objects.create(
            chatroom = chat,
            sender=sender,
            # receiver=receiver,
            content=content
        )
        
        serializer = MessageSerializer(message)
        return Response(serializer.data, status=201)