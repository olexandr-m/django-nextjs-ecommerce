from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class IamConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "core_apps.iam"
    verbose_name = _("Identity and Access Management")
