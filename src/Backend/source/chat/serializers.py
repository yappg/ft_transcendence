from rest_framework import serializers
from .models import ChatRoom, Message
from accounts.models import Player, PlayerProfile
from relations.models import BlockedUsers

class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.StringRelatedField()
    receiver = serializers.StringRelatedField()
    class Meta:
        model = Message
        fields = ['id', 'content', 'receiver', 'sender' ,'send_at']

class ChatRoomSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()
    receiver = serializers.SerializerMethodField()
    is_blocked = serializers.SerializerMethodField()
    blocked_by = serializers.SerializerMethodField()
    is_online = serializers.SerializerMethodField()
    class Meta:
        model = ChatRoom
        fields = ['id', 'created_at', 'last_message', 'receiver', 'is_blocked', 'blocked_by', 'is_online']
    
        
    
    def get_last_message(self, obj):
        last_message = obj.messages.order_by('-send_at').first()
        if last_message:
            return MessageSerializer(last_message).data
        return None
    
    def get_receiver(self, obj):
        user = self.context.get('request').user
        receivers = obj.senders.exclude(profile__isnull=True).exclude(id=user.id)
        if receivers.exists():
            receiver = receivers.first()
            return {
                'id': receiver.profile.id,
                'username': receiver.profile.display_name,
                'usernameGame': receiver.username,
                'avatar': receiver.profile.avatar.url if receiver.profile.avatar else None
            }
        return None

    def get_is_blocked(self, obj):
        user = self.context.get('request').user
        obj_receiver = obj.senders.exclude(profile__isnull=True).exclude(id=user.id).first()
        if obj_receiver:
            try:
                blocked = BlockedUsers.objects.get(user=user)
                if blocked.is_blocked(obj_receiver):
                    return True
            except BlockedUsers.DoesNotExist:
                return False
        return False

    def get_blocked_by(self, obj):
        user = self.context.get('request').user
        other = obj.senders.exclude(profile__isnull=True).exclude(id=user.id).first()
        if other:
            try:
                blocked_by = BlockedUsers.objects.get(user=other)
                return blocked_by.is_blocked(user)
            except BlockedUsers.DoesNotExist:
                return False
        return False

    def get_is_online(self, obj):
        user = self.context.get('request').user
        other = obj.senders.exclude(profile__isnull=True).exclude(id=user.id).first()
        if other:
            return other.profile.is_online
        return False
    
