from django.contrib.auth.models import AbstractBaseUser
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class Authentication(AbstractBaseUser):
    class AccountStatus(models.TextChoices):
        ACTIVE = "active", _("Active")
        INACTIVE = "inactive", _("Inactive")
        LOCKED = "locked", _("Locked")

    class RoleChoices(models.TextChoices):
        CUSTOMER = "customer", _("Customer")
        ADMIN = "admin", _("Admin")

    account_status = models.CharField(
        _("Account Status"),
        max_length=10,
        choices=AccountStatus.choices,
        default=AccountStatus.INACTIVE,
        db_index=True,
    )
    role = models.CharField(
        _("Role"),
        max_length=20,
        choices=RoleChoices.choices,
        default=RoleChoices.CUSTOMER,
        db_index=True,
    )
    activation_token = models.CharField(max_length=64, null=True, blank=True)
    activation_expires_at = models.DateTimeField(null=True, blank=True)
    activated_at = models.DateTimeField(null=True, blank=True)
    otp_code = models.CharField(max_length=64, null=True, blank=True)
    otp_expires_at = models.DateTimeField(null=True, blank=True)
    failed_login_attempts = models.PositiveSmallIntegerField(default=0)
    locked_until = models.DateTimeField(null=True, blank=True)
    token_version = models.PositiveIntegerField(default=0)

    @property
    def is_locked(self) -> bool:
        return bool(
            self.account_status == self.AccountStatus.LOCKED
            and self.locked_until
            and self.locked_until > timezone.now()
        )

    class Meta:
        abstract = True
