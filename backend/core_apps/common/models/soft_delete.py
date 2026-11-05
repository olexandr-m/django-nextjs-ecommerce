from core_apps.common.managers.soft_delete_manager import SoftDeleteManager
from django.db import models
from django.utils import timezone


class SoftDelete(models.Model):
    deleted_at = models.DateTimeField(
        null=True, blank=True, editable=False, db_index=True
    )

    objects = SoftDeleteManager()
    all_objects = SoftDeleteManager(include_deleted=True)

    def delete(self, using=None, keep_parents=False) -> tuple[int, dict[str, int]]:
        if self.deleted_at is not None:
            return 0, {}

        self.deleted_at = timezone.now()
        self.save(using=using, update_fields=["deleted_at"])

        return 1, {self._meta.label: 1}

    def hard_delete(self, using=None, keep_parents=False) -> tuple[int, dict[str, int]]:
        return super().delete(using=using, keep_parents=keep_parents)

    def restore(self, using=None) -> tuple[int, dict[str, int]]:
        if self.deleted_at is None:
            return 0, {}

        self.deleted_at = None
        self.save(using=using, update_fields=["deleted_at"])
        return 1, {self._meta.label: 1}

    @property
    def is_deleted(self) -> bool:
        return self.deleted_at is not None

    class Meta:
        abstract = True
        base_manager_name = "all_objects"
        default_manager_name = "objects"
