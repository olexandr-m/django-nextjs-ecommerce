import pytest
from core_apps.common.exceptions.base import AppException
from core_apps.common.exceptions.not_found import NotFoundException
from django.conf import settings
from django.urls import path
from rest_framework.exceptions import Throttled, ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView


class ExceptionView(APIView):
    authentication_classes: tuple = ()
    permission_classes: tuple = ()

    def get(self, request) -> Response:
        exc_type = request.query_params.get("exc")
        if exc_type == "throttle":
            raise Throttled(wait=10)
        elif exc_type == "validation":
            raise ValidationError({"field": "invalid"})
        elif exc_type == "app":
            raise AppException()
        elif exc_type == "not_found":
            raise NotFoundException()
        elif exc_type == "generic":
            raise Exception("Something went wrong")
        return Response({"message": "ok"})


urlpatterns = [
    path("test-exception/", ExceptionView.as_view()),
]


@pytest.fixture(autouse=True)
def set_root_urlconf():
    settings.ROOT_URLCONF = __name__


def test_throttled_exception(api_client):
    response = api_client.get("/test-exception/?exc=throttle")
    data = response.json()

    assert response.status_code == 429
    assert data["status"] == 429
    assert "Too many requests" in data["message"]
    assert "10 seconds" in data["message"]


def test_validation_exception(api_client):
    response = api_client.get("/test-exception/?exc=validation")
    data = response.json()

    assert response.status_code == 400
    assert data["message"] == "Validation failed."
    assert data["status"] == 400
    assert "field" in data["errors"]


def test_app_exception(api_client):
    response = api_client.get("/test-exception/?exc=app")
    data = response.json()

    assert response.status_code == 400
    assert data["message"] == "Application error."
    assert data["status"] == 400


def test_not_found_exception(api_client):
    response = api_client.get("/test-exception/?exc=not_found")
    data = response.json()

    assert response.status_code == 404
    assert data["message"] == "Resource not found."
    assert data["status"] == 404


def test_generic_exception(api_client):
    response = api_client.get("/test-exception/?exc=generic")
    data = response.json()

    assert response.status_code == 500
    assert data["message"] == "Internal server error. Please try again later."
    assert data["status"] == 500


def test_no_exception(api_client):
    response = api_client.get("/test-exception/")
    data = response.json()

    assert response.status_code == 200
    assert data["message"] == "ok"
    assert data["status"] == 200
