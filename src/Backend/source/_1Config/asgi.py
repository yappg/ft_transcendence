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

os.environ.setdefault('DJANGO_SETTINGS_MODULE', '_1Config.settings.developments')

django.setup()

from .middleware import TokenAuthMiddleware
from .routing import websockets_urlpatterns

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    'http': django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        TokenAuthMiddleware(
            URLRouter(websockets_urlpatterns)
        )
    ),
})
