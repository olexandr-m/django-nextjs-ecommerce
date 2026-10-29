import pytest
from core_apps.iam.models.authentication import Authentication
from django.db import models
from django.utils import timezone

pytestmark = pytest.mark.django_db


class DummyUserModel(Authentication):
    username = models.CharField(max_length=50)

    class Meta(Authentication.Meta):
        app_label = "dummy_users"


@pytest.fixture
def dummy_user_model():
    return DummyUserModel(
        username="test_user",
        activation_expires_at=timezone.now(),
        activated_at=timezone.now(),
        otp_expires_at=timezone.now(),
        locked_until=timezone.now(),
    )


def test_creation_authentication_fields(dummy_user_model):
    assert (
        dummy_user_model.account_status == Authentication.AccountStatus.INACTIVE.value
    )
    assert dummy_user_model.role == Authentication.RoleChoices.CUSTOMER
    assert dummy_user_model.activation_token is None
    assert dummy_user_model.activation_expires_at is not None
    assert dummy_user_model.activated_at is not None
    assert dummy_user_model.otp_code is None
    assert dummy_user_model.otp_expires_at is not None
    assert dummy_user_model.failed_login_attempts == 0
    assert dummy_user_model.locked_until is not None
    assert dummy_user_model.token_version == 0

    assert isinstance(dummy_user_model.activation_expires_at, timezone.datetime)
    assert isinstance(dummy_user_model.activated_at, timezone.datetime)
    assert isinstance(dummy_user_model.otp_expires_at, timezone.datetime)
    assert isinstance(dummy_user_model.locked_until, timezone.datetime)


def test_account_status_values():
    assert Authentication.AccountStatus.ACTIVE.value == "active"
    assert Authentication.AccountStatus.INACTIVE.value == "inactive"
    assert Authentication.AccountStatus.LOCKED.value == "locked"


def test_role_choices_values():
    assert Authentication.RoleChoices.CUSTOMER.value == "customer"
    assert Authentication.RoleChoices.ADMIN.value == "admin"
