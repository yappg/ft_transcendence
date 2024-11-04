from rest_framework.throttling import AnonRateThrottle
from rest_framework.exceptions import Throttled

class AnonRateLimitThrottling(AnonRateThrottle):
    rate = '3/min'

    # def throttle_failure(self, request, wait):
    #     # Customize the response when the rate limit is exceeded
    #     raise Throttled(detail={
    #         'error': 'OLALALALALLL.',
    #         'available_in': wait  # time until the user can retry
    #     }, status_code=429)
