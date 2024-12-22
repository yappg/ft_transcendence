from dataclasses import dataclass
from channels.layers import get_channel_layer
from channels.db import database_sync_to_async
from django_redis import get_redis_connection
from typing import Dict, Tuple
import asyncio
from .GameEngine import GamePlayer, PingPongGame
from .models import Game
from accounts.models import Player

RED_BOLD = '\033[31;1m'
RESET = '\033[0m'

class MatchMakingSystem:
    def __init__(self):
        print(f'{RED_BOLD}MatchMakingSystem Initialized{RESET}')
        self.players_queue: Dict[int, GamePlayer] = {}
        self.games: Dict[int, PingPongGame] = {}
        self._matchmaking_task = None
        self._channel_layer = get_channel_layer()
        self._running = False

    async def start(self):
        """Start the matchmaking system"""
        if not self._running:
            self._running = True
            self._matchmaking_task = asyncio.create_task(self.matchmaking_loop())
            print(f'{RED_BOLD}Matchmaking System Started{RESET}')

    async def stop(self):
        """Stop the matchmaking system"""
        if self._running:
            self._running = False
            if self._matchmaking_task:
                self._matchmaking_task.cancel()
                try:
                    await self._matchmaking_task
                except asyncio.CancelledError:
                    pass
                self._matchmaking_task = None
            print(f'{RED_BOLD}Matchmaking System Stopped{RESET}')

    async def matchmaking_loop(self):
        """Main matchmaking loop"""
        counter = 0
        while self._running:
            try:
                if counter % 10 == 0:
                    print('Matchmaking Loop')
                    print(f'Players in Queue: {len(self.players_queue)}')
                    print(f'Players indices in Queue: {self.players_queue.keys()}')
                    print(f'Games in Progress: {len(self.games)}')

                if len(self.players_queue) >= 2:
                    player_items = list(self.players_queue.items())[:2]
                    player1_id, player1 = player_items[0]
                    player2_id, player2 = player_items[1]

                    try:
                        # Get player models and create game
                        player1_model = await database_sync_to_async(Player.objects.get)(id=player1_id)
                        player2_model = await database_sync_to_async(Player.objects.get)(id=player2_id)
                        game_model = await database_sync_to_async(Game.objects.create)(player1=player1_model, player2=player2_model)

                        # Create game instance
                        game = PingPongGame(player1, player2, game_model_id=game_model.id)
                        self.games[game.game_id] = game
                        
                        # Remove matched players from queue
                        del self.players_queue[player1_id]
                        del self.players_queue[player2_id]
                        
                        # Notify players
                        await self.notify_players(player1, player2, game_model.id)
                        
                    except Exception as e:
                        print(f'Error creating game: {str(e)}')
                        # break
                    
                counter += 1
                await asyncio.sleep(1)
            except Exception as e:
                print(f'Error in matchmaking loop: {str(e)}')
                await asyncio.sleep(1)


    # def get_player_model(player_id):
    #     """Get player model asynchronously"""
    #     return Player.objects.get(id=player_id)


    # def create_game_model(player1_model, player2_model):
    #     """Create game model asynchronously"""
    #     return Game.objects.create(player1=player1_model, player2=player2_model)

    async def notify_players(self, player1, player2, game_id):
        """Notify players about the game match"""
        await self._channel_layer.send(
            player1.channel_name,
            {
                'type': 'game.found',
                'opponent': player2.username,
                'game_id': game_id,
                'message': "Game found, Get Ready to play!!"
            }
        )
        await self._channel_layer.send(
            player2.channel_name,
            {
                'type': 'game.found',
                'opponent': player1.username,
                'game_id': game_id,
                'message': "Game found, Get Ready to play!!"
            }
        )

    async def add_player_to_queue(self, player_id, username, channel_name):
        """Add a player to the matchmaking queue"""
        if player_id in self.players_queue:
            print(f'Player {player_id} already in Queue')
            return
        print(f'Adding player to queue: {player_id}')
        self.players_queue[player_id] = GamePlayer(player_id, username, channel_name, None, None)

    async def remove_player_from_queue(self, player_id):
        """Remove a player from the matchmaking queue"""
        if player_id in self.players_queue:
            del self.players_queue[player_id]

# from dataclasses import dataclass
# from channels.layers import get_channel_layer
# from django_redis import get_redis_connection
# from typing import Dict, Tuple
# import asyncio
# from .GameEngine import GamePlayer, PingPongGame
# from .models import Game
# from accounts.models import Player
#     # skill_rating: int

# RED_BOLD = '\033[31;1m'
# RESET = '\033[0m'

# class MatchMakingSystem:
#     def __init__(self):
#         print(f'{RED_BOLD}MatchMakingSystem Initialized{RESET}')

#         self.players_queue :Dict[int, GamePlayer] = {}
#         self.games :Dict[int, PingPongGame] = {}
#         self._matchmaking_task = None
#         self._channel_layer = get_channel_layer()

#         self._matchmaking_task = asyncio.create_task(self.matchmaking_loop())

#     # def start(self):
#     #     if not self._matchmaking_task:
            

#     # async def stop(self):
#     #     if self._matchmaking_task:
#     #         self._matchmaking_task.cancel()
#     #         self._matchmaking_task = None

#     async def player_in_queue(self, player_id):
#         return player_id in self.players_queue

#     async def add_player_to_queue(self, player_id, username, channel_name):
#         if player_id in self.players_queue:
#             print(f'Player {player_id} already in Queue')
#             return
#         print(f'Adding player to queue: {player_id}')
#         self.players_queue[player_id] = GamePlayer(player_id, username, channel_name)

#     async def remove_player_from_queue(self, player_id):
#         if player_id in self.players_queue:
#             del self.players_queue[player_id]

#     async def matchmaking_loop(self):
#         while True:
#             i =0
#             if i%10 == 0:
#                 print('Matchmaking Loop')
#                 print(f'Players in Queue: {len(self.players_queue)}')
#                 print(f'players indexs in Queue: {self.players_queue.keys()}')
#                 print(f'Games in Progress: {len(self.games)}')
#             await asyncio.sleep(1)
#             if len(self.players_queue) >= 2:
#                 try:
#                     player1 = self.players_queue.popitem()
#                     player2 = self.players_queue.popitem()
#                     player1_model = Player.objects.get(id=player1[0])
#                     player2_model = Player.objects.get(id=player2[0])
#                     game_model = Game.objects.create(player1=player1_model, player2=player2_model)
#                     game = PingPongGame(player1, player2, game_model_id=game_model.id)
#                     self.games[game.game_id] = game
#                     self.notify_players(player1, player2, game_model.id)
#                 except:
#                     print('Error creating game model')
#                     continue                
#                 asyncio.sleep(1/4)
#                 continue
#             i+=1


#     async def notify_players(self, player1, player2, game_id):
#         await self._channel_layer.send(
#             player1.channel_name,
#             {
#                 'type': 'game.found',
#                 'opponent': player2.username,
#                 'game_id': game_id,
#                 'message': "Game found, Get Ready to play!!"
#             }
#         )
#         await self._channel_layer.send(
#             player2.channel_name,
#             {
#                 'type': 'game.found',
#                 'opponent': player1.username,
#                 'game_id': game_id,
#                 'message': "Game found, Get Ready to play!!"
#             }
#         )
        
