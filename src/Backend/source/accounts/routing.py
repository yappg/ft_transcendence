from django.urls import re_path
from .consumers import OnlineStatusConsumer


websocket_urlpatterns = [
    re_path(r'^ws/online/(?P<userId>\d+)/?$', OnlineStatusConsumer.as_asgi()),
]