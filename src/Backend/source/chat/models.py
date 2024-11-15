from django.db import models
from accounts.models import Player


class ChatRoom(models.Model):
    name = models.CharField(max_length=100, unique=True)
    senders = models.ManyToManyField(Player, related_name='chatrooms')
    is_private = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chat between {self.senders.all()[0].username} and {self.senders.all()[1].username}"
    
class Message(models.Model):
    chatroom = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField()
    send_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Message from {self.sender.username} in chat {self.chatroom.id}"