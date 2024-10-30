from django.urls import re_path
from . import consumers



websockets_urlpatterns = [
    re_path(r'ws/socket-server/', consumers.GameConsumer.as_asgi()),
    ]
 