from django.db import models
from accounts.models import Player

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


class Notification(models.Model):
    recipient = models.ForeignKey(Player, related_name='notifications', on_delete=models.CASCADE)
    sender = models.ForeignKey(Player, related_name='sent_notifications', on_delete=models.CASCADE)
    message = models.TextField(max_length=255, default='Default notification')
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Notification for {self.recipient.username}'