from django.contrib.contenttypes.models import ContentType
from django.db import IntegrityError, models, transaction
from django.utils import timezone


class ContentViewManager(models.Manager):
    def record_view(self, content_object, user=None, viewer_ip=None):
        content_type = ContentType.objects.get_for_model(content_object)

        try:
            with transaction.atomic(using=self._db):
                return self._create_content_view(
                    content_type, content_object.pkid, user, viewer_ip
                )
        except IntegrityError:
            return self.get(
                content_type=content_type,
                object_id=content_object.pkid,
                user=user,
                viewer_ip=viewer_ip,
            )

    def _create_content_view(self, content_type, object_id, user, viewer_ip):
        return self.create(
            content_type=content_type,
            object_id=object_id,
            user=user,
            viewer_ip=viewer_ip,
            last_viewed=timezone.now(),
        )
