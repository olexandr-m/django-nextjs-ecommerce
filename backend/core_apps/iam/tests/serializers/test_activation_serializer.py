import pytest
from core_apps.iam.exceptions import InvalidActivationException
from core_apps.iam.serializers.activation_serializer import ActivationSerializer
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import serializers

pytestmark = pytest.mark.django_db


@pytest.fixture
def valid_data(user):
    uid = urlsafe_base64_encode(force_bytes(user.id))
    return {"uid": uid, "token": "test_token"}


def test_valid_data_passes(valid_data):
    serializer = ActivationSerializer(data=valid_data)

    assert serializer.is_valid()


def test_missing_required_fields():
    serializer = ActivationSerializer(data={})

    assert not serializer.is_valid()

    for field in ("uid", "token"):
        assert field in serializer.errors


def test_user_is_in_validated_data(user, valid_data):
    serializer = ActivationSerializer(data=valid_data)

    serializer.is_valid()
    serialized_data = serializer.validated_data
    assert isinstance(serialized_data, dict)

    assert "user" in serialized_data
    assert serialized_data["user"] == user


def test_non_existing_uid_raises_invalid_activation_token_exception(valid_data):
    invalid_data = {**valid_data, "uid": "550e8400-e29b-41d4-a716-446655440000"}
    serializer = ActivationSerializer(data=invalid_data)

    with pytest.raises(InvalidActivationException) as exc:
        serializer.is_valid(raise_exception=True)

    assert (
        str(exc.value)
        == "This activation link is no longer valid. Please log in or request a new link."
    )


def test_invalid_uid_raises_validation_error(valid_data):
    invalid_data = {**valid_data, "uid": {}}
    serializer = ActivationSerializer(data=invalid_data)

    with pytest.raises(serializers.ValidationError) as exc:
        serializer.is_valid(raise_exception=True)

    assert isinstance(exc.value.detail, dict)
    error = exc.value.detail["uid"][0]
    assert error == "Not a valid string."


def test_uid_cannot_be_blank(valid_data):
    invalid_data = {**valid_data, "uid": ""}
    serializer = ActivationSerializer(data=invalid_data)

    assert not serializer.is_valid()
    assert isinstance(serializer.errors, dict)
    assert serializer.errors["uid"][0] == "This field may not be blank."


def test_serializer_output_fields(valid_data):
    expected_fields = {"token", "uid", "user"}

    serializer = ActivationSerializer(data=valid_data)

    serializer.is_valid()
    serialized_data = serializer.validated_data
    assert isinstance(serialized_data, dict)

    assert set(serialized_data.keys()) == expected_fields
