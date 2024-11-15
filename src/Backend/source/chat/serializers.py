from rest_framework import serializers
from .models import ChatRoom, Message

class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'chatRoom', 'sender', 'content', 'send_at']


class ChatRoomSerializer(serializers.ModelSerializer):
    senders = serializers.SlugRelatedField(
        many=True,
        slug_field='username',
        read_only=True
    )
    last_message = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatRoom
        fields = {'id', 'senders', 'created_at', 'last_message'}
    
    def getConv(self, obj):
        LastMessage = obj.messages.order_by('send_at').first()
        if LastMessage:
            return MessageSerializer(LastMessage)
        return None