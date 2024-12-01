from rest_framework import serializers
from .models import Player , PlayerProfile , PlayerSettings
from django.contrib.auth import authenticate
# from django.core.exceptions import Validate_email

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model=Player
        fields = ('id', 'username','email','avatar')
        # fields = ('id', 'username','email', 'wins', 'losses',)

#########################

class PlayerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=PlayerProfile
        fields = '__all__'


class PlayerSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model=PlayerSettings
        fields = '__all__'


#########################



class SignInSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    extra_kwargs = {
        'password':{'write_only':True}
    }

    def validate(self, attrs):
        usernm = attrs.get('username')
        passwd = attrs.get('password')
        if usernm and passwd:
            user = authenticate(username=usernm, password=passwd)
            if not user:
                raise serializers.ValidationError("Invalid Credentials")
        else :
            serializers.ValidationError("Both Username and password required")

        attrs['user'] = user
        return attrs

class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ('username', 'email', 'password')

    def validate(self, attrs):
        if Player.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"error": "Email is already in use"})
        if Player.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"message": "Username is already in use"})
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

class GenerateOTPSerializer(serializers.Serializer):
        username = serializers.CharField()

class VerifyOTPSerializer(serializers.Serializer):
    username = serializers.CharField()
    otp_token = serializers.CharField(max_length=6)

class ValidateOTPSerializer(serializers.Serializer):
    username = serializers.CharField()
    otp_token = serializers.CharField(max_length=6)

    def validate(self, attrs):
        if not attrs.get('otp_token') or not attrs.get('username'):
            raise serializers.ValidationError({"error":"OTP Token required"})

class UpdateUserInfosSerializer(serializers.ModelSerializer):
    class Meta:
        model=Player
        fields=('username','avatar','cover',)

    def save(self, **kwargs):
        user = self.context['user']
        player = Player.objects.get(username=user.username)
        if 'username' in self.validated_data:
            player.username = self.validated_data['username']
        if 'avatar' in self.validated_data:
            player.avatar = self.validated_data['avatar']
        if 'cover' in self.validated_data:
            player.cover = self.validated_data['cover']
        player.save()
