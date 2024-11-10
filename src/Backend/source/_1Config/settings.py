from pathlib import Path
from datetime import timedelta
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-*bok4t@yesu4==8yn!+4juc1skc$$ys#x=agk2il9xh7u4z_l!'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    'daphne',
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
    #generate tokens for an authenticated player
    'rest_framework.authtoken',
    #swagger api documentation
    'drf_yasg',
    #local apps
    #versitileImageField
    'versatileimagefield',
    'accounts',
    'game',
    'tournament',
    'api',
    #generate tokens for an authenticated player
    'rest_framework.decorators',
    # 3rd party libs
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'dj_rest_auth',
    'dj_rest_auth.registration',
    'oauth2_provider',
    #local apps
    'chatoom',
    'channels',
    'corsheaders',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

CORS_ALLOW_ALL_ORIGINS = True

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
    'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES':[
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ]
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
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("localhost", 6379)],
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
        'NAME': 'postgres',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}


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

OAUTH2_PROVIDER_42 = {
    'CLIENT_ID': 'u-s4t2ud-4aae62bd87a3daa2bf54d50bbccb9a771a1cfde5353d8a10bd6ed5d8fe263033',
    'CLIENT_SECRET': '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',
    'AUTHORIZATION_URL': 'https://api.intra.42.fr/oauth/authorize',
    'TOKEN_URL': 'https://api.intra.42.fr/oauth/token',
    'USERDATA_URL': 'https://api.intra.42.fr/v2/me',
    'CALLBACK_URL': 'http://127.0.0.1:8000/oauth/callback/42',
    'SCOPE': 'public',
}

OAUTH2_PROVIDER_GOOGLE = {
    'CLIENT_ID': '182265720847-k8uvnm7i3oeh35t05aalu6lrj0blejh8.apps.googleusercontent.com',
    'CLIENT_SECRET': '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',
    'AUTHORIZATION_URL': 'https://accounts.google.com/o/oauth2/auth',
    'TOKEN_URL': 'https://oauth2.googleapis.com/token',
    'USERDATA_URL': 'https://www.googleapis.com/oauth2/v3/userinfo',
    'CALLBACK_URL': 'http://127.0.0.1:8000/oauth/callback/google',
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
