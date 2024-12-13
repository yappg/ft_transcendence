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


class LeaderBoardSerializer(serializers.ModelSerializer):
    class Meta:
        # achivements for latter use
        model = PlayerProfile
        fields = ['id', 'display_name', 'level', 'avatar', 'games_won', 'games_loss']
        read_only_fields = ['id', 'display_name', 'level', 'avatar', 'games_won', 'games_loss']
 