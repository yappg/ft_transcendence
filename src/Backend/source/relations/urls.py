from django.urls import path
from .views import FriendsListView, FriendInvitationView, BlockedFriendsView, PendingInvitationsView, AcceptInvitationView

urlpatterns = [
    path('friends/', FriendsListView.as_view(), name='friends_list'),
    path('friends/invite/', FriendInvitationView.as_view(), name='friend_invite'),
    path('friends/accept/', AcceptInvitationView.as_view(), name='accept_invite'),
    path('friends/block/', BlockedFriendsView.as_view(), name='block_friend'),
    path('friends/pending/', PendingInvitationsView.as_view(), name='pending_invitations'),
]