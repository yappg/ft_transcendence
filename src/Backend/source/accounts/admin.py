from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *

# @admin.register(Player)
# class PlayerAdmin(admin.ModelAdmin):
#     list_display = ('username', 'email', 'is_active', 'enabled_2fa', 'otp_secret_key', 'verified_otp')
#     # search_fields = ('username', 'email', 'is_active')
#     def display_name(self, obj):
#         return obj.profile.display_name if hasattr(obj, 'profile') else 'N/A'

#     display_name.admin_order_field = 'profile__display_name'

# @admin.register(PlayerProfile)
# class PlayerProfileAdmin(admin.ModelAdmin):
#     list_display = ('player', 'display_name', 'rank_points', 'games_played', 'games_won', 'games_loss')
#     # search_fields = ('player__username', 'display_name')

# @admin.register(PlayerSettings)
# class PlayerSettingsAdmin(admin.ModelAdmin):
#     list_display = ('player_profile', 'private_profile', 'notifications_enabled', 'updated_at')
#     # search_fields = ('player_profile__player__username',)

# @admin.register(MatchHistory)
# class MatchHistoryAdmin(admin.ModelAdmin):
#     list_display = ('player', 'opponent', 'result', 'date')
#     # search_fields = ('player__username', 'opponent__username')
#     # list_filter = ('result', 'date')



# class GameAdmin(UserAdmin):
#     model = Player
#     fieldsets = UserAdmin.fieldsets + (
#         (None, {'fields': ('avatar', 'tournament_display_name', 'is_online', 'wins', 'losses')}),
#     )

# admin.site.register(Player, GameAdmin)
