from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework import status
from .models import *
from .serializers import *
from drf_yasg.utils import swagger_auto_schema
from django.db.models import Q




class NotificationListView(ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user).order_by('-created_at')



class PlayerListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        print(f"request.user---->: {user}")
        # Exclude the current user, users who have sent friend requests to the current user,
        # users who have received friend requests from the current user, and users who are already friends

        friends_ids = Friends.objects.filter(
            Q(friend_requester=user) | Q(friend_responder=user)
        ).values_list('friend_requester_id', 'friend_responder_id')
        
        friend_invitation_ids = FriendInvitation.objects.filter(
            Q(sender=user) | Q(receiver=user)
        ).values_list('sender_id', 'receiver_id')
        
        friends_ids = set([item for sublist in friends_ids for item in sublist if item != user.id])
        friend_invitation_ids = set([item for sublist in friend_invitation_ids for item in sublist if item != user.id])
        
        players = Player.objects.exclude(
            Q(id=user.id) |
            Q(id__in=friends_ids)|
            Q(id__in=friend_invitation_ids)
        )
        serializer = PlayerSerializer(players, many=True) ##############
        return Response({'message': 'Success', 'data': serializer.data})

class FriendsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        friends = Friends.objects.filter(
            Q(friend_requester=user) | Q(friend_responder=user)
        ).distinct()

        # Filter to ensure each friendship is only included once
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

class PendingInvitationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        # fix later
        pending_invitations = FriendInvitation.objects.filter(receiver=user, status='pending')
        if not pending_invitations:
            Response({"error": "No Invitaions Found"}, status=200);
        serializer = FriendInvitationSerializer(pending_invitations, many=True)
        return Response({'message': 'Success', 'data': serializer.data})

class BlockedFriendsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        blocked_users = BlockedFriends.objects.filter(blocker=user)
        blocked_list = [block.blocked for block in blocked_users]
        serializer = PlayerSerializer(blocked_list, many=True) ##############
        return Response(serializer.data)

    def post(self, request):
        blocker = request.user
        blocked_username = request.data.get('blocked')
        try:
            blocked = Player.objects.get(username=blocked_username)
        except Player.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if blocker == blocked:
            return Response({"error": "You cannot block yourself"}, status=status.HTTP_400_BAD_REQUEST)

        block, created = BlockedFriends.objects.get_or_create(blocker=blocker, blocked=blocked)
        if not created:
            return Response({"error": "User already blocked"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = BlockedFriendsSerializer(block)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class FriendInvitationView(APIView):
    permission_classes = [IsAuthenticated]
    
    @swagger_auto_schema(
        request_body=FriendInvitationSerializer,
        responses={200: 'Success', 400: 'Invalid input'}
    )
    def post(self, request):
        sender = request.user
        receiver_username = request.data.get('receiver')
        try:
            receiver = Player.objects.get(username=receiver_username)
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


class AcceptInvitationView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        request_body=FriendInvitationSerializer,
        responses={200: 'Success', 400: 'Invalid input'}
    )
    def post(self, request):
        receiver = request.user
        sender_username = request.data.get('sender')
        try:
            sender = Player.objects.get(username=sender_username)
        except Player.DoesNotExist:
            return Response({"error": "User not found"}, status=200)

        invitation = FriendInvitation.objects.filter(sender=sender, receiver=receiver, status='pending').first()
        if not invitation:
            return Response({"error": "Invitation not found or already accepted"}, status=200)
        
        
        invitation.status = 'accepted'
        invitation.save()
        
        # chat_name = f"{current_user}_{friend}_room"
        # chat = ChatRoom.objects.filter(name=chat_name).first()

        # if chat is None:
        #     chat = ChatRoom.objects.create(name=chat_name)
        #     chat.senders.add(current_user, friend)

        # Create a new Friends object to establish the friendship
        Friends.objects.create(friend_requester=sender, friend_responder=receiver)

        return Response({"message": "Invitation accepted and friendship established"}, status=status.HTTP_200_OK)