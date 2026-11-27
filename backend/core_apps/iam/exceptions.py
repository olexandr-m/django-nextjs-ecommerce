from core_apps.common.exceptions.base import AppException
from django.utils.translation import gettext_lazy as _


class InvalidActivationException(AppException):
    status_code = 422
    default_detail = _(
        "This activation link is no longer valid. Please log in or request a new link."
    )
    default_code = "invalid_activation"
