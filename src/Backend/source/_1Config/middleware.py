import jwt
from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections

class TokenAuthMiddleware:
    """
    Custom middleware that authenticates WebSocket connections via JWT token stored in cookies.
    """

    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        close_old_connections()

        headers = dict(scope['headers'])
        cookies = headers.get(b'cookie', b'').decode()
        token = None

        if cookies:
            # Parse the cookies to extract the token
            cookie_dict = {}
            for item in cookies.split(';'):
                key, _, value = item.strip().partition('=')
                cookie_dict[key] = value
            token = cookie_dict.get('access_token')

        if token:
            try:
                # Decode the token to get user information
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                from django.contrib.auth import get_user_model
                User = get_user_model()
                user = User.objects.get(id=payload['user_id'])
                scope['user'] = user
            except (jwt.ExpiredSignatureError, jwt.DecodeError, User.DoesNotExist):
                scope['user'] = AnonymousUser()
        else:
            scope['user'] = AnonymousUser()

        return self.inner(scope)