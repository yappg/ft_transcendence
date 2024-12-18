from rest_framework import serializers
from .models import ChatRoom, Message
from accounts.models import Player

class ReceiverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player 
        fields = ['id', 'username', 'avatar']

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'content', 'send_at']

class ChatRoomSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()
    receiver = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = ['id', 'created_at', 'last_message', 'receiver']
    
    def get_last_message(self, obj):
        last_message = obj.messages.order_by('-send_at').first()
        if last_message:
            return MessageSerializer(last_message).data
        return None
    
    def get_receiver(self, obj):
        # Assuming the chat is between two users
        user = self.context.get('request').user
        receivers = obj.senders.exclude(id=user.id)
        
        if receivers.exists():
            receiver = receivers.first()
            return {
                'id': receiver.id,
                'username': receiver.username,
                'avatar': receiver.avatar.url if receiver.avatar else None
            }
        return None