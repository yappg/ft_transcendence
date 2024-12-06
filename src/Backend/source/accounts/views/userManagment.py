

from rest_framework import status , viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from drf_yasg.utils import swagger_auto_schema
from ..permissions import (
    IsOwnerOrAdminReadOnly,
    IsOwnerOrAdmin,
)
from ..models import *
from ..serializers import *

#--------------------------Players RESTFUL API ------------------------------

## add a point for disabling account and activating it for abstract user
# class PlayerViewSet(viewsets.ReadOnlyModelViewSet):
#     permission_classes = [IsAuthenticated]
#     queryset = Player.objects.all()
#     serializer_class = PlayerSerializer
#     permission_classes = [AllowAny]

class PlayerProfileViewSet(viewsets.ModelViewSet):
    # exlude disabled profiles with is_active from the account return to front that the profile is private
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
            return self.get_queryset().get()
        except PlayerSettings.DoesNotExist:
            raise NotFound("Player settings not found.")
        except PlayerSettings.MultipleObjectsReturned:
            raise NotFound("Error Multiple player settings found for the user.")


class UserHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MatchHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        try:
            player_profile = user.profile
            return player_profile.all_matches()
        except PlayerProfile.DoesNotExist:
            raise NotFound("Player profile not found.")

#--------------------------User Infos Update ------------------------------

class UpdateUserInfos(APIView):
    serializer_class = UpdateUserInfosSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def post(self, request):
        serializer = UpdateUserInfosSerializer(
            data=request.data,
            context={'user':request.user}
            )
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'informations Succesfuly Updated'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
