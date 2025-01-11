from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework import status
from .models import *
from .serializers import *
from django.db.models import Q
from accounts.serializers.userManagmentSerlizers import PlayerRelationsSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from chat.models import ChatRoom

class NotificationListView(ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            return Notification.objects.filter(recipient=self.request.user, read=False).order_by('-created_at')
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        try:
            Notification.objects.filter(recipient=request.user).update(read=True)
            return Response({'message': 'All notifications marked as read'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class FriendsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            from accounts.models import PlayerProfile
            from accounts.serializers.userManagmentSerlizers import FriendsSerializer

            user = request.user
            profile = PlayerProfile.objects.get(player=user)
            friends = profile.all_friends()

            serializer = FriendsSerializer(friends, many=True)
            return Response({'message': 'Success', 'data': serializer.data})
        except PlayerProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request):
        user = request.user
        remove_friend = request.data.get('remove_friend')

        try:
            remove_player = Player.objects.get(profile__display_name=remove_friend)

            if remove_player == user:
                return Response({"error": "You cannot remove yourself"}, status=status.HTTP_400_BAD_REQUEST)

            Friends.objects.filter(
                Q(friend_requester=user, friend_responder=remove_player) |
                Q(friend_requester=remove_player, friend_responder=user)
            ).delete()

            return Response({"message": "Friend removed"}, status=status.HTTP_200_OK)
        except Player.DoesNotExist:
            return Response({"error": "Player not found"}, status=status.HTTP_404_NOT_FOUND)

class PendingInvitationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        pending_invitations = FriendInvitation.objects.filter(receiver=user)
        if not pending_invitations:
            return Response({"error": "No Invitaions Found"}, status=200);
        serializer = FriendPendingSerializer(pending_invitations, many=True)
        return Response({'message': 'Success', 'data': serializer.data})

    def delete(self, request):
        user = request.user
        decline_pending = request.data.get('decline_pending')

        if not decline_pending:
            return Response({"error": "Missing decline_pending parameter"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            player = Player.objects.get(profile__display_name=decline_pending)
        except Player.DoesNotExist:
            return Response({"error": "Player not found"}, status=status.HTTP_404_NOT_FOUND)

        invitation = FriendInvitation.objects.filter(receiver=user, sender=player).first()
        if not invitation:
            return Response({"error": "No pending invitation found from this player"}, status=status.HTTP_404_NOT_FOUND)

        invitation.delete()
        return Response({"message": "Friend invitation declined successfully"}, status=status.HTTP_200_OK)


class FriendInvitationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            invitations = FriendInvitation.objects.filter(receiver=user)
        except FriendInvitation.DoesNotExist:
            return Response({"error": "No Invitations Found"}, status=200)
        serializer = FriendInvitationSerializer(invitations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        sender = request.user
        receiver_display_name = request.data.get('receiver')

        if not receiver_display_name:
            return Response({"error": "Missing receiver parameter"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            receiver = Player.objects.get(profile__display_name=receiver_display_name)
        except Player.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if sender == receiver:
            return Response({"error": "You cannot send a friend request to yourself"}, status=status.HTTP_400_BAD_REQUEST)

        if FriendInvitation.objects.filter(
            Q(sender=sender , receiver=receiver) |
            Q(sender=receiver , receiver=sender)
        ).exists():
            return Response({"error": "you already sent an invitation to this user"}, status=status.HTTP_400_BAD_REQUEST)

        if Friends.objects.filter(
            Q(friend_requester=sender , friend_responder=receiver) |
            Q(friend_requester=receiver , friend_responder=sender)
        ).exists():
            return Response({"error": "You are already friends"}, status=status.HTTP_400_BAD_REQUEST)

        if BlockedUsers.objects.filter(
            Q(user=sender, blocked=receiver) |
            Q(user=receiver, blocked=sender)
        ).exists():
            return Response({"error": "cant invite blocked user"}, status=status.HTTP_400_BAD_REQUEST)

        created = FriendInvitation.objects.get_or_create(sender=sender, receiver=receiver)
        if not created:
            return Response({"error": "Friend request already sent"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = FriendInvitationSerializer(created)
        return Response({"message":"Invitation sent","data":serializer.data}, status=status.HTTP_201_CREATED)

    def delete(self, request):
        sender = request.user
        receiver_display_name = request.data.get('cancel_invite')

        try:
            receiver = Player.objects.get(profile__display_name=receiver_display_name)
        except Player.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        invitation = FriendInvitation.objects.filter(sender=sender, receiver=receiver).first()
        if not invitation:
            return Response({"error": "Invitation not found"}, status=status.HTTP_404_NOT_FOUND)

        invitation.delete()
        return Response({"message": "Invitation canceled"}, status=status.HTTP_200_OK)

class AcceptInvitationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        receiver = request.user
        sender_display_name = request.data.get('sender')
        try:
            sender = Player.objects.get(profile__display_name=sender_display_name)
        except Player.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        invitation = FriendInvitation.objects.filter(sender=sender, receiver=receiver).first()
        if not invitation:
            return Response({"error": "Invitation not found or already accepted"}, status=status.HTTP_400_BAD_REQUEST)

        invitation.delete()
        Friends.objects.create(friend_requester=sender, friend_responder=receiver)

        return Response({"message": "Invitation accepted and friendship established"}, status=status.HTTP_200_OK)


class BlockedUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            blocked_users = BlockedUsers.objects.get(user=user)
            blocked_list = blocked_users.get_blocked_users()
            serializer = PlayerRelationsSerializer(blocked_list, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'An error occurred'}, status=status.HTTP_400_BAD_REQUEST)


    def patch(self, request):
        blocker = request.user
        blocked_display_name = request.data.get('block_user')

        if not blocked_display_name:
            return Response({"error": "No user specified to block"}, status=status.HTTP_400_BAD_REQUEST)

        if blocked_display_name == blocker.profile.display_name:
            return Response({"error": "Cannot block yourself"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            blocked = Player.objects.get(profile__display_name=blocked_display_name)
        except Player.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            block_list = BlockedUsers.objects.get(user=blocker)
        except BlockedUsers.DoesNotExist:
            return Response({"error": "Block list not found"}, status=status.HTTP_404_NOT_FOUND)

        if block_list.block_user(blocked):
            Friends.objects.filter(
                Q(friend_requester=blocker, friend_responder=blocked) |
                Q(friend_requester=blocked, friend_responder=blocker)
            ).delete()

            FriendInvitation.objects.filter(
                Q(sender=blocker, receiver=blocked) |
                Q(sender=blocked, receiver=blocker)
            ).delete()
            try:
                chat = ChatRoom.objects.filter(name=f"{blocker.username}_{blocked.username}_room").first()
                if not chat:
                    chat = ChatRoom.objects.filter(name=f"{blocked.username}_{blocker.username}_room").first()
            except ChatRoom.DoesNotExist:
                return Response({"error": "Chat room not found"}, status=status.HTTP_404_NOT_FOUND)

            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f"chat_{chat.id}",
                {
                    "type": "user_blocked",
                    "chat_id": chat.id
                    }
                )

            return Response({"message": "User blocked successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "User is already blocked"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        blocker = request.user
        blocked_display_name = request.data.get('unblock_user')

        try:
            blocked = Player.objects.get(profile__display_name=blocked_display_name)
            block_list = BlockedUsers.objects.get(user=blocker)
        except Player.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except BlockedUsers.DoesNotExist:
            return Response({"error": "Block list not found"}, status=status.HTTP_404_NOT_FOUND)
        if block_list.unblock_user(blocked):
            try:
                chat = ChatRoom.objects.filter(name=f"{blocker.username}_{blocked.username}_room").first()
                if not chat:
                    chat = ChatRoom.objects.filter(name=f"{blocked.username}_{blocker.username}_room").first()
            except ChatRoom.DoesNotExist:
                return Response({"error": "Chat room not found"}, status=status.HTTP_404_NOT_FOUND)
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f"chat_{chat.id}",
                {
                    "type": "user_blocked",
                    "chat_id": chat.id
                }
            )
            return Response({"message": "User unblocked successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "User not blocked"}, status=status.HTTP_400_BAD_REQUEST)
