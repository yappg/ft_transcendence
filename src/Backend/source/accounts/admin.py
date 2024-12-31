from django.contrib import admin
from .models import (
    Player,
    PlayerProfile,
    PlayerSettings,
    MatchHistory,
    Achievement,
    PlayerAchievement
)

class PreventDeleteAdmin(admin.ModelAdmin):

    def has_add_permission(self, request):
        return False  # Disable adding new instances

    def has_change_permission(self, request, obj=None):
        return True  # Disable editing instances

    def has_delete_permission(self, request, obj=None):
        return True  # Allow deletion via cascade

    def get_actions(self, request):
        actions = super().get_actions(request)
        if 'delete_selected' in actions:
            del actions['delete_selected']  # Remove bulk delete action
        return actions

    def delete_model(self, request, obj):
        pass  # Prevent deletion through the admin interface

    def delete_queryset(self, request, queryset):
        pass  # Prevent bulk deletion through the admin interface

@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'enabled_2fa', 'verified_otp', 'is_staff', 'is_superuser')
    search_fields = ('username', 'email')
    list_filter = ('enabled_2fa', 'verified_otp', 'is_staff', 'is_superuser')

    def has_add_permission(self, request):
        return True

    def has_delete_permission(self, request, obj=None):
        return True

@admin.register(PlayerProfile)
class PlayerProfileAdmin(PreventDeleteAdmin):
    list_display = ('display_name', 'player', 'level', 'xp', 'win_ratio', 'is_online')
    search_fields = ('display_name', 'player__username')
    list_filter = ('is_online', 'level')

@admin.register(PlayerSettings)
class PlayerSettingsAdmin(PreventDeleteAdmin):
    list_display = ('player_profile', 'private_profile', 'notifications_enabled', 'updated_at')
    search_fields = ('player_profile__display_name',)
    list_filter = ('private_profile', 'notifications_enabled')


@admin.register(MatchHistory)
class MatchHistoryAdmin(admin.ModelAdmin):
    list_display = ('player1', 'player2', 'result', 'map_played', 'date')
    search_fields = ('player1__display_name', 'player2__display_name')
    list_filter = ('result', 'map_played', 'date')


@admin.register(Achievement)
class AchievementAdmin(PreventDeleteAdmin):
    list_display = ('name', 'description', 'xp_gain', 'condition')
    search_fields = ('name',)


@admin.register(PlayerAchievement)
class PlayerAchievementAdmin(PreventDeleteAdmin):
    list_display = ('player', 'achievement', 'gained', 'progress', 'date_earned')
    search_fields = ('player__display_name', 'achievement__name')
    list_filter = ('gained',)
