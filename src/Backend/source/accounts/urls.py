from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter
from .views.authViews import *
from .views.userManagment import *
from .views.functionViews import *

router = DefaultRouter()
router.register(r'profiles', PlayerProfileViewSet, basename="profiles") # /profiles/{id}
router.register(r'historys', MatchHistoryViewSet, basename="historys") # history/{id} as for (profile id)  for user game history
router.register(r'achievements', PlayerAchievementViewSet, basename="achievements") # achievements/{id} as for (profile id)  for user achivements

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

UserAchivementView = UserAchivementViewSet.as_view({
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
    path('JWT/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('JWT/token/validate/', TokenValidateView.as_view(), name='token_validate'),

#2fa
    path('2fa/generate-uri/', GenerateURI.as_view(), name='generate_uri'),
    path('2fa/verifiy-otp/', VerifyOTP.as_view(), name='verify_otp'),
    path('2fa/validate-otp/', ValidateOTP.as_view(), name='validate_otp'),
    path('2fa/disable-otp/', DisableOTP.as_view(), name='disable_otp'),

# restful endpoints
    path('rest-', include(router.urls), name='users-restful endpoints'),

# user-management
    path('user-player/', UpdateUserInfos.as_view(), name='UpdateInfos'),
    path('user-profile/', UserProfileView , name='user_profile'),
    path('user-settings/', UserSettingsView , name='user_settings'),
    path('user-history/', UserHistoryView , name='user_game_history'),
    path('user-achievements/', UserAchivementView , name='user_achievements'),

# search views
    path ('search-users/', SearchUsersView.as_view(), name='search_users'),
    # path ('search-friends', Search)

    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    # path('settings/', SettingsView.as_view(), name='settings'),
    # path('oauth/login/google/', GoogleLoginView.as_view(), name='google_login'),


# TODO disable_account, delete_account
    # path('disable_account/', UserHistoryView , name='user_game_history'),
    # path('delete_account/', UserHistoryView , name='user_game_history'),

]
# TODO auth with Oauth username And Vice #########
