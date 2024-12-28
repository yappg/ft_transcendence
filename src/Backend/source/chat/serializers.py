from rest_framework import serializers
from .models import ChatRoom, Message
from accounts.models import Player, PlayerProfile

class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.StringRelatedField()
    receiver = serializers.StringRelatedField()
    class Meta:
        model = Message
        fields = ['id', 'content', 'receiver', 'sender' ,'send_at']

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
        user = self.context.get('request').user
        receivers = obj.senders.exclude(id=user.id)
    
        if receivers.exists():
            receiver = receivers.first()
            return {
                'id': receiver.profile.id,
                'username': receiver.profile.display_name,
                'avatar': receiver.profile.avatar.url if receiver.profile.avatar else None
            }
        return None
