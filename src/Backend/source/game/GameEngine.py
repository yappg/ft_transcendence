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

class Ball:
    position: Vector2D
    velocity: Vector2D
    radius: float = 2.0
    def __init__(self, position: Vector2D, velocity: Vector2D, Radius:float): 
        self.position = position
        self.velocity = velocity
        self.radius = Radius
    
    async def update(self, delta_time: float):
        self.position = self.position + (self.velocity * delta_time)

    async def reset(self):
        self.position = Vector2D(37.5, 50)
        self.velocity = Vector2D(20, 20)# Pixels per second
        self.position = Vector2D(37.5, 50)
        self.velocity = Vector2D(20, -20)# Pixels per second

@dataclass
class Paddle:
    position: Vector2D
    width: float = 75.0 #15.0
    height: float = 3.0

    async def move(self, new_x: float):
        # Clamp paddle position within game bounds
        self.position.x = max(self.width / 2, min(75 - self.width / 2, new_x))

@dataclass
class GamePlayer:
    id: int
    username: str
    channel_name: str 
    game_id: str 
    status: str = 'waiting' # waiting, ready, playing, 'finished'
    paddle: Paddle = None
    score: int = 0

class PingPongGame:
    def __init__(self, player1, player2, game_model_id: int):
        print(f'\033[31;1mCreating game with ID: {game_model_id} BETWEEN {player1.username} AND {player2.username}\033[0m')
        self.game_id = game_model_id
        self.ball = Ball(Vector2D(37.5, 50), Vector2D(20, 20))
        self.ball = Ball(Vector2D(self.game_width/2, self.game_height/2), Vector2D(-20, 20), self.game_width/35)

        # Initialize players with paddles at opposite sides
        self.player1 = player1
        self.player1.game_id = game_model_id
        self.player1.status = 'ready'
        self.player1.paddle = Paddle(Vector2D(50, 5))  # Lower paddle 
        self.player2 = player2
        self.player2.game_id = game_model_id
        self.player2.status = 'ready'
        self.player2.paddle = Paddle(Vector2D(37.5, 95))  # Upper paddle

        self.game_width = 75
        self.game_height = 100
        self.status = 'waiting'  # waiting, playing, finished
        self.winner = None
        self.winning_score = 10

    def start_game(self):
        self.status = 'playing'
        self.ball.reset()

    async def update(self, delta_time: float):
        """Update game state. Returns True if the game state changed."""

        # print (f'\033[31;1mUpdating game with ID: {self.status}\033[0m')
        print(f'Ball Position: ({self.ball.position.x}, {self.ball.position.y})')

        if self.status != 'playing':
            return False
        await self.ball.update(delta_time)

        if await self._check_collisions():
            return True
        if await self._check_scoring():
            return True
        if await self._check_game_end():
            return True
        return False

    #TODO remove _ from functions
    async def _check_collisions(self) -> bool:
        changed = False

        # Wall collisions (right and left)
        if self.ball.position.x <= self.ball.radius or \
            self.ball.position.x >= self.game_width - self.ball.radius:
            self.ball.velocity.x *= -1
            await self.ball.update(0.25)

            changed = True

        # Paddle collisions
        # Lower paddle (player1)
        if await self._check_paddle_collision(self.player1.paddle):
            self.ball.velocity.y = abs(self.ball.velocity.y)  # Move right
            # await self._adjust_ball_angle(self.player1.paddle) 
            await self.ball.update(0.25)

            changed = True
        # Upper paddle (player2)
        elif await self._check_paddle_collision(self.player2.paddle):
            self.ball.velocity.y = -abs(self.ball.velocity.y)  # Move left
            # await self._adjust_ball_angle(self.player2.paddle)
            changed = True
            await self.ball.update(0.25)

        return changed

    async def _check_paddle_collision(self, paddle: Paddle) -> bool:

        collosion_x = abs(self.ball.position.x - paddle.position.x) < (paddle.width + self.ball.radius)
        collosion_y = abs(self.ball.position.y - paddle.position.y) < (paddle.height + self.ball.radius)
        return collosion_x and collosion_y

    async def _adjust_ball_angle(self, paddle: Paddle):
        """Adjust ball angle based on where it hits the paddle"""
        relative_intersect_x = (paddle.position.x - self.ball.position.x)
        normalized_intersect = relative_intersect_x / (paddle.height / 2)
        bounce_angle = normalized_intersect * math.pi / 4  # 45 degrees max angle

        speed = math.sqrt(self.ball.velocity.x**2 + self.ball.velocity.y**2)
        self.ball.velocity.x = speed * math.cos(bounce_angle)
        self.ball.velocity.y = speed * math.sin(bounce_angle)

    async def _check_scoring(self) -> bool:
        if self.ball.position.y <= 0: # Player 2 scores
            self.player2.score += 1
            await self.ball.reset()
            return True
        elif self.ball.position.y >= 100:  # Player 1 scores
            self.player1.score += 1
            await self.ball.reset()
            return True
        return False
    
    async def _check_game_end(self) -> bool:
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
    
    def get_state(self, opponent_id) -> Dict:
        """Get the current game state as a dictionary"""
        
        player = self.player1 if opponent_id == self.player1.id else self.player2
        
        return {
            'game_id': self.game_id,
            'status': self.status,
            'ball':
            {
                'x': self.ball.position.x, # / self.game_width,
                'y': self.ball.position.y # / self.game_height
            },
            'opponent_paddle': 
            {
                    'paddle_x': player.paddle.position.x, # / self.game_height,
            },
            'winner': self.winner.username if self.winner else None
        }

