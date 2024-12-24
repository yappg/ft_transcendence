from django.db import models
from accounts.models import Player
from chat.models import ChatRoom

class Friends(models.Model):
    friend_requester = models.ForeignKey(Player, related_name='friend_requests_sent', on_delete=models.CASCADE)
    friend_responder = models.ForeignKey(Player, related_name='friend_requests_received', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('friend_requester', 'friend_responder')
        
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        chat_name = f"{self.friend_requester}_{self.friend_responder}_room"
        chat_exists = ChatRoom.objects.filter(name=chat_name).exists()

        if not chat_exists:
            chat = ChatRoom.objects.create(name=chat_name)
            chat.senders.add(self.friend_requester, self.friend_responder) 
        
    

class FriendInvitation(models.Model):
    sender = models.ForeignKey(Player, related_name='sent_invitations', on_delete=models.CASCADE)
    receiver = models.ForeignKey(Player, related_name='received_invitations', on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('declined', 'Declined')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('sender', 'receiver')
    
    # def save():
        
class BlockedFriends(models.Model):
    blocker = models.ForeignKey(Player, related_name='blocked_users', on_delete=models.CASCADE)
    blocked = models.ForeignKey(Player, related_name='blocked_by', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('blocker', 'blocked')


class Notification(models.Model):
    recipient = models.ForeignKey(Player, related_name='notifications', on_delete=models.CASCADE)
    Type = models.TextField(max_length=45, default='')
    message = models.TextField(max_length=255, default='Default notification')
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Notification for {self.recipient.username}'