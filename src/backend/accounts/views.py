from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth import logout
from .models import Player
from .serializers import PlayerSerializer, SignInSerializer, SignUpSerializer, GenerateOTPSerializer, VerifyOTPSerializer
from .utils import APIdata, fetch_user_data, store_user_data, generate_tokens

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

    def get(self, request):
        return Response({'message': 'Signup page'}, status=200)

    def post(self, request):

        #implement a rate limit 

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                tokens = generate_tokens(user)
                return Response({'tokens': tokens}, status=201)
        return Response(serializer.errors, status=400)

class SignInView(APIView):
    permission_classes = [AllowAny]
    Serializer_class = SignInSerializer

    #still need to implement a rate limit login attempts
    def get(self, request):
        return Response({'page to Serve': 'SignIn page'}, status=200)

    def post(self, request):
        Serializer = self.Serializer_class(data=request.data)

        if Serializer.is_valid() :
            user = Serializer.validated_data['user']
            # if (user.enabled_2fa == True and ):
            #     implement 2fa
            login(request, user)
            tokens = generate_tokens(user)
            return Response({'tokens': tokens}, status=200)
        else :
            return Response(Serializer.errors, status=400)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            # must the user send the tokens in header
            # refresh_token = request.data["refresh_token"]
            # tokens = RefreshToken(refresh_token)
            # tokens.backlist()
            # Refresh_token = request.data['']
            logout(request)
        except Exception as e:
            return Response({'error': str(e)}, status=400)
        return Response({'message': 'loggedOut Successfuly'}, status=200)

#------------------------------------- 2FA ------------------------------------

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
        return Response({'uri': uri}, status=200)

class VerifyOTP(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = VerifyOTPSerializer

    def get(self, request):
        return Response({'page to Serve': 'verify otp page'}, status=200)

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
from django.http import JsonResponse
from oauth2_provider.models import Application


class OAuth42LoginView(View):
    def get(self, request, provider):
        if provider == '42':
            Auth_url = settings.OAUTH2_PROVIDER_42['AUTHORIZATION_URL']
            client_id_42 = settings.OAUTH2_PROVIDER_42['CLIENT_ID']
            authorization_url = f"{Auth_url}?client_id={client_id_42}&redirect_uri=http%3A%2F%2F127.0.0.1%3A8000%2Foauth%2Fcallback%2F42&response_type=code"
        elif provider == 'google':
            Auth_url = settings.OAUTH2_PROVIDER_GOOGLE['AUTHORIZATION_URL']
            client_id_Google = settings.OAUTH2_PROVIDER_GOOGLE['CLIENT_ID']
            redirect_uri = settings.OAUTH2_PROVIDER_GOOGLE['CALLBACK_URL']
            scope = settings.OAUTH2_PROVIDER_GOOGLE['SCOPE']
            authorization_url = f"{Auth_url}?client_id={client_id_Google}&redirect_uri={redirect_uri}&scope={scope}&response_type=code"
        else:
            return Response({'error': 'Invalid platform'}, status=400)
        return redirect(authorization_url)

class OAuth42CallbackView(View):
    def get(self, request, provider):

        if (provider != '42' and provider != 'google'):
            return Response({'error': 'Invalid platform'}, status=400)

        code = request.GET.get('code')
        if not code:
            return Response({'error': 'No code provided'}, status=400)

        token_url, data = APIdata(code, provider)
        response = requests.post(token_url, data=data)
        token_data = response.json()

        if 'access_token' not in token_data:
            return Response({'error': 'Failed to obtain access token'}, status=400)

        user_data = fetch_user_data(token_data['access_token'], provider)

        user, created = store_user_data(user_data, provider)
        # print(user.id)
        if not created:
            user.email = user_data['email']
            # user.avatar_url = user_data['image']['link']
            user.save()

        user.backend = 'django.contrib.auth.backends.ModelBackend'
        # Log the user in
        login(request, user)

        # Create OAuth2 application for the user if it doesn't exist
        # app, _ = Application.objects.get_or_create(
        #     user=user,
        #     client_type=Application.CLIENT_CONFIDENTIAL,
        #     authorization_grant_type=Application.GRANT_AUTHORIZATION_CODE,
        #     name=f'42 OAuth App for {user.username}'
        # )

        # # # Generate access token for the user
        # token_url = reverse('oauth2_provider:token')
        # data = {
        #     'grant_type': 'client_credentials',
        #     'client_id': app.client_id,
        #     'client_secret': app.client_secret,
        # }
        # response = requests.post(request.build_absolute_uri(token_url), data=data)
        # token_data = response.json()
        # print('\n\n-----------' + str(token_data) + '----------\n\n')

        return Response({
            'access_token': token_data['access_token'],
            'token_type': token_data['token_type'],
            'expires_in': token_data['expires_in'],
            # 'username': user.username,
        })


# admin {"username":"kadigh1","password":"kadigh123"}
# {"username": "abdo", "password": "kadigh123"}