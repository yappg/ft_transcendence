# TODO will work on this after setting up nginx will manager env better
import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')

# Security settings
SECRET_KEY = os.getenv('JWT_SECRET_KEY')
DEBUG = False  # Ensure DEBUG is set to False for production
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(',')

# CORS settings
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', '').split(',')

# application
WSGI_APPLICATION = '_1Config.wsgi.application'
ASGI_APPLICATION = '_1Config.asgi.application'

# Installed apps
INSTALLED_APPS = [
    'drf_yasg',  # Swagger documentation
    'django_prometheus',  # Prometheus monitoring
    'daphne', 'channels',  # ASGI/Channels support
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',  # Required for allauth
    'corsheaders',  # Cross-origin requests
    'rest_framework',  # Django REST Framework
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'accounts', 'chat', 'game', 'relations',  # Local apps
]

# Middleware
MIDDLEWARE = [
    'django_prometheus.middleware.PrometheusBeforeMiddleware',
    'django_prometheus.middleware.PrometheusAfterMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    # 'whitenoise.middleware.WhiteNoiseMiddleware',  # Static file handling
    'accounts.middleware.UpdateLastSeenMiddleware',  # User activity tracking
]

# Django REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
        # 'accounts.authenticate.CotumAuthentication',
    ),
    # 'DEFAULT_THROTTLE_RATES' : {
    #     'anon' : '3/min',
    # }
}

# Simple JWT settings
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=3),
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
}

# swagger_settings
SWAGGER_SETTINGS = {
    'SECURITY_DEFINITIONS': {
        'Bearer': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header'
        }
    }
}

# Channel layers (Redis)
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [f"redis://:{os.getenv('REDIS_PASS')}@cache:6379/0"],
        },
    },
}

# Database settings
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('POSTGRES_DB'),
        'USER': os.getenv('POSTGRES_USER'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD'),
        'HOST': os.getenv('POSTGRES_HOST', 'localhost'),
        'PORT': os.getenv('POSTGRES_PORT', '5432'),
        'CONN_MAX_AGE': 600,  # Persistent connections
        # Increase connection timeout to 10 minutes
    }
}

# Caching
SESSION_ENGINE = "django.contrib.sessions.backends.cache"  # Use cache for sessions
SESSION_CACHE_ALIAS = "default"  # Use the default cache defined above

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# OAuth settings
OAUTH2_PROVIDER_42 = {
    'CLIENT_ID': os.getenv("42_CLIENT_ID"),
    'CLIENT_SECRET': os.getenv("42_CLIENT_SECRET"),
    'AUTHORIZATION_URL': 'https://api.intra.42.fr/oauth/authorize',
    'TOKEN_URL': 'https://api.intra.42.fr/oauth/token',
    'USERDATA_URL': 'https://api.intra.42.fr/v2/me',
    'CALLBACK_URL': os.getenv("OAUTH_CALLBACK_URL_42"), # http://127.0.0.1:8080/oauth/callback/42
    'SCOPE': 'public',
}

OAUTH2_PROVIDER_GOOGLE = {
    'CLIENT_ID': os.getenv("GOOGLE_CLIENT_ID"),
    'CLIENT_SECRET': os.getenv("GOOGLE_CLIENT_SECRET"),
    'AUTHORIZATION_URL': 'https://accounts.google.com/o/oauth2/auth',
    'TOKEN_URL': 'https://oauth2.googleapis.com/token',
    'USERDATA_URL': 'https://www.googleapis.com/oauth2/v3/userinfo',
    'CALLBACK_URL': os.getenv("OAUTH_CALLBACK_URL_GOOGLE"), # http://127.0.0.1:8080/oauth/callback/google
    'SCOPE': 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
}

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static and media files
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'UsersMedia/'


# Other settings
AUTH_USER_MODEL = 'accounts.Player' #CostumUserModel
SITE_ID = 1
ACCOUNT_USER_MODEL_USERNAME_FIELD = 'username'
ACCOUNT_EMAIL_REQUIRED = False
ACCOUNT_USERNAME_REQUIRED = True
ACCOUNT_AUTHENTICATION_METHOD = 'username'
ACCOUNT_EMAIL_VERIFICATION = 'optional'  # or 'mandatory'
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = os.getenv("EMAIL_HOST")
# EMAIL_PORT = os.getenv("EMAIL_PORT", 587)
# EMAIL_USE_TLS = True
# EMAIL_HOST_USER = os.getenv("EMAIL_USER")
# EMAIL_HOST_PASSWORD = os.getenv("EMAIL_PASSWORD")
