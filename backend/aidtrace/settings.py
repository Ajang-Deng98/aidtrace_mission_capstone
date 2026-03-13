import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-aidtrace-secret-key-change-in-production')

DEBUG = os.getenv('DEBUG', 'True') == 'True'

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '*').split(',')

CSRF_TRUSTED_ORIGINS = [
    'https://' + host for host in os.getenv('ALLOWED_HOSTS', '').split(',') if host
]

# Increase upload size limits for base64-encoded documents and beneficiaries ZIP files
DATA_UPLOAD_MAX_MEMORY_SIZE = 104857600  # 100MB
FILE_UPLOAD_MAX_MEMORY_SIZE = 104857600  # 100MB

INSTALLED_APPS = [
    'jazzmin',
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
    'whitenoise.middleware.WhiteNoiseMiddleware',
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
        'CONN_MAX_AGE': 60,
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
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS Configuration for Vercel Frontend
CORS_ALLOWED_ORIGINS = [
    'https://aidtrace-southsudan.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
]

CORS_ALLOW_ALL_ORIGINS = False  # Set to False for security
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

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
    # Using Alchemy (better rate limits than Infura)
    ALCHEMY_API_KEY = os.getenv('ALCHEMY_API_KEY')
    if ALCHEMY_API_KEY:
        WEB3_PROVIDER = f"https://eth-sepolia.g.alchemy.com/v2/{ALCHEMY_API_KEY}"
    else:
        # Fallback to Infura if Alchemy key not provided
        WEB3_PROVIDER = f"https://sepolia.infura.io/v3/{os.getenv('INFURA_PROJECT_ID')}"
    CONTRACT_ADDRESS = os.getenv('SEPOLIA_CONTRACT_ADDRESS')
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

# =============================================================================
# JAZZMIN ADMIN THEME CONFIGURATION
# =============================================================================

JAZZMIN_SETTINGS = {
    "site_title": "AidTrace Admin",
    "site_header": "AidTrace",
    "site_brand": "AidTrace Administration",
    "site_logo": None,
    "welcome_sign": "Welcome to AidTrace Admin Panel",
    "copyright": "AidTrace 2026",
    "search_model": ["api.User", "api.Project"],
    "user_avatar": None,
    
    "topmenu_links": [
        {"name": "Home", "url": "admin:index", "permissions": ["auth.view_user"]},
        {"name": "Support", "url": "https://github.com/", "new_window": True},
    ],
    
    "show_sidebar": True,
    "navigation_expanded": True,
    "hide_apps": [],
    "hide_models": [],
    "order_with_respect_to": ["api", "auth"],
    
    "icons": {
        "auth": "fas fa-users-cog",
        "auth.user": "fas fa-user",
        "auth.Group": "fas fa-users",
        "api.User": "fas fa-user-circle",
        "api.Project": "fas fa-project-diagram",
        "api.Funding": "fas fa-dollar-sign",
        "api.SupplyQuoteRequest": "fas fa-file-invoice",
        "api.SupplierQuote": "fas fa-receipt",
        "api.QuoteSelection": "fas fa-check-circle",
        "api.SupplierDeliveryConfirmation": "fas fa-truck",
        "api.FieldOfficerAssignment": "fas fa-user-tie",
        "api.Beneficiary": "fas fa-hands-helping",
        "api.Distribution": "fas fa-hand-holding-heart",
        "api.PublicReport": "fas fa-flag",
    },
    
    "default_icon_parents": "fas fa-chevron-circle-right",
    "default_icon_children": "fas fa-circle",
    
    "related_modal_active": False,
    "custom_css": None,
    "custom_js": None,
    "use_google_fonts_cdn": True,
    "show_ui_builder": False,
    
    "changeform_format": "horizontal_tabs",
    "changeform_format_overrides": {"auth.user": "collapsible", "auth.group": "vertical_tabs"},
    "language_chooser": False,
}

JAZZMIN_UI_TWEAKS = {
    "navbar_small_text": False,
    "footer_small_text": False,
    "body_small_text": False,
    "brand_small_text": False,
    "brand_colour": False,
    "accent": "accent-lightblue",
    "navbar": "navbar-white navbar-light",
    "no_navbar_border": False,
    "navbar_fixed": False,
    "layout_boxed": False,
    "footer_fixed": False,
    "sidebar_fixed": False,
    "sidebar": "sidebar-light-lightblue",
    "sidebar_nav_small_text": False,
    "sidebar_disable_expand": False,
    "sidebar_nav_child_indent": False,
    "sidebar_nav_compact_style": False,
    "sidebar_nav_legacy_style": False,
    "sidebar_nav_flat_style": True,
    "theme": "flatly",
    "dark_mode_theme": None,
    "button_classes": {
        "primary": "btn-outline-primary",
        "secondary": "btn-outline-secondary",
        "info": "btn-outline-info",
        "warning": "btn-outline-warning",
        "danger": "btn-outline-danger",
        "success": "btn-outline-success"
    }
}

# =============================================================================
# EMAIL CONFIGURATION (Gmail SMTP - FREE)
# =============================================================================
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')  # Your Gmail address
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')  # Your Gmail App Password

