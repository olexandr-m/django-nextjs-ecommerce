import pytest
from core_apps.iam.models.authentication import Authentication
from django.contrib.auth import get_user_model
from django.db import IntegrityError

User = get_user_model()

pytestmark = pytest.mark.django_db


def test_create_user(user):
    assert user.pkid is not None
    assert user.id is not None
    assert user.username is not None
    assert user.email is not None
    assert user.password is not None
    assert user.first_name is not None
    assert user.last_name is not None
    assert user.role == Authentication.RoleChoices.CUSTOMER
    assert user.account_status == Authentication.AccountStatus.INACTIVE
    assert user.activation_token is None
    assert user.activation_expires_at is None
    assert user.activated_at is None
    assert user.failed_login_attempts == 0
    assert user.locked_until is None
    assert user.token_version == 0
    assert user.otp_code is None
    assert user.otp_expires_at is None


def test_create_superuser(super_user):
    assert super_user.pkid is not None
    assert super_user.id is not None
    assert super_user.username is not None
    assert super_user.email is not None
    assert super_user.password is not None
    assert super_user.first_name is not None
    assert super_user.last_name is not None
    assert super_user.role == Authentication.RoleChoices.ADMIN
    assert super_user.account_status == Authentication.AccountStatus.ACTIVE
    assert super_user.activation_token is None
    assert super_user.activation_expires_at is None
    assert super_user.activated_at is None
    assert super_user.failed_login_attempts == 0
    assert super_user.locked_until is None
    assert super_user.token_version == 0
    assert super_user.otp_code is None
    assert super_user.otp_expires_at is None


def test_update_user(user):
    new_first_name = "John"
    new_last_name = "Doe"
    user.first_name = new_first_name
    user.last_name = new_last_name
    user.save()

    updated_user = User.objects.get(pk=user.pk)
    assert updated_user.first_name == new_first_name
    assert updated_user.last_name == new_last_name


def test_delete_user(user):
    user_pk = user.pk
    user.delete()

    with pytest.raises(User.DoesNotExist):
        User.objects.get(pk=user_pk)


def test_full_name(user_factory):
    user = user_factory.create(
        first_name="normal",
        last_name="user",
    )
    expected_full_name = "normal user"

    assert user.full_name == expected_full_name


def test_full_name_without_first_and_last(user_factory):
    user = user_factory.create(
        first_name="",
        last_name="",
    )
    expected_full_name = ""

    assert user.full_name == expected_full_name


def test_user_str(user_factory):
    user = user_factory.create(
        username="testuser",
        email="test@example.com",
    )
    expected_str = "testuser (test@example.com) - customer"
    assert str(user) == expected_str


def test_unique_id_constraint(user, user_factory):
    with pytest.raises(IntegrityError):
        user_factory.create(id=user.id)


def test_unique_email_constraint(user_factory):
    user_factory.create(email="test@example.com")

    with pytest.raises(IntegrityError):
        user_factory.create(email="test@example.com")


def test_unique_username_constraint(user_factory):
    user_factory.create(username="test user")

    with pytest.raises(IntegrityError):
        user_factory.create(username="test user")
