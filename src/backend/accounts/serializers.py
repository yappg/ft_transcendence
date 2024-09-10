from rest_framework import serializers
from .models import Player
# from django.core.exceptions import Validate_email

class PlayerSerializer(serializers.ModelSerializer):
    class meta:
        model=Player
        fields = ('id', 'username','email', 'wins', 'losses',)

class SignInSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ('username', 'password')

class SignUpSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)
    class Meta:
        model = Player
        fields = ('username', 'email', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields does not match"})
        #this must be checken in the frontend
        # if len(attrs['password']) < 8:
        #     raise serializers.ValidationError({"password": "Password must be at least 8 characters"})
        if Player.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "Email is already in use"})
        if Player.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"username": "Username is already in use"})
        #this must be checken in the frontend
        # try:
        #     Validate_email(attrs['email'])
        # except:
        #     raise serializers.ValidationError({"email": "Email is invalid"})
        return attrs

    def create(self, validated_data):
        user = Player.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])
        user.save()

        return user

