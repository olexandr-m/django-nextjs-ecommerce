from django.utils.translation import gettext as _
from rest_framework.exceptions import APIException


class AppException(APIException):
    status_code = 400
    default_detail = _("Application error.")
    default_code = "app_error"

    def __init__(self, message=None, status_code=None, errors=None):
        self.errors = errors
        self.status_code = status_code or self.status_code
        super().__init__(message or self.default_detail)
