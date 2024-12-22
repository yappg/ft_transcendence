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
            message=f'You have a new friend invitation from {instance.sender.username}',
            Type=Notification_Type.FRIEND_REQUEST.value
        )

# @receiver(post_save, sender=Friends)
# def create_friend_request_notification(sender, instance, created, **kwargs):
#     if created:
#         Notification.objects.create(
#             recipient=instance.friend_responder,
#             message=f'You are now friends with {instance.friend_requester.username}',
#             Type=Notification_Type.FRIEND_REQUEST.value
#         )

# @receiver(post_save, sender=Message)
# def incoming_messages(sender, instance, created, **kwargs):
#     print('instance dzbi:  ---------',instance.receiver.id)
#     if created:
#         Notification.objects.create(
#             recipient=instance.receiver,
#             message=f'You have a New message from {instance.sender.username}',
#             Type=Notification_Type.MESSAGE.value
#         )


@receiver(post_save, sender=Notification)
def send_notification_via_websocket(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    group_name = f'notifications_{instance.recipient.id}'


    print(f'DEBUG: Sending notification to group {group_name}')
    print(f'DEBUG: Notification message: {instance.message}')
    print(f'DEBUG: Notification type: {instance.Type}')
    print(f'DEBUG: Notification created_at: {instance.created_at}')
    print(f'DEBUG: Notification read status: {instance.read}')
    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            'type': 'send_notification',
            'notification': {
                'message': instance.message,
                'Type': instance.Type,
                'created_at': instance.created_at.isoformat(),
                'read': instance.read,
            }
        }
    )