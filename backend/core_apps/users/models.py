import uuid

from core_apps.iam.models.authentication import Authentication
from core_apps.users.managers import UserManager
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(Authentication):
    pkid = models.BigAutoField(primary_key=True, editable=False)
    id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    first_name = models.CharField(
        verbose_name=_("First Name"), max_length=60, blank=True
    )
    last_name = models.CharField(verbose_name=_("Last Name"), max_length=60, blank=True)
    email = models.EmailField(
        verbose_name=_("Email Address"), unique=True, db_index=True
    )
    username = models.CharField(verbose_name=_("Username"), max_length=60, unique=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()
    EMAIL_FIELD = "email"
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]  # noqa: RUF012

    @property
    def full_name(self) -> str:
        full_name = f"{self.first_name} {self.last_name}"
        return full_name.strip()

    class Meta(Authentication.Meta):
        verbose_name = _("User")
        verbose_name_plural = _("Users")
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return f"{self.username} ({self.email}) - {self.role}"
