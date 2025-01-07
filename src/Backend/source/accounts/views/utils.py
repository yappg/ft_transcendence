from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from ..models import Player, PlayerProfile
import requests
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile


Oauth2_Providers = {
    '42': {
        'code': 'code',
        'grant_type': 'authorization_code',
        'client_id': settings.OAUTH2_PROVIDER_42['CLIENT_ID'],
        'client_secret': settings.OAUTH2_PROVIDER_42['CLIENT_SECRET'],
        'redirect_uri': settings.OAUTH2_PROVIDER_42['CALLBACK_URL'],
        },
    'google': {
        'code': 'code',
        'grant_type': 'authorization_code',
        'client_id': settings.OAUTH2_PROVIDER_GOOGLE['CLIENT_ID'],
        'client_secret': settings.OAUTH2_PROVIDER_GOOGLE['CLIENT_SECRET'],
        'redirect_uri': settings.OAUTH2_PROVIDER_GOOGLE['CALLBACK_URL'],
        },
}

def APIdata(code, provider):
    data = Oauth2_Providers[provider]
    data['code'] = code
    print('--------DATA', data);
    return (data)

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
        username = user_data['login']
        email = user_data['email']
        f_name = user_data['first_name']
        l_name = user_data['last_name']
        img_url = user_data['image']['link'] if 'image' in user_data else None
    elif provider == 'google':
        email = user_data['email']
        f_name = user_data['given_name']
        l_name = user_data['family_name']
        username =  str(f_name)+str(l_name)
        img_url = user_data['picture'] if 'picture' in user_data else None

    user, created = Player.objects.get_or_create(
        username=username,
        defaults={
            'username' : username,
            'email' : email,
            'first_name' : f_name,
            'last_name' : l_name,
        }
    )
    if created and img_url:
        try :
            response = requests.get(img_url)
            tmpImg = NamedTemporaryFile(delete=True)
            tmpImg.write(response.content)
            tmpImg.flush()
            # here may be a problem if all 42 images arent .jpg extension or google being .png
            if provider == '42':
                user.profile.avatar.save(f"{username}_profile.jpg", File(tmpImg), save=True)
            elif provider == 'google':
                user.profile.avatar.save(f"{username}_profile.png", File(tmpImg), save=True)
        except requests.RequestException as e:
            print(f"Failed to download image: {e}")
    return (user, created)

def generate_tokens(user):
        refresh_token = RefreshToken.for_user(user)
        return (str(refresh_token.access_token), str(refresh_token))
