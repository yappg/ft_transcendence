from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *
# Register your models here.


class GameAdmin(UserAdmin):
    model = Player
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('avatar', 'cover', 'enabled_2fa', 'otp_secret_key', 'verified_otp')}),
    )

admin.site.register(Player, GameAdmin)
admin.site.register(PlayerProfile)
