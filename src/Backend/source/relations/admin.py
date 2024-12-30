from django.contrib import admin
from .models import Friends, FriendInvitation, BlockedUsers, Notification

@admin.register(Friends)
class FriendsAdmin(admin.ModelAdmin):
    list_display = ('friend_requester', 'friend_responder', 'created_at')
    search_fields = ('friend_requester__username', 'friend_responder__username')
    list_filter = ('created_at',)

@admin.register(FriendInvitation)
class FriendInvitationAdmin(admin.ModelAdmin):
    list_display = ('sender', 'receiver', 'created_at')
    search_fields = ('sender__username', 'receiver__username')
    list_filter = ('created_at',)

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('recipient', 'Type', 'message', 'read', 'created_at')
    search_fields = ('recipient__username', 'message')
    list_filter = ('Type', 'read', 'created_at')

@admin.register(BlockedUsers)
class BlockedUsersAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at')
    search_fields = ('user__username', 'blocked__username')
    list_filter = ('created_at',)
