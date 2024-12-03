from rest_framework.routers import DefaultRouter
from django.urls import path , include
from ..viewss.player_views import (

    PlayerProfileViewSet,
    PlayerSettingsViewSet,
    MatchHistoryViewSet,
)


router = DefaultRouter()
router.register(r'profiles', PlayerProfileViewSet)
router.register(r'matches', MatchHistoryViewSet)

profile_settings = PlayerSettingsViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
})

urlpatterns = [
    path('', include(router.urls)),
    path('profiles/<int:profile_id>/settings/', profile_settings, name='profile-settings'),
]
