from django.core.management.base import BaseCommand
from chat.models import ChatRoom, Message
from accounts.models import Player  # Adjust the import according to your project structure
  # Adjust the import according to your app structure

class Command(BaseCommand):
    help = 'Create chat rooms and messages'

    def handle(self, *args, **kwargs):
        # Create players (if not already created)
        player1, created1 = Player.objects.get_or_create(username='ali')
        player2, created2 = Player.objects.get_or_create(username='meryem')

        # Create a chat room with exactly two participants
        chat_room, created = ChatRoom.objects.get_or_create(name='ChatRoom1')
        chat_room.senders.set([player1, player2])  # Ensure only two participants
        chat_room.save()

        # Create messages in the chat room
        Message.objects.create(chatroom=chat_room, sender=player1, content='Hello from roo')
        Message.objects.create(chatroom=chat_room, sender=player2, content='Hello from hiya')

        self.stdout.write(self.style.SUCCESS('Successfully created chat rooms and messages'))