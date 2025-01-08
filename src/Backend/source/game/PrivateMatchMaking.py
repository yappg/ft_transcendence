from channels.layers import get_channel_layer
from accounts.models import Player
from game.GameEngine import PingPongGame
from typing import Set, Dict
from channels.db import database_sync_to_async
import random

RED = '\033[31m'
GREEN = '\033[32m'
YELLOW = '\033[33m'
BLUE = '\033[34m'
VIOLET = '\033[35m'
ORANGE = '\033[36m'
PINK = '\033[37m'
RESET = '\033[0m'

class PrivateMatchMakingSystem:
    def __init__(self):
        print(f'{RED}PrivateMatchMakingSystem Initialized{RESET}')
        self.players_in_game: Set[str] = set()
        self.games: Dict[int, PingPongGame] = {}
        self.channel_layer = get_channel_layer()

    def generate_unique_game_id(self):
        import random
        while True:
            randID = random.randint(1, 2000000)
            if randID not in self.games:
                print(f'Generated Game ID: {randID}')
                return randID

    @database_sync_to_async
    def Update_players_state(self, player1_id, player2_id):
        try:
            player1_model = Player.objects.select_related('profile').get(id=player1_id)
            player2_model = Player.objects.select_related('profile').get(id=player2_id)
            player1_model.profile.status = 'ready'
            player2_model.profile.status = 'ready'
            player1_model.profile.save(update_fields=['status'])
            player2_model.profile.save(update_fields=['status'])
        except Exception as e:
            print(f'Error updating players state: {str(e)}')
            raise

    async def notify_players(self, player1, player2, game_id):
        print(f'Notifying players: {player1.username} and {player2.username}')
        await self.channel_layer.group_send(
            f'invite_group_{player1.username}',
            {
                'type': 'game_found',
                'opponent': str(player2.username),
                'opponent_id': player2.id,
                'game_id': game_id,
                'top_paddle': False,
                'message': "Game found, Get Ready to play!!"
            }
        )
        await self.channel_layer.group_send(
            f'invite_group_{player2.username}',
            {
                'type': 'game_found',
                'opponent': str(player1.username),
                'opponent_id': player1.id,
                'game_id': game_id,
                'top_paddle': True,
                'message': "Game found, Get Ready to play!!"
            }
        )
    
    async def notify_players_game_over(self, player1, player2, game_id):
        await self.channel_layer.send(
            player1.channel_name,
            {
                'type': 'game_over',
                'game_id': game_id
            }
        )
        await self.channel_layer.send(
            player2.channel_name,
            {
                'type': 'game_over',
                'game_id': game_id
            }
        )