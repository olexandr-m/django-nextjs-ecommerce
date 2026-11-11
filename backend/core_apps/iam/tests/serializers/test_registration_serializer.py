import pytest
from core_apps.iam.serializers.registration_serializer import RegistrationSerializer
from core_apps.users.tests.factories import UserFactory
from rest_framework.validators import UniqueValidator

pytestmark = pytest.mark.django_db


@pytest.fixture
def valid_data():
    return {
        "email": "test@example.com",
        "username": "testuser",
        "password": "Password123!",
        "confirmed_password": "Password123!",
    }


def test_valid_data_passes(valid_data):
    serializer = RegistrationSerializer(data=valid_data)

    assert serializer.is_valid()


def test_missing_required_fields():
    serializer = RegistrationSerializer(data={})

    assert not serializer.is_valid()

    for field in ("email", "username", "password", "confirmed_password"):
        assert field in serializer.errors


def test_valid_data_creates_user(valid_data):
    serializer = RegistrationSerializer(data=valid_data)
    assert serializer.is_valid(), serializer.errors
    user = serializer.save()

    assert user.email == valid_data["email"]
    assert user.username == valid_data["username"]
    assert user.check_password(valid_data["password"])


def test_email_unique_validator_is_removed():
    serializer = RegistrationSerializer()
    assert isinstance(serializer, RegistrationSerializer)
    email_field = serializer.fields["email"]

    validators = email_field.validators
    has_unique_validator = any(isinstance(v, UniqueValidator) for v in validators)

    assert has_unique_validator == False


def test_serializer_accepts_duplicate_email(valid_data):
    UserFactory.create(email=valid_data["email"])

    serializer = RegistrationSerializer(data=valid_data)

    assert serializer.is_valid(), serializer.errors
    assert "email" not in serializer.errors


def test_missing_confirmed_password(valid_data):
    invalid_data = {**valid_data, "confirmed_password": ""}

    serializer = RegistrationSerializer(data=invalid_data)

    assert not serializer.is_valid()
    assert "confirmed_password" in serializer.errors


def test_passwords_do_not_match(valid_data):
    invalid_data = {**valid_data, "confirmed_password": "Different123!"}

    serializer = RegistrationSerializer(data=invalid_data)
    assert isinstance(serializer, RegistrationSerializer)

    assert not serializer.is_valid()
    assert "password" in serializer.errors
    assert serializer.errors["password"][0] == "Passwords do not match."


def test_create_does_not_include_confirmed_password(valid_data):
    serializer = RegistrationSerializer(data=valid_data)
    assert isinstance(serializer, RegistrationSerializer)
    assert serializer.is_valid(), serializer.errors

    user = serializer.save()

    assert user.check_password(valid_data["password"])
    assert not hasattr(user, "confirmed_password")


def test_serializer_output_fields(valid_data):
    expected_fields = {"email", "username", "password"}

    serializer = RegistrationSerializer(data=valid_data)

    serializer.is_valid()
    serialized_data = serializer.validated_data
    assert isinstance(serialized_data, dict)

    assert set(serialized_data.keys()) == expected_fields
