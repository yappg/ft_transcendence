from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from django.db.models import Q

from ..models import PlayerProfile
from ..serializers import SearchUsersSerializer

class SearchUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get search query from request parameters
        search_term = request.query_params.get('search', '') #?search=

        players = PlayerProfile.objects.filter(
            player__username__icontains=search_term
        )

        serializer = SearchUsersSerializer(players, many=True)

        return Response({'count': players.count(), 'results': serializer.data}, status=status.HTTP_200_OK)
