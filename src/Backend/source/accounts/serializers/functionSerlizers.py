from rest_framework import serializers
from ..models import *

class SearchUsersSerializer(serializers.ModelSerializer):

    class Meta:
        model = PlayerProfile
        fields = [
            'id' ,
            'display_name',
            'avatar',
            'is_online'
        ]
        read_only_fields = ['__all__']


class LeaderBoardSerializer(serializers.ModelSerializer):
    Achievement = serializers.SerializerMethodField()
    
    class Meta:
        model = PlayerProfile
        fields = [
            'id',
            'display_name',
            'level',
            'avatar',
            'games_won',
            'games_loss',
            'Achievement'
        ]
        read_only_fields = ['__all__']

    def get_Achievement(self, obj):
        from .userManagmentSerlizers import PlayerAchievementSerializer
        serializer = PlayerAchievementSerializer(obj.all_achievements_gained()[:3], many=True)
        return serializer.data
    
