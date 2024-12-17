from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.core.validators import MinLengthValidator
from django.utils import timezone
from django.db.models import Q
from django.db import models

import string
import random


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
        if is_new and not self.is_superuser:
            PlayerProfile.objects.create(player=self)
            PlayerSettings.objects.create(player_profile=self.profile)
            achievements = Achievement.objects.all()

            for achievement in achievements:
                PlayerAchievement.objects.create(player=self.profile, achievement=achievement)



# TODO for a private profile dont serlizer all the data only public one ###
class PlayerProfile(models.Model):
    player = models.OneToOneField(Player, on_delete=models.CASCADE, related_name='profile')

    is_online=models.BooleanField(default=False)
    display_name = models.CharField(validators=[MinLengthValidator(3)], max_length=50, unique=True, blank=False)
    bio = models.TextField(max_length=500, blank=True)


    avatar = models.ImageField(
        upload_to='Avatars/',
        default='Avatars/.defaultAvatar.jpeg'
    )
    cover = models.ImageField(
        upload_to='Covers/',
        default='Covers/.defaultCover.jpeg'
    )


    xp = models.PositiveIntegerField(default=0)
    level = models.PositiveIntegerField(default=0)

    total_games = models.PositiveIntegerField(default=0)

    games_won = models.PositiveIntegerField(default=0)
    games_loss = models.PositiveIntegerField(default=0)
    win_ratio = models.FloatField(default=0.0)


    ice_games =  models.PositiveIntegerField(default=0)
    water_games =  models.PositiveIntegerField(default=0)
    fire_games =  models.PositiveIntegerField(default=0)
    earth_games =  models.PositiveIntegerField(default=0)

    # ice_wins =  models.PositiveIntegerField(default=0)
    # water_wins =  models.PositiveIntegerField(default=0)
    # fire_wins =  models.PositiveIntegerField(default=0)
    # earth_wins =  models.PositiveIntegerField(default=0)


    last_login = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.display_name} (Level: {self.level})"

    class Meta:
        ordering = ['-games_won']
        verbose_name = 'Player Profile'
        verbose_name_plural = 'Player Profiles'

    def all_matches(self):
        return MatchHistory.objects.filter(Q(player1=self) | Q(player2=self)).order_by('-date')


    def calculate_level_up_xp(self):
        return 50 * (self.level + 1)

    def check_level_up(self):
        level_up_xp = self.calculate_level_up_xp()
        while self.xp >= level_up_xp:
            self.xp -= self.calculate_level_up_xp()
            self.level += 1
            level_up_xp = self.calculate_level_up_xp()

    def add_xp_points(self, amount):
        self.xp += amount
        self.check_level_up()


    def update_win_ratio(self):
        if self.total_games != 0:
            self.win_ratio = (self.games_won / self.total_games) * 100
        else:
            self.win_ratio = 0.0


    def save(self, *args, **kwargs):
        if not self.display_name:
            max_attempts = 10
            for attempt in range(max_attempts):
                suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=12))
                potential_name = self.player.username + '_' + suffix
                if not PlayerProfile.objects.filter(display_name=potential_name).exists():
                    self.display_name = potential_name
                    break
            else:
                raise ValueError("Unable to generate a unique display name after multiple attempts.")

        super().save(*args, **kwargs)



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



class MatchHistory(models.Model):
    XP_WIN = 30
    XP_DRAW = 20
    XP_LOSS = 15

    RESULT_CHOICES = [
        ('player1', 'player1'),
        ('player2', 'player2'),
        ('Draw', 'Draw'),
    ]
    MAP_CHOICES = [
        ("ice" , "ice"),
        ("water" , "water"),
        ("fire" , "fire"),
        ("earth" , "earth"),
    ]

    result = models.CharField(max_length=10, choices=RESULT_CHOICES)
    map_played = models.CharField(max_length=10, choices=MAP_CHOICES)

    player1 = models.ForeignKey(PlayerProfile, on_delete=models.CASCADE, related_name='matches_as_player1')
    player2 = models.ForeignKey(PlayerProfile, on_delete=models.CASCADE, related_name='matches_as_player2')

    player1_score = models.IntegerField(default=0)
    player2_score = models.IntegerField(default=0)

    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.player1.display_name} vs {self.player2.display_name} on {self.date.strftime('%Y-%m-%d')}"

    class Meta:
        ordering = ['-date']
        verbose_name = 'Match History'
        verbose_name_plural = 'Match Histories'

    def save(self, *args, **kwargs):
        if self.player1 == self.player2:
            raise ValidationError("A player cannot play against themselves.")

        self.player1.total_games += 1
        self.player2.total_games += 1

        if self.result == 'player1':
            self.player1.games_won += 1
            self.player2.games_loss += 1
            self.player1.add_xp_points(self.XP_WIN)
            self.player2.add_xp_points(self.XP_LOSS)
        elif self.result == 'player2':
            self.player2.games_won += 1
            self.player1.games_loss += 1
            self.player2.add_xp_points(self.XP_WIN)
            self.player1.add_xp_points(self.XP_LOSS)
        else:
            self.player1.add_xp_points(self.XP_DRAW)
            self.player2.add_xp_points(self.XP_DRAW)

        if self.map_played == 'ice':
            self.player1.ice_games += 1
            self.player2.ice_games += 1
        elif self.map_played == 'water':
            self.player1.water_games += 1
            self.player2.water_games += 1
        elif self.map_played == 'fire':
            self.player1.fire_games += 1
            self.player2.fire_games += 1
        else:
            self.player1.earth_games += 1
            self.player2.earth_games += 1

        self.player1.update_win_ratio()
        self.player2.update_win_ratio()

        self.player1.save()
        self.player2.save()

        super().save(*args, **kwargs)



class Achievement(models.Model):
    name = models.CharField(blank=False, max_length=50)
    description = models.TextField(blank=False, max_length=200)
    xp_gain = models.IntegerField(blank=False)
    condition = models.PositiveIntegerField(blank=False)

    class Meta:
        verbose_name = "achievement"
        verbose_name_plural = "achievements"

    def __str__(self):
        return self.name



class PlayerAchievement(models.Model):
    player = models.ForeignKey(PlayerProfile, on_delete=models.CASCADE)
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)

    gained = models.BooleanField(default=False)
    progress = models.IntegerField(default=0) # should only update progress

    date_earned = models.DateTimeField(null=True)

    class Meta:
        ordering = ["-gained"]
        verbose_name = "player achievement"
        verbose_name_plural = "player achievements"

    def __str__(self):
        return f"{self.player} - {self.achievement}"

    def save(self, *args, **kwargs):
        if self.progress == self.achievement.condition or self.gained:
            self.gained = True
            self.date_earned = timezone.now()
            self.player.add_xp_points(self.achievement.xp_gain)
            self.player.save()

        super().save(*args, **kwargs)
