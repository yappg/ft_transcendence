import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from .services import GameService, LeaderboardService
from .models import Game, PlayerProfile

logger = logging.getLogger(__name__)

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if not self.scope["user"].is_authenticated:
            logger.warning("Unauthenticated connection attempt rejected")
            await self.close(code=4003)
            return
        await self.accept()
        print(self.scope["user"].username)
        # print(self.scope["user"].email)
    
    async def receive_json(self, message):
        cmd = message.get("command")
        if command == "access":
            print(message["data_string"])
            await self.send_json({
                "command_response": "The command to \
                say hello was received ",
                "data_string_bacK": message.get
              ("data_string", None)
            })
    # async def connect(self):
    #     # Reject connection if user is not authenticated
    #     if not self.scope["user"].is_authenticated:
    #         logger.warning("Unauthenticated connection attempt rejected")
    #         await self.close(code=4003)
    #         return
    #     try:
    #         logger.info("Starting connection attempt...")
            
    #         self.user = self.scope["user"]
            
    #         # Handle anonymous users and save the profile
    #         if isinstance(self.user, AnonymousUser):
    #             print("debuuuuusuusuususususus")
    #             logger.info("Creating anonymous player profile")
    #             self.player_profile = PlayerProfile(display_name="Anonymous")
    #             # Save the anonymous profile to the database
    #             await self.save_player_profile()
    #         else:
    #             logger.info(f"Getting profile for user: {self.user.username}")
    #             self.player_profile = await self.get_or_create_player_profile()
            
    #         logger.info("Accepting connection...")
    #         await self.accept()
            
    #         # Generate a unique room name
    #         self.room_name = f"game_{self.channel_name}"
            
    #         # Try to join existing game or create a new one
    #         logger.info("Looking for available game...")
    #         available_game = await self.get_available_game()
            
    #         if available_game:
    #             logger.info(f"Joining existing game {available_game.id}")
    #             self.game = await GameService.join_game(available_game, self.player_profile)
    #             self.room_name = f"game_{self.game.id}"
    #             logger.info("Starting game...")
    #             await GameService.start_game(self.game)
    #         else:
    #             logger.info("Creating new game...")
    #             self.game = await GameService.create_game(
    #                 player=self.player_profile,
    #                 room_name=self.room_name
    #             )
    #             logger.info(f"New game created with ID: {self.game.id}")
            
    #         # Add to game group
    #         logger.info(f"Adding to game group: {self.room_name}")
    #         await self.channel_layer.group_add(
    #             self.room_name,
    #             self.channel_name
    #         )
            
    #         # Send initial game state
    #         logger.info("Broadcasting initial game state...")
    #         await self.broadcast_game_state()
            
    #         logger.info("Connection setup complete!")
            
    #     except Exception as e:
    #         logger.error(f"Error during connection: {str(e)}", exc_info=True)
    #         if hasattr(self, 'room_name'):
    #             await self.channel_layer.group_discard(
    #                 self.room_name,
    #                 self.channel_name
    #             )
    #         await self.close()

    # async def save_player_profile(self):
    #     """Save the player profile to the database"""
    #     try:
    #         # Use sync_to_async if your PlayerProfile.save() is not async
    #         from asgiref.sync import sync_to_async
    #         await sync_to_async(self.player_profile.save)()
    #     except Exception as e:
    #         logger.error(f"Error saving player profile: {str(e)}")
    #         raise

    # async def get_or_create_player_profile(self):
    #     """Get existing profile or create new one for authenticated user"""
    #     try:
    #         # First try to get existing profile
    #         profile = await PlayerProfile.objects.filter(user=self.user).afirst()
    #         if profile:
    #             return profile

    #         # If no profile exists, create one
    #         profile = PlayerProfile(
    #             user=self.user,
    #             name=self.user.username
    #         )
    #         await sync_to_async(profile.save)()
    #         return profile
    #     except Exception as e:
    #         logger.error(f"Error getting/creating player profile: {str(e)}")
    #         raise

    # # ... rest of the consumer methods remain the same ...

    # async def get_available_game(self):
    #     """Get an available game or return None"""
    #     try:
    #         logger.info("Searching for available games...")
    #         game = await Game.objects.filter(status='WAITING', player2=None).afirst()
    #         logger.info(f"Found game: {game.id if game else None}")
    #         return game
    #     except Exception as e:
    #         logger.error(f"Error finding available game: {str(e)}")
    #         return None