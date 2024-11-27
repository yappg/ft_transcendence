from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static

from django.http import JsonResponse

from rest_framework import permissions
from rest_framework_simplejwt.authentication import JWTAuthentication
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


from .views import YourAPIView


# # temporary
schema_view = get_schema_view(
   openapi.Info(
      title="Your API",
      default_version='v1',
      description="Test description",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@yourapi.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
   authentication_classes=(JWTAuthentication,),
#    security=[{'Bearer': []}],
)

urlpatterns = [
        path('admin/', admin.site.urls),
        # all entrys go to one point
        path('api/', include('accounts.urls')),
        path('chat/', include('chat.urls')),
        path('relations/', include('relations.urls')),
        path('prometheus/', include('django_prometheus.urls')),
        
         path('your-endpoint/', YourAPIView.as_view(), name='your-endpoint'),
        re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
        path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
        path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
    # structering api endpoints
    # path('api')

    # path('health/', health_checkup, name='health_checkup'),

# def health_checkup(request):
#     return JsonResponse({'status', 'healty'}, status=200)

# django would take resp of serving media files only in dev mode, and in production NGINX should serve them
if settings.DEBUG == True:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


