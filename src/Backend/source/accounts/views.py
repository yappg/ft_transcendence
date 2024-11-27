from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.core.cache import cache
from .permissions import AnonRateLimitThrottling
from .models import Player
from .serializers import *
from .utils import *
from drf_yasg.utils import swagger_auto_schema

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

    @swagger_auto_schema(request_body=SignUpSerializer)
    def post(self, request):

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
                return Response({'error': 'user not created'}, status=400)

        return Response(serializer.errors, status=400)

class SignInView(APIView):
    permission_classes = [AllowAny]
    Serializer_class = SignInSerializer
    throttle_classes = [AnonRateLimitThrottling]

    @swagger_auto_schema(request_body=SignInSerializer)
    def post(self, request):
        Serializer = self.Serializer_class(data=request.data)

        if Serializer.is_valid():
            user = Serializer.validated_data['user']
            # maybe it would be implemented as follow  or it could be validated on the serializer
            if (user.enabled_2fa == True):
                redirect('validate_otp')

            access_token, refresh_token = generate_tokens(user)
            resp = Response({'message':'logged in Successfuly'}, status=status.HTTP_200_OK)

            #clear the old cookies before sign in with new ones
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
            return Response(Serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    # permission_classes = [CotumAuthentication]

    #before logout clear the cookies in th browser
    def post(self, request):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            tokens = RefreshToken(refresh_token)
            tokens.blacklist()
            response = Response({'message': 'Logged Out Successfuly'}, status=200)
            response.delete_cookie('access_token')
            response.delete_cookie('refresh_token')
        except Exception as e:
            return Response({'error': str(e)}, status=400)
        return response

#------------------------------------- 2FA ------------------------------------19788791
import pyotp

class GenerateURI(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = GenerateOTPSerializer

    def get(self, request):
        return Response({'page to Serve': 'generate uri page'}, status=200)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        # if not serializer.is_valid():
        #     return Response(serializer.errors, status=400)
        user = Player.objects.get(username=request.data['username'])
        if user == None:
            return Response({'error': 'user Not found'}, status=404)
        if user.enabled_2fa == True:
            return Response({'error': '2fa already enabled'}, status=400)

        secret_key = pyotp.random_base32()
        totp = pyotp.TOTP(secret_key)
        uri = totp.provisioning_uri(name='transcendence', issuer_name='kadigh') # issuer_name=username
        #URI must be converted to QR Code in frontend
        #save user data secret key in the model
        user.enabled_2fa = True
        user.otp_secret_key = secret_key
        user.save()
        qrcode.make(uri).save(f"/Users/aaoutem-/Desktop/qr_2fa.png")
        return Response({'uri': uri}, status=200)

import qrcode
class VerifyOTP(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = VerifyOTPSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        # if not serializer.is_valid():
        #     return Response(serializer.errors, status=400)
        username = request.data['username']
        otp_token = request.data['otp_token']
        user = Player.objects.get(username=username)
        if user == None:
            return Response({'error': 'user Not found'}, status=404)
        totp = pyotp.TOTP(user.otp_secret_key)
        bol = totp.verify(otp_token)
        if not bol:
            return Response({'error': 'invalid token'}, status=400)
        user.verified_otp = True
        user.save()
        return Response({'message': '2fa Verified'}, status=200)

class ValidateOTP(APIView):
    permission_class = [IsAuthenticated]
    serializer_class = ValidateOTPSerializer

    def post(self, request):
        serializer = self.serializer_class(request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        username = request.data['username']
        otp_token = request.data['otp_token']
        user = Player.objects.get(username=username)
        if user == None:
            return Response({'error': 'user Not found'}, status=404)
        totp = pyotp.TOTP(user.otp_secret_key)
        bol = totp.verify(otp_token)
        if not bol:
            return Response({'message': 'Invalid Token'}, status=400)
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
        # return Response({'message': '2fa Verified'}, status=200)

class DisableOTP(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        username = request.data['username']
        user = Player.objects.get(username=username)
        if user is None:
            return Response({'error' : 'invalid user'})
        # if user.enabled_2fa is True:
        #     return Response({'message':'2fa Already Disabled'})
        user.enabled_2fa = False
        user.verified_otp = False
        user.otp_secret_key = ''
        user.save()
        return Response({'message':'2fa Disabled'})

#---------------------------------- OAuth2.0 ----------------------------------
import requests
from django.conf import settings
from django.contrib.auth import login
from django.shortcuts import redirect
from django.urls import reverse
from django.views import View
from rest_framework.response import Response

class OAuth42LoginView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, provider):
        if provider == '42':
            Auth_url = settings.OAUTH2_PROVIDER_42['AUTHORIZATION_URL']
            client_id_42 = settings.OAUTH2_PROVIDER_42['CLIENT_ID']
            authorization_url = f"{Auth_url}?client_id={client_id_42}&redirect_uri=http%3A%2F%2F127.0.0.1%3A8080%2Foauth%2Fcallback%2F42&response_type=code"
        elif provider == 'google':
            Auth_url = settings.OAUTH2_PROVIDER_GOOGLE['AUTHORIZATION_URL']
            client_id_Google = settings.OAUTH2_PROVIDER_GOOGLE['CLIENT_ID']
            redirect_uri = settings.OAUTH2_PROVIDER_GOOGLE['CALLBACK_URL']
            scope = settings.OAUTH2_PROVIDER_GOOGLE['SCOPE']
            authorization_url = f"{Auth_url}?client_id={client_id_Google}&redirect_uri={redirect_uri}&scope={scope}&response_type=code"
        else:
            return Response({'error': 'Invalid platform'}, status=400)
        return redirect(authorization_url)

class OAuth42CallbackView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, provider):

        if (provider != '42' and provider != 'google'):
            return Response({'error': 'Invalid platform'}, status=400)

        code = request.GET.get('code')
        if not code:
            return Response({'error': 'No code provided'}, status=400)

        token_url, data = APIdata(code, provider)
        response = requests.post(token_url, data=data)
        token_data = response.json()
        print(token_data)

        if 'access_token' not in token_data:
            return Response({'error': 'Failed to obtain access token'}, status=400)

        user_data = fetch_user_data(token_data['access_token'], provider)
        user, created = store_user_data(user_data, provider)

        jwt_tokens = generate_tokens(user)
        return Response({
            'id': user.id,
            'username': user.username,
            'tokens' : jwt_tokens,
        }, status=status.HTTP_200_OK)

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
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class PlayerStats(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user
        # return Response({
        #     'username': user.username,
        #     'email': user.email,
        #     'score': user.score,
        #     'games_played': user.games_played,
        #     'games_won': user.games_won,
        #     'games_lost': user.games_lost,
        #     'games_draw': user.games_draw,
        #     'win_rate': user.win_rate,
        #     'last_game': user.last_game,
        # }, status=200)
