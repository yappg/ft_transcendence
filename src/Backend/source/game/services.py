# # game/services.py
# from typing import Optional
# from django.utils import timezone
# from .models import Game, PlayerProfile, GameMove

# from asgiref.sync import sync_to_async
# from django.db import transaction

# class GameService:
#     @staticmethod
#     async def create_game(player, room_name):
#         """
#         Create a new game with the given player
#         """
#         try:
#             @sync_to_async
#             def create_game_sync():
#                 with transaction.atomic():
#                     game = Game.objects.create(
#                         player1=player,
#                         status='WAITING',
#                         room_name=room_name,
#                         player1_score=0,
#                         player2_score=0
#                     )
#                     return game
            
#             return await create_game_sync()
#         except Exception as e:
#             logger.error(f"Error creating game: {str(e)}")
#             raise

#     @staticmethod
#     async def join_game(game, player):
#         """
#         Join an existing game
#         """
#         try:
#             @sync_to_async
#             def join_game_sync():
#                 with transaction.atomic():
#                     game.player2 = player
#                     game.status = 'IN_PROGRESS'
#                     game.save()
#                     return game
            
#             return await join_game_sync()
#         except Exception as e:
#             logger.error(f"Error joining game: {str(e)}")
#             raise

#     @staticmethod
#     async def start_game(game):
#         """
#         Start the game
#         """
#         try:
#             @sync_to_async
#             def start_game_sync():
#                 with transaction.atomic():
#                     game.status = 'IN_PROGRESS'
#                     game.save()
#                     return game
            
#             return await start_game_sync()
#         except Exception as e:
#             logger.error(f"Error starting game: {str(e)}")
#             raise

#     @staticmethod
#     async def end_game(game, winner):
#         """
#         End the game and set the winner
#         """
#         try:
#             @sync_to_async
#             def end_game_sync():
#                 with transaction.atomic():
#                     game.status = 'COMPLETED'
#                     game.winner = winner
#                     game.save()
#                     return game
            
#             return await end_game_sync()
#         except Exception as e:
#             logger.error(f"Error ending game: {str(e)}")
#             raise

#     @staticmethod
#     async def record_move(game, player, position):
#         """
#         Record a move in the game
#         """
#         try:
#             @sync_to_async
#             def record_move_sync():
#                 with transaction.atomic():
#                     if player == game.player1:
#                         game.player1_score += 1
#                     elif player == game.player2:
#                         game.player2_score += 1
#                     game.save()
#                     return game
            
#             return await record_move_sync()
#         except Exception as e:
#             logger.error(f"Error recording move: {str(e)}")
#             raise

# class EloService:
#     K_FACTOR = 32

#     @classmethod
#     def update_ratings(cls, winner: PlayerProfile, loser: PlayerProfile) -> None:
#         """Update ELO ratings for both players"""
#         expected_winner = cls._get_expected_score(winner.rank_points, loser.rank_points)
#         expected_loser = 1 - expected_winner

#         winner.rank_points = round(winner.rank_points + cls.K_FACTOR * (1 - expected_winner))
#         loser.rank_points = round(loser.rank_points + cls.K_FACTOR * (0 - expected_loser))

#     @staticmethod
#     def _get_expected_score(rating_a: int, rating_b: int) -> float:
#         """Calculate expected score based on ELO ratings"""
#         return 1 / (1 + 10 ** ((rating_b - rating_a) / 400))

# class LeaderboardService:
#     @staticmethod
#     def update_leaderboard() -> None:
#         """Update the leaderboard rankings"""
#         from .models import LeaderboardEntry
        
#         # Get all players sorted by rank points
#         players = PlayerProfile.objects.order_by('-rank_points')
        
#         # Update or create leaderboard entries
#         for rank, player in enumerate(players, 1):
#             LeaderboardEntry.objects.update_or_create(
#                 player=player,
#                 defaults={'rank': rank}
#             )

#     @staticmethod
#     def get_top_players(limit: int = 10) -> list:
#         """Get top players from leaderboard"""
#         return PlayerProfile.objects.order_by('-rank_points')[:limit]