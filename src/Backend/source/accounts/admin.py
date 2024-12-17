from django.contrib import admin
from .models import *

# TODO errors when searching admin pannel
@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'enabled_2fa', 'verified_otp')
    search_fields = ('username', 'email')

@admin.register(PlayerProfile)
class PlayerProfileAdmin(admin.ModelAdmin):
    list_display = ('player', 'display_name', 'level', 'total_games', 'games_won', 'games_loss', 'win_ratio')
    search_fields = ('player__username', 'display_name')
    list_filter = ('level', 'is_online')

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

@admin.register(PlayerSettings)
class PlayerSettingsAdmin(admin.ModelAdmin):
    list_display = ('player_profile', 'private_profile', 'notifications_enabled')
    search_fields = ('player_profile__player__username' ,'player_profile__display_name')

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

@admin.register(MatchHistory)
class MatchHistoryAdmin(admin.ModelAdmin):
    list_display = ('player1', 'player2', 'result', 'map_played', 'date')
    search_fields = ('player1__display_name', 'player2__display_name')
    list_filter = ('result', 'map_played', 'date')


@admin.register(Achievement)
class AchivementAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'xp_gain')
    search_fields = ('name', 'xp_gain')

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

@admin.register(PlayerAchievement)
class PlayerAchievementAdmin(admin.ModelAdmin):
    list_display = ('achievement', 'player', 'gained', 'date_earned')
    search_fields = ('achievement__name', 'gained', 'player__display_name')

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
