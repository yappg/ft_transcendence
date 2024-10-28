from django.db import models
from django.conf import settings 

class PlayerProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='player_profile')
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

class Game(models.Model):
    GAME_STATUS_CHOICES = [
        ('WAITING', 'Waiting for Players'),
        ('IN_PROGRESS', 'Game in Progress'),
        ('FINISHED', 'Game Finished'),
        ('CANCELLED', 'Game Cancelled'),
    ]

    # game_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    player1 = models.ForeignKey(PlayerProfile, on_delete=models.CASCADE, related_name='games_as_player1')
    player2 = models.ForeignKey(PlayerProfile, on_delete=models.CASCADE, related_name='games_as_player2', null=True)
    winner = models.ForeignKey(PlayerProfile, on_delete=models.SET_NULL, related_name='won', null=True)
    player1_score = models.IntegerField(default=0)
    player2_score = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=GAME_STATUS_CHOICES, default='WAITING')
    created_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(null=True)
    finished_at = models.DateTimeField(null=True)
    room_name = models.CharField(max_length=100, default=None)

    def __str__(self):
        return f"Game {self.game_id} - {self.get_status_display()}"

    class Meta:
        ordering = ['-created_at']

class GameMove(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='moves')
    player = models.ForeignKey(PlayerProfile, on_delete=models.CASCADE)
    x_position = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

class LeaderboardEntry(models.Model):
    player = models.OneToOneField(PlayerProfile, on_delete=models.CASCADE)
    rank = models.IntegerField()
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['rank']