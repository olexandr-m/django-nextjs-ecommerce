import uuid

from django.contrib.auth import get_user_model
from factory.declarations import LazyAttribute
from factory.django import DjangoModelFactory
from faker import Faker

faker = Faker()

User = get_user_model()


class UserFactory(DjangoModelFactory):
    class Meta:  # type: ignore[override]
        model = User

    username = LazyAttribute(lambda x: f"{faker.first_name()}_{uuid.uuid4().hex[:6]}")
    first_name = LazyAttribute(lambda x: faker.first_name())
    last_name = LazyAttribute(lambda x: faker.last_name())
    email = LazyAttribute(lambda x: faker.email())
    password = LazyAttribute(lambda x: faker.password())

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        manager = cls._get_manager(model_class)
        is_admin = kwargs.pop("is_admin", False)
        if is_admin:
            return manager.create_superuser(*args, **kwargs)
        else:
            return manager.create_user(*args, **kwargs)
