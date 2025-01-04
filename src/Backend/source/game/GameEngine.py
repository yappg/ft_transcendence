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

    async def update(self, delta_time: float):
        self.position = self.position + (self.velocity * delta_time)

    async def reset(self):
        self.position = Vector2D(37.5, 50)
        self.velocity *= -1

@dataclass 
class Paddle:
    position: Vector2D
    width: float = 9.0
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
        self.status = 'waiting'# waiting, ready, playing, paused, 'finished'
        self.paddle = None
        self.map = 'air' # 'air','water','fire','earth'
        self.score: List[int] = [0,0,0]

class PingPongGame:
    def __init__(self, player1, player2, gameID: int):
        print(f'\033[31;1mCreating game with ID: {gameID} BETWEEN {player1.username} AND {player2.username}\033[0m')

        self.game_id = gameID
        self.game_width = 75
        self.game_height = 100
        self.status = 'waiting'  # waiting, start, pause, over
        self.ball = Ball(Vector2D(37.5, 50), Vector2D(35, 35))

        self.player1 = player1
        self.player1.game_id = gameID
        self.player1.paddle = Paddle(Vector2D(37.5, 4.5))  # Lower paddle 
        self.player2 = player2
        self.player2.game_id = gameID
        self.player2.paddle = Paddle(Vector2D(37.5, 96.5))  # Upper paddle

        self.winner = None
        self.round = 0
        self.map = 'water' # 'air','water','fire','earth'
        # self.new

    def start_game(self):
        import time

        while self.player1.status != 'ready' or self.player2.status != 'ready':
            time.sleep(0.2)
        self.status = 'playing'
        self.ball.reset()

    async def update(self, delta_time: float):

        if self.status != 'playing':
            return False 
        
        # implement game rounds and pause game, 3 round 7 goals
        await self.ball.update(delta_time)

        # if await self.check_game_end():
        #     return False 
        if await self.check_collisions():
            return True
        # if await self.check_scoring():
        #     return False
        # if await self.check_for_rounds():
        #     return True
        return False

    async def check_collisions(self) -> bool:
        changed = False

        if self.ball.position.x <= self.ball.radius or \
            self.ball.position.x >= self.game_width - self.ball.radius:
            self.ball.velocity.x *= -1
            changed = True

        if await self.check_paddle_collision(self.player1.paddle):
            self.ball.velocity.y = abs(self.ball.velocity.y)  # Move right
            # await self.adjust_ball_angle(self.player1.paddle) 
            changed = True
        elif await self.check_paddle_collision(self.player2.paddle):
            self.ball.velocity.y = -abs(self.ball.velocity.y)  # Move left
            # await self.adjust_ball_angle(self.player2.paddle) 
            changed = True
        return changed

    async def check_paddle_collision(self, paddle: Paddle) -> bool:

        collosion_x = abs(self.ball.position.x - paddle.position.x) < (paddle.width)
        collosion_y = abs(self.ball.position.y - paddle.position.y) < (paddle.height)
        if collosion_x and collosion_y:
            print(f'{GREEN}paddle position {paddle.position.x} and {self.ball.position.x}\033[0m')
            print(f'{GREEN}Collision detected with {abs(self.ball.position.x - paddle.position.x)} and {paddle.width + self.ball.radius}\033[0m')
        return collosion_x and collosion_y

    async def adjust_ball_angle(self, paddle: Paddle):
        import math

        collisionPoint_x = self.ball.position.x - paddle.position.x
        normalized_collision = (collisionPoint_x - paddle.width/2) / (paddle.width / 2)
        self.ball.velocity.x = normalized_collision * (abs(normalized_collision) + 0.5)

    async def check_for_rounds(self) :
        # TODO if (self.player1.score[self.round] == 7 or self.player2.score[self.round] == 7):
        if (self.player1.score[self.round] == 1 or self.player2.score[self.round] == 1):
            self.round += 1
            #TODO to check and test
            if self.round == 3:
                self.status = 'finished'
                if sum(self.player1.score) > sum(self.player2.score) :
                    self.winner = 'player1'
                    self.map = self.player1.map
                elif sum(self.player1.score) == sum(self.player2.score):
                    self.winner = 'draw'
                    self.map = self.player1.map
                else :
                    self.winner = 'player2'
                    self.map = self.player2.map
                return True
            #TODO broadcast round end
            print (f'{YELLOW}Round {self.round}, score: {self.player1.score}, {self.player2.score}{RESET}')
            await asyncio.sleep(5)
            return True
        return False
    async def check_scoring(self) -> bool: 
        if self.ball.position.y <= 0: # Player 2 scores
            self.player2.score[self.round] += 1
            #TODO reset paddle position
            await self.ball.reset()
            return True
        elif self.ball.position.y >= 100:  # Player 1 scores
            self.player1.score[self.round] += 1
            await self.ball.reset()
            return True
        return False

    #TODO to be fixed
    async def move_paddle(self, player_id: str, new_x: float) -> bool:
        if player_id == self.player1.id:
            self.player1.paddle.move(new_x)
            return True
        elif player_id == self.player2.id:
            self.player2.paddle.move(new_x)
            return True
        return False
     
    async def check_game_end(self) -> bool:
        if self.round == 3:
            self.status = 'finished'
            if sum(self.player1.score) > sum(self.player2.score) :
                self.winner = 'player1'
                self.map = self.player1.map
            elif sum(self.player1.score) == sum(self.player2.score):
                self.winner = 'draw'
                self.map = self.player1.map
            else :
                self.winner = 'player2'
                self.map = self.player2.map
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
