import pyotp
import requests
from drf_yasg.utils import swagger_auto_schema
from urllib.parse import quote

# from django.conf import settings
# from django.shortcuts import redirect
# from django.core.cache import cache
# from django.contrib.auth import authenticate
# from django.contrib.auth.models import User
# from django.contrib.auth.signals import user_logged_in
from rest_framework import status
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
# from rest_framework.generics import get_object_or_404

from ..permissions import (
    AnonRateLimitThrottling
)

from ..models import (
    Player
)

from ..serializers.authSerializers import *
from .utils import *

#------------------------------------ Auth ------------------------------------
@swagger_auto_schema(request_body=SignUpSerializer)
class SignUpView(APIView):
    permission_classes = [AllowAny]
    serializer_class = SignUpSerializer
    # throttle_classes = [AnonRateLimitThrottling]
    authentication_classes = []

    def post(self, request):
        if request.user.is_authenticated:
            return Response({'error': 'You are already authenticated'}, status=status.HTTP_200_OK)

        try:
            serializer = self.serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            if user:
                access_token, refresh_token = generate_tokens(user)
                resp = Response({'message': 'Logged in Successfully'},
                              status=status.HTTP_201_CREATED)
                resp.set_cookie(
                    key='access_token',
                    value=access_token,
                    httponly=False
                )
                resp.set_cookie(
                    key='refresh_token',
                    value=refresh_token,
                    httponly=False
                )
                return resp
        except serializers.ValidationError as e:
            if isinstance(e.detail, dict):
                error_message = next(iter(e.detail.values()))
                if isinstance(error_message, list):
                    error_message = error_message[0]
                return Response({'error': error_message}, status=status.HTTP_200_OK)
            return Response({'error': str(e.detail)}, status=status.HTTP_200_OK)

        return Response({'error': 'User not created'}, status=status.HTTP_200_OK)


@swagger_auto_schema(request_body=SignInSerializer)
class SignInView(APIView):
    permission_classes = [AllowAny]
    Serializer_class = SignInSerializer

    authentication_classes = []

    def post(self, request):

        if request.user.is_authenticated:
            return Response({'error': 'You are already authenticated'}, status=200)
        Serializer = self.Serializer_class(data=request.data)
        if Serializer.is_valid():
            user = Serializer.validated_data['user']
            if (user.enabled_2fa == True):
                return Response({'message':'logged in Successfuly','enabled_2fa':'True'}, status=status.HTTP_200_OK)

            access_token, refresh_token = generate_tokens(user)
            resp = Response({'message':'logged in Successfuly','enabled_2fa':'False'}, status=status.HTTP_200_OK)
            resp.set_cookie(
                key='access_token',
                value=access_token,
                httponly=False
            )
            resp.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=False
            )
            return resp
        else :
            return Response(Serializer.errors, status=status.HTTP_200_OK)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'message': 'this methode is only for the DRF web interface to avoid HTTP_400_Bad_Request'}, status=status.HTTP_200_OK)

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            tokens = RefreshToken(refresh_token)
            tokens.blacklist()
            response = Response({'message': 'Logged Out Successfuly'}, status=status.HTTP_200_OK)
            response.delete_cookie('access_token')
            response.delete_cookie('refresh_token')
        except Exception as e:
            return Response({'error': str(e)}, status=200)
        return response

#------------------------------------- 2FA ------------------------------------

class GenerateURI(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = GenerateOTPSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_200_OK)
        # TODO must retrieve the user from the request cookie, to fetch the user from the database
        try:
            user = Player.objects.get(username=request.data['username'])
        except:
            return Response({'error': 'user Not found'}, status=status.HTTP_404_NOT_FOUND)
        if user.enabled_2fa == True:
            return Response({'error': '2fa already enabled'}, status=status.HTTP_200_OK)

        secret_key = pyotp.random_base32()
        totp = pyotp.TOTP(secret_key)
        uri = totp.provisioning_uri(name='transcendence', issuer_name=user.username)

        user.otp_secret_key = secret_key
        user.save()
        return Response(
            {'uri': uri, 'enabled_2fa': user.enabled_2fa},
            status=status.HTTP_200_OK)

class VerifyOTP(APIView):
    permission_classes = [AllowAny]
    serializer_class = VerifyOTPSerializer
    authentication_classes = []


    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        # TODO must retrieve the user from the request cookie, to fetch the user from the database
        username = request.data['username']
        otp_token = request.data['otp_token']
        
        try:
            user = Player.objects.get(username=username)
        except Player.DoesNotExist:
            return Response({'error': 'user Not found'}, status=status.HTTP_404_NOT_FOUND)
        totp = pyotp.TOTP(user.otp_secret_key)
        bol = totp.verify(otp_token)
        if not bol:
            return Response({'error': 'invalid token'}, status=status.HTTP_200_OK)
        user.enabled_2fa = True
        user.verified_otp = True
        user.save()
        return Response({'message': '2fa Verified'}, status=status.HTTP_200_OK)

class ValidateOTP(APIView):
    permission_classes = [AllowAny]
    serializer_class = ValidateOTPSerializer
    authentication_classes = []

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_200_OK)

        # TODO must retrieve the user from the request cookie, to fetch the user from the database
        username = request.data['username']
        otp_token = request.data['otp_token']
        try:
            user = Player.objects.get(username=username)
        except:
            return Response({'error': 'user Not found'}, status=status.HTTP_404_NOT_FOUND)
        totp = pyotp.TOTP(user.otp_secret_key)
        bol = totp.verify(otp_token)
        if not bol:
            return Response({'error': 'Invalid Token'}, status=status.HTTP_200_OK)
        access_token, refresh_token = generate_tokens(user)
        resp = Response({'message':'logged in Successfuly'}, status=status.HTTP_200_OK)
        resp.set_cookie(
            key='access_token',
            value=access_token,
            httponly=False
        )
        resp.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=False
        )
        return resp

class DisableOTP(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        # TODO must retrieve the user from the request cookie, to fetch the user from the database
        username = request.data['username']
        try:
            user = Player.objects.get(username=username)
        except:
            return Response({'error' : 'invalid user'})
        if user.enabled_2fa is False:
            return Response({'error':'2fa Already Disabled'})
        user.enabled_2fa = False
        user.verified_otp = False
        user.otp_secret_key = ''
        user.save()
        return Response(
            {'message':'2fa Disabled', 'enabled_2fa': user.enabled_2fa},
            status=status.HTTP_200_OK)

#---------------------------------- OAuth2.0 ----------------------------------


class OAuth42LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request, provider):

        if request.user.is_authenticated:
            return Response({'error': 'You are already authenticated'}, status=status.HTTP_200_OK)
        if provider == '42':
            Auth_url = settings.OAUTH2_PROVIDER_42['AUTHORIZATION_URL']
            client_id_42 = settings.OAUTH2_PROVIDER_42['CLIENT_ID']
            redirect_uri = quote(settings.OAUTH2_PROVIDER_42['CALLBACK_URL'])
            authorization_url = f"{Auth_url}?client_id={client_id_42}&redirect_uri={redirect_uri}&response_type=code"
            #trans 2-----------------------------------------
            # authorization_url = f"{Auth_url}?client_id={client_id_42}&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fhome&response_type=code"
        elif provider == 'google':
            Auth_url = settings.OAUTH2_PROVIDER_GOOGLE['AUTHORIZATION_URL']
            client_id_Google = settings.OAUTH2_PROVIDER_GOOGLE['CLIENT_ID']
            redirect_uri = settings.OAUTH2_PROVIDER_GOOGLE['CALLBACK_URL']
            scope = settings.OAUTH2_PROVIDER_GOOGLE['SCOPE']
            authorization_url = f"{Auth_url}?client_id={client_id_Google}&redirect_uri={redirect_uri}&scope={scope}&response_type=code"
        else:
            return Response({'error': 'Invalid platform'}, status=status.HTTP_200_OK)
        return Response({'url': authorization_url}, status=status.HTTP_200_OK)

#this must be in a settings file
Oauth2_Providers_URLToken = {
    '42': settings.OAUTH2_PROVIDER_42['TOKEN_URL'],
    'google': settings.OAUTH2_PROVIDER_GOOGLE['TOKEN_URL'],
}


class OAuth42CallbackView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request, provider):

        if (provider != '42' and provider != 'google'):
            return Response({'error': 'Invalid platform'}, status=status.HTTP_200_OK)

        code = request.GET.get('code')
        print('--------42', code);
        if not code:
            return Response({'error': 'No code provided'}, status=status.HTTP_200_OK)

        data = APIdata(code, provider)
        response = requests.post(Oauth2_Providers_URLToken[provider], data=data)
        token_data = response.json()
        print(token_data)

        if 'access_token' not in token_data:
            return Response({'error': 'Failed to obtain access token'}, status=status.HTTP_200_OK)

        user_data = fetch_user_data(token_data['access_token'], provider)
        user, created = store_user_data(user_data, provider)

        access_token, refresh_token = generate_tokens(user)
        resp = Response({'message':f'logged in Successfuly Using {provider}.'}, status=status.HTTP_200_OK)
        resp.set_cookie(
            key='access_token',
            value=access_token,
            httponly=False
        )
        resp.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=False
        )
        return resp


# class TokenValidateView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         return Response({'message': 'Token is valid'}, status=status.HTTP_200_OK)

class UpdateUserInfos(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UpdateUserInfosSerializer

    def get(self, request):
        user = request.user
        serializer = self.serializer_class(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = UpdateUserInfosSerializer(
            request.user,
            data=request.data,
            context={'user': request.user},
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data , status=status.HTTP_200_OK)



# from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
# from dj_rest_auth.registration.views import SocialLoginView
# from allauth.socialaccount.providers.oauth2.client import OAuth2Client
# from django.conf import settings


# class GoogleLoginView(SocialLoginView):
#     athentication_classes = [AllowAny]
#     adapter_class = GoogleOAuth2Adapter
#     callback_url = "http://localhost:3000/api/auth/callback/google"
