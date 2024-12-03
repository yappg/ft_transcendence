from rest_framework.routers import DefaultRouter
from django.urls import path , include
from ..viewss.player_views import (

    UserProfileViewSet,
    UserSettingsViewSet,
    UserHistoryViewSet,

    PlayerProfileViewSet,
    MatchHistoryViewSet,

)

# documentation todos
# .list(), .retrieve(), .create(), .update(), .partial_update(), and .destroy


router = DefaultRouter()
# base my self on the settings and player model for quarying profiles
router.register(r'profiles', PlayerProfileViewSet)

#for that user requesting it all read only we take id of profile for profile history
#match history for the user it self and {id} for profile id match history
router.register(r'history', MatchHistoryViewSet)


UserProfileView = UserProfileViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
})

UserSettingsView = UserSettingsViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
})

UserHistoryView = UserHistoryViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
})

urlpatterns = [
    path('user-profile/', UserProfileView , name='user_profile'),
    path('user-settings/', UserSettingsView , name='user_settings'),
    path('user-history/', UserHistoryView , name='user_game_history'),

    path('', include(router.urls)),

    # path('disable_account/', UserHistoryView , name='user_game_history'),
    # path('delete_account/', UserHistoryView , name='user_game_history'),
    # path('change_username/', UserHistoryView , name='user_game_history'),
    # path('change_password/', UserHistoryView , name='user_game_history'),
    # path('change_email/', UserHistoryView , name='user_game_history'),


### TODO add loging for last time logged in and online status
### make signals to detect post save for game model to create a match history object for it
### test that the display name is unique and confirm changes and test errors
]

##### 
