import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-aidtrace-secret-key-change-in-production'

DEBUG = True

ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'aidtrace.urls'

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

WSGI_APPLICATION = 'aidtrace.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'aidtrace_db'),
        'USER': os.getenv('DB_USER', 'postgres'),
        'PASSWORD': os.getenv('DB_PASSWORD', ''),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CORS_ALLOW_ALL_ORIGINS = True

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [],
    'DEFAULT_PERMISSION_CLASSES': [],
}

JWT_SECRET = 'aidtrace-jwt-secret-key'
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_DELTA = timedelta(days=7)

TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID', '')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN', '')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER', '')

# =============================================================================
# BLOCKCHAIN CONFIGURATION
# =============================================================================

# Network Selection: 'development' for local Ganache, 'sepolia' for testnet
BLOCKCHAIN_NETWORK = os.getenv('BLOCKCHAIN_NETWORK', 'development')

# Blockchain Provider URLs
if BLOCKCHAIN_NETWORK == 'sepolia':
    # Sepolia Testnet Configuration
    # GET INFURA_PROJECT_ID: Sign up at https://infura.io, create project, copy Project ID
    WEB3_PROVIDER = f"https://sepolia.infura.io/v3/{os.getenv('INFURA_PROJECT_ID')}"
    # GET SEPOLIA_CONTRACT_ADDRESS: Deploy contract with 'truffle migrate --network sepolia'
    CONTRACT_ADDRESS = os.getenv('SEPOLIA_CONTRACT_ADDRESS')
    # GET BLOCKCHAIN_PRIVATE_KEY: Export private key from MetaMask (for transactions)
    BLOCKCHAIN_PRIVATE_KEY = os.getenv('BLOCKCHAIN_PRIVATE_KEY')
else:
    # Local Development (Ganache) Configuration
    WEB3_PROVIDER = 'http://127.0.0.1:7545'
    # GET LOCAL_CONTRACT_ADDRESS: Deploy contract with 'truffle migrate --reset'
    CONTRACT_ADDRESS = os.getenv('LOCAL_CONTRACT_ADDRESS')
    # Private key not needed for Ganache (uses unlocked accounts)
    BLOCKCHAIN_PRIVATE_KEY = None

# Required for Sepolia deployment only
# GET MNEMONIC: 12-word seed phrase from your wallet (for deployment)
MNEMONIC = os.getenv('MNEMONIC')


# WHAT TO PUT IN YOUR .env FILE:
# =============================================================================
# 
# For Local Development:
# BLOCKCHAIN_NETWORK=development
# LOCAL_CONTRACT_ADDRESS=0x... (get this after running 'truffle migrate --reset')
# 
# For Sepolia Testnet:
# BLOCKCHAIN_NETWORK=sepolia
# INFURA_PROJECT_ID=your_infura_project_id
# SEPOLIA_CONTRACT_ADDRESS=0x... (get this after running 'truffle migrate --network sepolia')
# MNEMONIC=your twelve word seed phrase here
# BLOCKCHAIN_PRIVATE_KEY=0x... (your wallet private key for transactions)

