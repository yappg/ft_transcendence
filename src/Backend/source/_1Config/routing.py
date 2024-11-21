from django.urls import path
from chat import consumers

websockets_urlpatterns = [
    path('ws/chat/<int:chat_id>/', consumers.ChatConsumer.as_asgi()),
    # path('ws/game/<str:room_name>/', GameConsumer.as_asgi()),
]