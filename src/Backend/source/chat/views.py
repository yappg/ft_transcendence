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
