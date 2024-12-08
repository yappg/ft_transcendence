from django.contrib.auth.models import AbstractUser
from django.utils import timezone
# from django.conf import settings
from django.db import models
from django.db.models import Q
import string
import random
from django.core.exceptions import ValidationError

# auth user
class Player(AbstractUser):
    enabled_2fa=models.BooleanField(default=False)
    verified_otp=models.BooleanField(default=False)
    otp_secret_key=models.CharField(max_length=255, default=None, null=True, blank=True)

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = 'Player'
        verbose_name_plural = 'Players'

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            PlayerProfile.objects.create(player=self)
            PlayerSettings.objects.create(player_profile=self.profile)



class PlayerProfile(models.Model):
    player = models.OneToOneField(Player, on_delete=models.CASCADE, related_name='profile')

    is_online=models.BooleanField(default=False)

    display_name = models.CharField(max_length=50, unique=True, blank=False)

    bio = models.TextField(max_length=500, blank=True)

    avatar = models.ImageField(
        upload_to='avatars/',
        default='avatars/.defaultAvatar.jpeg'
    )
    cover = models.ImageField(
        upload_to='covers/',
        default='covers/.defaultCover.jpeg'
    )

    rank_points = models.PositiveIntegerField(default=0)
    games_played = models.PositiveIntegerField(default=0)
    games_won = models.PositiveIntegerField(default=0)
    games_loss = models.PositiveIntegerField(default=0)
    win_ratio = models.FloatField(default=0.0)

    last_login = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.display_name} (Rank: {self.rank_points})"

    class Meta:
        ordering = ['-rank_points']
        verbose_name = 'Player Profile'
        verbose_name_plural = 'Player Profiles'

    def save(self, *args, **kwargs):
        if not self.display_name:
            max_attempts = 10
            for attempt in range(max_attempts):
                random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=12))
                potential_name = f"Player_{random_suffix}"
                if not PlayerProfile.objects.filter(display_name=potential_name).exists():
                    self.display_name = potential_name
                    break
            else:
                raise ValueError("Unable to generate a unique display name after multiple attempts.")

        # Calculate win ratio
        if self.games_played > 0:
            self.win_ratio = self.games_won / self.games_played
        else:
            self.win_ratio = 0.0

        super().save(*args, **kwargs)

    def update_last_login(self):
        self.last_login = timezone.now()
        self.save(update_fields=['last_login'])

    def all_matches(self):
        return MatchHistory.objects.filter(Q(player1=self) | Q(player2=self)).order_by('-date')



class PlayerSettings(models.Model):
    player_profile = models.OneToOneField(PlayerProfile, on_delete=models.CASCADE, related_name="settings")

    private_profile = models.BooleanField(default=False)
    notifications_enabled = models.BooleanField(default=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Settings for {self.player_profile.display_name}"

    class Meta:
        verbose_name = 'Player Settings'
        verbose_name_plural = 'Player Settings'



# user shouldnt play agains it self
class MatchHistory(models.Model):
    RESULT_CHOICES = [
        ('player1', 'player1'),
        ('player2', 'player2'),
        ('Draw', 'Draw'),
    ]

    result = models.CharField(max_length=10, choices=RESULT_CHOICES)

    player1 = models.ForeignKey(PlayerProfile, on_delete=models.CASCADE, related_name='matches_as_player1')
    player2 = models.ForeignKey(PlayerProfile, on_delete=models.CASCADE, related_name='matches_as_player2')

    player1_score = models.IntegerField(default=0)
    player2_score = models.IntegerField(default=0)

    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.player1.display_name} vs {self.player2.display_name} on {self.date.strftime('%Y-%m-%d')}"

    def save(self, *args, **kwargs):
        if self.player1 == self.player2:
            raise ValidationError("A player cannot play against themselves.")
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-date']
        verbose_name = 'Match History'
        verbose_name_plural = 'Match Histories'
