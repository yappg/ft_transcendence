from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-*bok4t@yesu4==8yn!+4juc1skc$$ys#x=agk2il9xh7u4z_l!'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
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
    #generate tokens for an authenticated player
    'rest_framework.authtoken',
    # 3rd party libs
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.oauth2',
    'dj_rest_auth',
    'dj_rest_auth.registration',
    'oauth2_provider',
    #swagger api documentation
    'drf_yasg',
    #local apps
    'accounts',
    'game',
    'tournament',
    'chat',
    'api',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
    'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES':[
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
        'oauth2_provider.contrib.rest_framework.OAuth2Authentication',
    ]
}

AUTHENTICATION_BACKENDS = (
    'oauth2_provider.backends.OAuth2Backend',
    'django.contrib.auth.backends.ModelBackend',
)

OAUTH2_PROVIDER_42 = {
    'CLIENT_ID': 'u-s4t2ud-3029a7101dfe59b4b0241c30869ea8b1eac488292da336c2cb49bca3631be37e',
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

WSGI_APPLICATION = '_1Config.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
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