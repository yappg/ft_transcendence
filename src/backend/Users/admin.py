from django.contrib import admin

# Register your models here.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Player
# Register your models here.


class GameAdmin(UserAdmin):
    model = Player
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('avatar', 'tournament_display_name', 'is_online', 'wins', 'losses')}),
    )

admin.site.register(Player, GameAdmin)