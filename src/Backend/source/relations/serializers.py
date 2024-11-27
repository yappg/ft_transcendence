from rest_framework import serializers
from accounts.serializers import PlayerSerializer
from .models import FriendInvitation, BlockedFriends ,Friends

class FriendInvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendInvitation
        fields = ['id', 'sender', 'receiver', 'created_at', 'status']

class BlockedFriendsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockedFriends
        fields = ['id', 'blocker', 'blocked', 'created_at']


class FriendsSerializer(serializers.ModelSerializer):
    friend_requester = PlayerSerializer()
    friend_responder = PlayerSerializer()

    class Meta:
        model = Friends
        fields = ['id', 'friend_requester', 'friend_responder', 'created_at']