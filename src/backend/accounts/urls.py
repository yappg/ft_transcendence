from django.urls import path, include
from .views import * # SignInView, SignUpView, OAuth42LoginView, OAuth42CallbackView, LogoutView , PlayersViewList, GenerateURI, VerifyOTP, DisableOTP
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
# regular auth
    path('signup/', SignUpView.as_view(), name='signup'),
    path('signin/', SignInView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
# Oauth (42, Google)
    path('login/<slug:provider>/', OAuth42LoginView.as_view(), name='oauth_login'),
    path('callback/<slug:provider>/', OAuth42CallbackView.as_view(), name='oauth_callback'),
# JWT tokens
    path('token/', TokenObtainPairView.as_view(), name='token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token'),
#2fa
    path('generate-uri/', GenerateURI.as_view(), name='generate_uri'),
    path('verifiy-otp/', VerifyOTP.as_view(), name='verify_otp'),
    path('disable-otp/', DisableOTP.as_view(), name='disable_otp'),
#upload media UpdateUserInfos
    path('update-user-infos/',UpdateUserInfos.as_view(), name='update_infos'),

#list users
    path('all/', PlayersViewList.as_view(), name='playersList'),
]
