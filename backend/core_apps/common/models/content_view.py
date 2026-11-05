from core_apps.common.managers.content_view_manager import ContentViewManager
from core_apps.common.models.timestamped import TimeStamped
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _

User = get_user_model()


class ContentView(TimeStamped):
    content_type = models.ForeignKey(
        ContentType, on_delete=models.CASCADE, verbose_name=_("Content Type")
    )
    object_id = models.PositiveIntegerField(verbose_name=_("Object ID"))
    content_object = GenericForeignKey("content_type", "object_id")
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="content_views",
        verbose_name=_("User"),
    )
    viewer_ip = models.GenericIPAddressField(
        verbose_name=_("Viewer IP Address"),
        null=True,
        blank=True,
    )
    last_viewed = models.DateTimeField()

    objects = ContentViewManager()

    def save(self, *args, **kwargs):
        if self.pkid:
            raise ValidationError(
                _("This record is an immutable log and cannot be modified.")
            )
        super().save(*args, **kwargs)

    class Meta(TimeStamped.Meta):
        verbose_name = _("Content View")
        verbose_name_plural = _("Content Views")
        unique_together = (
            "content_type",
            "object_id",
            "user",
            "viewer_ip",
        )
        indexes = (
            models.Index(fields=("content_type", "object_id", "user", "viewer_ip")),
        )

    def __str__(self) -> str:
        user_name = self.user.full_name if self.user else "Anonymous"
        return f"{self.content_type} viewed by {user_name} from IP {self.viewer_ip}"
