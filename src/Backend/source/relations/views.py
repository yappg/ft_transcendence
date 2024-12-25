from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework import status
from .models import *
from .serializers import *
from drf_yasg.utils import swagger_auto_schema
from django.db.models import Q
from accounts.serializers.userManagmentSerlizers import PlayerRelationsSerializer


class NotificationListView(ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user).order_by('-created_at')


class PlayerListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from accounts.models import PlayerProfile
        profiles = PlayerProfile.objects.get(player=request.user)
        friends = profiles.all_friends()

        players = Player.objects.filter(profile__isnull=False).exclude(profile__in=friends)[:10]
        serializer = PlayerRelationsSerializer(players, many=True)
        return Response({'message': 'Success', 'data': serializer.data})

class FriendsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        friends = Friends.objects.filter(
            Q(friend_requester=user) | Q(friend_responder=user)
        ).distinct()

        unique_friends = []
        seen_pairs = set()
        for friend in friends:
            pair = tuple(sorted([friend.friend_requester.username, friend.friend_responder.username]))
            if pair not in seen_pairs:
                seen_pairs.add(pair)
                unique_friends.append(friend)

        if not unique_friends:
            return Response({"error": "No Friends Found"}, status=200)

        serializer = FriendsSerializer(unique_friends, many=True)
        return Response({'message': 'Success', 'data': serializer.data})

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
        pending_invitations = FriendInvitation.objects.filter(receiver=user, status='pending')
        if not pending_invitations:
            return Response({"error": "No Invitaions Found"}, status=200);
        serializer = FriendInvitationSerializer(pending_invitations, many=True)
        return Response({'message': 'Success', 'data': serializer.data})

    def delete(self, request):
        user = request.user
        decline_pending = request.data.get('decline_pending')
        player = Player.objects.get(profile__display_name=decline_pending)
        deleted = FriendInvitation.objects.filter(receiver=user, sender=player).delete()
        if deleted:
            return Response({"message": "Invitation declined"}, status=status.HTTP_200_OK)
        return Response({"error": "Invitation not found"}, status=status.HTTP_404_NOT_FOUND)

class FriendInvitationView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        request_body=FriendInvitationSerializer,
        responses={200: 'Success', 400: 'Invalid input'}
    )

    def post(self, request):
        sender = request.user
        receiver_display_name = request.data.get('receiver')
        try:
            receiver = Player.objects.get(profile__display_name=receiver_display_name)
        except Player.DoesNotExist:
            return Response({"error": "User not found"}, status=200)

        if sender == receiver:
            return Response({"error": "You cannot send a friend request to yourself"}, status=200)

        # Check if they are already friends
        if Friends.objects.filter(
            (Q(friend_requester=sender) & Q(friend_responder=receiver)) |
            (Q(friend_requester=receiver) & Q(friend_responder=sender))
        ).exists():
            return Response({"error": "You are already friends"}, status=200)

        invitation, created = FriendInvitation.objects.get_or_create(sender=sender, receiver=receiver)
        if not created:
            return Response({"error": "Friend request already sent"}, status=200)

        serializer = FriendInvitationSerializer(invitation)
        return Response({"message":"Invitation sent","data":serializer.data}, status=status.HTTP_201_CREATED)

    def delete(self, request):
        sender = request.user
        receiver_display_name = request.data.get('cancel_invite')
        try:
            receiver = Player.objects.get(profile__display_name=receiver_display_name)
        except Player.DoesNotExist:
            return Response({"error": "User not found"}, status=200)

        FriendInvitation.objects.filter(sender=sender, receiver=receiver).delete()
        return Response({"message": "Invitation canceled"}, status=status.HTTP_200_OK)



class AcceptInvitationView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        request_body=FriendInvitationSerializer,
        responses={200: 'Success', 400: 'Invalid input'}
    )
    def post(self, request):
        receiver = request.user
        sender_display_name = request.data.get('sender')
        try:
            sender = Player.objects.get(profile__display_name=sender_display_name)
        except Player.DoesNotExist:
            return Response({"error": "User not found"}, status=200)

        invitation = FriendInvitation.objects.filter(sender=sender, receiver=receiver, status='pending').first()
        if not invitation:
            return Response({"error": "Invitation not found or already accepted"}, status=200)


        invitation.delete()
        # invitation.status = 'accepted'
        # invitation.save()
#########################

        Friends.objects.create(friend_requester=sender, friend_responder=receiver)

        return Response({"message": "Invitation accepted and friendship established"}, status=status.HTTP_200_OK)


class BlockedUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        blocked_users = BlockedUsers.objects.get(user=user)
        blocked_list = blocked_users.get_blocked_users()

        serializer = PlayerRelationsSerializer(blocked_list, many=True)
        return Response(serializer.data)

    def patch(self, request):
        blocker = request.user
        blocked_display_name = request.data.get('block_user')

        try:
            blocked = Player.objects.get(profile__display_name=blocked_display_name)
        except Player.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        block_list = BlockedUsers.objects.get(user=blocker)
        if block_list.block_user(blocked):
            return Response({"message": "User blocked successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": "User already blocked"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        blocker = request.user
        blocked_display_name = request.data.get('unblock_user')

        try:
            blocked = Player.objects.get(profile__display_name=blocked_display_name)
        except Player.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        block_list = BlockedUsers.objects.get(user=blocker)
        if block_list.unblock_user(blocked):
            return Response({"message": "User unblocked successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "User not blocked"}, status=status.HTTP_400_BAD_REQUEST)
