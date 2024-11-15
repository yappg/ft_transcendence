from django.urls import path
from . import consumers



websockets_urlpatterns = [
    path('ws/chat/<int:chatId>/', consumers.ChatConsumer.as_asgi()),
]

