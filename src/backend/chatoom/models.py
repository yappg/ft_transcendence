from django.db import models
from django.conf import settings

# Create your models here.
class chatoom(models.Model):
    name = models.CharField(max_length=100, unique=True)
    users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='chatooms')
    # messages = models.ManyToManyField('ChatMessage', related_name='chatoom')
    password = models.CharField(max_length=100, null=True, blank=True)