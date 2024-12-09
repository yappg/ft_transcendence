
from rest_framework import serializers
from ..models import *

########################################################################################

# KEEP IS_ACTIVE AND IS_STAFF LOGIC FOR BACKEND
class PlayerSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()

    class Meta:
        model = Player
        fields = [
            'id',
            'username',
            'profile',
        ]
        read_only_fields = [
            'id',
            'username',
            'profile',
        ]

    def get_profile(self, obj):
        from ..serializers import PlayerProfileSerializer
        return PlayerProfileSerializer(obj.profile, read_only=True).data

    def validate_username(self, value):
        if Player.objects.filter(username=value).exists():
            raise serializers.ValidationError("username must be unique.")
        return value


# fix private profile only give back display name
class PlayerProfileSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = PlayerProfile
        exclude = ['player']
        read_only_fields = [
            'id',
            'is_online',
            'username',
            'rank_points',
            'games_played',
            'games_won',
            'games_loss',
            'win_ratio',
            'last_login',
            'created_at',
        ]

    def get_username(self, obj):
        return obj.player.username

    def validate_display_name(self, value):
        if PlayerProfile.objects.filter(display_name=value).exists():
            raise serializers.ValidationError("Display name already exists.")
        return value

    def validate_avatar(self, value):
        size_max = 2 * 1024 * 1024  # 2MB for max size of the avatar
        allowed_types = ['image/jpeg', 'image/png']

        if (value.size > size_max):
            raise serializers.ValidationError("Avatar image size should not exceed 2MB.")

        if (value.content_type not in allowed_types):
            raise serializers.ValidationError("Avatar must be a JPEG or PNG image.")

        return value

    def validate_cover(self, value):
        size_max = 5 * 1024 * 1024  # 5MB for max size of the cover
        allowed_types = ['image/jpeg', 'image/png']

        if (value.size > size_max):
            raise serializers.ValidationError("Cover image size should not exceed 5MB.")

        if (value.content_type not in allowed_types):
            raise serializers.ValidationError("Cover must be a JPEG or PNG image.")

        return value


class PlayerSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model=PlayerSettings
        exclude = ['player_profile']
        read_only_fields = ['id', 'updated_at']


# Corrected field name
class MatchHistorySerializer(serializers.ModelSerializer):
    player1 = PlayerProfileSerializer(read_only=True)
    player2 = PlayerProfileSerializer(read_only=True)

    class Meta:
        model = MatchHistory
        fields = ['__all__']
        read_only_fields = ['__all__']
