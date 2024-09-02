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
from .utils import APIdata, fetch_user_data, store_user_data



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
            return JsonResponse({'error': 'Invalid platform'}, status=400)
        return redirect(authorization_url)

class OAuth42CallbackView(View):
    def get(self, request, provider):

        if (provider != '42' and provider != 'google'):
            return JsonResponse({'error': 'Invalid platform'}, status=400)

        code = request.GET.get('code')
        if not code:
            return JsonResponse({'error': 'No code provided'}, status=400)

        token_url, data = APIdata(code, provider)
        response = requests.post(token_url, data=data)
        token_data = response.json()

        if 'access_token' not in token_data:
            return JsonResponse({'error': 'Failed to obtain access token'}, status=400)

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
        app, _ = Application.objects.get_or_create(
            user=user,
            client_type=Application.CLIENT_CONFIDENTIAL,
            authorization_grant_type=Application.GRANT_AUTHORIZATION_CODE,
            name=f'42 OAuth App for {user.username}'
        )

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

        return JsonResponse({
            'access_token': token_data['access_token'],
            'token_type': token_data['token_type'],
            'expires_in': token_data['expires_in'],
            # 'username': user.username,
        })
