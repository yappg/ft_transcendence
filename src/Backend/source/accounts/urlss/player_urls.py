# from rest_framework.routers import DefaultRouter
from django.urls import path #, include
from ..viewss.player_views import (
    # PlayersView,
#     PlayerIdView,
#     PlayersIdProfileView,
#     PlayersIdSettingsView

    accountView,
    accountProfileView,
    accoutSettingView,
)

# from rest_framework.routers import DefaultRouter


# userRouter = DefaultRouter()
# userRouter.register(r'Users', UserViewSet, basename='Users')
urlpatterns = [

    # path('Users/', include(userRouter.urls)),
    path('account/', accountView.as_view(), name='account'),
    path('accountProfile/', accountProfileView.as_view(), name='profile'),
    path('accountSettings/', accoutSettingView.as_view(), name='settings'),


    # path('Players/', PlayersView.as_view(), name='players'),
    # path('Players/<int:player-id>/',PlayerIdView.as_view(), name='playerId'),
    # path('Players/<int:player-id>/Profile/', PlayersIdProfileView.as_view(), name='playerIdProfile'),

    # path('Players/<int:player-id>/Settings/', PlayersIdSettingsView.as_view(), name='playerIdSettings'),


#    # Profile-specific custom endpoints
#     path('player-profiles/<int:pk>/rank/',
#          PlayerProfileViewSet.as_view({'get': 'retrieve_rank'}),
#          name='player-profile-rank'),
#     path('player-profiles/top-ranked/',
#          PlayerProfileViewSet.as_view({'get': 'list_top_ranked'}),
#          name='top-ranked-players'),

#     # Player Settings custom endpoints
#     path('player-settings/<int:pk>/toggle-privacy/',
#          PlayerSettingsViewSet.as_view({'patch': 'toggle_privacy'}),
#          name='toggle-profile-privacy'),
#     path('player-settings/<int:pk>/toggle-notifications/',
#          PlayerSettingsViewSet.as_view({'patch': 'toggle_notifications'}),
#          name='toggle-notifications'),

]
