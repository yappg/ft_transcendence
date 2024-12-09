from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Player, PlayerProfile, PlayerSettings, MatchHistory

@admin.register(Player)
class PlayerAdmin(UserAdmin):
    # Fields to display in the admin list view
    list_display = ('username', 'email', 'is_staff', 'is_superuser', 'is_active')
    list_filter = ('is_staff', 'is_superuser', 'is_active')
    search_fields = ('username', 'email')
    ordering = ('username',)

    # Fieldsets to organize the detail view
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('email', 'enabled_2fa', 'verified_otp', 'otp_secret_key')}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser', 'is_active', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )

    # Add fieldsets for adding a new user
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'is_staff', 'is_superuser', 'is_active'),
        }),
    )

@admin.register(PlayerProfile)
class PlayerProfileAdmin(admin.ModelAdmin):
    list_display = ('display_name', 'player', 'elo_rating', 'level', 'xp', 'games_played', 'games_won', 'games_loss', 'win_ratio')
    search_fields = ('display_name', 'player__username')
    list_filter = ('level', 'elo_rating')
    ordering = ('-elo_rating',)

@admin.register(PlayerSettings)
class PlayerSettingsAdmin(admin.ModelAdmin):
    list_display = ('player_profile', 'private_profile', 'notifications_enabled', 'updated_at')
    search_fields = ('player_profile__display_name',)
    list_filter = ('private_profile', 'notifications_enabled')
    ordering = ('-updated_at',)

@admin.register(MatchHistory)
class MatchHistoryAdmin(admin.ModelAdmin):
    list_display = ('player1', 'player2', 'result', 'player1_score', 'player2_score', 'date')
    search_fields = ('player1__display_name', 'player2__display_name')
    list_filter = ('result', 'date')
    ordering = ('-date',)
