import unicodedata

import pytest
from core_apps.iam.models.authentication import Authentication
from core_apps.users.tests.factories import UserFactory
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

User = get_user_model()

pytestmark = pytest.mark.django_db


@pytest.fixture
def create_user():
    def make_user(**kwargs):
        defaults = {
            "username": "user",
            "email": "user@example.com",
            "password": "password123",
        }
        defaults.update(kwargs)
        return UserFactory.create(**defaults)

    return make_user


def test_create_user_success(create_user):
    user = create_user()
    assert user.username == unicodedata.normalize("NFKC", "user")
    assert user.email == "user@example.com"
    assert user.check_password("password123")
    assert user.role == Authentication.RoleChoices.CUSTOMER
    assert user.account_status == Authentication.AccountStatus.INACTIVE


def test_create_super_user_success(create_user):
    user_data = {
        "username": "admin",
        "email": "admin@example.com",
        "password": "password123",
    }
    admin = create_user(is_admin=True, **user_data)

    assert admin.username == unicodedata.normalize("NFKC", "admin")
    assert admin.email == "admin@example.com"
    assert admin.check_password("password123")
    assert admin.role == Authentication.RoleChoices.ADMIN
    assert admin.account_status == Authentication.AccountStatus.ACTIVE


def test_create_user_when_username_is_not_provided(create_user):
    with pytest.raises(ValueError, match="A username must be provided."):
        create_user(username=None)


def test_create_user_when_email_is_not_provided(create_user):
    with pytest.raises(ValueError, match="An email address must be provided."):
        create_user(email=None)


def test_create_user_with_invalid_email(create_user):
    with pytest.raises(ValidationError, match="Enter a valid email address."):
        create_user(email="not-email")


def test_create_user_when_password_is_not_provided(create_user):
    with pytest.raises(ValueError, match="A password must be provided."):
        create_user(password=None)


def test_create_user_email_is_normalized(create_user):
    user = create_user(email="user@ExaMplE.com")
    assert user.email == "user@example.com"


def test_create_user_email_in_lower_case(create_user):
    user = create_user(email="uSeR@example.com")
    assert user.email == "user@example.com"


def test_create_user_username_is_normalized(create_user):
    user = create_user(username="ＡＢＣ user")
    assert user.username == "ABC user"
