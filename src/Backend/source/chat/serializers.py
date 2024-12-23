from rest_framework import serializers
from .models import ChatRoom, Message

class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.StringRelatedField(read_only=True)
    receiver = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'chatroom', 'sender', 'receiver', 'content', 'send_at']


class ChatRoomSerializer(serializers.ModelSerializer):
    senders = serializers.SlugRelatedField(
        many=True,
        slug_field='username',
        read_only=True
    )
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = ['id', 'senders', 'created_at', 'last_message']


    def get_senders(self, obj):
        senders = obj.senders.all()
        return [{'username': senders.username, 'avatar': senders.avatar.url} for sender in senders]

    def get_last_message(self, obj):
        LastMessage = obj.messages.order_by('-send_at').first()
        if LastMessage:
            return MessageSerializer(LastMessage).data
        return None
