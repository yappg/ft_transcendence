# invite_consumer.py
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.core.exceptions import ObjectDoesNotExist
import json
from accounts.models import Player, PlayerProfile
from typing import Optional, Dict
import GameInviteManager

invite_manager = GameInviteManager()

class GameInviteConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = None
        self.invite_group = None
        
    async def connect(self):
        """Handle WebSocket connection"""
        if not self.scope["user"].is_authenticated:
            await self.close()
            return

        self.user = self.scope["user"]
        self.invite_group = f'invite_group_{self.user.id}'
        
        # Add user to their personal invite group
        await self.channel_layer.group_add(self.invite_group, self.channel_name)
        
        # Accept the connection
        await self.accept()
        
        # Update user status to available
        await self.update_user_status('available')

    async def disconnect(self, close_code):
        """Handle WebSocket disconnection"""
        if self.user:
            # Remove from invite group
            await self.channel_layer.group_discard(self.invite_group, self.channel_name)
            # Update user status
            await self.update_user_status('offline')

    async def receive(self, text_data):
        """Handle incoming WebSocket messages"""
        try:
            data = json.loads(text_data)
            action = data.get('action')

            if action == 'send_invite':
                await self.handle_send_invite(data)
            elif action == 'accept_invite':
                await self.handle_accept_invite(data)
            elif action == 'reject_invite':
                await self.handle_reject_invite(data)
            else:
                await self.send_error('Invalid action')

        except json.JSONDecodeError:
            await self.send_error('Invalid JSON format')
        except Exception as e:
            await self.send_error(f'Error processing request: {str(e)}')

    async def handle_send_invite(self, data):
        """Handle sending game invites"""
        try:
            receiver_id = data.get('receiver_id')
            if not receiver_id:
                await self.send_error('Receiver ID is required')
                return

            # Check if receiver exists and is available
            receiver = await self.get_player(receiver_id)
            if not receiver:
                await self.send_error('Invalid receiver')
                return

            # Try to send the invite through the invite manager
            invite_id = await invite_manager.send_invite(
                self.user.id, receiver_id
            )

            if invite_id:
                await self.send_json({
                    'type': 'invite_sent',
                    'invite_id': invite_id,
                    'receiver_id': receiver_id
                })
            else:
                await self.send_error('Failed to send invite')

        except Exception as e:
            await self.send_error(f'Error sending invite: {str(e)}')

    async def handle_accept_invite(self, data):
        """Handle accepting game invites"""
        invite_id = data.get('invite_id')
        if not invite_id:
            await self.send_error('Invite ID is required')
            return

        success = await invite_manager.handle_invite_response(
            invite_id, accepted=True
        )

        if success:
            await self.send_json({
                'type': 'invite_accepted',
                'invite_id': invite_id
            })
        else:
            await self.send_error('Failed to accept invite')

    async def handle_reject_invite(self, data):
        """Handle rejecting game invites"""
        invite_id = data.get('invite_id')
        if not invite_id:
            await self.send_error('Invite ID is required')
            return

        success = await invite_manager.handle_invite_response(
            invite_id, accepted=False
        )

        if success:
            await self.send_json({
                'type': 'invite_rejected',
                'invite_id': invite_id
            })
        else:
            await self.send_error('Failed to reject invite')

    # Websocket group event handlers
    async def invite_notification(self, event):
        """Handle invite-related notifications"""
        await self.send_json(event)

    async def status_update(self, event):
        """Handle status update notifications"""
        await self.send_json(event)

    # Helper methods
    @database_sync_to_async
    def get_player(self, player_id: int) -> Optional[Dict]:
        """Get player information from database"""
        try:
            player = Player.objects.select_related('profile').get(id=player_id)
            return {
                'id': player.id,
                'username': player.username,
                'status': player.profile.status
            }
        except ObjectDoesNotExist:
            return None

    @database_sync_to_async
    def update_user_status(self, status: str):
        """Update user's status in database"""
        try:
            profile = self.user.profile
            profile.status = status
            profile.save(update_fields=['status'])
        except Exception as e:
            print(f"Error updating user status: {str(e)}")

    @database_sync_to_async
    def get_available_players(self) -> list:
        """Get list of available players"""
        try:
            players = Player.objects.select_related('profile').filter(
                profile__status='available'
            ).exclude(id=self.user.id)
            
            return [{
                'id': player.id,
                'username': player.username,
                'status': player.profile.status
            } for player in players]
        except Exception as e:
            print(f"Error getting available players: {str(e)}")
            return []

    async def send_error(self, message: str):
        """Send error message to client"""
        await self.send_json({
            'type': 'error',
            'message': message
        })

    async def send_json(self, content: dict):
        """Send JSON message to client"""
        await self.send(text_data=json.dumps(content))