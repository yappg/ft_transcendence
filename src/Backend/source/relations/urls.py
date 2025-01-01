from django.urls import path
from .views import *

urlpatterns = [
    # path('players/', PlayerListView.as_view(), name='players_list'),
    path('friends/', FriendsListView.as_view(), name='friends_list'),
    path('friends/pending/', PendingInvitationsView.as_view(), name='pending_invitations'),
    path('friends/invite/', FriendInvitationView.as_view(), name='friend_invite'),
    path('friends/accept/', AcceptInvitationView.as_view(), name='accept_invite'),

    path('notifications/', NotificationListView.as_view(), name='notification_list'),
    path('friends/block/', BlockedUsersView.as_view(), name='block_user'),
]
