"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""
import os
import django  # Import django to call django.setup()

from django.core.asgi import get_asgi_application
from django.urls import path
django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from .middleware import TokenAuthMiddleware
from .routing import websockets_urlpatterns

# Set the default settings module for the 'django' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', '_1Config.settings.developments')

# Initialize Django
django.setup()  # Ensure Django is set up before accessing any models

# TODO what the AllowedHostsOriginValidator is for.
application = ProtocolTypeRouter({
    'http': django_asgi_app,
    'websocket':AllowedHostsOriginValidator(
        TokenAuthMiddleware(
            URLRouter(
                websockets_urlpatterns
            )
        ),
    ),
})
