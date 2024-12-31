from django.urls import path, re_path
from accounts.consumers import *
from chat.consumers import *
from game.Gameconsumer0 import *
from relations.consumers import *

websockets_urlpatterns = [
    path('ws/game/', GameConsumer.as_asgi()),
    re_path(r'^ws/chat/(?P<chatId>\d+)/?$', ChatConsumer.as_asgi()),
    re_path(r'ws/online/$', OnlineStatusConsumer.as_asgi()),
    re_path(r'ws/notifications/$', NotificationConsumer.as_asgi()),
]