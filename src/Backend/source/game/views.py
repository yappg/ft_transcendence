
from django.shortcuts import render

# Create your views here.


def lobby_game(request):
    return render(request, 'game/pingpong.html')