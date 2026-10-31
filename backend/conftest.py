import io
import shutil

import pytest
from core_apps.users.tests.factories import UserFactory
from django.conf import settings
from django.core.cache import cache
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image
from pytest_factoryboy import register
from rest_framework.test import APIClient, APIRequestFactory

register(UserFactory)


@pytest.fixture(autouse=True)
def clear_cache():
    cache.clear()
    yield
    cache.clear()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def api_factory():
    return APIRequestFactory()


@pytest.fixture
def user(db, user_factory):
    new_user = user_factory.create()
    return new_user


@pytest.fixture
def super_user(db, user_factory):
    new_user = user_factory.create(is_admin=True)
    return new_user


@pytest.fixture
def auth_client(api_client, user):
    api_client.force_authenticate(user=user)
    yield api_client
    api_client.force_authenticate(user=None)


@pytest.fixture(autouse=True)
def cleanup_media():
    yield
    shutil.rmtree(settings.MEDIA_ROOT, ignore_errors=True)


@pytest.fixture()
def test_image():
    file = io.BytesIO()
    image = Image.new("RGB", (100, 100), color="red")
    image.save(file, "JPEG")
    file.name = "test.jpg"
    file.seek(0)
    return SimpleUploadedFile(
        name="test.jpg", content=file.read(), content_type="image/jpeg"
    )


@pytest.fixture
def transaction_on_commit(django_capture_on_commit_callbacks):
    return django_capture_on_commit_callbacks
