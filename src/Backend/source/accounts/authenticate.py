from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import AccessToken
from django.conf import settings
from rest_framework import exceptions
from django.middleware.csrf import CsrfViewMiddleware
import jwt

class CotumAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get('access_token')
        if not access_token:
            return None
        try:
            validated_token = self.get_validated_token(access_token)
            user = self.get_user(validated_token)
            request.user = user
            return (user, validated_token)
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Access token has expired')
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed('Invalid token')
        except Exception as e:
            raise exceptions.AuthenticationFailed(str(e))

    def get_validated_token(self, raw_token):
        try:
            return AccessToken(raw_token)
        except Exception as e:
            raise exceptions.AuthenticationFailed(str(e))
