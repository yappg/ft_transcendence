from rest_framework import serializers
from models import ChatRoom

class ChatRoomSerializer(serializers.ModelSerializer):
    class meta:
        model = ChatRoom
        fields = ('id', 'name', 'users', 'password')
