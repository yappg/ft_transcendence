from django.urls import path, include
from .views import OAuth42LoginView, OAuth42CallbackView
from . import views

urlpatterns = [
    path('login/<slug:provider>/', OAuth42LoginView.as_view(), name='oauth_login'),
    path('callback/<slug:provider>/', OAuth42CallbackView.as_view(), name='oauth_callback'),

    path('', views.PlayersViewSet.as_view({'get': 'list'})),
]
    # path('42/login/', OAuth42LoginView.as_view(), name='oauth_login'),
    # path('42/callback/', OAuth42CallbackView.as_view(), name='oauth_callback'),

