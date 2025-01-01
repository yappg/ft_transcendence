from rest_framework import serializers
from .models import *

class FriendInvitationSerializer(serializers.ModelSerializer):
    sender = serializers.StringRelatedField()
    receiver = serializers.StringRelatedField()

    class Meta:
        model = FriendInvitation
        fields = ['sender', 'id', 'receiver', 'created_at']


class ProfileFriendsSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    display_name = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    level = serializers.SerializerMethodField()

    class Meta:
        model = Friends
        fields = ['id', 'display_name', 'avatar', 'level']
        read_only_fields = ['id', 'display_name', 'avatar', 'level']

    def get_id(self, obj):
        if self.context['request'].user == obj.friend_requester:
            return obj.friend_responder.profile.id
        return obj.friend_requester.profile.id

    def get_display_name(self, obj):
        if self.context['request'].user == obj.friend_requester:
            return obj.friend_responder.profile.display_name
        return obj.friend_requester.profile.display_name

    def get_level(self, obj):
        print(f"request user is {self.context['request'].user}")
        if self.context['request'].user == obj.friend_requester:
            return obj.friend_responder.profile.level
        return obj.friend_requester.profile.level

    def get_avatar(self, obj):
        print(f"request user is {self.context['request'].user}")
        if self.context['request'].user == obj.friend_requester:
            return obj.friend_responder.profile.avatar.url
        return obj.friend_requester.profile.avatar.url


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
