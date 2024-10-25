from rest_framework import serializers
from .models import Game


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ('id', 'player1', 'player2', 'player1_score', 'player2_score', 'is_active', 'created_at', 'updated_at')
