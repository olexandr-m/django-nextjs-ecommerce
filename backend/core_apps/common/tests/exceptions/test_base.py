from core_apps.common.exceptions.base import AppException
from rest_framework import status


def test_default_values():
    exc = AppException()

    assert exc.status_code == status.HTTP_400_BAD_REQUEST
    assert exc.detail == "Application error."
    assert exc.errors is None


def test_custom_message():
    exc = AppException(message="Custom error message")

    assert exc.detail == "Custom error message"


def test_custom_status_code():
    exc = AppException(status_code=status.HTTP_404_NOT_FOUND)

    assert exc.status_code == status.HTTP_404_NOT_FOUND


def test_with_errors_field():
    errors = {"test_error": ["some error details"]}
    exc = AppException(errors=errors)

    assert exc.errors == errors


def test_custom_message_and_status_code():
    exc = AppException(
        message="Conflict occurred",
        status_code=status.HTTP_409_CONFLICT,
    )

    assert exc.status_code == status.HTTP_409_CONFLICT
    assert exc.detail == "Conflict occurred"


def test_inherits_from_api_exception():
    assert issubclass(AppException, Exception)
    assert issubclass(AppException, BaseException)
