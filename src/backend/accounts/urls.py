from django.urls import path, include
from .views import SignInView, SignUpView, OAuth42LoginView, OAuth42CallbackView, LogoutView , PlayersViewList
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('login/<slug:provider>/', OAuth42LoginView.as_view(), name='oauth_login'),
    path('callback/<slug:provider>/', OAuth42CallbackView.as_view(), name='oauth_callback'),
    path('signup/', SignUpView.as_view(), name='signup'),
    path('signin/', SignInView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('all/', PlayersViewList.as_view(), name='playersList'),
    path('token/', TokenObtainPairView.as_view(), name='token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token'),
]
