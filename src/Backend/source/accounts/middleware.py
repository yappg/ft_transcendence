from django.utils.timezone import now
from django.conf import settings
import datetime
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication

class AccessTokenMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        jwt_auth = JWTAuthentication()
        accessToken = request.COOKIES.get('access_token')
        # print('prev access Token: '+str(accessToken))
        try:
            validated_token = jwt_auth.get_validated_token(accessToken)
        except:
            return self.get_response(request)
        exp_time = validated_token.get('exp')
        if exp_time:
            exp_time = datetime.datetime.fromtimestamp(exp_time, tz=datetime.timezone.utc)
            remain_time = exp_time - now()
            if remain_time.total_seconds() < 300:
                #and remain_time.total_seconds() > 0()in
                refresh_token = request.COOKIES.get('refresh_token')
                if refresh_token:
                    try:
                        Refresh = RefreshToken(refresh_token)
                        new_access_token = str(Refresh.access_token)
                        # print('new access Token: '+new_access_token)
                        response = self.get_response(request)
                        response.set_cookie('access_token', new_access_token)#, expires=exp_time)
                        return response
                    except:
                        pass
                        # return self.get_response(request)
        return self.get_response(request)
