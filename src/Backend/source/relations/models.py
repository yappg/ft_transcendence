from django.db import models
from accounts.models import Player
from django.core.exceptions import ValidationError
from django.db.models import Q

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
        indexes = [
            models.Index(fields=['friend_requester', 'created_at']),
            models.Index(fields=['friend_responder', 'created_at']),
        ]

    def get_friend(self, player):
        if self.friend_requester == player:
            return self.friend_responder
        return self.friend_requester

    def save(self, *args, **kwargs):
        from chat.models import ChatRoom

        if self.friend_requester == self.friend_responder:
            raise ValidationError("Cannot be friends with yourself")

        super().save(*args, **kwargs)
        
        try:        
            chat_room = ChatRoom.objects.filter(name=f"{self.friend_requester.username}_{self.friend_responder.username}_room").first()
            chat_room_reverse = ChatRoom.objects.filter(name=f"{self.friend_responder.username}_{self.friend_requester.username}_room").first()

            if not chat_room and not chat_room_reverse:
                chat_room = ChatRoom.objects.create(name=f"{self.friend_requester.username}_{self.friend_responder.username}_room")
                chat_room.senders.add(self.friend_requester, self.friend_responder)
                chat_room.save()
        except ChatRoom.DoesNotExist:
            pass
        

class FriendInvitation(models.Model):
    sender = models.ForeignKey(Player, related_name='sent_invitations', on_delete=models.CASCADE)
    receiver = models.ForeignKey(Player, related_name='received_invitations', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"sender = {self.sender} | reciver = {self.receiver}"

    class Meta:
        verbose_name = 'Friend Invitation'
        verbose_name_plural = 'Friend Invitations'
        unique_together = ('sender', 'receiver')

    def clean(self):
        if self.sender == self.receiver:
            raise ValidationError("Cannot send invitation to yourself")

        if Friends.objects.filter(
            Q(friend_requester=self.sender, friend_responder=self.receiver) |
            Q(friend_requester=self.receiver, friend_responder=self.sender)
        ).exists():
            raise ValidationError("Users are already friends")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


class BlockedUsers(models.Model):
    user = models.OneToOneField(Player, related_name='blocked_users_list', on_delete=models.CASCADE)
    blocked = models.ManyToManyField(Player, related_name='blocked_by', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user}"

    class Meta:
        verbose_name = 'Blocked User'
        verbose_name_plural = 'Blocked Users'
        indexes = [
            models.Index(fields=['user', 'created_at']),
        ]

    def is_blocked(self, user):
        if self.blocked.filter(id=user.id).exists():
            return True
        return False

    def get_blocked_users(self):
        return self.blocked.all()

    def block_user(self, user_to_block):
        if (user_to_block != self.user and
            user_to_block.profile and
            not self.blocked.filter(id=user_to_block.id).exists()):
            self.blocked.add(user_to_block)
            return True
        return False

    def unblock_user(self, user_to_unblock):
        if self.blocked.filter(id=user_to_unblock.id).exists():
            self.blocked.remove(user_to_unblock)
            return True
        return False


class Notification(models.Model):
    recipient = models.ForeignKey(Player, related_name='notifications', on_delete=models.CASCADE)
    Type = models.TextField(max_length=45, default='')
    message = models.TextField(max_length=255, default='Default notification')
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'

    def __str__(self):
        return f'Notification for {self.recipient.username}'
