# consumers0.py
import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .GameEngine import GameManager
from accounts.models import Player, PlayerProfile
from game.models import Game

game_manager = GameManager()

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if not self.scope["user"].is_authenticated:
            await self.close()
            return

        self.user = self.scope["user"]
        self.game = None
        self.game_model = None
        print(f'------------\nUser Authentified {self.user}\n----------------------\n')

        await self.accept()
        await self.add_to_matchmaking()

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            action = data.get('action')

            if action == 'move_paddle':
                if self.game:
                    new_y = data.get('position', 50)
                    self.game.move_paddle(self.user.id, new_y)
                    await self.broadcast_game_state()
            elif action == 'ready':
                if self.game and self.game.status == 'waiting':
                    self.game.start_game()
                    await self.start_game_loop()
                    await self.broadcast_game_state()
        except json.JSONDecodeError:
            pass
        except Exception as e:
            pass

    async def get_opponent(self):
        player_id = game_manager.players_queue.spop('players_queue')
        print(f'Player ID: {player_id}')
        player2 = player_id
        # player2 = await database_sync_to_async(Player.objects.get)(id=player_id)

        # self.game_model = await database_sync_to_async(Game.objects.create)(
        #             room_name=f'{player2.username}_VS_{self.user.username}',
        #             player1=self.user, player2=player2)
        return player2

    async def add_to_matchmaking(self):
        #could be there an effecient way for this checks 
        if not game_manager.player_in_queue(self.user.id): #should i make await here?? 
            game_manager.add_player_to_queue(self.user.id) #should i make await here also ?? 

        if game_manager.players_queue.slen('players_queue') > 1:
            try:
                player2 = await self.get_Opponent()
                self.game = game_manager.create_game(self.user, player2, self.game_model.id)

                await self.channel_layer.group_add(
                    f'game_{self.game_id}',
                    self.channel_name
                )
                await self.broadcast_game_state()
            except :
                # TODO need to handle this
                pass
        else:
            return

    async def start_game_loop(self):
        while self.game and self.game.status == 'playing':
            delta_time = 1/60  # 60 FPS
            if self.game.update(delta_time):
                await self.broadcast_game_state()
            await asyncio.sleep(delta_time)    
        if self.game and self.game.status == 'finished':
            await self.broadcast_game_state()
            await self.handle_game_end()
            
    async def broadcast_game_state(self):
        if not self.game:
            return
        await self.channel_layer.group_send(
            f'game_{self.game_id}',
            {
                'type': 'game.update',
                'game_state': self.game.get_state()
            }
        )

    async def handle_game_end(self):
        if not self.game:
            return
            
        # Save game result to database
        await self.save_game_result(self.game.get_state())
        
        # Clean up
        game_manager.remove_game(self.game_id)
        self.game = None
        self.game_id = None

    @database_sync_to_async
    def save_game_result(self, game_state):
        # Implement game result saving logic here
        pass

    # TODO handle the unexpeted disconnects or cleanup after normal disconnect 
    async def disconnect(self, close_code):
        # self.channel_layer.group_discard(self.groupe_name, self.channel_name)
        await self.close()