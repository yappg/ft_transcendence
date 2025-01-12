# game_engine.py
from dataclasses import dataclass
from typing import Dict, Tuple, Optional
import json
import math
import asyncio

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

    def update(self, delta_time: float):
        self.position = self.position + (self.velocity * delta_time)

    async def reset(self, UniVect: int):
        self.position = Vector2D(37.5, 50)
        self.velocity *= UniVect

@dataclass 
class Paddle:
    position: Vector2D
    width: float = 7.0
    height: float = 2.5

    def move(self, new_x: float):
        self.position.x = new_x + 7.5

from typing import List
class GamePlayer:
    def __init__(self, player_id: int, username: str, channel_name: str):
        self.id = player_id
        self.game_id = None
        self.username = username
        self.channel_name = channel_name
        self.status = 'waiting'# waiting, ready, playing, paused, 'over'
        self.paddle = None
        self.map = 'fire' # 'air','water','fire','earth'
        self.score: List[int] = [0,0,0]

class PingPongGame:
    def __init__(self, player1, player2, gameID: int):
        # print(f'\033[31;1mCreating game with ID: {gameID} BETWEEN {player1.username} AND {player2.username}\033[0m')

        self.game_id = gameID
        self.game_width = 75
        self.game_height = 100
        self.status = 'waiting'  # waiting, start, pause, over
        self.ball = Ball(Vector2D(37.5, 50), Vector2D(0, 60))

        self.player1 = player1
        self.player1.paddle = Paddle(Vector2D(37.5, 4.5))  # Lower paddle 
        self.player2 = player2
        self.player2.paddle = Paddle(Vector2D(37.5, 96.5))  # Upper paddle

        self.winner = None
        self.map = 'water' # 'air','water','fire','earth'
        self.round = 0
        self.round_win = 7
        self.is_round_over = False
        self.round_status = 'playing'  #playing, over
        self.lock = asyncio.Lock()

    def start_game(self):
        import time

        start_time = time.time()
        while self.player1.status != 'ready' or self.player2.status != 'ready':
            # if start_time - time.time() > 10:
            #     # print(f'{RED}Timeout{RESET}')
            #     self.status = 'over'
            #     # return  
            time.sleep(0.2)
        self.status = 'playing'
        self.ball.reset(1)

    def update(self, delta_time: float):

        self.ball.update(delta_time)
        if self.check_collisions():
            return True
        return False

    def check_collisions(self) -> bool:
        changed = False

        if self.ball.position.x <= self.ball.radius or \
            self.ball.position.x >= self.game_width - self.ball.radius:
            self.ball.velocity.x *= -1
            changed = True

        if self.check_paddle_collision(self.player1.paddle):
            self.ball.velocity.y = abs(self.ball.velocity.y)  # Move right
            self.adjust_ball_angle(self.player1.paddle) 
            changed = True
        elif self.check_paddle_collision(self.player2.paddle):
            self.ball.velocity.y = -abs(self.ball.velocity.y)  # Move left
            self.adjust_ball_angle(self.player2.paddle) 
            changed = True
        return changed

    def check_paddle_collision(self, paddle: Paddle) -> bool:

        collosion_x = abs(self.ball.position.x - paddle.position.x) < (paddle.width + self.ball.radius)
        collosion_y = abs(self.ball.position.y - paddle.position.y) < (paddle.height + self.ball.radius)
        return collosion_x and collosion_y

    def adjust_ball_angle(self, paddle: Paddle):

        collisionPoint_x = self.ball.position.x - paddle.position.x
        normalized_collision = (collisionPoint_x - paddle.width) / (paddle.width)
        self.ball.velocity.x = normalized_collision * (abs(normalized_collision) + 5.5)

    async def check_for_rounds(self) :
        if (self.player1.score[self.round] == self.round_win or self.player2.score[self.round] == self.round_win):
            # print (f'{YELLOW}Round {self.round}, score: {self.player1.score}, {self.player2.score}{RESET}')
            self.round += 1
            # self.ball.reset(0)

            if self.round == 3:
                async with self.lock:
                    if sum(self.player1.score) > sum(self.player2.score):
                        self.winner = 'player1'
                        self.map = self.player1.map
                    elif sum(self.player1.score) < sum(self.player2.score):
                        self.winner = 'player2'
                        self.map = self.player2.map
                    else :
                        self.winner = 'draw'
                        self.map = 'air' #default map
                    self.status = 'over'
                    return True
            return True
        return False



    async def check_scoring(self) -> bool: 
        async with self.lock:
            if self.ball.position.y <= 0: # Player 2 scores
                self.player2.score[self.round] += 1
                await self.ball.reset(-1.00)
                self.ball.velocity.x= 0
                if self.player1.score[self.round] == self.round_win or self.player2.score[self.round] == self.round_win:
                    return False
                return True
            elif self.ball.position.y >= 100:  # Player 1 scores
                self.player1.score[self.round] += 1
                await self.ball.reset(-1.00)
                self.ball.velocity.x= 0
                if self.player1.score[self.round] == self.round_win or self.player2.score[self.round] == self.round_win:
                    return False
                return True
        return False

    async def move_paddle(self, player_id: str, new_x: float) -> bool:
        if player_id == self.player1.id:
            self.player1.paddle.move(new_x)
            return True
        elif player_id == self.player2.id:
            self.player2.paddle.move(new_x)
            return True
        return False

    async def ball_update(self) -> Dict:
        return {
            'dx': self.ball.velocity.x,
            'dy': self.ball.velocity.y,
            'position':
            {
                'x': self.ball.position.x,
                'y': self.ball.position.y
            },
        }

            # 'round': self.round,
            # self.player1.id: self.player1.score,
            # self.player2.id: self.player2.score,