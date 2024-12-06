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
        print(f"request.user: {request.user}")
        players = Player.objects.exclude(
            Q(id=request.user.id) |
            Q(id__in=request.user.friend_requester) |
            Q(id__in=request.user.friend_responder)
        )
        serializer = PlayerSerializer(players, many=True)
        return Response(serializer.data)

class FriendsListView(APIView):
    permission_classes = [IsAuthenticated]
    

    def get(self, request):
        user = request.user
        friends = Friends.objects.filter(Q(friend_requester=user) | Q(friend_responder=user))
        serializer = FriendsSerializer(friends, many=True)
        return Response(serializer.data)

class PendingInvitationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        pending_invitations = FriendInvitation.objects.filter(receiver=user, status='pending')
        serializer = FriendInvitationSerializer(pending_invitations, many=True)
        return Response(serializer.data)

class BlockedFriendsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        blocked_users = BlockedFriends.objects.filter(blocker=user)
        blocked_list = [block.blocked for block in blocked_users]
        serializer = PlayerSerializer(blocked_list, many=True)
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
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if sender == receiver:
            return Response({"error": "You cannot send a friend request to yourself"}, status=status.HTTP_400_BAD_REQUEST)

        invitation, created = FriendInvitation.objects.get_or_create(sender=sender, receiver=receiver)
        if not created:
            return Response({"error": "Friend request already sent"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = FriendInvitationSerializer(invitation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


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
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        invitation = FriendInvitation.objects.filter(sender=sender, receiver=receiver, status='pending').first()
        if not invitation:
            return Response({"error": "Invitation not found or already accepted"}, status=status.HTTP_400_BAD_REQUEST)

        invitation.status = 'accepted'
        invitation.save()
        

        # Create a new Friends object to establish the friendship
        Friends.objects.create(friend_requester=sender, friend_responder=receiver)

        return Response({"message": "Invitation accepted and friendship established"}, status=status.HTTP_200_OK)