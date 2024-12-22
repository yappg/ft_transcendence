from rest_framework import serializers
from ..models import *
from relations.models import Friends
from django.db.models import Q
from relations.serializers import ProfileFriendsSerializer

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

class PlayerRelationsSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()

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
        return obj.profile.avatar

    def get_username(self, obj):
        return obj.profile.display_name


class StatisticsSerializer(serializers.ModelSerializer):
    ice_ratio = serializers.SerializerMethodField()
    water_ratio = serializers.SerializerMethodField()
    fire_ratio = serializers.SerializerMethodField()
    earth_ratio = serializers.SerializerMethodField()

    graph_data = serializers.SerializerMethodField()

    class Meta:
        model = PlayerProfile
        fields = [
            'ice_ratio',
            'water_ratio',
            'fire_ratio',
            'earth_ratio',

            'graph_data',
        ]
        read_only_fields = ["__all__"]

    def get_ice_ratio(self, obj):
        if obj.ice_games == 0:
            return 0.0
        return (obj.ice_wins / obj.ice_games) * 100

    def get_water_ratio(self, obj):
        if obj.water_games == 0:
            return 0.0
        return (obj.water_wins / obj.water_games) * 100

    def get_fire_ratio(self, obj):
        if obj.fire_games == 0:
            return 0.0
        return (obj.fire_wins / obj.fire_games) * 100

    def get_earth_ratio(self, obj):
        if obj.earth_games == 0:
            return 0.0
        return (obj.earth_wins / obj.earth_games) * 100

    def get_graph_data(self, obj):
        return obj.daily_stats(obj.settings.stats_graph_days)


# fix private profile only give back display name
class PlayerProfileSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    xp = serializers.SerializerMethodField()
    achievements = serializers.SerializerMethodField()

    statistics = serializers.SerializerMethodField()
    friends = serializers.SerializerMethodField()

    last_login = serializers.SerializerMethodField()
    # created_at = serializers.SerializerMethodField()

    class Meta:
        model = PlayerProfile
        exclude = [
            'player' ,

            'ice_games',
            'water_games',
            'fire_games',
            'earth_games',

            'ice_wins',
            'water_wins',
            'fire_wins',
            'earth_wins',

            # 'created_at',
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
            # 'ice_games',
            # 'water_games',
            # 'fire_games',
            # 'earth_games',

            'last_login',
            'created_at',
        ]

    def get_achievements(self, obj):
        # from ..serializers import PlayerAchievementSerializer
        return PlayerAchievementSerializer(obj.all_achievements_gained(), many=True).data

    def get_statistics(self, obj):
        # from ..serializers import StatisticsSerializer
        return StatisticsSerializer(obj, read_only=True).data




    def get_friends(self, obj):
        # More efficient query using select_related
        friends = Friends.objects.filter(
            Q(friend_requester=obj.player) | Q(friend_responder=obj.player)
        ).select_related('friend_requester', 'friend_responder').distinct()

        # Use a list comprehension for better performance
        unique_friends = []
        seen_players = set()

        for friend in friends:
            other_player = (
                friend.friend_responder
                if friend.friend_requester == obj.player
                else friend.friend_requester
            )

            if other_player.id not in seen_players:
                seen_players.add(other_player.id)
                unique_friends.append(friend)

        return (
            ProfileFriendsSerializer(
                unique_friends,
                context={'request': self.context.get('request')},
                many=True
            ).data if unique_friends else []
        )






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
        fields = [ "id", "name", "description", "condition", "xp_gain"]
        read_only_fields = [ "id", "name", "description", "condition", "xp_gain"]




class PlayerAchievementSerializer(serializers.ModelSerializer):
    achievement = AchievementSerializer(read_only=True)
    date_earned = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = PlayerAchievement
        fields = ["id", "player", "achievement", "gained", "progress", "date_earned", "image"]
        read_only_fields = ["id", "player", "achievement", "gained", "progress", "date_earned", "image"]

    def get_date_earned(self, obj):
        return obj.date_earned.date().isoformat() if obj.date_earned else None

    def get_image(self, obj):
        return obj.achievement.get_image(obj.gained)
