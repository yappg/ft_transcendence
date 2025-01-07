"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""
import os
import django

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from .middleware import TokenAuthMiddleware
from .routing import websockets_urlpatterns
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator

# Initialize Django
django.setup()

# Get the ASGI application
django_asgi_app = get_asgi_application()

class WebSocketNotFoundMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "websocket":
            if not any(pattern.match(scope["path"]) for pattern in websockets_urlpatterns):
                await send({
                    "type": "websocket.close",
                    "code": 4404,
                })
                return
        return await self.app(scope, receive, send)

application = ProtocolTypeRouter({
    'http': django_asgi_app,
    "websocket": WebSocketNotFoundMiddleware(
        AllowedHostsOriginValidator(
            AuthMiddlewareStack(
                URLRouter(websockets_urlpatterns)
            )
        )
    ),
})
