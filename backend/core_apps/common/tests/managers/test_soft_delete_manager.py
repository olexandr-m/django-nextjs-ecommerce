import pytest
from core_apps.common.managers.soft_delete_manager import SoftDeleteManager
from core_apps.common.models.soft_delete import SoftDelete
from django.db import models

pytestmark = pytest.mark.django_db


class SoftDeleteDummyModel(SoftDelete):
    name = models.CharField(max_length=50)

    objects: SoftDeleteManager = SoftDeleteManager()
    all_objects: SoftDeleteManager = SoftDeleteManager(include_deleted=True)

    class Meta(SoftDelete.Meta):
        app_label = "common"


@pytest.fixture
def soft_delete_model():
    return SoftDeleteDummyModel.objects.create()


def test_instance_alive(soft_delete_model):
    alive_items = SoftDeleteDummyModel.objects.alive()

    assert soft_delete_model in alive_items
    assert alive_items.count() == 1


def test_queryset_alive(soft_delete_model):
    alive_items = SoftDeleteDummyModel.all_objects.alive()

    assert soft_delete_model in alive_items
    assert alive_items.count() == 1


def test_instance_deleted(soft_delete_model):
    soft_delete_model.delete()
    soft_delete_model.refresh_from_db()

    deleted_items = SoftDeleteDummyModel.objects.deleted()

    assert soft_delete_model not in deleted_items
    assert deleted_items.count() == 0


def test_queryset_deleted(soft_delete_model):
    SoftDeleteDummyModel.objects.all().delete()

    deleted_items = SoftDeleteDummyModel.all_objects.deleted()

    assert soft_delete_model in deleted_items
    assert deleted_items.count() == 1


def test_instance_delete(soft_delete_model):
    soft_delete_model.delete()

    assert soft_delete_model.deleted_at is not None
    assert SoftDeleteDummyModel.objects.count() == 0


def test_queryset_delete():
    SoftDeleteDummyModel.objects.create()
    SoftDeleteDummyModel.objects.create()

    SoftDeleteDummyModel.all_objects.delete()

    assert SoftDeleteDummyModel.all_objects.count() == 2


def test_instance_hard_delete(soft_delete_model):
    soft_delete_model.hard_delete()

    assert SoftDeleteDummyModel.objects.count() == 0


def test_queryset_hard_delete():
    SoftDeleteDummyModel.objects.create()
    SoftDeleteDummyModel.objects.create()

    SoftDeleteDummyModel.all_objects.hard_delete()

    assert SoftDeleteDummyModel.all_objects.count() == 0


def test_instance_restore(soft_delete_model):
    soft_delete_model.delete()
    assert SoftDeleteDummyModel.objects.count() == 0

    soft_delete_model.restore()

    assert soft_delete_model.deleted_at is None
    assert SoftDeleteDummyModel.objects.filter(id=soft_delete_model.id).count() == 1
    assert soft_delete_model.is_deleted is False


def test_queryset_restore():
    SoftDeleteDummyModel.objects.create()
    SoftDeleteDummyModel.objects.create()

    SoftDeleteDummyModel.all_objects.delete()
    assert SoftDeleteDummyModel.objects.count() == 0
    assert SoftDeleteDummyModel.all_objects.count() == 2

    SoftDeleteDummyModel.all_objects.deleted().restore()

    assert SoftDeleteDummyModel.objects.count() == 2
    assert SoftDeleteDummyModel.all_objects.count() == 2
