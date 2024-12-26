from django.urls import path
from accounts.consumers import *
from chat.consumers import *
from game.Gameconsumer0 import *

websockets_urlpatterns = [
    path('ws/user-activity/', OnlineStatusConsumer.as_asgi()),
    path('ws/chat/<int:chat_id>/', ChatConsumer.as_asgi()),
    path('ws/game/', GameConsumer.as_asgi()),
]
