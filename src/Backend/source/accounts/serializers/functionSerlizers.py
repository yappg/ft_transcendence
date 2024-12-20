from rest_framework import serializers
from ..models import *

class SearchUsersSerializer(serializers.ModelSerializer):
    # username = serializers.SerializerMethodField()

    class Meta:
        model = PlayerProfile
        fields = [
            'id' ,
            # 'username',
            'display_name',
            'avatar',
            'is_online'
        ]
        read_only_fields = [ '__all__']

    # def get_username(self, obj):
    #     return obj.player.username


# achivements ser for latter use
class LeaderBoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerProfile
        fields = ['id', 'display_name', 'level', 'avatar', 'games_won', 'games_loss']
        read_only_fields = ['id', 'display_name', 'level', 'avatar', 'games_won', 'games_loss']






class StatisticsSerializer(serializers.ModelSerializer):
    # total_games = serializers.SerializerMethodField()
    ice_ratio = serializers.SerializerMethodField()
    water_ratio = serializers.SerializerMethodField()
    fire_ratio = serializers.SerializerMethodField()
    earth_ratio = serializers.SerializerMethodField()

    # profile = serializers.SerializerMethodField()
    class Meta:
        model = PlayerProfile
        fields = [
            # 'profile',
            # 'total_games',
            'ice_ratio',
            'water_ratio',
            'fire_ratio',
            'earth_ratio',
        ]
        read_only_fields = ["__all__"]

    # def get_profile(self, obj):
    #     return obj.id

    # def get_total_games(self, obj):
    #     return obj.total_games

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
