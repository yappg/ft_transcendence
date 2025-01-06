# game_invite.py

from GameEngine import GamePlayer, PingPongGame
from channels.layers import get_channel_layer
from channels.db import database_sync_to_async
from django.core.exceptions import ObjectDoesNotExist
from dataclasses import dataclass
from typing import Dict, Optional
import asyncio
import time

@dataclass
class GameInvite:
    invite_id: str
    sender_id: int
    receiver_id: int
    created_at: float
    status: str = 'pending'  # pending, accepted, rejected, expired
    expiry_time: int = 30  # seconds

class GameInviteManager:
    def __init__(self, matchmaking_system):
        self.pending_invites: Dict[str, GameInvite] = {}
        self.channel_layer = get_channel_layer()
        self.matchmaking_system = matchmaking_system
        self._cleanup_task = None
        self._running = False

    async def start(self):
        if not self._running:
            self._running = True
            self._cleanup_task = asyncio.create_task(self._cleanup_loop())

    async def _cleanup_loop(self):
        while self._running:
            current_time = time.time()
            expired_invites = [
                invite_id for invite_id, invite in self.pending_invites.items()
                if current_time - invite.created_at > invite.expiry_time
            ]
            
            for invite_id in expired_invites:
                invite = self.pending_invites[invite_id]
                await self._handle_expired_invite(invite)
                del self.pending_invites[invite_id]
            
            await asyncio.sleep(5)  # Check every 5 seconds

    async def send_invite(self, sender_id: int, receiver_id: int) -> Optional[str]:
        # Validate if both players are available
        if not await self._can_send_invite(sender_id, receiver_id):
            return None
        
        invite_id = f"invite_{sender_id}_{receiver_id}_{int(time.time())}"
        invite = GameInvite(
            invite_id=invite_id,
            sender_id=sender_id,
            receiver_id=receiver_id,
            created_at=time.time()
        )
        
        self.pending_invites[invite_id] = invite
        
        # Notify receiver
        await self.channel_layer.group_send(
            f'selfGroup_{receiver_id}',
            {
                'type': 'game.invite',
                'invite_id': invite_id,
                'sender_id': sender_id,
                'action': 'receive'
            }
        )
        
        return invite_id

    async def handle_invite_response(self, invite_id: str, accepted: bool) -> bool:
        invite = self.pending_invites.get(invite_id)
        if not invite or invite.status != 'pending':
            return False

        if accepted:
            return await self._handle_accepted_invite(invite)
        else:
            return await self._handle_rejected_invite(invite)

    async def _handle_accepted_invite(self, invite: GameInvite) -> bool:
        try:
            # Create players and add them to matchmaking
            sender = await self._get_player(invite.sender_id)
            receiver = await self._get_player(invite.receiver_id)
            
            if not sender or not receiver:
                return False

            # Create a direct game through matchmaking
            game_id = self.matchmaking_system.generate_unique_game_id()
            new_game = PingPongGame(sender, receiver, gameID=game_id)
            
            self.matchmaking_system.games[game_id] = new_game
            self.matchmaking_system.players_in_game.add(invite.sender_id)
            self.matchmaking_system.players_in_game.add(invite.receiver_id)
            
            # Add players to game channel
            await self.channel_layer.group_add(f'game_{game_id}', sender.channel_name)
            await self.channel_layer.group_add(f'game_{game_id}', receiver.channel_name)
            
            # Notify both players
            await self.matchmaking_system.notify_players(sender, receiver, game_id)
            
            invite.status = 'accepted'
            del self.pending_invites[invite.invite_id]
            return True
            
        except Exception as e:
            print(f"Error handling accepted invite: {str(e)}")
            return False

    async def _handle_rejected_invite(self, invite: GameInvite) -> bool:
        invite.status = 'rejected'
        
        # Notify sender of rejection
        await self.channel_layer.group_send(
            f'selfGroup_{invite.sender_id}',
            {
                'type': 'game.invite',
                'invite_id': invite.invite_id,
                'action': 'rejected'
            }
        )
        
        del self.pending_invites[invite.invite_id]
        return True

    async def _handle_expired_invite(self, invite: GameInvite):
        invite.status = 'expired'
        
        # Notify both players
        for player_id in [invite.sender_id, invite.receiver_id]:
            await self.channel_layer.group_send(
                f'selfGroup_{player_id}',
                {
                    'type': 'game.invite',
                    'invite_id': invite.invite_id,
                    'action': 'expired'
                }
            )

    @database_sync_to_async
    def _can_send_invite(self, sender_id: int, receiver_id: int) -> bool:
        try:
            # Check if either player is in game or queue
            if (sender_id in self.matchmaking_system.players_in_game or 
                receiver_id in self.matchmaking_system.players_in_game or
                sender_id in self.matchmaking_system.players_queue or
                receiver_id in self.matchmaking_system.players_queue):
                return False
            
            # Check if there's already a pending invite between these players
            existing_invites = [
                invite for invite in self.pending_invites.values()
                if (invite.sender_id == sender_id and invite.receiver_id == receiver_id) or
                   (invite.sender_id == receiver_id and invite.receiver_id == sender_id)
            ]
            if existing_invites:
                return False
                
            return True
            
        except Exception as e:
            print(f"Error checking invite availability: {str(e)}")
            return False

    @database_sync_to_async
    def _get_player(self, player_id: int) -> Optional[GamePlayer]:
        try:
            player = Player.objects.select_related('profile').get(id=player_id)
            return GamePlayer(player_id, player.username, f'selfGroup_{player_id}')
        except ObjectDoesNotExist:
            return None