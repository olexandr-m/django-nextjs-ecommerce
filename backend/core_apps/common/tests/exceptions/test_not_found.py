import pytest
from core_apps.common.exceptions.base import AppException
from core_apps.common.exceptions.not_found import NotFoundException
from rest_framework import status


def test_default_values():
    exc = NotFoundException()

    assert exc.status_code == status.HTTP_404_NOT_FOUND
    assert exc.detail == "Resource not found."
    assert exc.errors is None


def test_custom_entity_name():
    exc = NotFoundException(entity_name="Test model")

    assert exc.detail == "Test model not found."


def test_invalid_argument_raises_type_error():
    with pytest.raises(TypeError):
        NotFoundException(status_code=status.HTTP_400_BAD_REQUEST)  # type: ignore


def test_inherits_from_api_exception():
    assert issubclass(NotFoundException, AppException)
