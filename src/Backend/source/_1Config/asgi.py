"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""
import os
import django  # Import django to call django.setup()

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from channels.security.websocket import AllowedHostsOriginValidator

# Set the default settings module for the 'django' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', '_1Config.settings')

# Initialize Django
django.setup()  # Ensure Django is set up before accessing any models

# Get the ASGI application
django_asgi_app = get_asgi_application()

# # Define the ASGI application routing
import chat.routing
import relations.routing

# Combine WebSocket URL patterns from different apps
websocket_urlpatterns = chat.routing.websocket_urlpatterns + relations.routing.websocket_urlpatterns

application = ProtocolTypeRouter({
    'http': django_asgi_app,
    'websocket': AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})
