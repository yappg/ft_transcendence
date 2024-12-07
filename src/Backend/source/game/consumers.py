import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from .services import GameService, LeaderboardService
from .models import Game, PlayerProfile

# working with logging for tracking errors and infos realtime..
logger = logging.getLogger(__name__)

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Reject connection if user is not authenticated
        if not self.scope["user"].is_authenticated:
            logger.warning("Unauthenticated connection attempt rejected")
            await self.close(code=4003)
            return
        try:
            logger.info("Starting connection attempt...")
            
            self.user = self.scope["user"]
            
            # Handle anonymous users and save the profile
            # if isinstance(self.user, AnonymousUser):
            #     print("debuuuuusuusuususususus")
            #     logger.info("Creating anonymous player profile")
            #     self.player_profile = PlayerProfile(display_name="Anonymous")
            #     # Save the anonymous profile to the database
            #     await self.save_player_profile()
            # else:
            logger.info(f"Getting profile for user: {self.user.username}")
            self.player_profile = await self.get_or_create_player_profile()
            
            logger.info("Accepting connection...")
            await self.accept()
            
            # Generate a unique room name
            self.room_name = f"game_{self.channel_name}"
            
            # Try to join existing game or create a new one
            logger.info("Looking for available game...")
            available_game = await self.get_available_game()
            
            if available_game:
                logger.info(f"Joining existing game {available_game.id}")
                self.game = await GameService.join_game(available_game, self.player_profile)
                self.room_name = f"game_{self.game.id}"
                logger.info("Starting game...")
                await GameService.start_game(self.game)
            else:
                logger.info("Creating new game...")
                self.game = await GameService.create_game(
                    player=self.player_profile,
                    room_name=self.room_name
                )
                logger.info(f"New game created with ID: {self.game.id}")
            
            # Add to game group
            logger.info(f"Adding to game group: {self.room_name}")
            await self.channel_layer.group_add(
                self.room_name,
                self.channel_name
            )
            # Initialize game state
            self.game_state = {
                'ball': {'x': 0, 'y': 0, 'vx': 1, 'vy': 1},
                'paddles': {
                    self.user.username: {'x': 0, 'y': 0}
                }
            }
            
            
            # Send initial game state
            logger.info("Broadcasting initial game state...")
            await self.broadcast_game_state()
            
            logger.info("Connection setup complete!")
            
            
            # Schedule ball updates
            self.ball_update_task = self.loop.create_task(self.update_ball_loop())
            
        except Exception as e:
            logger.error(f"Error during connection: {str(e)}", exc_info=True)
            if hasattr(self, 'room_name'):
                await self.channel_layer.group_discard(
                    self.room_name,
                    self.channel_name
                )
            await self.close()


    async def save_player_profile(self):
        """Save the player profile to the database"""
        try:
            # Use sync_to_async if your PlayerProfile.save() is not async
            from asgiref.sync import sync_to_async
            await sync_to_async(self.player_profile.save)()
        except Exception as e:
            logger.error(f"Error saving player profile: {str(e)}")
            raise

    async def get_or_create_player_profile(self):
        """Get existing profile or create new one for authenticated user"""
        try:
            # First try to get existing profile
            profile = await PlayerProfile.objects.filter(user=self.user).afirst()
            if profile:
                return profile

            # If no profile exists, create one
            profile = PlayerProfile(
                user=self.user,
                name=self.user.username
            )
            await sync_to_async(profile.save)()
            return profile
        except Exception as e:
            logger.error(f"Error getting/creating player profile: {str(e)}")
            raise

    async def get_available_game(self):
        """Get an available game or return None"""
        try:
            logger.info("Searching for available games...")
            game = await Game.objects.filter(status='WAITING', player2=None).afirst()
            logger.info(f"Found game: {game.id if game else None}")
            return game
        except Exception as e:
            logger.error(f"Error finding available game: {str(e)}")
            return None
        
    
    # Handle paddle movements:
    async def receive(self, text_data):
        data = json.loads(text_data)
        if data['type'] == 'move_paddle':
            await self.move_paddle(data['x'], data['y'])

    async def move_paddle(self, x, y):
        self.game_state['paddles'][self.user.username] = {'x': x, 'y': y}
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': 'paddle_moved',
                'player': self.user.username,
                'x': x,
                'y': y
            }
        )

    async def paddle_moved(self, event):
        await self.send(text_data=json.dumps({
            'type': 'paddle_moved',
            'player': event['player'],
            'x': event['x'],
            'y': event['y']
        }))
        
        

    # Handle ball movements:
    async def update_ball_position(self):
        ball = self.game_state['ball']
        ball['x'] += ball['vx']
        ball['y'] += ball['vy']
        
        # Check for collisions and update velocities accordingly
        # (This is a simplified example; you should add proper collision detection)
        if ball['x'] <= 0 or ball['x'] >= 100:  # Assuming 100 is the width of the game area
            ball['vx'] *= -1
        if ball['y'] <= 0 or ball['y'] >= 100:  # Assuming 100 is the height of the game area
            ball['vy'] *= -1
        
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': 'ball_moved',
                'x': ball['x'],
                'y': ball['y']
            }
        )

    async def ball_moved(self, event):
        await self.send(text_data=json.dumps({
            'type': 'ball_moved',
            'x': event['x'],
            'y': event['y']
        }))
    
    # Schedule ball updates:
    async def disconnect(self, close_code):
        # Cancel the ball update task
        self.ball_update_task.cancel()
        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )

    async def update_ball_loop(self):
        while True:
            await self.update_ball_position()
            await asyncio.sleep(0.1)