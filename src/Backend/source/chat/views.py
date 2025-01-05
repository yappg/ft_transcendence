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
from rest_framework.exceptions import status

class ChatListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            chats = ChatRoom.objects.filter(senders=user)
            serializer = ChatRoomSerializer(chats, many=True, context={'request': request})
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": f"Failed to retrieve chats {e}"}, status=status.HTTP_404_NOT_FOUND)


class ChatMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, chatId):
        try:
            chat = ChatRoom.objects.get(id=chatId)

            if request.user not in chat.senders.all():
                return Response({"error": "Access denied"}, status=status.HTTP_403_FORBIDDEN)

            messages = Message.objects.filter(chatroom=chat).order_by('send_at')
            serializer = MessageSerializer(messages, many=True)
            return Response(serializer.data)

        except ChatRoom.DoesNotExist:
            return Response({"error": "Chat Not Found"}, status=status.HTTP_404_NOT_FOUND)
