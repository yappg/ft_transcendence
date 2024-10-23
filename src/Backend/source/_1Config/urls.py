from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('accounts.urls')),
    path('oauth/', include('accounts.urls')),
    path('2fa/', include('accounts.urls')),
    path('players/', include('accounts.urls')),
]
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


    # path('oauth/', include('allauth.urls')),
    # path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='swagger-docs'),
