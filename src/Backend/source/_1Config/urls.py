from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from django.http import JsonResponse

# # temporary
# def health_checkup(request):
#     return JsonResponse({'status', 'healty'}, status=200)

urlpatterns = [
    path('admin/', admin.site.urls),
    #all entrys go to one point
        path('auth/', include('accounts.urls')),
        path('oauth/', include('accounts.urls')),
        path('2fa/', include('accounts.urls')),
        path('players/', include('accounts.urls')),
        path('upload/', include('accounts.urls')),
    # structering api endpoints
    # path('api')

    # path('health/', health_checkup, name='health_checkup'),
]

# django would take resp of serving media files only in dev mode, and in production NGINX should serve them
if settings.DEBUG == True:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Tournament API",
        default_version='v1',
        description="API for the Tournament App",),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns += [
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='swagger-docs'),
]