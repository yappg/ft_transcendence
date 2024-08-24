from rest_framework import serializers
from .models import Player

class PlayerSerializer(serializers.ModelSerializer):
    class meta:
        model=Player
        field=('id', 'username','email', 'wins', 'losses',)

