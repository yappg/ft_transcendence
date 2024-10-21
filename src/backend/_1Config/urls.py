from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('Users.urls')),
    path('oauth/', include('Users.urls')),
    path('2fa/', include('Users.urls')),
    path('players/', include('Users.urls')),
    path('api/', include('game.urls')),
]