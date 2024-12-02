from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

#USER MODEL
class Player(AbstractUser):

    # display_name=models.CharField(max_length=50, blank=True)
    # is_online=models.BooleanField(default=False)
    # wins=models.IntegerField(default=0)
    # losses=models.IntegerField(default=0)

    # pending_friends=models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='pending_friends', blank=True)
    # friends=models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='friends', blank=True)
    # avatar=models.ImageField(upload_to='Avatars/', default='Avatars/defaultAvatar.jpeg')
    # cover=models.ImageField(upload_to='Covers/', default='Covers/defaultCover.jpeg')
    # avatar=models.ImageField(upload_to='Avatars/', default='Avatars/defaultAvatar.jpeg')
    # cover=models.ImageField(upload_to='Covers/', default='Covers/defaultCover.jpeg')

    enabled_2fa=models.BooleanField(default=False)
    otp_secret_key=models.CharField(max_length=16, default=None, null=True, blank=True) #, null=True, blank=True
    verified_otp=models.BooleanField(default=False)

    def __str__(self):
        return self.username


    def save(self, *args, **kwargs):
    # If the player is being created, also create a PlayerProfile and PlayerSettings
        if not self.pk:  # Check if the object is being created (not updated)
            super().save(*args, **kwargs)  # Save the Player instance first to get the player id
            PlayerProfile.objects.create(player=self)
            PlayerSettings.objects.create(player_profile=self)
        else:
            super().save(*args, **kwargs)  # For updates, just save the Player normally

    # last_login=models.DateTimeField()

import string
import random

# PROFILE MODEL
class PlayerProfile(models.Model):
    player = models.OneToOneField(Player, on_delete=models.CASCADE, related_name='profile')

    is_online=models.BooleanField(default=False)

    display_name = models.CharField(max_length=50, unique=True, default="Player")
    bio = models.TextField(max_length=500, blank=True)
    avatar=models.ImageField(upload_to='Avatars/', default='Avatars/.defaultAvatar.jpeg')
    cover=models.ImageField(upload_to='Covers/', default='Covers/.defaultCover.jpeg')

    rank_points = models.IntegerField(default=0)
    games_played = models.IntegerField(default=0)
    games_won = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.display_name} (Rank: {self.rank_points})"

    def save(self, *args, **kwargs):
        if not self.display_name:
            random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=4))
            self.display_name = f"{random_suffix}"

        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-rank_points']


class PlayerSettings(models.Model):
    player_profile = models.OneToOneField(Player, on_delete=models.CASCADE, related_name="settings")
    private_profile = models.BooleanField(default=False)
    notifications_enabled = models.BooleanField(default=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Settings for {self.user_profile.user.username}"
