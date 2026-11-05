import time
import uuid

import pytest
from core_apps.common.models.timestamped import TimeStamped
from django.db import models
from django.utils import timezone

pytestmark = pytest.mark.django_db


class TimestampedDummyModel(TimeStamped):
    name = models.CharField(max_length=50)

    class Meta(TimeStamped.Meta):
        app_label = "users"


@pytest.fixture
def timestamped_model():
    return TimestampedDummyModel.objects.create()


def test_creation_timestamp_fields(timestamped_model):
    assert timestamped_model.pkid is not None
    assert isinstance(timestamped_model.id, uuid.UUID)
    assert isinstance(timestamped_model.created_at, timezone.datetime)
    assert isinstance(timestamped_model.updated_at, timezone.datetime)


def test_updated_at_field_changes_on_save(timestamped_model):
    original_updated_at = timestamped_model.updated_at

    time.sleep(0.01)
    timestamped_model.name = "updated"
    timestamped_model.save()

    assert timestamped_model.updated_at > original_updated_at
    assert timestamped_model.created_at < timestamped_model.updated_at


def test_ordering(db):
    obj1 = TimestampedDummyModel.objects.create()
    time.sleep(0.01)
    obj2 = TimestampedDummyModel.objects.create()

    results = list(TimestampedDummyModel.objects.all())
    assert results == [obj2, obj1]
