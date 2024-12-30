# game_engine.py
from dataclasses import dataclass
from typing import Dict, Tuple, Optional
import json
import math
# import uuid
RED = '\033[31m'
GREEN = '\033[32m'
YELLOW = '\033[33m'
BLUE = '\033[34m'
RESET = '\033[0m'
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
    radius: float = 2.0
    
    async def update(self, delta_time: float):
        self.position = self.position + (self.velocity * delta_time)

    async def reset(self):
        self.position = Vector2D(37.5, 50)
        self.velocity = Vector2D(0, 1)# Pixels per second

@dataclass 
class Paddle:
    position: Vector2D
    width: float = 15.0 #15.0 
    height: float = 2.5

    async def move(self, new_x: float):
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
        self.ball = Ball(Vector2D(37.5, 50), Vector2D(0, 1)) 

        # Initialize players with paddles at opposite sides
        self.player1 = player1
        self.player1.game_id = game_model_id
        # self.player1.status = ''
        self.player1.paddle = Paddle(Vector2D(37.5, 3))  # Lower paddle 
        self.player2 = player2
        self.player2.game_id = game_model_id
        # self.player2.status = ''
        self.player2.paddle = Paddle(Vector2D(37.5, 97))  # Upper paddle

        self.game_width = 75
        self.game_height = 100
        self.status = 'waiting'  # waiting, start, over
        self.winner = None
        self.winning_score = 10

    def start_game(self):
        import time
        # print("statuses:", self.player1.status, self.player2.status)
        while self.player1.status != 'ready' or self.player2.status != 'ready':
            # print(f'{YELLOW}Player 1: {self.player1.status} Player 2: {self.player2.status} | Game status :{self.status}\n{RESET}')
            time.sleep(0.2)
        self.status = 'playing' 
        self.ball.reset()

    async def update(self, delta_time: float):
        """Update game state. Returns True if the game state changed."""

        # print (f'\033[31;1mUpdating game with ID: {self.status}\033[0m')
        # print(f'Ball Position: ({self.ball.position.x}, {self.ball.position.y})')

        if self.status != 'playing':
            return False 
        await self.ball.update(delta_time)
        import asyncio
        # await asyncio.sleep(delta_time)


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
            print(f'\033[31;1mBall Position: ({self.ball.position.x}, {self.ball.position.y})\033[0m')
            # await self.ball.update(0.25)

            changed = True

        # Paddle collisions
        # Lower paddle (player1)
        if await self._check_paddle_collision(self.player1.paddle):
            self.ball.velocity.y = abs(self.ball.velocity.y)  # Move right
            # await self._adjust_ball_angle(self.player1.paddle) 
            print(f'\033[31;1m[PADDLE COLLISION ] Ball Position: ({self.ball.position.x}, {self.ball.position.y})\033[0m')
            changed = True
        # Upper paddle (player2)   
        elif await self._check_paddle_collision(self.player2.paddle):
            self.ball.velocity.y = -abs(self.ball.velocity.y)  # Move left
            # await self._adjust_ball_angle(self.player2.paddle)
            print(f'\033[31;1m[PADDLE COLLISION ] Ball Position: ({self.ball.position.x}, {self.ball.position.y})\033[0m')
            changed = True

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

    def move_paddle(self, player_id: str, new_x: float) -> bool:
        """Move a player's paddle to a new y position"""
        if player_id == self.player1.id:
            self.player1.paddle.move(new_x)
            return True
        elif player_id == self.player2.id:
            self.player2.paddle.move(new_x)
            return True
        return False
     
    def get_state(self) -> Dict:
        
        return {
            'dx': self.ball.velocity.x,
            'dy': self.ball.velocity.y,
            'position':
            {
                'x': self.ball.position.x, # / self.game_width,
                'y': self.ball.position.y # / self.game_height
            },
        }

    def paddle_update(self, opponent_id: int) -> Dict:
        player = self.player1 if self.player1.id == opponent_id else self.player2
        return {
            self.player.username: {
            {
                'paddle_x': self.player1.paddle.position.x, # / self.game_height,
            },
            }}
            # self.player2.username: {
            #     'paddle_x': self.player2.paddle.position.x, # / self.game_height,
            # },
            # }

