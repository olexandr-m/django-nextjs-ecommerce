from django.db import models
from django.utils import timezone


class SoftDeleteQuerySet(models.QuerySet):
    def alive(self) -> "SoftDeleteQuerySet":
        return self.filter(deleted_at__isnull=True)

    def deleted(self) -> "SoftDeleteQuerySet":
        return self.filter(deleted_at__isnull=False)

    def delete(self) -> tuple[int, dict[str, int]]:
        rows_updated = self.update(deleted_at=timezone.now())
        return rows_updated, {self.model._meta.label: rows_updated}

    def hard_delete(self) -> tuple[int, dict[str, int]]:
        return super().delete()

    def restore(self) -> int:
        return self.update(deleted_at=None)


class SoftDeleteManager(models.Manager):
    def __init__(
        self,
        *args,
        include_deleted: bool = False,
        **kwargs,
    ) -> None:
        super().__init__(*args, **kwargs)
        self.include_deleted_items = include_deleted

    def get_queryset(self) -> SoftDeleteQuerySet:
        queryset = SoftDeleteQuerySet(
            self.model,
            using=self._db,
        )

        if not self.include_deleted_items:
            queryset = queryset.alive()

        return queryset

    def alive(self) -> SoftDeleteQuerySet:
        return self.get_queryset().alive()

    def delete(self) -> tuple[int, dict[str, int]]:
        return self.get_queryset().delete()

    def deleted(self) -> SoftDeleteQuerySet:
        return self.get_queryset().deleted()

    def hard_delete(self) -> tuple[int, dict[str, int]]:
        return self.get_queryset().hard_delete()

    def restore(self) -> int:
        return self.get_queryset().restore()
