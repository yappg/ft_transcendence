from django.db import models
from accounts.models import Player

# Create your models here.
class ChatRoom(models.Model):
    name = models.CharField(max_length=100, unique=True)
    users = models.ManyToManyField(Player, related_name='chatrooms')
    # messages = models.ManyToManyField(Player, related_name='message')
    password = models.CharField(max_length=100, null=True, blank=True)

class Message(models.Model):
    chatroom = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name="chatRoom")
    user = models.ForeignKey(Player, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)