from dataclasses import dataclass
from channels.layers import get_channel_layer
from channels.db import database_sync_to_async
from django_redis import get_redis_connection
from typing import Dict, Set
import asyncio
from .GameEngine import GamePlayer, PingPongGame
from .models import Game
from accounts.models import Player, PlayerProfile
import uuid

RED_BOLD = '\033[31;1m'
YELLOW_BOLD = '\033[33;1m'
GREEN_BOLD = '\033[32;1m'
BLUE_BOLD = '\033[34;1m'
VIOLET_BOLD = '\033[35;1m'
RESET = '\033[0m'

class MatchMakingSystem:
    def __init__(self):
        print(f'{RED_BOLD}MatchMakingSystem Initialized{RESET}')
        self.players_queue: Dict[int, GamePlayer] = {}
        self.players_in_game: Set[int] = set()
        self.games: Dict[int, PingPongGame] = {}
        self._matchmaking_task = None
        self.channel_layer = get_channel_layer()
        self._running = False

    async def start(self):
        if not self._running:
            self._running = True
            self._matchmaking_task = asyncio.create_task(self.matchmaking_loop())
            print(f'{RED_BOLD}Matchmaking System Started{RESET}')

    def generate_unique_game_id(self):
        import random
        import sys

        while True:
            randID = random.randint(1, 2000000)
            if randID not in self.games:
                print (f'Generated Game ID: {randID}')
                return randID

    async def matchmaking_loop(self):
        i = 0
        while self._running:
            try:
                if i % 10 == 0:
                    print('Matchmaking Loop')
                    print(f'Players in Queue: {len(self.players_queue)}')
                    print(f'Players in Game: {len(self.players_in_game)}')
                    print(f'Players in Game: {self.players_in_game}')  
                    print(f'Players indices in Queue: {self.players_queue.keys()}')
                    print(f'Games in Progress: {len(self.games)}')

                if len(self.players_queue) >= 2:
                    player_items = list(self.players_queue.items())[:2]
                    player1_id, player1 = player_items[0]
                    player2_id, player2 = player_items[1]

                    try:
                        await self.Update_players_state(player1_id, player2_id)
                        game_ID = self.generate_unique_game_id()
                        print(f'{YELLOW_BOLD}Game created AM here ID: {game_ID}{RESET}')
                        new_game = PingPongGame(player1, player2, gameID=game_ID)

                        self.games[new_game.game_id] = new_game
                        print(f'{YELLOW_BOLD}Game created AM here ID: {new_game.game_id}{RESET}')

                        del self.players_queue[player1_id]
                        del self.players_queue[player2_id]
                        self.players_in_game.add(player1_id)
                        self.players_in_game.add(player2_id)
                        await self.channel_layer.group_add(f'game_{new_game.game_id}', player1.channel_name)
                        await self.channel_layer.group_add(f'game_{new_game.game_id}', player2.channel_name)
                        print(f'{VIOLET_BOLD}Game created POAOAOAPAOPAOAss ID: {new_game.game_id}{RESET}')
                        await self.notify_players(player1, player2, new_game.game_id)
                    except Exception as e:
                        print(f'Error creating game: {str(e)}')
                i += 1
                await asyncio.sleep(1)
            except Exception as e:
                print(f'{RED_BOLD}Error in matchmaking loop: {str(e)}{RESET}')
                await asyncio.sleep(1)

    # --------------------------->>>>>>>>game invite<<<<<<<<<<<<<---------------------------

    

    # --------------------------->>>>>>>>UTILS<<<<<<<<<<<<<---------------------------
    @database_sync_to_async
    def Update_players_state(self, player1_id, player2_id):
        try :
            player1_model = Player.objects.select_related('profile').get(id=player1_id)
            player2_model = Player.objects.select_related('profile').get(id=player2_id)
            player1_model.profile.status = 'ready'
            player2_model.profile.status = 'ready'
            player1_model.profile.save(update_fields=['status'])
            player2_model.profile.save(update_fields=['status'])
        except Exception as e:
            #TODO handle the exception
            print(f'Error Match_making; updating players state: {str(e)}')
            pass 

    # --------------------------->>>>>>>>CHANNEL METHODS<<<<<<<<<<<<<---------------------------
    async def notify_players(self, player1, player2, game_id):
        print(f'Notifying players: {player1.username} and {player2.username}')
        await self.channel_layer.send(
            player1.channel_name,
            {
                'type': 'game.found',
                'opponent': str(player2.username),
                'opponent_id': player2.id,
                'top_paddle': False,
                'game_id': game_id,
                'message': "Game found, Get Ready to play!!"
            }
        )
        await self.channel_layer.send(
            player2.channel_name,
            {
                'type': 'game.found',
                'opponent': str(player1.username),
                'opponent_id': player1.id,
                'game_id': game_id,
                'top_paddle': True,
                'message': "Game found, Get Ready to play!!"
            }
        )

    async def add_player_to_queue(self, player_id, username, channel_name):
        if player_id in self.players_queue:
            print(f'Player {player_id} already in Queue')
            return
        print(f'Adding player to queue: {player_id}')
        self.players_queue[player_id] = GamePlayer(player_id, username, channel_name)

    async def remove_player_from_queue(self, player_id):
        if player_id in self.players_queue:
            del self.players_queue[player_id]
    

