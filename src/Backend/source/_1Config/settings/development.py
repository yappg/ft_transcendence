import os
from pathlib import Path
from datetime import timedelta
from django.conf import settings
from dotenv import load_dotenv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/
load_dotenv(BASE_DIR.parent.parent / ".env")

SECRET_KEY = os.getenv('JWT_SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = [
    'http://127.0.0.1:3000',
    'http://localhost:3000',
]
  
# Application definition
INSTALLED_APPS = [
    # prometheus
    'django_prometheus',
    # asgi app
    'daphne',
    'channels',
    # django apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # needed for the allauth
    'django.contrib.sites',
    # django-rest-framework
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    #swagger api documentation
    'drf_yasg',
    # local apps
    'accounts',
    'chat',
    'relations',
    'game',
]

MIDDLEWARE = [
    #take off bellow line for production
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    
    # prometheus middleware
    'django_prometheus.middleware.PrometheusBeforeMiddleware',
    'django_prometheus.middleware.PrometheusAfterMiddleware',
    # django middleware
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # 'allauth.account.middleware.AccountMiddleware',
]


SWAGGER_SETTINGS = {
    'SECURITY_DEFINITIONS': {
        'Bearer': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header'
        }
    }
}


# CSRF_TRUSTED_ORIGINS = ['https://read-and-write.example.com']

   
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
    'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES':[
        'accounts.authenticate.CotumAuthentication',
    ],
    'DEFAULT_THROTTLE_RATES' : {
        'anon' : '3/min',
    }
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
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
            "hosts": [f"redis://:{os.getenv('REDIS_PASS')}@cache:6379/0"],
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
        'CONN_MAX_AGE': 600,  # Increase connection timeout to 10 minutes
    }
}

# CACHES = {
#     'default': {
#         'BACKEND': 'django_redis.cache.RedisCache',
#         'LOCATION': f"redis://:{os.getenv('REDIS_PASS')}@cache:6379/1",
#         'OPTIONS': {
#             'CLIENT_CLASS': 'django_redis.client.DefaultClient',
#         }
#     }
# }

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

#env
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


