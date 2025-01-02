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

    class Meta:
        model = PlayerProfile
        fields = [
            'id',
            'display_name',
            'level',
            'avatar',
            'games_won',
            'games_loss'
        ]
        read_only_fields = ['__all__']
