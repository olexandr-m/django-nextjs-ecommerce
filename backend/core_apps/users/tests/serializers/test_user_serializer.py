import pytest
from core_apps.profiles.tests.factories import ProfileFactory
from core_apps.users.serializers.user_serializer import UserSerializer

pytestmark = pytest.mark.django_db


def test_serializer_output_fields(user):
    serializer = UserSerializer(instance=user)
    serialized_data = serializer.data
    assert isinstance(serialized_data, dict)

    expected_fields = {
        "id",
        "email",
        "username",
        "first_name",
        "last_name",
        "account_status",
        "role",
        "avatar",
        "created_at",
    }

    assert set(serialized_data.keys()) == expected_fields


def test_uuid_id_field_serialization_to_string(user):
    serializer = UserSerializer(user)
    assert isinstance(serializer, UserSerializer)

    assert isinstance(serializer.data["id"], str)


def test_avatar_no_profile_returns_none(user_factory):
    user = user_factory(profile=None)

    serializer = UserSerializer(user)
    assert isinstance(serializer, UserSerializer)

    assert serializer.data["avatar"] is None


def test_avatar_profile_no_avatar_returns_none(user):
    ProfileFactory(user=user, avatar=None)

    serializer = UserSerializer(user)
    assert isinstance(serializer, UserSerializer)

    assert serializer.data["avatar"] is None


def test_avatar_with_no_request_in_context_returns_relative_url(user):
    user.profile.avatar = "test_avatar.jpg"
    user.save()

    serializer = UserSerializer(user)
    assert isinstance(serializer, UserSerializer)

    assert serializer.data["avatar"].endswith("test_avatar.jpg")
    assert "http" not in serializer.data["avatar"]


def test_avatar_with_request_in_context_returns_absolute_url(user, api_factory):
    user.profile.avatar = "test_avatar.jpg"
    user.save()

    request = api_factory.get("http://testserver")
    serializer = UserSerializer(user, context={"request": request})
    assert isinstance(serializer, UserSerializer)

    avatar = serializer.data["avatar"]
    assert avatar.startswith("http://testserver")
    assert avatar.endswith("test_avatar.jpg")
