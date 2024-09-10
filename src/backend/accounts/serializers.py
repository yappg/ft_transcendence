from rest_framework.serializers import ModelSerializer
from .models import Player

class PlayerSerializer(ModelSerializer):
    class meta:
        model=Player
        fields = ('id', 'username','email', 'wins', 'losses',)

class SignInSerializer(ModelSerializer):
    class Meta:
        model = Player
        fields = ('username', 'password')

class SignUpSerializer(ModelSerializer):
    class Meta:
        model = Player
        fields = ('username', 'email', 'password','password2')
