from rest_framework import serializers
from .models import AccountUser

class PlayerSerializer(serializers.ModelSerializer):
    class meta:
        model= AccountUser
        field=('id', 'username','email', 'wins', 'losses',)

