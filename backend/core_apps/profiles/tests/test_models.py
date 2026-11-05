import pytest
from core_apps.profiles.models import Profile
from core_apps.profiles.tests.factories import ProfileFactory
from django.utils.text import slugify

pytestmark = pytest.mark.django_db


def test_create_profile():
    profile = ProfileFactory()

    assert profile.user is not None
    assert profile.avatar is not None
    assert profile.gender == Profile.Gender.OTHER
    assert profile.bio is not None
    assert profile.phone_number is not None
    assert profile.date_of_birth is not None
    assert profile.city is not None
    assert profile.country is not None
    assert profile.slug is not None


def test_update_profile(user):
    profile = user.profile
    new_bio = "new bio"
    new_city = "new city"
    profile.bio = new_bio
    profile.city = new_city
    profile.save()

    updated_profile = Profile.objects.get(pk=profile.pk)
    assert updated_profile.bio == new_bio
    assert updated_profile.city == new_city


def test_delete_profile(user):

    profile = user.profile
    profile_pk = profile.pk
    profile.delete()

    assert not Profile.objects.filter(pk=profile_pk).exists()


def test_slug_is_generated_from_username(user):
    profile = user.profile

    assert profile.slug == slugify(user.username)


def test_str_with_full_name(user_factory):
    user = user_factory(first_name="Test", last_name="User", username="Username")
    profile = user.profile

    assert str(profile) == "Test User Profile"


def test_str_without_full_name(user_factory):
    user = user_factory(first_name="", last_name="", username="Username")
    profile = user.profile

    assert str(profile) == "Username Profile"


def test_profile_user_relationship(user):
    profile = user.profile

    assert profile.user == user


def test_user_deletion_cascades_to_profile(user):
    profile = user.profile
    profile_pk = profile.pk

    user.delete()

    assert not Profile.objects.filter(pk=profile_pk).exists()


def test_gender_labels():
    assert Profile.Gender.MALE.label == "Male"
    assert Profile.Gender.FEMALE.label == "Female"
    assert Profile.Gender.OTHER.label == "Other"
