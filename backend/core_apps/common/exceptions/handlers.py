from core_apps.common.exceptions.base import AppException
from core_apps.common.exceptions.not_found import NotFoundException
from core_apps.common.responses import error
from core_apps.common.utils.format_time import format_seconds_to_time_string
from django.utils.translation import gettext as _
from loguru import logger
from rest_framework import status
from rest_framework.exceptions import Throttled, ValidationError
from rest_framework.views import exception_handler


class GenericException:
    @staticmethod
    def handle(exc, context):
        response = exception_handler(exc, context)
        view = context.get("view", None)
        view_name = view.__class__.__name__ if view else "UnknownView"

        if isinstance(exc, Throttled):
            wait = getattr(exc, "wait", None)
            wait_str = format_seconds_to_time_string(wait)
            message = _("Too many requests. Please try again later.")

            if wait:
                message_template = _("Too many requests. Try again in %(wait)s.")
                message = message_template % {"wait": wait_str}

            logger.warning(
                f"Too many requests in {view_name}. Wait time = {wait_str if wait else 'unknown'}"
            )

            return error(
                message=message,
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        if isinstance(exc, ValidationError):
            return error(
                message=_("Validation failed."),
                errors=exc.detail,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        if isinstance(exc, AppException):
            return error(
                message=str(exc.detail),
                status_code=exc.status_code,
                errors=getattr(exc, "errors", None),
            )

        if isinstance(exc, NotFoundException):
            return error(message=exc.detail, status_code=exc.status_code)

        if response is not None:
            message = getattr(exc, "detail", str(exc)) or _("An error occurred.")
            logger.error(f"Handled exception in {view_name}: {exc!s}")

            return error(
                message=message,
                status_code=response.status_code,
            )

        logger.warning(f"Unhandled exception in {view_name}: {exc!s}", exc_info=True)

        return error(
            message=_("Internal server error. Please try again later."),
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


def generic_exception_handler(exc, context):
    return GenericException.handle(exc, context)
