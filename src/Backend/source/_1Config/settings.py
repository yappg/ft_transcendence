import os
from pathlib import Path
from datetime import timedelta
from django.conf import settings

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

SECRET_KEY = os.getenv('JWT_SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Application definition

INSTALLED_APPS = [
    # asgi app
    'daphne',
    'channels',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    #needed for the allauth
    'django.contrib.sites',
    #django-rest-framework
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    #swagger api documentation
    'drf_yasg',
    #local apps
    'accounts',
    'chat',
    # 'game',
]

MIDDLEWARE = [
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    #take off above
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # 'allauth.account.middleware.AccountMiddleware',
]


CORS_ALLOW_ALL_ORIGINS = True
# CORS_ALLOWED_ORIGINS = [
#     'http://localhost:5173',
# ]


# CSRF_TRUSTED_ORIGINS = ['https://read-and-write.example.com']


REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
    'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES':[
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_THROTTLE_RATES' : {
        'anon' : '3/min',
    }
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=3),
    "ALGORITHM": "HS256",
    "SIGNING_KEY": settings.SECRET_KEY,
}

ROOT_URLCONF = '_1Config.urls'

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

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [(f'redis://:{os.getenv('REDIS_PASS')}@cache:6379/0')],
        },
    },
}

WSGI_APPLICATION = '_1Config.wsgi.application'

ASGI_APPLICATION = '_1Config.asgi.application'

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv("POSTGRES_DB"),
        'USER': os.getenv("POSTGRES_USER"),
        'PASSWORD': os.getenv("POSTGRES_PASSWORD"),
        'HOST': 'database',
        'PORT': '5432',
    }
}

CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': f'redis://:{os.getenv('REDIS_PASS')}@cache:6379/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}

SESSION_ENGINE = "django.contrib.sessions.backends.cache"  # Use cache for sessions
SESSION_CACHE_ALIAS = "default"  # Use the default cache defined above

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

#env
OAUTH2_PROVIDER_42 = {
    'CLIENT_ID': os.getenv("42_CLIENT_ID"),
    'CLIENT_SECRET': os.getenv("42_CLIENT_SECRET"),
    'AUTHORIZATION_URL': 'https://api.intra.42.fr/oauth/authorize',
    'TOKEN_URL': 'https://api.intra.42.fr/oauth/token',
    'USERDATA_URL': 'https://api.intra.42.fr/v2/me',
    'CALLBACK_URL': 'http://127.0.0.1:8080/oauth/callback/42',
    'SCOPE': 'public',
}

#env
OAUTH2_PROVIDER_GOOGLE = {
    'CLIENT_ID': os.getenv("GOOGLE_CLIENT_ID"),
    'CLIENT_SECRET': os.getenv("GOOGLE_CLIENT_SECRET"),
    'AUTHORIZATION_URL': 'https://accounts.google.com/o/oauth2/auth',
    'TOKEN_URL': 'https://oauth2.googleapis.com/token',
    'USERDATA_URL': 'https://www.googleapis.com/oauth2/v3/userinfo',
    'CALLBACK_URL': 'http://127.0.0.1:8080/oauth/callback/google',
    'SCOPE': 'https://www.googleapis.com/auth/update-user-infosinfo.profile https://www.googleapis.com/auth/update-user-infosinfo.email',
}

# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL='accounts.Player' #CostumUserModel

SITE_ID = 1

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend' # new

ACCOUNT_USER_MODEL_USERNAME_FIELD = 'username'
ACCOUNT_EMAIL_REQUIRED = False
ACCOUNT_USERNAME_REQUIRED = True
ACCOUNT_AUTHENTICATION_METHOD = 'username'
ACCOUNT_EMAIL_VERIFICATION = 'optional'  # or 'mandatory'

# LOGIN_REDIRECT_URL = 'players/'

MEDIA_ROOT=os.path.join(BASE_DIR,'UsersMedia/')
MEDIA_URL='/media/'
