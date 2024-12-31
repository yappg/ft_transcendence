from django.contrib import admin
from .models import ChatRoom, Message

@admin.register(ChatRoom)
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'is_private', 'created_at')
    filter_horizontal = ('senders',)
    search_fields = ('name', 'senders__username')
    list_filter = ('is_private', 'created_at')

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'receiver', 'chatroom', 'send_at', 'is_read')
    list_filter = ('is_read', 'send_at')
    search_fields = ('content', 'sender__username', 'receiver__username')
