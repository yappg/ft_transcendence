from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.core.cache import cache
from .permissions import AnonRateLimitThrottling
from .models import *
from .serializers import *
from .DeprecatedUtils import *
from drf_yasg.utils import swagger_auto_schema

class PlayerProfileView(APIView):
    
    def get(self, request):
        permission_classes = [IsAuthenticated]
        userInfo = request.user
        serializer = PlayerSerializer(userInfo)
        return Response(serializer.data, status=200)


class PlayerProfileViewWithUserName(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request, username):
        userInfo = get_object_or_404(Player, username=username)
        serializer = PlayerSerializer(userInfo)
        return Response(serializer.data, status=200)
# -----


class PlayerProfileViewWithId(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, userId):
        userInfo = get_object_or_404(Player, id=userId)
        serializer = PlayerSerializer(userInfo)
        return Response(serializer.data, status=200)

# ----

class PlayersViewList(ListAPIView):
    permission_classes = [IsAuthenticated]
    model = Player
    serializer_class=PlayerSerializer
    queryset=Player.objects.all()

# class PlayerView(APIView):
#------------------------------------ Auth ------------------------------------
class SignUpView(APIView):
    permission_classes = [AllowAny]
    serializer_class = SignUpSerializer
    throttle_classes = [AnonRateLimitThrottling]
    authentication_classes = []

    @swagger_auto_schema(request_body=SignUpSerializer)
    def post(self, request):

        if request.user.is_authenticated:
            return Response({'error': 'You are already authenticated'}, status=200)
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
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
            else :
                return Response({'error': 'user not created'}, status=200)
        return Response(serializer.errors, status=200)

class SignInView(APIView):
    permission_classes = [AllowAny]
    Serializer_class = SignInSerializer
    throttle_classes = [AnonRateLimitThrottling]
    authentication_classes = []


    @swagger_auto_schema(request_body=SignInSerializer)
    def post(self, request):

        # if request.user.is_authenticated:
        #     return Response({'error': 'You are already authenticated'}, status=200)
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
            # csrf_token = get_token(request)
            # resp.set_cookie(
            #     key='csrftoken',
            #     value=csrf_token,
            #     samesite='Lax'
            # )
            return resp
        else :
            return Response(Serializer.errors, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'message': 'AM here'}, status=status.HTTP_200_OK)

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            tokens = RefreshToken(refresh_token)
            tokens.blacklist()
            response = Response({'message': 'Logged Out Successfuly'}, status=status.HTTP_200_OK)
            response.delete_cookie('access_token')
            response.delete_cookie('refresh_token')
            response.delete_cookie('csrftoken')
        except Exception as e:
            return Response({'error': str(e)}, status=200)
        return response

#------------------------------------- 2FA ------------------------------------
import pyotp

class GenerateURI(APIView):
    permission_classes = [AllowAny]
    serializer_class = GenerateOTPSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_200_OK)
        user = Player.objects.get(username=request.data['username'])
        if user == None:
            return Response({'error': 'user Not found'}, status=status.HTTP_200_OK)
        if user.enabled_2fa == True:
            return Response({'error': '2fa already enabled'}, status=status.HTTP_200_OK)

        secret_key = pyotp.random_base32()
        totp = pyotp.TOTP(secret_key)
        uri = totp.provisioning_uri(name='transcendence', issuer_name='kadigh') # issuer_name=username

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
        # if not serializer.is_valid():
        #     return Response(serializer.errors, status=400)
        username = request.data['username']
        otp_token = request.data['otp_token']
        user = Player.objects.get(username=username)
        if user == None:
            return Response({'error': 'user Not found'}, status=status.HTTP_200_OK)
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
        serializer = self.serializer_class(request.data)
        # if not serializer.is_valid():
        #     return Response(serializer.errors, status=status.HTTP_200_OK)
        username = request.data['username']
        otp_token = request.data['otp_token']
        user = Player.objects.get(username=username)
        if user == None:
            return Response({'error': 'user Not found'}, status=status.HTTP_200_OK)
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
    permission_classes = [AllowAny]#while testing
    # permission_classes = [IsAuthenticated]

    def post(self, request):
        username = request.data['username']
        user = Player.objects.get(username=username)
        if user is None:
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
import requests
from django.conf import settings
from django.contrib.auth import login
from django.shortcuts import redirect
from django.urls import reverse
from django.views import View
from rest_framework.response import Response

providers_data = {
    "42":{
        "client_id":settings.OAUTH2_PROVIDER_42['CLIENT_ID'],
        "Auth_url":settings.OAUTH2_PROVIDER_42['AUTHORIZATION_URL'],
        "redirect_uri":"http%3A%2F%2F127.0.0.1%3A8080%2Fapi%2Foauth%2Fcallback%2F42"
    },
    "google":{
        "client_id":settings.OAUTH2_PROVIDER_GOOGLE['CLIENT_ID'],
        "Auth_url":settings.OAUTH2_PROVIDER_GOOGLE['AUTHORIZATION_URL'],
        "redirect_uri":settings.OAUTH2_PROVIDER_GOOGLE['CALLBACK_URL'],
        "scope":settings.OAUTH2_PROVIDER_GOOGLE['SCOPE'],
    },
}

class OAuth42LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request, provider):

        if request.user.is_authenticated:
            return Response({'error': 'You are already authenticated'}, status=status.HTTP_200_OK)
        authorization_url = ''
        if provider == '42':
            # Auth_url = settings.OAUTH2_PROVIDER_42['AUTHORIZATION_URL']
            # client_id_42 = settings.OAUTH2_PROVIDER_42['CLIENT_ID']
            authorization_url = f"{providers_data[provider]['Auth_url']}?client_id={providers_data[provider]['clientt_id']}&redirect_uri={providers_data[provider]['redirect_uri']}&response_type=code"
            #trans 2-----------------------------------------
            # authorization_url = f"{Auth_url}?client_id={client_id_42}&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fhome&response_type=code"
        elif provider == 'google':
            # Auth_url = settings.OAUTH2_PROVIDER_GOOGLE['AUTHORIZATION_URL']
            # client_id_Google = settings.OAUTH2_PROVIDER_GOOGLE['CLIENT_ID']
            # redirect_uri = settings.OAUTH2_PROVIDER_GOOGLE['CALLBACK_URL']
            # scope = settings.OAUTH2_PROVIDER_GOOGLE['SCOPE']
            authorization_url = f"{providers_data[provider]['Auth_url']}?client_id={providers_data[provider]['clientt_id']}\&redirect_uri={providers_data[provider]['redirect_uri']}&scope={scope}&response_type=code"
        else:
            return Response({'error': 'Invalid platform'}, status=status.HTTP_200_OK)
        return redirect(authorization_url)

class OAuth42CallbackView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request, provider):

        if (provider != '42' and provider != 'google'):
            return Response({'error': 'Invalid platform'}, status=status.HTTP_200_OK)

        code = request.GET.get('code')
        if not code:
            return Response({'error': 'No code provided'}, status=status.HTTP_200_OK)

        token_url, data = APIdata(code, provider)
        response = requests.post(token_url, data=data)
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

#--------------------------User Infos Update ------------------------------
class UpdateUserInfos(APIView):
    serializer_class = UpdateUserInfosSerializer

    def post(self, request):
        serializer = UpdateUserInfosSerializer(
            data=request.data,
            context={'user':request.user}
            )
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'informations Succesfuly Updated'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_200_OK)
