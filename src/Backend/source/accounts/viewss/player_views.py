from rest_framework.permissions import IsAuthenticated , AllowAny
from rest_framework import permissions
from rest_framework import viewsets
from ..permissions import *
from ..serializers import *
from rest_framework import status , response
from rest_framework.exceptions import NotFound

class IsOwnerOrAdmin(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        # print(f"===== DEBUG ==== : (|{obj.display_name}| == |{request.user.profile.display_name}|) is staff or user : {(request.user == obj.player or request.user.is_staff)}")
        return (request.user == obj.player or request.user.is_staff)


class IsOwnerOrAdminReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        # print(f"===== DEBUG ==== : (|{obj.display_name}| == |{request.user.profile.display_name}|) is staff or user : {(request.user == obj.player or request.user.is_staff)}")

        # return True

        return (request.user == obj.player or request.user.is_staff)


#--------------------------Players RESTFUL API ------------------------------

## add a point for disabling account and activating it for abstract user
# class PlayerViewSet(viewsets.ReadOnlyModelViewSet):
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
            return response.Response(data=serializer.data, status=status.HTTP_200_OK)

        except PlayerProfile.DoesNotExist:
            raise NotFound("Player profile not found.")


class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = PlayerProfileSerializer
    permission_classes = [IsAuthenticated]  ## test out
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
    permission_classes = [IsAuthenticated] ## test out
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
