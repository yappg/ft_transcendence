from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter
from .views.authViews import *
from .views.userManagment import *
from .views.functionViews import *

router = DefaultRouter()
router.register(r'profiles', PlayerProfileViewSet)
router.register(r'historys', MatchHistoryViewSet) # history/{id} as for (profile id)  for user game history

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
# regular auth
    path('auth/signup/', SignUpView.as_view(), name='signup'),
    path('auth/signin/', SignInView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),

# Oauth (42, Google)
    path('oauth/login/<slug:provider>/', OAuth42LoginView.as_view(), name='oauth_login'),
    path('oauth/callback/<slug:provider>/', OAuth42CallbackView.as_view(), name='oauth_callback'),

# JWT tokens
    path('JWT/token/', TokenObtainPairView.as_view(), name='token'),
    path('JWT/token/refresh/', TokenRefreshView.as_view(), name='token'),

#2fa
    path('2fa/generate-uri/', GenerateURI.as_view(), name='generate_uri'),
    path('2fa/verifiy-otp/', VerifyOTP.as_view(), name='verify_otp'),
    path('2fa/validate-otp/', ValidateOTP.as_view(), name='validate_otp'),
    path('2fa/disable-otp/', DisableOTP.as_view(), name='disable_otp'),

# user-management
    path('rest-', include(router.urls), name='users-restfulrestful endpoint'),

    path('user-profile/', UserProfileView , name='user_profile'),
    path('user-settings/', UserSettingsView , name='user_settings'),
    path('user-history/', UserHistoryView , name='user_game_history'),

    # change_password , change_email , change_username , disable_account, delete_account
    # path('change_username/',UpdateUserInfos.as_view(), name='acount-updater'), 
    # path('change_email/', UserHistoryView , name='user_game_history'), # verification confirm mail maybe in future
    # path('change_password/', UserHistoryView , name='user_game_history'), # verficiation from front
    # path('disable_account/', UserHistoryView , name='user_game_history'), #
    # path('delete_account/', UserHistoryView , name='user_game_history'), #

# search views
    path ('search-users/', SearchUsersView.as_view(), name='search_users') #?search=....
    # path ('search-friends', Search)
]

####### TODO add search functionalitty for the front with slugs
####### TODO add loging for last time logged in and online status

### make signals to detect post save for game model to create a match history object for it
### test that the display name is unique and confirm changes and test errors

#####
