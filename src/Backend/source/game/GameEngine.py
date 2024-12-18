# game_engine.py
from dataclasses import dataclass
from typing import Dict, Tuple, Optional
import json
import math
import uuid

@dataclass
class Vector2D:
    x: float
    y: float
    
    def __add__(self, other):
        return Vector2D(self.x + other.x, self.y + other.y)
    
    def __mul__(self, scalar):
        return Vector2D(self.x * scalar, self.y * scalar)

@dataclass
class Ball:
    position: Vector2D
    velocity: Vector2D
    radius: float = 1.0
    
    def update(self, delta_time: float):
        self.position = self.position + (self.velocity * delta_time)

    def reset(self):
        self.position = Vector2D(50, 50)
        self.velocity = Vector2D(300, 300)  # Pixels per second

@dataclass
class Paddle:
    position: Vector2D
    width: float = 3.0
    height: float = 15.0
    
    def move(self, new_y: float):
        # Clamp paddle position within game bounds
        self.position.y = max(self.height / 2, min(100 - self.height / 2, new_y))

@dataclass
class Player:
    id: str
    username: str
    paddle: Paddle
    score: int = 0

class PingPongGame:
    def __init__(self,player1 : Player, player2: Player, game_model_id: int):
        self.game_id = game_model_id
        self.ball = Ball(Vector2D(50, 50), Vector2D(300, 300))
        # Initialize players with paddles at opposite sides
        self.player1 = Player(
            player1.id,
            player1.username,
            Paddle(Vector2D(5, 50))  # Left paddle
        )
        self.player2 = Player(
            player2.id,
            player2.username,
            Paddle(Vector2D(95, 50))  # Right paddle
        )
        self.game_width = 100
        self.game_height = 100
        self.status = 'waiting'  # waiting, playing, finished
        self.winner = None
        self.winning_score = 11

    def start_game(self):
        """Start the game if both players are ready"""
        self.status = 'playing'
        self.ball.reset()
    
    def update(self, delta_time: float) -> bool:
        """Update game state. Returns True if the game state changed."""
        if self.status != 'playing':
            return False
            
        # Update ball position
        self.ball.update(delta_time)
        
        # Check for collisions and scoring
        if self._check_collisions():
            return True
            
        # Check for scoring
        if self._check_scoring():
            return True
            
        # Check for game end
        if self._check_game_end():
            return True
            
        return False
    
    def _check_collisions(self) -> bool:
        """Handle collisions between ball and paddles/walls"""
        changed = False
        
        # Wall collisions (top/bottom)
        if self.ball.position.y <= self.ball.radius or \
           self.ball.position.y >= self.game_height - self.ball.radius:
            self.ball.velocity.y *= -1
            changed = True
        
        # Paddle collisions
        # Left paddle (player1)
        if self._check_paddle_collision(self.player1.paddle):
            self.ball.velocity.x = abs(self.ball.velocity.x)  # Move right
            self._adjust_ball_angle(self.player1.paddle)
            changed = True
            
        # Right paddle (player2)
        elif self._check_paddle_collision(self.player2.paddle):
            self.ball.velocity.x = -abs(self.ball.velocity.x)  # Move left
            self._adjust_ball_angle(self.player2.paddle)
            changed = True
            
        return changed
    
    def _check_paddle_collision(self, paddle: Paddle) -> bool:
        """Check if ball collides with given paddle"""
        # Simplified rectangle collision check
        return (abs(self.ball.position.x - paddle.position.x) < (paddle.width + self.ball.radius) and
                abs(self.ball.position.y - paddle.position.y) < (paddle.height + self.ball.radius))
    
    def _adjust_ball_angle(self, paddle: Paddle):
        """Adjust ball angle based on where it hits the paddle"""
        relative_intersect_y = (paddle.position.y - self.ball.position.y)
        normalized_intersect = relative_intersect_y / (paddle.height / 2)
        bounce_angle = normalized_intersect * math.pi / 4  # 45 degrees max angle
        
        speed = math.sqrt(self.ball.velocity.x**2 + self.ball.velocity.y**2)
        self.ball.velocity.x = speed * math.cos(bounce_angle)
        self.ball.velocity.y = speed * math.sin(bounce_angle)
    
    def _check_scoring(self) -> bool:
        """Check if a point was scored"""
        if self.ball.position.x <= 0:  # Player 2 scores
            self.player2.score += 1
            self.ball.reset()
            return True
        elif self.ball.position.x >= self.game_width:  # Player 1 scores
            self.player1.score += 1
            self.ball.reset()
            return True
        return False
    
    def _check_game_end(self) -> bool:
        """Check if the game has ended"""
        if self.player1.score >= self.winning_score or \
           self.player2.score >= self.winning_score:
            self.status = 'finished'
            self.winner = self.player1 if self.player1.score > self.player2.score else self.player2
            return True
        return False
    
    def move_paddle(self, player_id: str, new_y: float) -> bool:
        """Move a player's paddle to a new y position"""
        if player_id == self.player1.id:
            self.player1.paddle.move(new_y)
            return True
        elif player_id == self.player2.id:
            self.player2.paddle.move(new_y)
            return True
        return False
    
    def get_state(self) -> Dict:
        """Get the current game state as a dictionary"""
        return {
            'game_id': self.game_id,
            'status': self.status,
            'ball':
            {
            'x': self.ball.position.x,
            'y': self.ball.position.y
            },
            'players': 
            {
                'player1':
                {
                    'id': self.player1.id,
                    'username': self.player1.username,
                    'paddle_y': self.player1.paddle.position.y,
                    'score': self.player1.score
                },
                'player2':
                {
                    'id': self.player2.id,
                    'username': self.player2.username,
                    'paddle_y': self.player2.paddle.position.y,
                    'score': self.player2.score
                }
            },
            'winner': self.winner.username if self.winner else None
        }

from django_redis import get_redis_connection
from game.models import Game
from accounts.models import Player, PlayerProfile

class GameManager:
    def __init__(self):
        print('**Game Manager Initialized**')
        # self.games: Dict[str, PingPongGame] = {}

        self.players_queue = get_redis_connection("players_queue")

        self.games = get_redis_connection("games_pool")


    def add_player_to_queue(self, player_id):
        self.players_queue.rpush('players_queue', player_id)
    def pop_player_from_queue(self, player_id):
        self.players_queue.lpop('players_queue')#, player_id)

    def create_game(self,_player1:Player, _player2: Player, game_model_id: int) -> PingPongGame:
        """Create a new game and store it"""
        game = PingPongGame(_player1, _player2, game_model_id)
        self.games.set(game_model_id, game)
        # self.games
        # self.games[game_model_id] = game
        return game

    def get_game(self, game_id: str) -> Optional[PingPongGame]:
        """Get a game by its ID"""
        return self.games.get(game_id)

    def remove_game(self, game_id: str):
        """Remove a game by its ID"""
        if self.games.get(game_id):
            self.games.delete(game_id)