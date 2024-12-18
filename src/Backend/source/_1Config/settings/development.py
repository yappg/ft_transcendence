import os
from pathlib import Path
from datetime import timedelta
from django.conf import settings
from dotenv import load_dotenv

# ===========================
# PATHS & ENVIRONMENT VARIABLES
# ===========================

# Define the base directory of the project
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from the .env file if it exists will be added after TODO
load_dotenv(BASE_DIR.parent.parent / ".env") 

# ===========================
# SECURITY SETTINGS
# ===========================

# Secret key for cryptographic signing
SECRET_KEY = os.getenv('JWT_SECRET_KEY')

# Enable debug mode for development only (disable in production)
DEBUG = True

# Allow all hosts for development (update for production)
ALLOWED_HOSTS = ['*']

# ===========================
# CORS CONFIGURATION
# ===========================

CORS_ALLOW_ALL_ORIGINS = False  # Restrict origins
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    'http://frontend:3000',
    # 'http://127.0.0.1:3000',
    # 'http://localhost:3000',
]

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
    # Security middleware
    'django.middleware.security.SecurityMiddleware',
    'accounts.middleware.AccessTokenMiddleware',

    # WhiteNoise for serving static files will be removed in production
    'whitenoise.middleware.WhiteNoiseMiddleware',

    # Prometheus monitoring (before other middlewares to capture metrics)
    'django_prometheus.middleware.PrometheusBeforeMiddleware',

    # Core Django middleware
    'django.contrib.sessions.middleware.SessionMiddleware',  # Handles session management
    'corsheaders.middleware.CorsMiddleware',  # CORS must come before CommonMiddleware
    'django.middleware.common.CommonMiddleware',  # Adds common functionality like redirects
    'django.middleware.csrf.CsrfViewMiddleware',  # Protects against CSRF attacks
    'django.contrib.auth.middleware.AuthenticationMiddleware',  # Authentication handling
    'django.contrib.messages.middleware.MessageMiddleware',  # Enables messages framework

    # Middleware for clickjacking protection
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    # Prometheus middleware for after request handling
    'django_prometheus.middleware.PrometheusAfterMiddleware',
]

# ===========================
# DRF & JWT CONFIGURATION
# ===========================

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=600),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=3),
    "ALGORITHM": "HS256",
    "SIGNING_KEY": settings.SECRET_KEY,
}

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'accounts.authenticate.CotumAuthentication',
        # 'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon' : '3/min',
    }
}

# ===========================
# CHANNELS CONFIGURATION
# ===========================

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [f"redis://:{os.getenv('REDIS_PASS')}@cache:6379/0"],
        },
    },
}

# ===========================
# DATABASE CONFIGURATION
# ===========================

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv("POSTGRES_DB"),
        'USER': os.getenv("POSTGRES_USER"),
        'PASSWORD': os.getenv("POSTGRES_PASSWORD"),
        'HOST': 'database',
        'PORT': '5432',
        'CONN_MAX_AGE': 600,  # Extend connection lifetime to 10 minutes
    }
}

CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': f"redis://:{os.getenv('REDIS_PASS')}@cache:6379/1",
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    },
    'players_queue': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': f"redis://:{os.getenv('REDIS_PASS')}@cache:6379/2",
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    },
    'games_pool': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': f"redis://:{os.getenv('REDIS_PASS')}@cache:6379/3",
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    },
}

SESSION_ENGINE = "django.contrib.sessions.backends.cache"  # Use cache for sessions
SESSION_CACHE_ALIAS = "default"  # Use the default cache defined above

# ===========================
# AUTHENTICATION & USERS
# ===========================

AUTH_USER_MODEL = 'accounts.Player'  # Custom user model
SITE_ID = 1

ACCOUNT_USER_MODEL_USERNAME_FIELD = 'username'
ACCOUNT_EMAIL_REQUIRED = False
ACCOUNT_USERNAME_REQUIRED = True
ACCOUNT_AUTHENTICATION_METHOD = 'username'
ACCOUNT_EMAIL_VERIFICATION = 'optional'

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
        # 'OPTIONS': {
            # 'user_attributes': ('username', 'email', 'first_name', 'last_name'),
        # },
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 8,  # Enforces a minimum length of 8 characters
        },
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
        # 'OPTIONS': {
        #     'password_list_path': '/path/to/common-passwords.txt',  # Optional customization
        # },
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# ===========================
# THIRD-PARTY CONFIGURATION
# ===========================

# Swagger API Documentation
SWAGGER_SETTINGS = {
    'SECURITY_DEFINITIONS': {
        'Bearer': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header',
        },
    },
}

# OAuth2 Configuration for 42 API TODO ENV
OAUTH2_PROVIDER_42 = {
    'CLIENT_ID': "u-s4t2ud-9a789e497d800c5a443dceb37c2238734264a05f5208354f0a20b8eecb94e72f",
    'CLIENT_SECRET': "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",
    #TRANS2-----------------------------------------
    # 'CLIENT_ID': "u-s4t2ud-4aedcd9bbfe99586bd8aab9967a260dd24e4a1459620fe008ae457eae916624c",
    # 'CLIENT_SECRET': "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",
    # -----------------END--------------------------
    # 'CLIENT_ID': os.getenv("CLIENT_ID_42"),
    # 'CLIENT_SECRET': os.getenv("CLIENT_SECRET_42"),
    'AUTHORIZATION_URL': 'https://api.intra.42.fr/oauth/authorize',
    'TOKEN_URL': 'https://api.intra.42.fr/oauth/token',
    'USERDATA_URL': 'https://api.intra.42.fr/v2/me',
    # 'CALLBACK_URL': 'http://127.0.0.1:3000/home',
    'CALLBACK_URL': 'http://127.0.0.1:8080/api/oauth/callback/42',
    'SCOPE': 'public',
}

# OAuth2 Configuration for Google API TODO ENV
OAUTH2_PROVIDER_GOOGLE = {
    'CLIENT_ID': os.getenv("GOOGLE_CLIENT_ID"),
    'CLIENT_SECRET': os.getenv("GOOGLE_CLIENT_SECRET"),
    'AUTHORIZATION_URL': 'https://accounts.google.com/o/oauth2/auth',
    'TOKEN_URL': 'https://oauth2.googleapis.com/token',
    'USERDATA_URL': 'https://www.googleapis.com/oauth2/v3/userinfo',
    'CALLBACK_URL': 'http://127.0.0.1:8080/api/oauth/callback/google',
    # 'CALLBACK_URL': 'http://127.0.0.1:3000/home',
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

STATIC_URL = 'static/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'UsersMedia/')
MEDIA_URL = '/media/'


# ===========================
# MISCELLANEOUS SETTINGS
# ===========================

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Email Backend
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
