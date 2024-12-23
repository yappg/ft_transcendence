from .views import *
from django.urls import path
from .views import ChatListView

urlpatterns = [
    path('list/', ChatListView.as_view(), name='list_chat'),
    path('<int:chatId>/messages/', ChatMessagesView.as_view(), name='chat_messages'),
]
