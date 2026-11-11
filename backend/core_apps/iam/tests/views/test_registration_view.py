from unittest.mock import patch

import pytest
from core_apps.users.models import User
from core_apps.users.serializers.user_serializer import UserSerializer
from django.conf import settings
from django.core import mail
from django.core.cache import cache
from django.urls import reverse
from django.utils import timezone
from rest_framework import status


@pytest.fixture(autouse=True)
def clear_cache():
    cache.clear()


pytestmark = pytest.mark.django_db

url = reverse("register")


@pytest.fixture
def valid_data():
    return {
        "email": "test@example.com",
        "username": "testuser",
        "password": "Password123!",
        "confirmed_password": "Password123!",
    }


def test_register_success_creates_user(api_client, valid_data):
    api_client.post(url, valid_data, format="json")

    user = User.objects.get(email=valid_data["email"])
    assert user is not None


def test_register_success_generates_token(api_client, valid_data):
    api_client.post(url, valid_data, format="json")

    user = User.objects.get(email=valid_data["email"])

    assert user.activation_token is not None
    assert user.activation_expires_at > timezone.now()


def test_register_with_duplicate_do_not_generate_token(api_client, valid_data, user):
    invalid_data = {**valid_data, "email": user.email}

    api_client.post(url, invalid_data, format="json")

    assert user.activation_token is None
    assert user.activation_expires_at is None


def test_register_success_sends_activation_email(api_client, valid_data):
    with patch("django.db.transaction.on_commit", side_effect=lambda func: func()):
        api_client.post(url, valid_data, format="json")

    assert len(mail.outbox) == 1
    email = mail.outbox[0]
    assert email.subject == "Activate your account."


def test_register_with_duplicate_email_sends_already_registered_email(
    api_client, valid_data, user
):
    invalid_data = {**valid_data, "email": user.email}

    with patch("django.db.transaction.on_commit", side_effect=lambda func: func()):
        api_client.post(url, invalid_data, format="json")

    assert len(mail.outbox) == 1
    email = mail.outbox[0]
    assert email.subject == f"Attempted Registration at {settings.SITE_NAME}"


def test_register_success_response(api_client, valid_data):
    response = api_client.post(url, valid_data, format="json")

    data = response.json()

    assert response.status_code == status.HTTP_201_CREATED
    assert data["status"] == 201
    assert (
        data["message"]
        == "Registration successful. Check your email to activate your account."
    )
    assert data["data"]["user"] is not None


def test_register_with_duplicate_email_response(api_client, valid_data, user):
    invalid_data = {**valid_data, "email": user.email}
    response = api_client.post(url, invalid_data, format="json")

    data = response.json()

    assert response.status_code == status.HTTP_201_CREATED
    assert data["status"] == 201
    assert (
        data["message"]
        == "Registration successful. Check your email to activate your account."
    )
    assert data["data"]["user"] is not None


def test_register_success_response_returns_user_serializer_data(api_client, valid_data):
    response = api_client.post(url, valid_data, format="json")

    user = User.objects.get(email=valid_data["email"])
    expected_serializer = UserSerializer(
        user, context={"request": response.renderer_context["request"]}
    )

    data = response.json()
    assert data["data"]["user"] == expected_serializer.data


def test_register_validation_error(api_client, valid_data):
    invalid_data = {**valid_data, "email": "not email"}

    response = api_client.post(url, invalid_data, format="json")

    data = response.json()
    assert response.status_code == 400
    assert "Enter a valid email address." in data["errors"]["email"]

    assert User.objects.filter(email=valid_data["email"]).count() == 0
    assert len(mail.outbox) == 0


def test_register_email_send_failure_still_creates_user(api_client, valid_data):
    with patch(
        "core_apps.iam.services.registration_service.send_activation_email",
        side_effect=Exception("SMTP failure"),
    ):
        api_client.post(url, valid_data, format="json")

    user = User.objects.get(email=valid_data["email"])
    assert user.username == valid_data["username"]

    assert len(mail.outbox) == 0


def test_register_duplicate_username(api_client, valid_data, user_factory):
    user_factory(username=valid_data["username"])

    response = api_client.post(url, valid_data, format="json")

    data = response.json()
    assert response.status_code == 400
    assert "User with this Username already exists." in data["errors"]["username"]
    assert not User.objects.filter(email=valid_data["email"]).exists()


def test_register_password_mismatch(api_client, valid_data):
    invalid_data = {**valid_data, "confirmed_password": "Different123!"}
    response = api_client.post(url, invalid_data, format="json")

    data = response.json()
    assert response.status_code == 400
    assert "Passwords do not match." in data["errors"]["password"]
    assert not User.objects.filter(email=valid_data["email"]).exists()


def test_register_throttle(api_client, valid_data):
    other_email = {
        **valid_data,
        "email": "other@email.com",
        "username": "other_username",
    }
    limit_per_minute = 5

    for i in range(limit_per_minute):
        api_client.post(url, valid_data, format="json")

    same_email_response = api_client.post(url, valid_data, format="json")
    other_email_response = api_client.post(url, other_email, format="json")

    assert other_email_response.json()["status"] == 201

    data = same_email_response.json()
    assert same_email_response.status_code == status.HTTP_429_TOO_MANY_REQUESTS
    assert data["status"] == 429
    assert data["message"] == "Too many requests. Try again in 1 minute."
    assert "data" not in data
