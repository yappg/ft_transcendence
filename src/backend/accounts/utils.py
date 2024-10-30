from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from .models import Player
import requests

def APIdata(code, provider):
    if provider == '42':
        token_url = settings.OAUTH2_PROVIDER_42['TOKEN_URL']
        data = {
            'code': code,
            'grant_type': 'authorization_code',
            'client_id': settings.OAUTH2_PROVIDER_42['CLIENT_ID'],
            'client_secret': settings.OAUTH2_PROVIDER_42['CLIENT_SECRET'],
            'redirect_uri': settings.OAUTH2_PROVIDER_42['CALLBACK_URL'],
        }
    elif provider == 'google':
        token_url = settings.OAUTH2_PROVIDER_GOOGLE['TOKEN_URL']
        data = {
            'code': code,
            'grant_type': 'authorization_code',
            'client_id': settings.OAUTH2_PROVIDER_GOOGLE['CLIENT_ID'],
            'client_secret': settings.OAUTH2_PROVIDER_GOOGLE['CLIENT_SECRET'],
            'redirect_uri': settings.OAUTH2_PROVIDER_GOOGLE['CALLBACK_URL'],
        }
    return (token_url, data)

def fetch_user_data(access_token, provider):
    if provider == '42':
        userdata_url = settings.OAUTH2_PROVIDER_42['USERDATA_URL']
    elif provider == 'google':
        userdata_url = settings.OAUTH2_PROVIDER_GOOGLE['USERDATA_URL']
    headers = {'Authorization': f"Bearer {access_token}"}
    response = requests.get(userdata_url, headers=headers)
    return response.json()

def store_user_data(user_data, provider):
    if provider == '42':
        user, created = Player.objects.get_or_create(username=user_data['login'],
            defaults={
                'username' : user_data['login'],
                'email' : user_data['email'],
                'first_name' : user_data['first_name'],
                'last_name' : user_data['last_name'],
                # :user_data['image']['link']
            }
        )
    elif provider == 'google':
        if 'email' in user_data:
            email = user_data['email']
        else :
            email = None
        Gusername = str(user_data['given_name']) + str(user_data['family_name'])
        user, created = Player.objects.get_or_create(username=Gusername,
            defaults={
                'email' : email,
                'email' : user_data['email'],
                'username' : Gusername,
                'first_name' : user_data['given_name'],
                'last_name' : user_data['family_name'],
                # :user_data['image']['link']
            }
        )
        if not created:
            user.save()
    return (user, created)

def generate_tokens(user):
        refresh_token = RefreshToken.for_user(user)
        tokens = {'access':str(refresh_token.access_token), 'refresh':str(refresh_token)}
        return tokens