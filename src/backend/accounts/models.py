from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class Player(AbstractUser):
    
    tournament_display_name=models.CharField(max_length=50, blank=True)
    avatar=models.ImageField(upload_to='templates/account/', default='templates/account/defaultAvatar.jpeg')
    is_online=models.BooleanField(default=False)
    # friends=models.ManyToManyField()
    wins=models.IntegerField(default=0)
    losses=models.IntegerField(default=0)
