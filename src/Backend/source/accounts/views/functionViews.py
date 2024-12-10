from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from ..models import PlayerProfile
from ..serializers.functionSerlizers import *
from ..serializers.userManagmentSerlizers import PlayerProfileSerializer

from django.core.cache import cache

class SearchUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        search_term = request.query_params.get('search', '')

        players = PlayerProfile.objects.filter(
            display_name__istartswith=search_term
        )

        serializer = SearchUsersSerializer(players, many=True)

        return Response({'count': players.count(), 'results': serializer.data}, status=status.HTTP_200_OK)


# class PlayerProfileSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = PlayerProfile
#         fields = ['display_name', 'elo_rating', 'level', 'xp', 'games_played', 'games_won', 'games_loss', 'win_ratio']

# class LeaderboardView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         leaderboard = cache.get('top_100_leaderboard')
#         if not leaderboard:
#             top_players = PlayerProfile.objects.all().order_by('-elo_rating')[:100]
#             serializer = PlayerProfileSerializer(top_players, many=True)
#             leaderboard = serializer.data
#             cache.set('top_100_leaderboard', leaderboard, timeout=60*5)  # Cache for 5 minutes
#         return Response(leaderboard, status=200)
