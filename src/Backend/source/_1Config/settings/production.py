import os
from pathlib import Path
from datetime import timedelta
from django.core.exceptions import ImproperlyConfigured

# ===========================
# PATHS & ENVIRONMENT VARIABLES
# ===========================

BASE_DIR = Path(__file__).resolve().parent.parent

def get_env_variable(var_name):
    try:
        return os.getenv(var_name)
    except KeyError:
        raise ImproperlyConfigured(f"{var_name} environment variable is not set")

# ===========================
# SECURITY SETTINGS
# ===========================

SECRET_KEY = get_env_variable('SIGNING_KEY')

DEBUG = False
ALLOWED_HOSTS = get_env_variable('ALLOWED_HOSTS').split(',')

# Security Headers
# SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
# SECURE_SSL_REDIRECT = False
# SECURE_HSTS_SECONDS = 0
# SESSION_COOKIE_SECURE = True
# CSRF_COOKIE_SECURE = True
# SECURE_BROWSER_XSS_FILTER = True
# SECURE_CONTENT_TYPE_NOSNIFF = True
# X_FRAME_OPTIONS = 'DENY'
# SECURE_HSTS_INCLUDE_SUBDOMAINS = False
# SECURE_HSTS_PRELOAD = False

# ===========================
# CORS CONFIGURATION
# ===========================

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = get_env_variable('CORS_ALLOWED_ORIGINS').split(',')
# CORS_EXPOSE_HEADERS = ['Content-Type', 'X-CSRFToken']

# ===========================
# APPLICATION CONFIGURATION
# ===========================

INSTALLED_APPS = [
    # API documentation
    'drf_yasg',

    # Monitoring
    'django_prometheus',

    # ASGI/Channels
    'daphne', 'channels',
    # Core Django apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    # Third-party apps
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',

    # Local apps
    'accounts', 'chat', 'game', 'relations',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'accounts.middleware.AccessTokenMiddleware',
    'django_prometheus.middleware.PrometheusBeforeMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django_prometheus.middleware.PrometheusAfterMiddleware',
]

# ===========================
# DRF & JWT CONFIGURATION
# ===========================

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
}

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'accounts.authenticate.CotumAuthentication',
    ],
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '20/minute',
        'user': '100/minute',
    },
    # 'DEFAULT_RENDERER_CLASSES': [
    #     'rest_framework.renderers.JSONRenderer',
    # ]
}

# ===========================
# CHANNELS CONFIGURATION
# ===========================

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [f"redis://:{get_env_variable('REDIS_PASS')}@cache:6379/0"],
            "capacity": 1500,
            "expiry": 10,
        },
    },
}

# ===========================
# DATABASE CONFIGURATION
# ===========================

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': get_env_variable('POSTGRES_DB'),
        'USER': get_env_variable('POSTGRES_USER'),
        'PASSWORD': get_env_variable('POSTGRES_PASSWORD'),
        'HOST': 'database',
        'PORT': '5432',
        'CONN_MAX_AGE': 600,
    }
}

CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': f"redis://:{get_env_variable('REDIS_PASS')}@cache:6379/1",
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            'SOCKET_CONNECT_TIMEOUT': 5,
            'SOCKET_TIMEOUT': 5,
            'RETRY_ON_TIMEOUT': True,
            'MAX_CONNECTIONS': 500,
            'CONNECTION_POOL_KWARGS': {'max_connections': 50},
        }
    },
    'players_queue': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': f"redis://:{get_env_variable('REDIS_PASS')}@cache:6379/2",
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            'SOCKET_CONNECT_TIMEOUT': 5,
            'SOCKET_TIMEOUT': 5,
            'RETRY_ON_TIMEOUT': True,
            'MAX_CONNECTIONS': 500,
            'CONNECTION_POOL_KWARGS': {'max_connections': 50},
        }
    },
    'games_pool': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': f"redis://:{get_env_variable('REDIS_PASS')}@cache:6379/3",
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            'SOCKET_CONNECT_TIMEOUT': 5,
            'SOCKET_TIMEOUT': 5,
            'RETRY_ON_TIMEOUT': True,
            'MAX_CONNECTIONS': 500,
            'CONNECTION_POOL_KWARGS': {'max_connections': 50},
        }
    },
}

SESSION_ENGINE = "django.contrib.sessions.backends.cache"
SESSION_CACHE_ALIAS = "default"

# ===========================
# AUTHENTICATION & USERS
# ===========================

AUTH_USER_MODEL = 'accounts.Player'
SITE_ID = 1

ACCOUNT_USER_MODEL_USERNAME_FIELD = 'username'
ACCOUNT_EMAIL_REQUIRED = False
ACCOUNT_USERNAME_REQUIRED = True
ACCOUNT_AUTHENTICATION_METHOD = 'username'
ACCOUNT_EMAIL_VERIFICATION = 'optional'

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 8,
        },
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# ===========================
# OAUTH2 CONFIGURATION
# ===========================

OAUTH2_PROVIDER_42 = {
    'CLIENT_ID': get_env_variable('CLIENT_ID_42'),
    'CLIENT_SECRET': get_env_variable('CLIENT_SECRET_42'),
    'AUTHORIZATION_URL': 'https://api.intra.42.fr/oauth/authorize',
    'TOKEN_URL': 'https://api.intra.42.fr/oauth/token',
    'USERDATA_URL': 'https://api.intra.42.fr/v2/me',
    'CALLBACK_URL': get_env_variable('OAUTH_42_CALLBACK_URL'),
    'SCOPE': 'public',
}

OAUTH2_PROVIDER_GOOGLE = {
    'CLIENT_ID': get_env_variable('GOOGLE_CLIENT_ID'),
    'CLIENT_SECRET': get_env_variable('GOOGLE_CLIENT_SECRET'),
    'AUTHORIZATION_URL': 'https://accounts.google.com/o/oauth2/auth',
    'TOKEN_URL': 'https://oauth2.googleapis.com/token',
    'USERDATA_URL': 'https://www.googleapis.com/oauth2/v3/userinfo',
    'CALLBACK_URL': get_env_variable('OAUTH_GOOGLE_CALLBACK_URL'),
    'SCOPE': 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
}

# ===========================
# TEMPLATES & URL CONFIGURATION
# ===========================

ROOT_URLCONF = '_1Config.urls'
WSGI_APPLICATION = '_1Config.wsgi.application'
ASGI_APPLICATION = '_1Config.asgi.application'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# ===========================
# STATIC & MEDIA FILES
# ===========================

STATIC_URL = '/Static/'
STATIC_ROOT = '/app/source/staticfiles'
MEDIA_URL = '/Media/'
MEDIA_ROOT = '/app/source/UsersMedia'

FILE_UPLOAD_MAX_MEMORY_SIZE = 5 * 1024 * 1024
DATA_UPLOAD_MAX_MEMORY_SIZE = 5 * 1024 * 1024

# ===========================
# MISCELLANEOUS SETTINGS
# ===========================

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True