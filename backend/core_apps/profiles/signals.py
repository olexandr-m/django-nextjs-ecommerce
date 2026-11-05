from typing import Any

from core_apps.profiles.models import Profile
from core_apps.users.models import User
from django.db.models.base import Model
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.text import slugify
from loguru import logger


def _generate_safe_profile_slug(username: str) -> str:
    raw_slug = slugify(username or "")
    max_length: int = getattr(Profile._meta.get_field("slug"), "max_length", 255)
    return raw_slug[:max_length].rstrip("-")


@receiver(post_save, sender=User)
def ensure_user_profile_exists(
    sender: type[Model], instance: User, created: bool, **kwargs: Any
) -> None:

    if created:
        slug = _generate_safe_profile_slug(instance.username)
        Profile.objects.create(user=instance, slug=slug)
        logger.info(f"Profile created for {instance.full_name or instance.username}")


@receiver(post_save, sender=User)
def update_profile_slug_on_username_change(sender, instance, created, **kwargs):
    if created:
        return

    try:
        profile = instance.profile
    except Profile.DoesNotExist:
        return

    new_slug = _generate_safe_profile_slug(instance.username)

    if profile.slug != new_slug:
        profile.slug = new_slug
        profile.save(update_fields=["slug", "updated_at"])
