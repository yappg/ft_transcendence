from django.urls import path, include
from .views import SignInView, SignUpView, OAuth42LoginView, OAuth42CallbackView, LogoutView , PlayersViewList
urlpatterns = [
    path('login/<slug:provider>/', OAuth42LoginView.as_view(), name='oauth_login'),
    path('callback/<slug:provider>/', OAuth42CallbackView.as_view(), name='oauth_callback'),
    path('signup/', SignUpView.as_view(), name='signup'),
    path('signin/', SignInView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('all/', PlayersViewList.as_view(), name='playersList'),
]
