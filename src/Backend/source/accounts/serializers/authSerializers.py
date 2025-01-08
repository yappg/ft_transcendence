from rest_framework import serializers
from ..models import *
from django.contrib.auth import authenticate
from django.db import IntegrityError
# from django.core.exceptions import Validate_email

########################################################################################

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
        if len(value) < 3 or len(value) > 30:
            raise serializers.ValidationError("Username should be between 3 and 30 characters long")
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
        except :
            raise serializers.ValidationError("User Could not be created")


class SignInSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)
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

class GenerateOTPSerializer(serializers.Serializer):
    username = serializers.CharField()

    def validate(self, attrs):
        if not attrs.get('username'):
            raise serializers.ValidationError({"error":"Username required"})
        if not Player.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"error":"User does not exist"})
        return attrs


class VerifyOTPSerializer(serializers.Serializer):
    username = serializers.CharField()
    otp_token = serializers.CharField(max_length=6, required=True)

    def validate(self, attrs):
        if not attrs.get('otp_token') or not attrs.get('username'):
            raise serializers.ValidationError({"error":"OTP Token required"})
        if not Player.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"error":"User does not exist"})
        return attrs


class ValidateOTPSerializer(serializers.Serializer):
    username = serializers.CharField()
    otp_token = serializers.CharField(max_length=6)

    def validate(self, attrs):
        if not attrs.get('otp_token'):# or not attrs.get('username'):
            raise serializers.ValidationError({"error":"OTP Token required"})
        # if not attrs.get('username'):
        #     raise serializers.ValidationError({"error":"OTP Token required"})
        return attrs

class UpdateUserInfosSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(write_only=True, required=False)
    new_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Player
        fields = ['username', 'email', 'verified_otp', 'enabled_2fa', 'old_password', 'new_password']
        read_only_fields = ['username', 'email']
        extra_kwargs = {
            'username': {'required': False},
            'email': {'required': False}
        }

    def validate(self, attrs):
        user = self.context['user']

        if ('old_password' in attrs and 'new_password' not in attrs) or \
           ('new_password' in attrs and 'old_password' not in attrs):
            raise serializers.ValidationError(
                {"error": "Both old and new passwords must be provided together"}
            )
        if 'old_password' in attrs and 'new_password' in attrs:
            if not user.check_password(attrs['old_password']):
                raise serializers.ValidationError(
                    {"error": "Current password is incorrect"}
                )
            if user.check_password(attrs['new_password']):
                raise serializers.ValidationError(
                    {"error": "New password cannot be the same as the old password"}
                )
        return attrs

    def update(self, instance, validated_data):
        if not validated_data:
            raise serializers.ValidationError({"error": "incorrect data"})

        if 'old_password' in validated_data and 'new_password' in validated_data:
            instance.set_password(validated_data['new_password'])
            validated_data.pop('old_password')
            validated_data.pop('new_password')

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
