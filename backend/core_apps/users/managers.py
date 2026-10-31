from core_apps.iam.models.authentication import Authentication
from django.contrib.auth.models import UserManager as DjangoUserManager
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.db import transaction
from django.utils.translation import gettext_lazy as _


def validate_email_address(email: str):
    try:
        validate_email(email)
    except ValidationError:
        raise ValidationError(_("Enter a valid email address."))


class UserManager(DjangoUserManager):
    def _create_user(
        self, username: str, email: str | None, password: str | None, **extra_fields
    ):
        if not username:
            raise ValueError(_("A username must be provided."))

        if not email:
            raise ValueError(_("An email address must be provided."))

        if not password:
            raise ValueError(_("A password must be provided."))

        email = self.normalize_email(email).lower()
        validate_email_address(email)

        username_max_len = self.model._meta.get_field("username").max_length
        username = self.model.normalize_username(username)[:username_max_len]

        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)

        with transaction.atomic():
            user.save(using=self._db)

        return user

    def create_user(
        self,
        username: str,
        email: str | None = None,
        password: str | None = None,
        **extra_fields,
    ):
        extra_fields.setdefault("role", Authentication.RoleChoices.CUSTOMER)
        return self._create_user(username, email, password, **extra_fields)

    def create_superuser(
        self,
        username: str,
        email: str | None = None,
        password: str | None = None,
        **extra_fields,
    ):
        extra_fields.setdefault("role", Authentication.RoleChoices.ADMIN)
        extra_fields.setdefault("account_status", Authentication.AccountStatus.ACTIVE)

        return self._create_user(username, email, password, **extra_fields)
