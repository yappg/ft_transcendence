from django.urls import path, include
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

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

#upload media UpdateUserInfos0
    path('upload/update-user-infos/',UpdateUserInfos.as_view(), name='update_infos'),

#list users
    path('list/all/', PlayersViewList.as_view(), name='playersList'),

    path('accountREST/', include('accounts.urlss.player_urls')),
]
