from rest_framework import serializers
from ..models import *
from relations.models import Friends
from django.db.models import Q
from relations.serializers import ProfileFriendsSerializer

########################################################################################

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

class PlayerRelationsSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = Player
        fields = [
            'id',
            'username',
            'avatar',
        ]
        read_only_fields = [
            'id',
            'username',
            'avatar',
        ]

    def get_avatar(self, obj):
        return obj.profile.avatar.url

    def get_username(self, obj):
        return obj.profile.display_name


class StatisticsSerializer(serializers.ModelSerializer):
    air_ratio = serializers.SerializerMethodField()
    water_ratio = serializers.SerializerMethodField()
    fire_ratio = serializers.SerializerMethodField()
    earth_ratio = serializers.SerializerMethodField()

    graph_data = serializers.SerializerMethodField()

    class Meta:
        model = PlayerProfile
        fields = [
            'air_ratio',
            'water_ratio',
            'fire_ratio',
            'earth_ratio',

            'graph_data',
        ]
        read_only_fields = ["__all__"]

    def get_air_ratio(self, obj):
        if obj.total_games == 0:
            return 0.0
        return (obj.air_wins / obj.total_games) * 100

    def get_water_ratio(self, obj):
        if obj.total_games == 0:
            return 0.0
        return (obj.water_wins / obj.total_games) * 100

    def get_fire_ratio(self, obj):
        if obj.total_games == 0:
            return 0.0
        return (obj.fire_wins / obj.total_games) * 100

    def get_earth_ratio(self, obj):
        if obj.total_games == 0:
            return 0.0
        return (obj.earth_wins / obj.total_games) * 100

    def get_graph_data(self, obj):
        return obj.daily_stats(obj.settings.stats_graph_days)


class FriendsSerializer(serializers.ModelSerializer):

    class Meta:
        model = PlayerProfile
        fields = ['id', 'display_name', 'avatar', 'level']
        read_only_fields = ['id', 'display_name', 'avatar', 'level']


class PlayerProfileSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    xp = serializers.SerializerMethodField()
    achievements = serializers.SerializerMethodField()

    statistics = serializers.SerializerMethodField()
    friends = serializers.SerializerMethodField()
    matches_history = serializers.SerializerMethodField()

    avatar = serializers.SerializerMethodField()
    cover = serializers.SerializerMethodField()

    avatar_upload = serializers.ImageField(write_only=True, required=False)
    cover_upload = serializers.ImageField(write_only=True, required=False)

    last_login = serializers.SerializerMethodField()
    is_private = serializers.SerializerMethodField()

    relation = serializers.SerializerMethodField()

    class Meta:
        model = PlayerProfile
        exclude = [
            'player' ,

            'air_games',
            'water_games',
            'fire_games',
            'earth_games',

            'air_wins',
            'water_wins',
            'fire_wins',
            'earth_wins',

            'created_at'
        ]
        read_only_fields = [
            'id',
            'is_online',
            'username',

            'xp',
            'level',

            'achievements',
            'statistics',

            'total_games',
            'games_won',
            'games_loss',
            'win_ratio',

            'friends',
            'matches_history',

            'is_private',

            'relation',

            'last_login',
        ]

    def get_relation(self, obj):
        from relations.models import FriendInvitation, BlockedUsers
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return []

        blockedUsers_by = Player.objects.get(id=request.user.id).blocked_by.all()
        blocked_by = [blocker.user for blocker in blockedUsers_by]

        user = request.user
        if obj.player == user:
            return "self"
        elif user.profile in obj.all_friends():
            return "friend"
        elif FriendInvitation.objects.filter(receiver=user, sender=obj.player).exists():
            return "received_invite"
        elif FriendInvitation.objects.filter(receiver=obj.player, sender=user).exists():
            return "sent_invite"
        elif BlockedUsers.objects.get(user=user).is_blocked(obj.player):
            return "blocked"
        elif obj.player in blocked_by:
            return "blocked_by_user"
        else:
            return "none"

    def get_is_private(self, obj):
        return obj.settings.private_profile

    def get_cover(self, obj):
        return obj.cover.url

    def get_avatar(self, obj):
        return obj.avatar.url

    def get_achievements(self, obj):
        LIMIT = 15

        return PlayerAchievementSerializer(obj.all_achievements_gained()[:LIMIT], many=True).data

    def get_statistics(self, obj):
        return StatisticsSerializer(obj, read_only=True).data

    def get_friends(self, obj):
        LIMIT = 4

        if obj.settings.private_profile == True:
            return []
        return FriendsSerializer(obj.all_friends()[:LIMIT], many=True).data

    def get_matches_history(self, obj):
        LIMIT = 4

        if obj.settings.private_profile == True:
            return []
        return MatchHistorySerializer(obj.all_matches()[:LIMIT], many=True).data

    def get_xp(self, obj):
        xp_percentage = (obj.xp / obj.calculate_level_up_xp()) * 100
        return xp_percentage

    def get_username(self, obj):
        return obj.player.username

    def get_last_login(self, obj):
        return obj.last_login.date().isoformat() if obj.last_login else None

    def get_created_at(self, obj):
        return obj.created_at.date().isoformat() if obj.created_at else None

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
        size_max = 2 * 1024 * 1024
        allowed_types = ['image/jpeg', 'image/png']

        if (value.size > size_max):
            raise serializers.ValidationError("Avatar image size should not exceed 2MB.")

        if (value.content_type not in allowed_types):
            raise serializers.ValidationError("Avatar must be a JPEG or PNG image.")

        return value

    def validate_cover(self, value):
        size_max = 5 * 1024 * 1024
        allowed_types = ['image/jpeg', 'image/png']

        if (value.size > size_max):
            raise serializers.ValidationError("Cover image size should not exceed 5MB.")

        if (value.content_type not in allowed_types):
            raise serializers.ValidationError("Cover must be a JPEG or PNG image.")

        return value
    
    
    def update(self, instance, validated_data):
        if 'avatar_upload' in validated_data:
            instance.avatar = validated_data.pop('avatar_upload')
        if 'cover_upload' in validated_data:
            instance.cover = validated_data.pop('cover_upload')

        return super().update(instance, validated_data)


class PlayerSettingsSerializer(serializers.ModelSerializer):

    updated_at = serializers.SerializerMethodField()

    class Meta:
        model=PlayerSettings
        exclude = ['player_profile']
        read_only_fields = ['id', 'updated_at']


    def validate_stats_graph_days(self, value):
        if value < 1 or value > 30:
            raise serializers.ValidationError("stats_graph_days must be between 1 and 30")

        return value

    def get_updated_at(self, obj):
        return obj.updated_at.date().isoformat() if obj.updated_at else None


class MatchHistoryProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerProfile
        fields = ['id', 'display_name', 'level', 'avatar']
        read_only_fields = ['id', 'display_name', 'level', 'avatar']


class MatchHistorySerializer(serializers.ModelSerializer):
    player1 = MatchHistoryProfileSerializer(read_only=True)
    player2 = MatchHistoryProfileSerializer(read_only=True)

    date = serializers.SerializerMethodField()

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

    def get_date(self, obj):
        return obj.date.date().isoformat() if obj.date else None

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = [ "name", "description", "condition", "xp_gain"]
        read_only_fields = [ "name", "description", "condition", "xp_gain"]


class PlayerAchievementSerializer(serializers.ModelSerializer):
    achievement = AchievementSerializer(read_only=True)
    image = serializers.SerializerMethodField()
    date_earned = serializers.SerializerMethodField()

    class Meta:
        model = PlayerAchievement
        fields = ["player", "achievement", "gained", "progress", "date_earned", "image"]
        read_only_fields = ["player", "achievement", "gained", "progress", "date_earned", "image"]

    def get_image(self, obj):
        return obj.achievement.get_image(obj.gained)

    def get_date_earned(self, obj):
        return obj.date_earned.date().isoformat() if obj.date_earned else None

# class ProfileSettingsSerializer(serializers.ModelSerializer):
#     avatar = serializers.SerializerMethodField()
#     cover = serializers.SerializerMethodField()

#     class Meta:
#         model = PlayerProfile
#         fields = [
#             'display_name',
#             'avatar',
#             'cover',
#             'bio',
#         ]

#     def get_avatar(self, obj):
#         return obj.avatar.url

#     def get_cover(self, obj):
#         return obj.cover.url

#     def validate_display_name(self, value):
#         if len(value) < 3 or len(value) > 40:
#             raise serializers.ValidationError("display name must be between 3 and 40 characters long")
#         if PlayerProfile.objects.filter(display_name=value).exists():
#             raise serializers.ValidationError("Display name already exists.")
#         return value

#     def validate_bio(self, value):
#         if len(value) > 500:
#             raise serializers.ValidationError("max bio size is 500 characters")
#         return value

#     def validate_avatar(self, value):
#         size_max = 2 * 1024 * 1024
#         allowed_types = ['image/jpeg', 'image/png']

#         if (value.size > size_max):
#             raise serializers.ValidationError("Avatar image size should not exceed 2MB.")

#         if (value.content_type not in allowed_types):
#             raise serializers.ValidationError("Avatar must be a JPEG or PNG image.")

#         return value

#     def validate_cover(self, value):
#         size_max = 5 * 1024 * 1024
#         allowed_types = ['image/jpeg', 'image/png']

#         if (value.size > size_max):
#             raise serializers.ValidationError("Cover image size should not exceed 5MB.")

#         if (value.content_type not in allowed_types):
#             raise serializers.ValidationError("Cover must be a JPEG or PNG image.")

#         return value


# class SecuritySettingsSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = Player
#         fields = ['username', 'email', 'enabled_2fa']
#         read_only_fields = ['username', 'email', 'enabled_2fa']
