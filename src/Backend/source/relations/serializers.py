from rest_framework import serializers
from accounts.serializers import PlayerSerializer
from .models import *

class FriendInvitationSerializer(serializers.ModelSerializer):
    sender = serializers.StringRelatedField()
    receiver = serializers.StringRelatedField()

    class Meta:
        model = FriendInvitation
        fields = ['sender', 'id', 'receiver', 'created_at', 'status']

class BlockedFriendsSerializer(serializers.ModelSerializer):

    class Meta:
        model = BlockedFriends
        fields = ['id', 'blocker', 'blocked', 'created_at']


class FriendsSerializer(serializers.ModelSerializer):
    friend_requester = serializers.StringRelatedField()
    friend_responder = serializers.StringRelatedField()

    class Meta:
        model = Friends
        fields = ['id', 'friend_requester', 'friend_responder', 'created_at']


class NotificationSerializer(serializers.ModelSerializer):
    recipient = serializers.StringRelatedField()
    class Meta:
        model = Notification
        fields = ['id', 'recipient', 'message', 'read', 'created_at']
