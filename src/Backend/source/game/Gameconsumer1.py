# consumers.py
import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User
from django_redis import get_redis_connection
import logging

logger = logging.getLogger(__name__)

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if not self.scope["user"].is_authenticated:
            await self.close()
            return
        
        self.user = self.scope["user"]
        self.redis = get_redis_connection("default")
        self.game_id = None
        self.room_group_name = None

        await self.accept()
        await self.add_to_matchmaking()

    async def disconnect(self, close_code):
        if self.game_id:
            await self.leave_game()
        await self.remove_from_matchmaking()
        if self.room_group_name:
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            action = data.get('action')
            
            if action == 'move_paddle':
                await self.handle_paddle_movement(data)
            elif action == 'ready':
                await self.handle_player_ready()
            
        except json.JSONDecodeError:
            logger.error(f"Invalid JSON received: {text_data}")
        except Exception as e:
            logger.error(f"Error processing message: {str(e)}")

    @database_sync_to_async
    def add_to_matchmaking(self):
        # Add player to matchmaking queue
        player_data = {
            'user_id': self.user.id,
            'username': self.user.username,
            'channel_name': self.channel_name,
            'rating': self.get_player_rating()
        }
        self.redis.rpush('matchmaking_queue', json.dumps(player_data))
        asyncio.create_task(self.find_match())

    async def find_match(self):
        while True:
            queue_length = self.redis.llen('matchmaking_queue')
            if queue_length >= 2:
                # Get two players with similar ratings
                players = []
                for _ in range(queue_length):
                    player = json.loads(self.redis.lpop('matchmaking_queue'))
                    players.append(player)
                    if len(players) == 2:
                        break
                
                # Create a new game
                game_id = f"game_{self.user.id}_{players[1]['user_id']}"
                self.game_id = game_id
                self.room_group_name = f"game_{game_id}"
                
                # Initialize game state
                game_state = {
                    'game_id': game_id,
                    'player1': players[0],
                    'player2': players[1],
                    'ball_position': {'x': 50, 'y': 50},
                    'ball_velocity': {'dx': 5, 'dy': 5},
                    'paddle1_position': 50,
                    'paddle2_position': 50,
                    'score': {'player1': 0, 'player2': 0},
                    'status': 'waiting'
                }
                
                # Store game state in Redis
                self.redis.set(f"game_state_{game_id}", json.dumps(game_state))
                
                # Add players to game group
                for player in players:
                    await self.channel_layer.group_add(
                        self.room_group_name,
                        player['channel_name']
                    )
                
                # Notify players about match
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'game.start',
                        'game_id': game_id,
                        'players': players
                    }
                )
                break
            
            await asyncio.sleep(1)  # Wait before checking queue again

    async def handle_paddle_movement(self, data):
        if not self.game_id:
            return
        
        position = data.get('position', 50)
        game_state = json.loads(self.redis.get(f"game_state_{self.game_id}"))
        
        # Update paddle position
        if game_state['player1']['user_id'] == self.user.id:
            game_state['paddle1_position'] = position
        else:
            game_state['paddle2_position'] = position
        
        # Save updated state
        self.redis.set(f"game_state_{self.game_id}", json.dumps(game_state))
        
        # Broadcast update
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'game.update',
                'game_state': game_state
            }
        )

    async def game_loop(self):
        while True:
            if not self.game_id:
                break
                
            game_state = json.loads(self.redis.get(f"game_state_{self.game_id}"))
            if game_state['status'] != 'playing':
                await asyncio.sleep(1/60)  # 60 FPS
                continue
                
            # Update ball position
            game_state['ball_position']['x'] += game_state['ball_velocity']['dx']
            game_state['ball_position']['y'] += game_state['ball_velocity']['dy']
            
            # Ball collision with top/bottom
            if game_state['ball_position']['y'] <= 0 or game_state['ball_position']['y'] >= 100:
                game_state['ball_velocity']['dy'] *= -1
            
            # Ball collision with paddles
            if (game_state['ball_position']['x'] <= 5 and 
                abs(game_state['ball_position']['y'] - game_state['paddle1_position']) < 10):
                game_state['ball_velocity']['dx'] *= -1
            elif (game_state['ball_position']['x'] >= 95 and 
                  abs(game_state['ball_position']['y'] - game_state['paddle2_position']) < 10):
                game_state['ball_velocity']['dx'] *= -1
            
            # Score points
            if game_state['ball_position']['x'] <= 0:
                game_state['score']['player2'] += 1
                self.reset_ball(game_state)
            elif game_state['ball_position']['x'] >= 100:
                game_state['score']['player1'] += 1
                self.reset_ball(game_state)
            
            # Check for game end
            if game_state['score']['player1'] >= 11 or game_state['score']['player2'] >= 11:
                game_state['status'] = 'finished'
                await self.handle_game_end(game_state)
            
            # Save and broadcast state
            self.redis.set(f"game_state_{self.game_id}", json.dumps(game_state))
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'game.update',
                    'game_state': game_state
                }
            )
            
            await asyncio.sleep(1/60)  # 60 FPS

    def reset_ball(self, game_state):
        game_state['ball_position'] = {'x': 50, 'y': 50}
        game_state['ball_velocity'] = {'dx': 5, 'dy': 5}

    @database_sync_to_async
    def get_player_rating(self):
        # Implement your rating system here
        return 1000  # Default rating

    async def handle_game_end(self, game_state):
        winner = game_state['player1'] if game_state['score']['player1'] > game_state['score']['player2'] else game_state['player2']
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'game.end',
                'winner': winner,
                'final_score': game_state['score']
            }
        )
        # Update ratings and store match result in database
        await self.update_ratings(game_state)

    # Handlers for different message types
    async def game_start(self, event):
        await self.send(json.dumps({
            'type': 'game_start',
            'game_id': event['game_id'],
            'players': event['players']
        }))

    async def game_update(self, event):
        await self.send(json.dumps({
            'type': 'game_update',
            'game_state': event['game_state']
        }))

    async def game_end(self, event):
        await self.send(json.dumps({
            'type': 'game_end',
            'winner': event['winner'],
            'final_score': event['final_score']
        }))