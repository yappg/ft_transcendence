from rest_framework import serializers
from .models import *
from django.contrib.auth import authenticate
# from django.core.exceptions import Validate_email

    # {
    #     "id": 1,
    #     "profile": {
    #         "id": 1,
    #         "is_online": false,
    #         "display_name": "Player_tlcw302b",
    #         "bio": "",
    #         "avatar": "http://localhost:8080/media/avatars/.defaultAvatar.jpeg",
    #         "cover": "http://localhost:8080/media/covers/.defaultCover.jpeg",
    #         "rank_points": 0,
    #         "games_played": 0,
    #         "games_won": 0,
    #         "games_loss": 0,
    #         "win_ratio": 0.0,
    #         "created_at": "2024-12-02T23:06:56.514028Z",
    #         "player": 1
    #     },

    #     "last_login": null,

    #     "enabled_2fa": false,
    #     "otp_secret_key": null,
    #     "verified_otp": false,
    # }

class MatchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchHistory
        fields = '__all__'
        read_only_fields = ['id', 'date']

class PlayerSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model=PlayerSettings
        fields = '__all__'
        exclude = ['player_profile']
        read_only_fields = ['id', 'updated_at']


class PlayerProfileSerializer(serializers.ModelSerializer):
    settings = PlayerSettingsSerializer()

    class Meta:
        model=PlayerProfile
        fields = '__all__'
        exclude = ['player']
        read_only_fields = ['id', 'created_at']


## add a api endpoint to trigger password reset and username change or email > posibly trigger 2fa or email verif
# class PlayerSerializer(serializers.ModelSerializer): # KEEP IS_ACTIVE AND IS_STAFF LOGIC FOR BACKEND
#     profile = PlayerProfileSerializer(read_only=True)
#     settings = PlayerSettingsSerializer(read_only=True)

#     class Meta:
#         model = Player
#         # fields = '__all__'
#         fields = ['profile', 'enabled_2fa', 'otp_secret_key', 'verified_otp']
#         read_only_fields = ['username' ,'email' ,'date_joined']

############################################

class SignInSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    otp_token = serializers.CharField(max_length=6, required=False)
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
            # if the the otp would be sent with the user credentials
            # if user.enabled_2fa:
            #     if attrs.get('otp_token'):
            #         totp = pyotp.TOTP(user.otp_secret_key)
            #         if not totp.verify(otp_token):
            #             raise serializers.ValidationError("Invalid OTP Token")
            #     else:
            #         raise serializers.ValidationError("OTP Token required")
        else :
            serializers.ValidationError("Both Username and password required")

        attrs['user'] = user
        return attrs

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
            raise serializers.ValidationError("OTP Token required")

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
