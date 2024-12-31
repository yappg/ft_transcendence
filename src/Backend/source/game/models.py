from django.db import models
from django.conf import settings

from accounts.models import Player, PlayerProfile

class Game(models.Model):
    TIMER = 6 # in minutes

    STATUS_CHOICES = [
        ('WAITING', 'Waiting'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
    ]

    room_name = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='WAITING')
    
    winner = models.ForeignKey(Player, on_delete=models.SET_NULL, related_name='game_win', null=True, blank=True)
    
    player1 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='games_as_player1')
    player2 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='games_as_player2', null=True, blank=True)
    
    player1_score = models.IntegerField(default=0)
    player2_score = models.IntegerField(default=0)
    
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Game {self.id}: {self.player1} vs {self.player2 or 'Waiting'}"
    # def save(self):
    #     if self.status == 'COMPLETED':
    #         if self.player1_score > self.player2_score:
    #             self.winner = self.player1
    #         elif self.player1_score < self.player2_score:
    #             self.winner = self.player2
    #     super().save()

# class GameMove(models.Model):
#     game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='moves')
#     player = models.ForeignKey(PlayerProfile, on_delete=models.CASCADE)
#     x_position = models.FloatField()
#     # y_position = models.FloatField()
#     timestamp = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         ordering = ['timestamp']


#game history

class LeaderboardEntry(models.Model):
    player = models.OneToOneField(PlayerProfile, on_delete=models.CASCADE)
    rank = models.IntegerField()
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['rank']
