from ..models import *

class PlayerRepository:

    @staticmethod
    def get_players(self):
        return Player.objects.all()

    @staticmethod
    def create_player(self, player_data):
        player = Player.objects.create(username=player_data['username'], email=player_data['email'])
        return player


    @staticmethod
    def get_player_by_id(self, player_id):
        return Player.objects.get(id=player_id)

    @staticmethod
    def update_player_by_id(self, player_id, player_data):
        player = Player.objects.get(id=player_id)
        player.username = player_data['username']
        player.email = player_data['email']
        player.save()


    # @staticmethod
    # @def delete_player_by_id(self, player_id):


    # @staticmethod
    # de


    @staticmethod
    def get_player_profile_by_id(self, player_id):
        player = Player.objects.get(id=player_id)
        return player.player_profile

    @staticmethod
    def get_player_settings_by_id(self, player_id):
        player = Player.objects.get(id=player_id)
        return player.player_profile.player_settings


    @staticmethod
    def update_player_by_id(self, player_id, player_data):
        player = Player.objects.get(id=player_id)
        player.username = player_data['username']
        player.email = player_data['email']
        player.save()


    @staticmethod
    def delete_player_by_id(self, player_id):
        player = Player.objects.get(id=player_id)
        player.delete()
