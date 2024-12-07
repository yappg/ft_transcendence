from rest_framework import serializers
from .models import *
from django.contrib.auth import authenticate
# from django.core.exceptions import Validate_email

class PlayerSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()

    class Meta:
        model = Player
        fields = [
            'id',
            'username',
            'profile',
        ]
        read_only_fields = [
            'id',
            'username',
            'profile',
        ]

    def get_profile(self, obj):
        from .serializers import PlayerProfileSerializer
        return PlayerProfileSerializer(obj.profile, read_only=True).data


class PlayerProfileSerializer(serializers.ModelSerializer):
    player = serializers.SerializerMethodField()

    class Meta:
        model = PlayerProfile
        fields = [
            'id',
            'is_online',
            'display_name',
            'bio',
            'avatar',
            'rank_points',
            'games_played',
            'games_won',
            'games_loss',
            'win_ratio',
            'last_login',
            'created_at',
            'player_username',
        ]
        read_only_fields = [
            'id',
            'is_online',
            'rank_points',
            'games_played',
            'games_won',
            'games_loss',
            'win_ratio',
            'last_login',
            'created_at',
        ]

    # Custom validator for display_name to ensure uniqueness
    def validate_display_name(self, value):
        if PlayerProfile.objects.filter(display_name=value).exists():
            raise serializers.ValidationError("Display name must be unique.")
        return value

    def get_player(self, obj):
        from .serializers import PlayerSerializer
        return PlayerSerializer(obj.player, read_only=True).data



# # KEEP IS_ACTIVE AND IS_STAFF LOGIC FOR BACKEND
# class PlayerSerializer(serializers.ModelSerializer):
#     profile = PlayerProfileSerializer(read_only=True)

#     class Meta:
#         model = Player
#         fields = [
#             'id',
#             'username'
#          ]
#         read_only_fields = [
#             'id',
#             'username'
#         ]

# ### make sure that the display name field is always unic un every put and patch method return error display_name exists
# # fix private profile only give back display name
# class PlayerProfileSerializer(serializers.ModelSerializer):
#     Player = PlayerSerializer(read_only=True)

#     class Meta:
#         model=PlayerProfile
#         exclude = [
#             '__all__'
#         ]
#         read_only_fields = [
#             'id',
#              'is_online',
#             'rank_points' ,
#             'games_played' ,
#             'games_won' ,
#             'games_loss' ,
#             'win_ratio' ,
#             'last_login' ,
#             'created_at'
#         ]

class PlayerSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model=PlayerSettings
        exclude = ['player_profile']
        read_only_fields = ['id']


# Corrected field name
class MatchHistorySerializer(serializers.ModelSerializer):
    player = PlayerProfileSerializer(read_only=True)
    opponent = PlayerProfileSerializer(read_only=True)

    class Meta:
        model = MatchHistory
        fields = '__all__'


class SearchUsersSerializer(serializers.ModelSerializer):
    Player = PlayerSerializer(read_only=True)

    class Meta:
        model = PlayerProfile
        fields = [
            'id' ,
            'display_name',
            'avatar',
             'is_online'
        ]
        read_only_fields = [
            'id' ,
            'display_name' ,
            'avatar',
            'is_online'
        ]

########################################################################################

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
        fields=['username']
        # fields=('username','email','password',)

    def save(self, **kwargs):
        user = self.context['user']
        player = Player.objects.get(username=user.username)
        if 'username' in self.validated_data:
            player.username = self.validated_data['username']
        # if 'avatar' in self.validated_data:
        #     player.avatar = self.validated_data['avatar']
        # if 'cover' in self.validated_data:
        #     player.cover = self.validated_data['cover']
        player.save()
