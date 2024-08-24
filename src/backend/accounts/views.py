from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Player
from .serializers import PlayerSerializer

#____________________________________________

# Create your views here.
class PlayersViewSet(viewsets.ModelViewSet):
    permission_classes=(IsAuthenticated,)
    queryset=Player.objects.all
    serializer_class=PlayerSerializer

import requests
from django.conf import settings
from django.contrib.auth import login
from django.shortcuts import redirect
from django.urls import reverse
from django.views import View
from django.http import JsonResponse
from oauth2_provider.models import Application
import json


class OAuth42LoginView(View):
    def get(self, request):
        client_id_42 = settings.OAUTH2_PROVIDER_42['CLIENT_ID']
        Auth_url = settings.OAUTH2_PROVIDER_42['AUTHORIZATION_URL']
        authorization_url = f"{Auth_url}?client_id={client_id_42}&redirect_uri=http%3A%2F%2F127.0.0.1%3A8000%2Fo%2F42%2Fcallback%2F&response_type=code"
        redirected_url = redirect(authorization_url)
        return redirected_url

class OAuth42CallbackView(View):
    def get(self, request):
        code = request.GET.get('code')
        if not code:
            return JsonResponse({'error': 'No code provided'}, status=400)

        # Exchange code for access token
        token_url = settings.OAUTH2_PROVIDER_42['TOKEN_URL']
        data = {
            'grant_type': 'authorization_code',
            'client_id': settings.OAUTH2_PROVIDER_42['CLIENT_ID'],
            'client_secret': settings.OAUTH2_PROVIDER_42['CLIENT_SECRET'],
            'code': code,
            'redirect_uri': settings.OAUTH2_PROVIDER_42['CALLBACK_URL'],
        }
        response = requests.post(token_url, data=data)
        token_data = response.json()
        if 'access_token' not in token_data:
            return JsonResponse({'error': 'Failed to obtain access token'}, status=400)

        # Get user info
        userdata_url = settings.OAUTH2_PROVIDER_42['USERDATA_URL']
        headers = {'Authorization': f"Bearer {token_data['access_token']}"}
        response = requests.get(userdata_url, headers=headers)
        user_data = response.json()

        # Create or get user
        user, created = Player.objects.get_or_create(username=user_data['login'],
                email=user_data['email'],
                first_name=user_data['first_name'],
                last_name=user_data['last_name'])
            # defaults={
                # 'username' : user_data['login'],
                # 'email' : user_data['email'],
                # 'first_name' : user_data['first_name'],
                # 'last_name' : user_data['last_name'],
                # :user_data['image']['link']
            # }
        # )
        print(user.id)

        # if not created:
        #     user.email = user_data['email']
        #     user.avatar_url = user_data['image_url']
        #     user.save()

        # Log the user in
        # login(request, user)

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

        return JsonResponse({
            'access_token': token_data['access_token'],
            'token_type': token_data['token_type'],
            'expires_in': token_data['expires_in'],
            # 'username': user.username,
        })
