from core_apps.common.exceptions.base import AppException
from django.utils.translation import gettext as _


class NotFoundException(AppException):
    status_code = 404

    def __init__(self, entity_name: str = "Resource"):
        message_template = _("%(resource)s not found.")
        message = message_template % {"resource": entity_name}

        super().__init__(message=message)
