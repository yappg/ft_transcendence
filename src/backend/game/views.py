from django.shortcuts import render

from rest_framework import viewsets
from .models import Game
from rest_framework.response import Response
from .serializers import GameSerializer
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated


class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'])
    def update_score(self, request, pk=None):
        game = self.get_object()
        player = request.data.get('player')
        if player == 'player1':
            game.player1_score += 1
        elif player == 'player2':
            game.player2_score += 1
        game.save()
        return Response({'status': 'score updated'})

    @action(detail=True, methods=['post'])
    def end_game(self, request, pk=None):
        game = self.get_object()
        game.is_active = False
        game.save()
        return Response({'status': 'game ended'})
    