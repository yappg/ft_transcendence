from rest_framework import serializers
from ..models import *

class SearchUsersSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = PlayerProfile
        fields = [
            'id' ,
            'username',
            'display_name',
            'avatar',
            'is_online'
        ]
        read_only_fields = [ '__all__']
