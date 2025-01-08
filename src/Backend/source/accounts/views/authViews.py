import pyotp
import requests
from drf_yasg.utils import swagger_auto_schema
from urllib.parse import quote

from rest_framework import status
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
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
    authentication_classes = []

    def post(self, request):
        try:
            if request.user.is_authenticated:
                return Response({'error': 'You are already authenticated'}, status=status.HTTP_200_OK)

            serializer = self.serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()

            if user:
                try:
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
                except Exception as e:
                    return Response({'error': 'Error generating tokens'}, status=status.HTTP_400_BAD_REQUEST)
        except serializers.ValidationError as e:
            if isinstance(e.detail, dict):
                error_message = next(iter(e.detail.values()))
                if isinstance(error_message, list):
                    error_message = error_message[0]
                return Response({'error': error_message}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'error': str(e.detail)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'error there was an error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@swagger_auto_schema(request_body=SignInSerializer)
class SignInView(APIView):
    permission_classes = [AllowAny]
    Serializer_class = SignInSerializer

    authentication_classes = []

    def post(self, request):
        try:
            if request.user.is_authenticated:
                return Response({'error': 'You are already authenticated'}, status=200)
            Serializer = self.Serializer_class(data=request.data)
            if Serializer.is_valid():
                user = Serializer.validated_data['user']
                if (user.enabled_2fa == True):
                    return Response({'message':'logged in Successfully','enabled_2fa':'True'}, status=status.HTTP_200_OK)

                access_token, refresh_token = generate_tokens(user)
                resp = Response({'message':'logged in Successfully','enabled_2fa':'False'}, status=status.HTTP_200_OK)
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
            return Response(Serializer.errors, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'error there was an error'}, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'message': 'This method is only for the DRF web interface'}, status=status.HTTP_200_OK)

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            if not refresh_token:
                return Response({'error': 'No refresh token found'}, status=status.HTTP_400_BAD_REQUEST)

            tokens = RefreshToken(refresh_token)
            tokens.blacklist()

            response = Response({'message': 'Logged Out Successfully'}, status=status.HTTP_200_OK)
            response.delete_cookie('access_token')
            response.delete_cookie('refresh_token')
            return response
        except Exception as e:
            return Response({'error': 'error there was an error'}, status=status.HTTP_400_BAD_REQUEST)

#------------------------------------- 2FA ------------------------------------

class GenerateURI(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = GenerateOTPSerializer

    def post(self, request):
        try:
            serializer = self.serializer_class(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            try:
                user = Player.objects.get(username=request.data['username'])
            except Player.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

            if user.enabled_2fa:
                return Response({'error': '2FA already enabled'}, status=status.HTTP_400_BAD_REQUEST)

            secret_key = pyotp.random_base32()
            totp = pyotp.TOTP(secret_key)
            uri = totp.provisioning_uri(name='transcendence', issuer_name=user.username)

            user.otp_secret_key = secret_key
            user.save(update_fields=['otp_secret_key'])

            return Response(
                {'uri': uri, 'enabled_2fa': user.enabled_2fa},
                status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'error there was an error'}, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTP(APIView):
    permission_classes = [AllowAny]
    serializer_class = VerifyOTPSerializer
    authentication_classes = []

    def post(self, request):
        try:
            serializer = self.serializer_class(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            username = request.data.get('username')
            otp_token = request.data.get('otp_token')

            try:
                user = Player.objects.get(username=username)
            except Player.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

            if not user.otp_secret_key:
                return Response({'error': '2FA not set up'}, status=status.HTTP_400_BAD_REQUEST)

            totp = pyotp.TOTP(user.otp_secret_key)
            if not totp.verify(otp_token):
                return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

            user.enabled_2fa = True
            user.verified_otp = True
            user.save()
            return Response({'message': '2FA Verified'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'error there was an error'}, status=status.HTTP_400_BAD_REQUEST)

class ValidateOTP(APIView):
    permission_classes = [AllowAny]
    serializer_class = ValidateOTPSerializer
    authentication_classes = []

    def post(self, request):
        try:
            serializer = self.serializer_class(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            username = request.data.get('username')
            otp_token = request.data.get('otp_token')

            try:
                user = Player.objects.get(username=username)
            except Player.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

            if not user.otp_secret_key:
                return Response({'error': '2FA not set up'}, status=status.HTTP_400_BAD_REQUEST)

            totp = pyotp.TOTP(user.otp_secret_key)
            if not totp.verify(otp_token):
                return Response({'error': 'Invalid Token'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                access_token, refresh_token = generate_tokens(user)
                resp = Response({'message': 'Logged in Successfully'}, status=status.HTTP_200_OK)
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
            except Exception as e:
                return Response({'error': 'Error generating tokens'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': "error there was an error"}, status=status.HTTP_400_BAD_REQUEST)

class DisableOTP(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            username = request.data.get('username')
            if not username:
                return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)
            try:
                user = Player.objects.get(username=username)
            except Player.DoesNotExist:
                return Response({'error': 'Invalid user'}, status=status.HTTP_404_NOT_FOUND)

            if user.enabled_2fa is False:
                return Response({'error':'2FA Already Disabled'}, status=status.HTTP_200_OK)

            user.enabled_2fa = False
            user.verified_otp = False
            user.otp_secret_key = ''
            user.save()
            return Response(
                {'message':'2FA Disabled', 'enabled_2fa': user.enabled_2fa},
                status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': "error there was an error"}, status=status.HTTP_400_BAD_REQUEST)

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
        elif provider == 'google':
            Auth_url = settings.OAUTH2_PROVIDER_GOOGLE['AUTHORIZATION_URL']
            client_id_Google = settings.OAUTH2_PROVIDER_GOOGLE['CLIENT_ID']
            redirect_uri = quote(settings.OAUTH2_PROVIDER_GOOGLE['CALLBACK_URL'])
            scope = quote(settings.OAUTH2_PROVIDER_GOOGLE['SCOPE'])
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
        if not code:
            return Response({'error': 'No code provided'}, status=status.HTTP_200_OK)

        data = APIdata(code, provider)
        try:
            response = requests.post(Oauth2_Providers_URLToken[provider], data=data)
            response.raise_for_status()  # Raises an HTTPError for bad responses
            token_data = response.json()
        except requests.exceptions.RequestException as e:
            return Response({'error': 'Failed to fetch token error there was an error'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        if 'access_token' not in token_data:
            return Response({'error': 'Failed to obtain access token'}, status=status.HTTP_200_OK)

        try:
            user_data = fetch_user_data(token_data['access_token'], provider)
            user = store_user_data(user_data, provider)
        except Exception as e:
            return Response({'error': 'Failed to process user data error there was an error'}, status=status.HTTP_400_BAD_REQUEST)

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
        try:
            user = request.user
            serializer = self.serializer_class(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'error there was an error'}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        try:
            serializer = UpdateUserInfosSerializer(
                request.user,
                data=request.data,
                context={'user': request.user},
            )
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'error there was an error'}, status=status.HTTP_400_BAD_REQUEST)
