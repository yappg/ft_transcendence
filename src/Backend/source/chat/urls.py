from .views import *
from django.urls import path
from .views import ChatListView

urlpatterns = [
    path('ch/', ChatView.as_view(), name='StartChatingBro'),
    path('list/', ChatListView.as_view(), name='chat'),
    path('<int:chatId>/messages/', ChatMessagesView.as_view(), name='chat_messages'),
]
