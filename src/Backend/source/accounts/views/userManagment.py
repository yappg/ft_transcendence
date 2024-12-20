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



class MatchHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MatchHistory.objects.all()
    serializer_class = MatchHistorySerializer
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, pk=None):
        try:
            profile = PlayerProfile.objects.get(pk=pk)

            serializer = self.get_serializer(profile.all_matches(), many=True)
            return Response(data=serializer.data, status=status.HTTP_200_OK)

        except PlayerProfile.DoesNotExist:
            raise NotFound("Player profile not found.")


class PlayerAchievementViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PlayerAchievement.objects.all()
    serializer_class = PlayerAchievementSerializer
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, pk=None):
        try:
            profile = PlayerProfile.objects.get(pk=pk)

            serializer = self.get_serializer(profile.all_achievements(), many=True)
            return Response(data=serializer.data, status=status.HTTP_200_OK)

        except PlayerProfile.DoesNotExist:
            raise NotFound("Player profile not found.")

#--------------------------User Infos ------------------------------

class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = PlayerProfileSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'put', 'patch', 'options']

    def get_queryset(self):
        return PlayerProfile.objects.filter(player=self.request.user)

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
        return PlayerSettings.objects.filter(id=self.request.user.id)

    def get_object(self):
        try:
            profile = PlayerProfile.objects.get(player=self.request.user)
            settings = profile.settings
            return settings
        except PlayerSettings.DoesNotExist:
            raise NotFound("Player settings not found.")
        except PlayerSettings.MultipleObjectsReturned:
            raise NotFound("Error Multiple player settings found for the user.")


class UserHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MatchHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            user = self.request.user
            player_profile = user.profile
            return player_profile.all_matches()
        except PlayerProfile.DoesNotExist:
            raise NotFound("Player profile not found.")

class UserAchivementViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PlayerAchievementSerializer

    def get_queryset(self):
        try:
            user = self.request.user
            profile = user.profile
            return profile.all_achievements()
        except PlayerProfile.DoesNotExist:
            raise NotFound("Player profile not found.")

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
