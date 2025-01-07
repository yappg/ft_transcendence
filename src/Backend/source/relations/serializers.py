from rest_framework import serializers
from .models import *

class FriendInvitationSerializer(serializers.ModelSerializer):
    sender = serializers.StringRelatedField()
    receiver = serializers.StringRelatedField()

    class Meta:
        model = FriendInvitation
        fields = ['sender', 'id', 'receiver', 'created_at']


class FriendPendingSerializer(serializers.ModelSerializer):
    sender_display_name = serializers.SerializerMethodField()
    sender_avatar = serializers.SerializerMethodField()
    sender_level = serializers.SerializerMethodField()


    class Meta:
        model = FriendInvitation
        fields = ['sender', 'receiver', 'created_at', 'sender_display_name', 'sender_avatar', 'sender_level']

    def get_sender_display_name(self, obj):
        return obj.sender.profile.display_name
    def get_sender_avatar(self, obj):
        return obj.sender.profile.avatar.url
    def get_sender_level(self, obj):
        return obj.sender.profile.level


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
        if self.context['request'].user == obj.friend_requester:
            return obj.friend_responder.profile.level
        return obj.friend_requester.profile.level

    def get_avatar(self, obj):
        if self.context['request'].user == obj.friend_requester:
            return obj.friend_responder.profile.avatar.url if obj.friend_responder.profile.avatar else None
        return obj.friend_requester.profile.avatar.url if obj.friend_requester.profile.avatar else None


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
