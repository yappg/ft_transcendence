from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Friends, FriendInvitation, Notification
from chat.models import Message
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from enum import Enum

class Notification_Type(Enum):
    MESSAGE = 'Message'
    FRIEND_REQUEST = 'Friend Request'
    GAME_INVITE = 'Game Invite'

@receiver(post_save, sender=FriendInvitation)
def create_friend_invitation_notification(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            recipient=instance.receiver,
            message=f'You have a new friend invitation from {instance.sender.profile.display_name}',
            Type=Notification_Type.FRIEND_REQUEST.value
        )

@receiver(post_save, sender=Friends)
def create_friend_notification(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            recipient=instance.friend_requester,
            message=f'{instance.friend_responder.profile.display_name} accepted your Invitation',
            Type=Notification_Type.FRIEND_REQUEST.value
        )

@receiver(post_save, sender=Notification)
def notification_created(sender, instance, created, **kwargs):
    if created:
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"user_{instance.recipient.id}",
            {
                "type": "send_notification",
                "message": instance.message
            }
        )
