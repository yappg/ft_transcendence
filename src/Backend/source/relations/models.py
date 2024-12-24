from django.db import models
from accounts.models import Player

class Friends(models.Model):
    friend_requester = models.ForeignKey(Player, related_name='friend_requests_sent', on_delete=models.CASCADE)
    friend_responder = models.ForeignKey(Player, related_name='friend_requests_received', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.friend_requester} and {self.friend_responder} are friends"

    class Meta:
        verbose_name = 'Friend'
        verbose_name_plural = 'Friends'
        unique_together = ('friend_requester', 'friend_responder')

    def get_friend(self, player):
        if self.friend_requester == player:
            return self.friend_responder
        return self.friend_requester

    def save(self, *args, **kwargs):
        from chat.models import ChatRoom

        super().save(*args, **kwargs)

        chat_name = f"{self.friend_requester}_{self.friend_responder}_room"
        chat_exists = ChatRoom.objects.filter(name=chat_name).exists()

        if not chat_exists:
            chat = ChatRoom.objects.create(name=chat_name, friends=self)
            chat.senders.add(self.friend_requester, self.friend_responder)




# if he accept the invitation remove the fucking model and same if he declines
class FriendInvitation(models.Model):
    sender = models.ForeignKey(Player, related_name='sent_invitations', on_delete=models.CASCADE)
    receiver = models.ForeignKey(Player, related_name='received_invitations', on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('declined', 'Declined')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Friend Invitation'
        verbose_name_plural = 'Friend Invitations'
        unique_together = ('sender', 'receiver')


class BlockedUsers(models.Model):
    user = models.OneToOneField(Player, related_name='blocked_users_list', on_delete=models.CASCADE)
    blocked = models.ManyToManyField(Player, related_name='blocked_by', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user}'s blocked users"

    class Meta:
        verbose_name = 'Blocked User'
        verbose_name_plural = 'Blocked Users'

    def is_blocked(self, user):
        if self.blocked.filter(id=user.id).exists():
            return True
        return False

    def get_blocked_users(self):
        return self.blocked.all()

    def block_user(self, user_to_block):
        if user_to_block != self.user and self.is_blocked(user_to_block) == False:
            self.blocked.add(user_to_block)
            return True
        return False

    def unblock_user(self, user_to_unblock):
        if user_to_unblock in self.blocked.all():
            self.blocked.remove(user_to_unblock)
            return True
        return False


class Notification(models.Model):
    recipient = models.ForeignKey(Player, related_name='notifications', on_delete=models.CASCADE)
    Type = models.TextField(max_length=25, default='')
    message = models.TextField(max_length=255, default='Default notification')
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'

    def __str__(self):
        return f'Notification for {self.recipient.username}'
