from asgiref.sync import sync_to_async
from django.contrib.auth.models import AnonymousUser
from urllib.parse import parse_qs
import jwt
from jwt.exceptions import InvalidTokenError, ExpiredSignatureError
from accounts.models import Player
from django.conf import settings
from asgiref.sync import sync_to_async

async def get_user_from_token(token_string):
    try:
        payload = jwt.decode(
            token_string,
            settings.SECRET_KEY,
            algorithms=["HS256"]
        )
        
        user_id = payload.get('user_id')
        if not user_id:
            return AnonymousUser()
            
        user = await sync_to_async(Player.objects.get)(id=user_id)
        print(f'Payload.user: {user}')
        return user
        
    except Exception as e:
        print(f'ERRROOROR DZABIII {e}')
        return AnonymousUser()

class JWTtokenCustomMiddlware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        try:
            query_string = scope["query_string"]
            query_params = parse_qs(query_string.decode())
            if "token" not in query_params:
                scope["user"] = AnonymousUser()
                return await self.app(scope, receive, send)
            token = query_params["token"][0]
            user = await get_user_from_token(token)
            scope["user"] = user
        except Exception as e:
            scope["user"] = AnonymousUser()
        return await self.app(scope, receive, send)