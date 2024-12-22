from rest_framework.throttling import AnonRateThrottle
from rest_framework.exceptions import Throttled
from rest_framework import permissions

class AnonRateLimitThrottling(AnonRateThrottle):
    rate = '3/min'

    # def throttle_failure(self, request, wait):
    #     # Customize the response when the rate limit is exceeded
    #     raise Throttled(detail={
    #         'error': 'OLALALALALLL.',
    #         'available_in': wait  # time until the user can retry
    #     }, status_code=429)

class IsOwnerOrAdmin(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        return (request.user == obj.player or request.user.is_staff)

class IsOwnerOrAdminReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return (request.user == obj.player or request.user.is_staff)
