import sys
from os import getenv, path

from dotenv import load_dotenv

from .base import *
from .base import BASE_DIR

IS_TESTING = "pytest" in sys.modules or "test" in sys.argv

local_env_file = path.join(BASE_DIR, "envs", ".env.dev")

if path.isfile(local_env_file):
    load_dotenv(local_env_file)

SECRET_KEY = getenv("DJANGO_SECRET_KEY")

DEBUG = getenv("DEBUG")

SITE_NAME = getenv("SITE_NAME")

ALLOWED_HOSTS = ["localhost", "127.0.0.1", "backend", "0.0.0.0"]

ADMIN_URL = getenv("DJANGO_ADMIN_URL")
FRONTEND_URL = "http://localhost:8080"

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = getenv("EMAIL_HOST")
EMAIL_PORT = getenv("EMAIL_PORT")
DEFAULT_FROM_EMAIL = getenv("DEFAULT_FROM_EMAIL")
DOMAIN = getenv("DOMAIN")
ADMIN_EMAIL = getenv("ADMIN_EMAIL")
