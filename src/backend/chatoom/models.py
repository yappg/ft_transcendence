from django.db import models
from django.conf import settings

# Create your models here.
class ChatRoom(models.Model):
    name = models.CharField(max_length=100, unique=True)
    users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='chatrooms')
    # messages = models.ManyToManyField('ChatMessage', related_name='chatroom')
    password = models.CharField(max_length=100, null=True, blank=True)