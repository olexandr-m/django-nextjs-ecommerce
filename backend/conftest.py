import io
import shutil

import pytest
from django.conf import settings
from django.core.cache import cache
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image
from rest_framework.test import APIClient, APIRequestFactory


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
