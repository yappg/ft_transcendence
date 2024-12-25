from rest_framework import status , viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from drf_yasg.utils import swagger_auto_schema
from ..permissions import (
    IsOwnerOrAdminReadOnly,
    IsOwnerOrAdmin,
)
from ..models import *
from ..serializers.userManagmentSerlizers import *

#--------------------------Players RESTFUL API ------------------------------

## add a point for disabling account and activating it for abstract user
# class PlayerViewSet(viewsets.ReadOnlyModelViewSet):
#     permission_classes = [IsAuthenticated]
#     queryset = Player.objects.all()
#     serializer_class = PlayerSerializer


# exlude disabled profiles with is_active to false from the account return to front that the profile is private
class PlayerProfileViewSet(viewsets.ModelViewSet):
    queryset = PlayerProfile.objects.all()
    serializer_class = PlayerProfileSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdminReadOnly]
    http_method_names = ['get', 'put', 'patch', 'options']

    def get_queryset(self):
        if self.action == 'list':
            return PlayerProfile.objects.all()[:10]
        return PlayerProfile.objects.all()

    def get_object(self):
        try:
            return super().get_object()
        except PlayerProfile.DoesNotExist:
            raise NotFound("Player profile not found.")

class MatchHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MatchHistory.objects.all()
    serializer_class = MatchHistorySerializer
    permission_classes = [IsAuthenticated]


    def get_queryset(self):
        if self.action == 'list':
            return MatchHistory.objects.all()[:10]
        return MatchHistory.objects.all()

    def retrieve(self, request, pk=None):
        if not pk:
            raise NotFound("Profile ID is required.")
        try:
            profile = PlayerProfile.objects.select_related('player').get(pk=pk)
            if profile.settings.private_profile == True:
                return Response(data=[], status=status.HTTP_200_OK)
            matches = profile.all_matches()
            serializer = self.get_serializer(matches, many=True)
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        except PlayerProfile.DoesNotExist:
            raise NotFound("Player profile not found.")
        except Exception as e:
            return Response(
                {"error": "An error occurred while fetching match history"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PlayerAchievementViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PlayerAchievement.objects.all()
    serializer_class = PlayerAchievementSerializer
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, pk=None):
        if not pk:
            raise NotFound("Profile ID is required.")
        try:
            profile = PlayerProfile.objects.select_related('player').get(pk=pk)
            achievements = profile.all_achievements()
            serializer = self.get_serializer(achievements, many=True)
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        except PlayerProfile.DoesNotExist:
            raise NotFound("Player profile not found.")
        except Exception as e:
            return Response(
                {"error": "An error occurred while fetching achievements"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

#--------------------------User Infos ------------------------------

class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = PlayerProfileSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'put', 'patch', 'options']

    def get_queryset(self):
        try:
            return PlayerProfile.objects.select_related('player').filter(player=self.request.user)
        except Exception:
            return PlayerProfile.objects.none()

    def get_object(self):
        try:
            return self.get_queryset().get()
        except PlayerProfile.DoesNotExist:
            raise NotFound("Player profile not found.")
        except PlayerProfile.MultipleObjectsReturned:
            raise NotFound("Error Multiple player profile found for the user.")


class UserSettingsViewSet(viewsets.ModelViewSet):
    serializer_class = PlayerSettingsSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'put', 'patch', 'options']


    def get_queryset(self):
        try:
            return PlayerSettings.objects.filter(id=self.request.user.id)
        except Exception:
            return PlayerSettings.objects.none()

    def get_object(self):
        try:
            profile = PlayerProfile.objects.select_related('settings').get(player=self.request.user)
            if not profile.settings:
                raise NotFound("Settings not found for this user.")
            return profile.settings
        except PlayerProfile.DoesNotExist:
            raise NotFound("Player profile not found.")
        except Exception as e:
            raise NotFound("Error retrieving user settings.")


class UserHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MatchHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            user = self.request.user
            player_profile = PlayerProfile.objects.select_related('player').get(player=user)
            return player_profile.all_matches()
        except PlayerProfile.DoesNotExist:
            return []
        except Exception:
            return []

class UserAchivementViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PlayerAchievementSerializer

    def get_queryset(self):
        try:
            user = self.request.user
            profile = PlayerProfile.objects.select_related('player').get(player=user)
            return profile.all_achievements()
        except PlayerProfile.DoesNotExist:
            return []
        except Exception:
            return []

# #--------------------------User Infos Update ------------------------------

# class UpdateUserInfos(APIView):
#     # permission_classes = [Allow]
#     serializer_class = UpdateUserInfosSerializer

#     def post(self, request):
#         serializer = UpdateUserInfosSerializer(
#             data=request.data,
#             context={'user':request.user}
#             )
#         if serializer.is_valid():
#             serializer.save()
#             return Response({'message': 'You Updated your informations'}, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_200_OK)

# {"username":"kad","password":"asd123"}


# class PlayerProfileView(APIView):

#     def get(self, request):
#         permission_classes = [IsAuthenticated]
#         userInfo = request.user
#         serializer = PlayerSerializer(userInfo)
#         return Response(serializer.data, status=200)


# class PlayerProfileViewWithUserName(APIView):

#     permission_classes = [IsAuthenticated]

#     def get(self, request, username):
#         userInfo = get_object_or_404(Player, username=username)
#         serializer = PlayerSerializer(userInfo)
#         return Response(serializer.data, status=200)
# # -----


# class PlayerProfileViewWithId(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, userId):
#         userInfo = get_object_or_404(Player, id=userId)
#         serializer = PlayerSerializer(userInfo)
#         return Response(serializer.data, status=200)

# # ----

# class PlayersViewList(ListAPIView):
#     permission_classes = [IsAuthenticated]
#     model = Player
#     serializer_class=PlayerSerializer
#     queryset=Player.objects.all()
