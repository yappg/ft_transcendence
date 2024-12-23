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
from drf_yasg import openapi
from .models import ChatRoom



class ChatView(APIView):

    @swagger_auto_schema(request_body=ChatRoomSerializer)
    def post(self, request):
        current_user = request.user
        friend_username = request.data.get('senders')
        try:
            friend = Player.objects.get(username=friend_username)
        except Player.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        if current_user == friend:
            return Response({"error": "You cannot start a chat with yourself"}, status=400)
        chat_name = f"{current_user}_{friend}_room"
        chat = ChatRoom.objects.filter(name=chat_name).first()
        if chat is None:
            chat = ChatRoom.objects.create(name=chat_name)
            chat.senders.add(current_user, friend)
        serializer = ChatRoomSerializer(chat)
        return Response(serializer.data)


class ChatListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        chats = ChatRoom.objects.filter(senders=user)
        serializer = ChatRoomSerializer(chats, many=True, context={'request': request})
        return Response(serializer.data)


class ChatMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request , chatId):
        try:
            chat = ChatRoom.objects.get(id=chatId)
        except ChatRoom.DoesNotExist:
            return Response({"error": "Chat Not Found"}, status=404)
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
        try:
            chat = ChatRoom.objects.get(id=chatId)
        except ChatRoom.DoesNotExist:
            return Response({"error": "Chat not Found"}, status=404)

        print(f"-----------------{chat}-----------------------------------4")

        try:
            receiver = Player.objects.get(username=receiverId)
        except Player.DoesNotExist:
            return Response({"error": "Receiver Not Found"}, status=404)
        print(f"-----------------{receiver}-----------------------------------5")

        if receiver not in chat.senders.all():
            return Response({"error": "Receiver is not a participants of this chat"}, status=404)
        message = Message.objects.create(
            chatroom = chat,
            sender=sender,
            receiver=receiver,
            content=content
        )

        serializer = MessageSerializer(message)
        return Response(serializer.data, status=201)

