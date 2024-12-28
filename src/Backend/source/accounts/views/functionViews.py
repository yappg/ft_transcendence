from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from ..models import PlayerProfile
from ..serializers.functionSerlizers import *

class SearchUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        search_term = request.query_params.get('search', '').strip()

        if not search_term:
            return Response({'message': 'Search term is required'}, status=status.HTTP_400_BAD_REQUEST)
        if len(search_term) > 50:
            return Response({'message': 'Search term too long'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            players = PlayerProfile.objects.filter(
                display_name__istartswith=search_term
            ).exclude(player=request.user)[:10] # exlude block list

            serializer = SearchUsersSerializer(players, many=True)
            return Response({
                'count': len(players),
                'results': serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'message': 'An error occurred while searching users'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LeaderboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            top_players = PlayerProfile.objects.all().order_by(
                '-win_ratio',
                '-total_games',
                '-level',
                '-games_won'
            )[:100]

            serializer = LeaderBoardSerializer(top_players, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'message': 'An error occurred while fetching leaderboard'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
