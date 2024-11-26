from django.db import models
from accounts.models import Player

# Create your models here.
class Friends(models.Model):
    friend_requester = models.ForeignKey(Player, related_name='friend_requests_sent', on_delete=models.CASCADE)
    friend_responder = models.ForeignKey(Player, related_name='friend_requests_received', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('friend_requester', 'friend_responder')

class FriendInvitation(models.Model):
    sender = models.ForeignKey(Player, related_name='sent_invitations', on_delete=models.CASCADE)
    receiver = models.ForeignKey(Player, related_name='received_invitations', on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('declined', 'Declined')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('sender', 'receiver')

class BlockedFriends(models.Model):
    blocker = models.ForeignKey(Player, related_name='blocked_users', on_delete=models.CASCADE)
    blocked = models.ForeignKey(Player, related_name='blocked_by', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('blocker', 'blocked')
