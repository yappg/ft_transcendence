from django.db import models
from accounts.models import Player


class ChatRoom(models.Model):
    from relations.models import Friends

    name = models.CharField(max_length=100, unique=True)
    senders = models.ManyToManyField(Player)
    is_private = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"ChatRoom :{self.name}"        


class Message(models.Model):
    chatroom = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name="messages")

    sender = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='recived_messages', default='')

    content = models.TextField()
    is_read = models.BooleanField(default=False)

    send_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.sender.username} in chat {self.chatroom.id}"
