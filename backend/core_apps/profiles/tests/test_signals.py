import pytest
from core_apps.profiles.models import Profile
from django.contrib.auth import get_user_model
from django.utils.text import slugify

User = get_user_model()

pytestmark = pytest.mark.django_db


def test_profile_is_created_on_user_creation(user):

    assert hasattr(user, "profile") is True
    assert isinstance(user.profile, Profile)
    assert user.profile.user == user


def test_profile_slug_is_truncated(user_factory):
    max_slug_length: int = getattr(Profile._meta.get_field("slug"), "max_length", 255)
    too_long_username = "a" * (max_slug_length + 1)

    user = user_factory(username=too_long_username)
    expected_slug = slugify(too_long_username)[:max_slug_length].rstrip("-")

    assert len(user.profile.slug) <= max_slug_length
    assert user.profile.slug == expected_slug


def test_profile_slug_field_is_updated_on_username_change(user_factory):
    old_username = "old_username"
    new_username = "new_username"

    user = user_factory(username=old_username)

    assert user.profile.slug == slugify(old_username)

    user.username = new_username
    user.save()

    assert user.profile.slug == slugify(new_username)


def test_profile_updated_at_field_is_updated_on_username_change(user):
    old_updated_at = user.profile.updated_at

    user.username = f"new {user.username}"
    user.save()

    profile = Profile.objects.get(user=user)
    profile.refresh_from_db()

    assert profile.updated_at != old_updated_at


def test_profile_updated_at_field_is_not_updated_on_username__is_same(user):
    old_updated_at = user.profile.updated_at

    user.first_name = f"new {user.first_name}"
    user.save()

    profile = Profile.objects.get(user=user)
    profile.refresh_from_db()

    assert profile.updated_at == old_updated_at
