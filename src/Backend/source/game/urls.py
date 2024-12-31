
from django.urls import path, include
from rest_framework.routers import DefaultRouter
# from .views import lobby_game
from .views import *


# router = DefaultRouter()
# router.register(r'games', lobby_game)

urlpatterns = [
    path('', lobby_game),
]