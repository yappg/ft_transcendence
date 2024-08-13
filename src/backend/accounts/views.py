from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Player
from .serializers import PlayerSerializer

# Create your views here.
class PlayersViewSet(viewsets.ModelViewSet):
    permission_classes=(IsAuthenticated,)
    queryset=Player.objects.all
    serializer_class=PlayerSerializer