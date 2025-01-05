import jwt
from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async

class TokenAuthMiddleware(BaseMiddleware):
    """
    Custom middleware that authenticates WebSocket connections via JWT token stored in cookies.
    """
    @database_sync_to_async
    def get_user(self, user_id):
        from accounts.models import Player
        try:
            return Player.objects.get(id=user_id)
        except Player.DoesNotExist:
            # in this case actually it must not accept the connection
            #Q: alternative for this instead of returning AnonymousUser() is to not accept the connection
            return AnonymousUser()

    async def __call__(self, scope, receive, send):
        # Am not sure if this is necessary, but it's here to be safe
        close_old_connections()

        scope = dict(scope)
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
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                user = await self.get_user(payload['user_id'])
                scope['user'] = user
                print(f'User: {user}')
            except:
                scope['user'] = AnonymousUser()
        else:
            scope['user'] = AnonymousUser()
        return await super().__call__(scope, receive, send)
