from django.urls import re_path
from .consumers import GameConsumer

websockets_urlpatterns = [
    re_path(r'ws/game/', GameConsumer.as_asgi()),
]
