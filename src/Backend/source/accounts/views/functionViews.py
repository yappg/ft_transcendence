from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from ..models import PlayerProfile
from ..serializers.functionSerlizers import *

class SearchUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        search_term = request.query_params.get('search', '').strip()

        if not search_term:
            return Response({'message': 'Search term is required'}, status=status.HTTP_400_BAD_REQUEST)
        if len(search_term) > 50:
            return Response({'message': 'Search term too long'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            from relations.models import BlockedUsers

            # blocked = BlockedUsers.objects.get(user=request.user).get_blocked_users()
            blockedUsers_by = Player.objects.get(id=request.user.id).blocked_by.all()
            blocked_by = [blocker.user for blocker in blockedUsers_by]

            # print(f" ============= blocked: {blocked}")
            # print(f" ============= blocked_by: {blocked_by}")

            players = PlayerProfile.objects.filter(
                display_name__istartswith=search_term
            ).exclude(player=request.user)

            # if blocked:
            #     players = players.exclude(player__in=blocked)
            if blocked_by:
                players = players.exclude(player__in=blocked_by)

            players = players[:10]

            serializer = SearchUsersSerializer(players, many=True)
            return Response({
                'count': len(players),
                'results': serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'message': 'An error occurred while searching users'},
                status=status.HTTP_400_BAD_REQUEST
            )

class LeaderboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            top_players = PlayerProfile.objects.all().order_by(
                '-level',
                '-win_ratio',
                '-games_won',
                '-total_games',
            )[:100]

            serializer = LeaderBoardSerializer(top_players, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'message': 'An error occurred while fetching leaderboard'},
                status=status.HTTP_400_BAD_REQUEST
            )


# class SettingsView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         try:
#             from ..serializers.userManagmentSerlizers import PlayerSettingsSerializer, ProfileSettingsSerializer, SecuritySettingsSerializer
#             player = Player.objects.get(id=request.user.id)
#             profile = player.profile
#             settings = profile.settings

#             profileSerializer = ProfileSettingsSerializer(profile)
#             settingsSerializer = PlayerSettingsSerializer(settings)
#             securitySerializer = SecuritySettingsSerializer(player)

#             data = {
#                 'profile': profileSerializer.data,
#                 'settings': settingsSerializer.data,
#                 'security': securitySerializer.data,
#             }
#             return Response(data, status=status.HTTP_200_OK)
#         except Exception as e:
#             return Response({'message': 'issue fetching ' + str(e)}, status=status.HTTP_404_NOT_FOUND)

    # def patch(self, request):
    #     try:
    #         player = Player.objects.get(id=request.user.id)
    #         profile = player.profile
    #         settings = profile.settings

    #         # Separate the incoming data by model
    #         profile_data = request.data.get('profile', {})
    #         settings_data = request.data.get('settings', {})
    #         security_data = request.data.get('security', {})

    #         # Update each model with its respective serializer
    #         if profile_data:
    #             profile_serializer = PlayerProfileSerializer(profile, data=profile_data, partial=True)
    #             if profile_serializer.is_valid():
    #                 profile_serializer.save()

    #         if settings_data:
    #             settings_serializer = PlayerSettingsSerializer(settings, data=settings_data, partial=True)
    #             if settings_serializer.is_valid():
    #                 settings_serializer.save()

    #         if security_data:
    #             security_serializer = PlayerSecuritySerializer(player, data=security_data, partial=True)
    #             if security_serializer.is_valid():
    #                 security_serializer.save()

    #         # Return updated data
    #         updated_data = {
    #             'profile': profile,
    #             'settings': settings,
    #             'security': player,
    #         }
    #         return Response(settingsSerializer(updated_data).data, status=status.HTTP_200_OK)

    #     except Player.DoesNotExist:
    #         return Response({'message': 'Player not found'}, status=status.HTTP_404_NOT_FOUND)
    #     except Exception as e:
    #         return Response(
    #             {'message': f'Error updating settings: {str(e)}'},
    #             status=status.HTTP_400_BAD_REQUEST
    #         )
