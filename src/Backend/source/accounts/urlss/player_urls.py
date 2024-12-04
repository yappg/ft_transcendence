from rest_framework.routers import DefaultRouter
from django.urls import path , include
from ..viewss.player_views import (

    UserProfileViewSet,
    UserSettingsViewSet,
    UserHistoryViewSet,

    PlayerProfileViewSet,
    MatchHistoryViewSet,

)

router = DefaultRouter()
# base my self on the settings and player model for quarying profiles
router.register(r'profiles', PlayerProfileViewSet) # get options head for auth users / {id} put patch only for request user else get

#for that user requesting it all read only we take id of profile for profile history
#match history for the user it self and {id} for profile id match history
router.register(r'history', MatchHistoryViewSet)


UserProfileView = UserProfileViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'options': 'options',
})

UserSettingsView = UserSettingsViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'options': 'options',
})

UserHistoryView = UserHistoryViewSet.as_view({
    'get': 'list',
    'options': 'options',
})

urlpatterns = [
    path('', include(router.urls)),
    path('user-profile/', UserProfileView , name='user_profile'),
    path('user-settings/', UserSettingsView , name='user_settings'),
    path('user-history/', UserHistoryView , name='user_game_history'),

    # path('change_password/', UserHistoryView , name='user_game_history'), # PATCH verficiation from front
    # path('change_email/', UserHistoryView , name='user_game_history'), # PATCH and verification confirm mail maybe in future
    # path('disable_account/', UserHistoryView , name='user_game_history'), # PATCH and quaryset
    # path('delete_account/', UserHistoryView , name='user_game_history'), # DELETE


### TODO add loging for last time logged in and online status
### make signals to detect post save for game model to create a match history object for it
### test that the display name is unique and confirm changes and test errors
]

#####
