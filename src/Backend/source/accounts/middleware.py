from django.utils import timezone
from django.utils.deprecation import MiddlewareMixin

class UpdateLastSeenMiddleware(MiddlewareMixin):
    def process_view(self, request, view_func, view_args, view_kwargs):
        if request.user.is_authenticated:
            profile = request.user.profile
            profile.update_last_seen()
        return None

