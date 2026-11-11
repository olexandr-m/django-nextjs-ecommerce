from typing import Any

from core_apps.iam.emails.send_activation_email import send_activation_email
from core_apps.iam.emails.send_already_registered_email import (
    send_already_registered_email,
)
from core_apps.iam.services.activation_service import ActivationService
from core_apps.users.models import User
from django.db import IntegrityError, transaction
from loguru import logger


class RegistrationService:
    @staticmethod
    def register_user(data: dict[str, Any]) -> tuple[User, bool]:
        data.pop("confirmed_password", None)

        try:
            with transaction.atomic():
                user = User.objects.create_user(**data)
                raw_token = ActivationService.generate_token(user)
                transaction.on_commit(lambda: send_activation_email(user, raw_token))

                logger.info(f"User registered successfully: {user.email}")

                return user, True

        except IntegrityError:
            user = User.objects.get(email=data["email"])
            send_already_registered_email(user)

            logger.warning(
                f"Attempt to register user with existing email: {user.email}"
            )

            return user, False
