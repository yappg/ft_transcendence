
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
    xp = serializers.SerializerMethodField()

    class Meta:
        model = PlayerProfile
        exclude = ['player']
        read_only_fields = [
            'id',
            'is_online',
            'username',

            'xp',
            'level',

            'total_games',
            'games_won',
            'games_loss',
            'win_ratio',

            # 'ice_games',
            # 'water_games',
            # 'fire_games',
            # 'earth_games',

            'last_login',
            'created_at',
        ]

    def get_xp(self, obj):
        xp_percentage = (obj.xp / obj.calculate_level_up_xp()) * 100
        return xp_percentage

    def get_username(self, obj):
        return obj.player.username

    def validate_display_name(self, value):
        if len(value) < 3 or len(value) > 40:
            raise serializers.ValidationError("display name must be between 3 and 40 characters long")
        if PlayerProfile.objects.filter(display_name=value).exists():
            raise serializers.ValidationError("Display name already exists.")
        return value

    def validate_bio(self, value):
        if len(value) > 500:
            raise serializers.ValidationError("max bio size is 500 characters")
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


class MatchHistoryProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerProfile
        fields = ['id', 'display_name', 'level', 'avatar']
        read_only_fields = ['id', 'display_name', 'level', 'avatar']


class MatchHistorySerializer(serializers.ModelSerializer):
    player1 = MatchHistoryProfileSerializer(read_only=True)
    player2 = MatchHistoryProfileSerializer(read_only=True)

    class Meta:
        model = MatchHistory
        fields = [
            'id', 'result', 'map_played', 'player1', 'player2',
            'player1_score', 'player2_score', 'date'
        ]
        read_only_fields = [
            'id', 'result', 'map_played', 'player1', 'player2',
            'player1_score', 'player2_score', 'date'
        ]
