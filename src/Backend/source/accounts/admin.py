from django.contrib import admin
from .models import *

@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_staff', 'is_superuser')
    search_fields = ('username', 'email')

@admin.register(PlayerProfile)
class PlayerProfileAdmin(admin.ModelAdmin):
    list_display = ('display_name', 'player', 'rank_points', 'games_played', 'games_won', 'games_loss', 'win_ratio', 'is_online')
    search_fields = ('display_name', 'player__username')

@admin.register(PlayerSettings)
class PlayerSettingsAdmin(admin.ModelAdmin):
    list_display = ('player_profile', 'private_profile', 'notifications_enabled')
    search_fields = ('player_profile__display_name',)

@admin.register(MatchHistory)
class MatchHistoryAdmin(admin.ModelAdmin):
    list_display = ('result', 'player', 'opponent', 'player_score', 'opponent_score', 'date')
    list_filter = ('result', 'date')
    search_fields = ('player__display_name', 'opponent__display_name')
