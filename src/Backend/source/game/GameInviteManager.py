from .GameEngine import GamePlayer, PingPongGame
from .PrivateMatchMaking import PrivateMatchMakingSystem
from channels.layers import get_channel_layer
from channels.db import database_sync_to_async
from django.core.exceptions import ObjectDoesNotExist
from dataclasses import dataclass
from typing import Dict, Optional
import asyncio
import time
from accounts.models import Player

@dataclass
class GameInvite:
    invite_id: str
    sender_username: str
    receiver_username: str
    created_at: float
    status: str = 'pending'  # pending, accepted, rejected, expired
    expiry_time: int = 120  # seconds

class GameInviteManager:
    def __init__(self):
        self.pending_invites: Dict[str, GameInvite] = {}
        self.channel_layer = get_channel_layer()
        self.matchmaking_system = PrivateMatchMakingSystem()
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
                print(f'expired id {invite_id}')
                invite = self.pending_invites.get(invite_id)
                await self._handle_expired_invite(invite)
                del self.pending_invites[invite_id]
            print('cleanup...')
            await asyncio.sleep(5)


    async def send_invite(self, sender_username: str, receiver_username: str) -> Optional[str]:
        currTime = time.time()
        invite_id = f"invite_{sender_username}_{receiver_username}_{int(currTime)}"
        invite = GameInvite(
            invite_id=invite_id,
            sender_username=sender_username,
            receiver_username=receiver_username,
            created_at=currTime
        )
        
        # Store the invite and verify it's stored
        self.pending_invites[invite_id] = invite
        print('Debug - New invite created:', invite_id)
        print('Debug -OLLLALLALLALLALALALALALALALALL Current pending invites:', sender_username)#self.pending_invites)
        
        await self.channel_layer.group_send(
            f'invite_group_{receiver_username}',
            {
                'type': 'game_invite',
                'invite_id': invite_id,
                'sender_username': sender_username,
                'action': 'receive'
            }
        )
        
        return invite_id

    async def handle_invite_response(self, invite_id: str, accepted: bool) -> bool:
        # print('Debug - All pending invites:', self.pending_invites)
        # print('Debug - Looking for invite_id:', invite_id)
        invite = self.pending_invites.get(invite_id)
        print(invite)
        if not invite or invite.status != 'pending':
            print('Debug - Invite not found or not pending')
            return False

        if accepted:
            return await self._handle_accepted_invite(invite)
        else:
            return await self._handle_rejected_invite(invite)

    async def _handle_accepted_invite(self, invite: GameInvite) -> bool:
        try:
            sender = await self._get_player(invite.sender_username)
            receiver = await self._get_player(invite.receiver_username)
            
            if not sender or not receiver:
                return False

            print("game iddd ")
            game_id = self.matchmaking_system.generate_unique_game_id()
            new_game = PingPongGame(sender, receiver, gameID=game_id)
            
            self.matchmaking_system.games[game_id] = new_game
            self.matchmaking_system.players_in_game.add(invite.sender_username)
            self.matchmaking_system.players_in_game.add(invite.receiver_username)
            
            await self.channel_layer.group_add(f'game_{game_id}', sender.channel_name)
            await self.channel_layer.group_add(f'game_{game_id}', receiver.channel_name)
            
            await self.matchmaking_system.notify_players(sender, receiver, game_id)
            
            invite.status = 'accepted'
            del self.pending_invites[invite.invite_id]
            return True
            
        except Exception as e:
            print(f"Error handling accepted invite: {str(e)}")
            return False

    async def _handle_rejected_invite(self, invite: GameInvite) -> bool:
        invite.status = 'rejected'
        print (f'rejected {invite}')
        await self.channel_layer.group_send(
            f'invite_group_{invite.sender_username}',
            {
                'type': 'game_reject',
                # 'invite_id': invite.invite_id,
                # 'sender_username': invite.sender_username,
                'action': 'rejected'
            }
        )
        
        del self.pending_invites[invite.invite_id]
        return True

    async def _handle_expired_invite(self, invite: GameInvite):
        invite.status = 'expired'
        
        for username in [invite.sender_username, invite.receiver_username]:
            await self.channel_layer.group_send(
                f'invite_group_{username}',
                {
                    'type': 'game_invite',
                    'invite_id': invite.invite_id,
                    'action': 'expired'
                }
            )

    @database_sync_to_async
    def _get_player(self, username: str) -> Optional[GamePlayer]:
        try:
            player = Player.objects.get(username=username)
            return GamePlayer(username, player.username, f'invite_group_{username}')
        except ObjectDoesNotExist:
            return None