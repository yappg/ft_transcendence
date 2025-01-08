from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from accounts.authenticate import CotumAuthentication

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

schema_view = get_schema_view(
    openapi.Info(
        title="Tournament API",
        default_version='v1',
        description="API for the Tournament App",),
    public=True,
    authentication_classes=(CotumAuthentication,),
)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def health_check(request):
    return Response({"status": "ok"}, status=200)

urlpatterns = [
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='swagger-docs'),
    path('schema-viewer/', include('schema_viewer.urls')),
    path('prometheus/', include('django_prometheus.urls')),
    path('health/', health_check, name='health_check'),

    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls'), name='accounts'),
    path('api/relations/', include('relations.urls'), name='relations'),
    path('api/chat/', include('chat.urls'), name='chat'),
]

if settings.DEBUG == True:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
