from unittest.mock import patch

import pytest
from core_apps.iam.services.registration_service import RegistrationService
from core_apps.users.models import User
from django.conf import settings
from django.core import mail

pytestmark = pytest.mark.django_db


@pytest.fixture
def valid_data():
    return {
        "email": "test@example.com",
        "username": "new user name",
        "password": "Password123!",
        "confirmed_password": "Password123!",
    }


def test_it_pops_confirmed_password_from_data(valid_data):
    valid_data["confirmed_password"] = "Password123!"

    RegistrationService.register_user(valid_data)

    assert "confirmed_password" not in valid_data
    assert "email" in valid_data


def test_register_success_creates_user(valid_data):
    RegistrationService.register_user(valid_data)

    user = User.objects.get(email=valid_data["email"])
    assert user is not None


@patch("core_apps.iam.services.activation_service.ActivationService.generate_token")
def test_register_success_calls_activation_service_generate_token_method(
    mock_activation_service, valid_data
):
    mock_activation_service.return_value = "dummy-token"

    user, _ = RegistrationService.register_user(valid_data)

    mock_activation_service.assert_called_once_with(user)


def test_register_success_sends_activation_email(valid_data):
    with patch("django.db.transaction.on_commit", side_effect=lambda func: func()):
        RegistrationService.register_user(valid_data)

    assert len(mail.outbox) == 1
    email = mail.outbox[0]
    assert email.subject == "Activate your account."


def test_register_success_returns_created_user_and_true(valid_data):
    created_user, created = RegistrationService.register_user(valid_data)

    user_from_db = User.objects.get(email=valid_data["email"])

    assert created is True
    assert isinstance(created_user, User)

    assert created_user == user_from_db
    assert created_user.pk == user_from_db.pk


def test_failure_do_not_creates_new_user(user, valid_data):
    invalid_data = {**valid_data, "email": user.email}
    RegistrationService.register_user(invalid_data)

    existing_user = User.objects.filter(username=user.username).exists()
    created_user = User.objects.filter(username=valid_data["username"]).exists()

    assert existing_user is True
    assert created_user is False


@patch("core_apps.iam.services.activation_service.ActivationService.generate_token")
def test_failure_do_not_call_activation_service(
    mock_activation_service, user, valid_data
):
    invalid_data = {**valid_data, "email": user.email}

    RegistrationService.register_user(invalid_data)

    mock_activation_service.assert_not_called()


def test_failure_sends_already_registered_email(user, valid_data):
    subject = f"Attempted Registration at {settings.SITE_NAME}"
    invalid_data = {**valid_data, "email": user.email}

    RegistrationService.register_user(invalid_data)

    assert len(mail.outbox) == 1
    email = mail.outbox[0]
    assert email.subject == subject


def test_failure_returns_existing_user_and_false(user, valid_data):
    invalid_data = {**valid_data, "email": user.email}

    returned_user, created = RegistrationService.register_user(invalid_data)

    existing_user = User.objects.get(username=user.username)

    assert created is False
    assert isinstance(returned_user, User)

    assert returned_user == existing_user
    assert returned_user.pk == existing_user.pk
