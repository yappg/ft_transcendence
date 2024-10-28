import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .services import GameService, LeaderboardService
from .models import Game, PlayerProfile

class GameConsumer(WebsocketConsumer):
    def connect(self):
        self.player_profile = self.scope["user"].player_profile
        self.game = None
        self.accept()

        # Try to join existing game or create new one
        available_game = Game.objects.filter(status='WAITING', player2=None).first()
        if available_game:
            try:
                self.game = GameService.join_game(available_game, self.player_profile)
                GameService.start_game(self.game)
            except ValueError:
                self.game = GameService.create_game(self.player_profile, f"game_{self.game_id}")
        else:
            self.game = GameService.create_game(self.player_profile, f"game_{self.game_id}")

        # Add to game group
        async_to_sync(self.channel_layer.group_add)(
            f"game_{self.game.game_id}",
            self.channel_name
        )

    def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')

        if action == 'move':
            GameService.record_move(
                self.game,
                self.player_profile,
                data.get('position', 0)
            )
            self.broadcast_game_state()

        elif action == 'end_game':
            winner_id = data.get('winner_id')
            if winner_id:
                winner = PlayerProfile.objects.get(id=winner_id)
                GameService.end_game(self.game, winner)
                LeaderboardService.update_leaderboard()
                self.broadcast_game_state()

    def disconnect(self, close_code):
        if self.game and self.game.status == 'IN_PROGRESS':
            # If game was in progress, other player wins
            winner = self.game.player2 if self.game.player1 == self.player_profile else self.game.player1
            GameService.end_game(self.game, winner)
            LeaderboardService.update_leaderboard()
            self.broadcast_game_state()

        async_to_sync(self.channel_layer.group_discard)(
            f"game_{self.game.game_id}",
            self.channel_name
        )

    def broadcast_game_state(self):
        """Broadcast current game state to all players"""
        async_to_sync(self.channel_layer.group_send)(
            f"game_{self.game.game_id}",
            {
                'type': 'game_state_update',
                'game_state': self.get_game_state()
            }
        )

    def get_game_state(self):
        """Get current game state for broadcasting"""
        return {
            'game_id': str(self.game.game_id),
            'status': self.game.status,
            'player1': {
                'id': self.game.player1.id,
                'name': self.game.player1.display_name,
                'score': self.game.player1_score
            },
            'player2': {
                'id': self.game.player2.id,
                'name': self.game.player2.display_name,
                'score': self.game.player2_score
            } if self.game.player2 else None,
            'winner': self.game.winner.id if self.game.winner else None
        }