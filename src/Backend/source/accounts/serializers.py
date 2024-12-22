from rest_framework import serializers
from .models import Player , PlayerProfile , PlayerSettings
from django.contrib.auth import authenticate
# from django.core.exceptions import Validate_email

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model=Player
        fields = ('id', 'username','avatar')

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
                raise serializers.ValidationError({"error":"Invalid Credentials"})
        else :
            serializers.ValidationError({"error":"Both Username and password required"})

        attrs['user'] = user
        return attrs

class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ('username', 'email', 'password')
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate_username(self, value):
        if Player.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username is already in use")
        return value
    def validate_email(self, value):
        if Player.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email is already in use")
        return value

    def validate(self, attrs):
        if not attrs.get('username') or not attrs.get('password') or not attrs.get('email'):
            raise serializers.ValidationError({"error":"Fields are required: email, username and password"})

        return attrs
    
    def create(self, validated_data):
        try:
            user = Player.objects.create(
                username=validated_data['username'],
                email=validated_data['email'],
            )
            user.set_password(validated_data['password'])
            user.save()
            return user
        except IntegrityError:
            raise serializers.ValidationError("User Could not be created")

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

###################### [.] It needs To be Optimized 
class UpdateUserInfosSerializer(serializers.Serializer):
    username = serializers.CharField(required=False)
    avatar = serializers.ImageField(required=False)
    cover = serializers.ImageField(required=False)

    def validate(self, attrs):
        if not attrs.get('username') and not attrs.get('avatar') and not attrs.get('cover'):
            raise serializers.ValidationError({"error":"At least one field is required"})
        if Player.objects.filter(username=attrs.get('username')).exists():
                raise serializers.ValidationError({"error":"Username is already in use"})
        return attrs

    def save(self, **kwargs):
        user = self.context['user']
        player = Player.objects.get(username=user.username)
        if player is None:
            raise serializers.ValidationError({"error":"User not found"})
        

        if 'username' in self.validated_data:
            player.username = self.validated_data['username']
        if 'avatar' in self.validated_data:
            player.avatar = self.validated_data['avatar']
        if 'cover' in self.validated_data:
            player.cover = self.validated_data['cover']
        player.save()
