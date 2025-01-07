from django.urls import path, re_path
from accounts.consumers import *
from chat.consumers import *
from game.Gameconsumer0 import *
from game.GameInviteConsumer import *
from relations.consumers import *
from channels.consumer import AsyncConsumer

class fallbackConsumer(AsyncConsumer):
    async def websocket_connect(self, event):
        await self.send({
            "type": "websocket.close",
            "code": 4004,
        })

    async def websocket_disconnect(self, event):
        pass

websockets_urlpatterns = [
    re_path(r'ws/game/$', GameConsumer.as_asgi()),
    re_path(r'ws/game_invite/$', GameInviteConsumer.as_asgi()),
    re_path(r'^ws/chat/(?P<chatId>\d+)/?$', ChatConsumer.as_asgi()),
    re_path(r'ws/online/$', OnlineStatusConsumer.as_asgi()),
    re_path(r'ws/notifications/$', NotificationConsumer.as_asgi()),
    re_path(r'ws/.*', fallbackConsumer.as_asgi()),
]
