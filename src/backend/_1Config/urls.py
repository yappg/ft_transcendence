from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('accounts.urls')),
    path('oauth/', include('accounts.urls')),
    path('2fa/', include('accounts.urls')),
    path('players/', include('accounts.urls')),
]
urlpatterns += static(settings.MEDIA_ROOT, document_root=settings.MEDIA_ROOT)

# from rest_framework import permissions
# from drf_yasg.views import get_schema_view
# from drf_yasg import openapi

# schema_view = get_schema_view(
#     openapi.Info(
#         title="Tournament API",
#         default_version='v1',
#         description="API for the Tournament App",),
#     public=True,
#     permission_classes=(permissions.AllowAny,),
# )


    # path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='swagger-docs'),
