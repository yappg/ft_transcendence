from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import render
from accounts.models import Player, Friends

class LobbyView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        friends = Friends.objects.filter(friend_requester=user) | Friends.objects.filter(friend_responder=user)
        friends_list = []

        for friend in friends:
            if friend.friend_requester == user:
                friends_list.append(friend.friend_responder)
            else:
                friends_list.append(friend.friend_requester)

        context = {
            'friends': friends_list
        }
        return render(request, 'lobby.html', context)