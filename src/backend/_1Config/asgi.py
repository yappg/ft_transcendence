"""
ASGI config for _1Config project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from channels.security.websocket import AllowedHostsOriginValidator
from chatoom.consumers import ChatConsumer
from django.urls import re_path
from chatoom.routing import websockets_urlpatterns 

os.environ.setdefault('DJANGO_SETTINGS_MODULE', '_1Config.settings')


django_asgi_app = get_asgi_application()
application = ProtocolTypeRouter(
    {
        'http': django_asgi_app,
        # 'websocket': 
        #     AllowedHostsOriginValidator(
        #     AuthMiddlewareStack(
        #         URLRouter(
        #             websockets_urlpatterns
        #         )
        #     )
        # ),
        "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter([
                # path("chat/admin/", AdminChatConsumer.as_asgi()),
                path('ws/socket-server', ChatConsumer.as_asgi()),
            ])
        )
    ),
    })
  