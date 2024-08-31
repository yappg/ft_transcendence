from django.conf import settings
import requests

def APIdata(code):
    # if platform == '42':
    token_url = settings.OAUTH2_PROVIDER_42['TOKEN_URL']
    data = {
        'grant_type': 'authorization_code',
        'client_id': settings.OAUTH2_PROVIDER_42['CLIENT_ID'],
        'client_secret': settings.OAUTH2_PROVIDER_42['CLIENT_SECRET'],
        'code': code,
        'redirect_uri': settings.OAUTH2_PROVIDER_42['CALLBACK_URL'],
    }
    # elif platform == 'google':
    #     token_url = settings.OAUTH2_PROVIDER_GOOGLE['TOKEN_URL']
    #     data = {
    #         'grant_type': 'authorization_code',
    #         'client_id': settings.OAUTH2_PROVIDER_GOOGLE['CLIENT_ID'],
    #         'client_secret': settings.OAUTH2_PROVIDER_GOOGLE['CLIENT_SECRET'],
    #         'code': code,
    #         'redirect_uri': settings.OAUTH2_PROVIDER_GOOGLE['CALLBACK_URL'],
    #     }
    return (token_url, data)

def fetch_user_data(access_token):
    param = ''
    userdata_url = ''
    # if '42':
    #     userdata_url = settings.OAUTH2_PROVIDER_42['USERDATA_URL']
    # elif 'google':
    #     userdata_url = settings.OAUTH2_PROVIDER_GOOGLE['USERDATA_URL']
    headers = {'Authorization': f"Bearer {access_token}"}
    response = requests.get(userdata_url, headers=headers)
    return response.json()