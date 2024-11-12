
from .views import *
from django.urls import path
from .views import LobbyView

urlpatterns = [
    path('lobby/', LobbyView.as_view(), name='lobby'),
]