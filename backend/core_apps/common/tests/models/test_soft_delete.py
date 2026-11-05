import pytest
from core_apps.common.models.soft_delete import SoftDelete
from django.db import models

pytestmark = pytest.mark.django_db


class SoftDeleteDummyModel(SoftDelete):
    name = models.CharField(max_length=50)

    class Meta(SoftDelete.Meta):
        app_label = "users"


@pytest.fixture
def soft_delete_model():
    return SoftDeleteDummyModel.objects.create()


def test_creation_soft_delete_field(soft_delete_model):
    assert soft_delete_model.deleted_at is None


def test_update_deleted_at_field_on_delete(soft_delete_model):
    soft_delete_model.delete()

    assert soft_delete_model.deleted_at is not None


def test_does_not_update_deleted_at_field_if_already_deleted(soft_delete_model):
    soft_delete_model.delete()
    deleted_at = soft_delete_model.deleted_at

    soft_delete_model.refresh_from_db()
    soft_delete_model.delete()

    assert soft_delete_model.deleted_at == deleted_at


def test_hard_delete(soft_delete_model):
    model_class = soft_delete_model.__class__
    model_id = soft_delete_model.id

    soft_delete_model.hard_delete()

    with pytest.raises(model_class.DoesNotExist):
        model_class.all_objects.get(id=model_id)


def test_restore(soft_delete_model):
    soft_delete_model.delete()

    assert soft_delete_model.deleted_at is not None

    soft_delete_model.refresh_from_db()
    soft_delete_model.restore()

    assert soft_delete_model.deleted_at is None


def test_is_deleted_true(soft_delete_model):
    soft_delete_model.delete()

    assert soft_delete_model.is_deleted is True


def test_is_deleted_false(soft_delete_model):

    assert soft_delete_model.is_deleted is False
