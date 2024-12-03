from rest_framework.permissions import IsAuthenticated , AllowAny
from rest_framework import permissions
from rest_framework import viewsets
from ..permissions import *
from ..serializers import *
from django.shortcuts import get_object_or_404

# from rest_framework.views import APIView, Response
# from rest_framework import request, status

class IsOwnerOrAdmin(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        return (obj.player_profile.player == request.user or request.user.is_staff)


class IsOwnerOrAdminReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        # Allow GET and OPTION and HEAD requests for any user
        if request.method in permissions.SAFE_METHODS:
            return True

        # Allow PUT and PATCH only if the user owns the object
        return (obj.player == request.user or request.user.is_staff)


#--------------------------Players RESTFUL API ------------------------------

## add a point for disabling account and activating it for abstract user
# class PlayerViewSet(viewsets.ReadOnlyModelViewSet):
#     queryset = Player.objects.all()
#     serializer_class = PlayerSerializer
#     permission_classes = [AllowAny]

class PlayerProfileViewSet(viewsets.ModelViewSet):
    queryset = PlayerProfile.objects.all() # exlude disabled profiles with is_active from the account return to front that the profile is private
    serializer_class = PlayerProfileSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdminReadOnly]
    http_method_names = ['get', 'put', 'patch', 'head', 'options']


# class PlayerSettingsViewSet(viewsets.ModelViewSet):
#     serializer_class = PlayerSettingsSerializer
#     permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
#     http_method_names = ['get', 'put', 'patch', 'head', 'options']

#     def get_object(self):
#         profile_id = self.kwargs.get('profile_id')
#         # Ensure the settings belong to the requesting user
#         return get_object_or_404(PlayerSettings, profile__id=profile_id, profile__user=self.request.user)


class MatchHistoryView(viewsets.ReadOnlyModelViewSet):
    queryset = MatchHistory.objects.all()
    serializer_class = MatchHistorySerializer
    permission_classes = [IsAuthenticated]


# class UserProfileView():

# class UserSettingsView()

# class UserHistoryView()
