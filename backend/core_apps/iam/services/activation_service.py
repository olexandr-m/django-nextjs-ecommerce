import hashlib
import hmac
import secrets
from datetime import timedelta

from core_apps.iam.emails.send_activation_email import send_activation_email
from core_apps.users.models import User
from django.conf import settings
from django.db import transaction
from django.utils import timezone
from loguru import logger


class ActivationService:
    ACTIVATION_TOKEN_EXPIRY_HOURS = int(
        getattr(settings, "ACTIVATION_TOKEN_EXPIRY_HOURS", 24)
    )

    @classmethod
    def _hmac_hash(cls, raw_token: str) -> str:
        return hmac.new(
            key=settings.SECRET_KEY.encode(),
            msg=raw_token.encode(),
            digestmod=hashlib.sha256,
        ).hexdigest()

    @classmethod
    def generate_token(cls, user) -> str:
        raw_token = secrets.token_urlsafe(32)
        hashed_token = cls._hmac_hash(raw_token)

        user.activation_token = hashed_token
        user.activation_expires_at = timezone.now() + timedelta(
            hours=cls.ACTIVATION_TOKEN_EXPIRY_HOURS
        )
        user.save(
            update_fields=["activation_token", "activation_expires_at", "updated_at"]
        )

        return raw_token

    @classmethod
    def verify_token(cls, user: User, raw_token: str) -> bool:
        if not raw_token or not user.activation_token:
            return False

        if user.account_status != User.AccountStatus.INACTIVE:
            return False

        if (
            not user.activation_expires_at
            or user.activation_expires_at < timezone.now()
        ):
            return False

        return secrets.compare_digest(user.activation_token, cls._hmac_hash(raw_token))

    @classmethod
    def handle_resend_request(cls, email: str) -> bool:
        user = User.objects.filter(email=email).first()

        if not user:
            logger.error(f"Activation resend failed — user {email} not found.")
            return False

        if user.account_status != User.AccountStatus.INACTIVE:
            logger.error(
                f"Activation resend failed — user {user.email} is already active."
            )
            return False

        with transaction.atomic():
            raw_token = cls.generate_token(user)
            transaction.on_commit(lambda: send_activation_email(user, raw_token))

        logger.info(f"Activation email resent successfully to {user.email}")

        return True

    @classmethod
    def activate_user(cls, user) -> User:
        user.account_status = User.AccountStatus.ACTIVE
        user.activated_at = timezone.now()

        user.activation_token = None
        user.activation_expires_at = None
        user.save(
            update_fields=[
                "account_status",
                "activated_at",
                "activation_token",
                "activation_expires_at",
                "updated_at",
            ]
        )
        return user
