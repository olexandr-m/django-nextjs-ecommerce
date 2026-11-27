from core_apps.iam.exceptions import InvalidActivationException
from django.utils.translation import gettext_lazy as _
from rest_framework import status


def test_invalid_activation_exception_default_locked_until():
    exc = InvalidActivationException()

    assert exc.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    assert exc.detail == _(
        "This activation link is no longer valid. Please log in or request a new link."
    )
    assert exc.errors is None
