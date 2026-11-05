from datetime import datetime

import factory
from core_apps.profiles.models import Profile
from core_apps.users.tests.factories import UserFactory
from django.contrib.auth import get_user_model
from django.db.models import signals
from factory.declarations import LazyAttribute, SubFactory
from factory.django import DjangoModelFactory
from factory.faker import Faker

User = get_user_model()


@factory.django.mute_signals(signals.post_save)
class ProfileFactory(DjangoModelFactory):
    class Meta:  # type: ignore[override]
        model = Profile
        django_get_or_create = ("user",)

    user = SubFactory(UserFactory)
    avatar = ""
    gender = Profile.Gender.OTHER
    bio = Faker("paragraph", nb_sentences=3)
    phone_number = Faker("phone_number")
    date_of_birth = LazyAttribute(lambda x: datetime.now())
    city = Faker("city")
    country = Faker("country_code")
    slug = LazyAttribute(lambda obj: obj.user.username)
