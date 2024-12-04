from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

# Create your models here.

#USER MODEL
class Player(AbstractUser):

    # display_name=models.CharField(max_length=50, blank=True)
    # is_online=models.BooleanField(default=False)
    # wins=models.IntegerField(default=0)
    # losses=models.IntegerField(default=0)
    avatar=models.ImageField(upload_to='Avatars/', default='Avatars/defaultAvatar.jpeg')
    cover=models.ImageField(upload_to='Covers/', default='Covers/defaultCover.jpeg')

    enabled_2fa=models.BooleanField(default=False)
    otp_secret_key=models.CharField(max_length=512, default=None, null=True, blank=True) #, null=True, blank=True
    verified_otp=models.BooleanField(default=False)
    
    def __str__(self):
        return self.username

    # last_login=models.DateTimeField()


# PROFILE MODEL
class PlayerProfile(models.Model):
    player = models.OneToOneField(Player, on_delete=models.CASCADE, related_name='player_profile')
    is_online=models.BooleanField(default=False)
    display_name = models.CharField(max_length=50, unique=True)
    rank_points = models.IntegerField(default=1000)
    games_played = models.IntegerField(default=0)
    games_won = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.display_name} (Rank: {self.rank_points})"

    class Meta:
        ordering = ['-rank_points']

class PlayerSettings(models.Model):
    player_profile = models.OneToOneField(PlayerProfile, on_delete=models.CASCADE)
    private_profile = models.BooleanField(default=False)
    notifications_enabled = models.BooleanField(default=True)

    def __str__(self):
        return f"Settings for {self.user_profile.user.username}"
