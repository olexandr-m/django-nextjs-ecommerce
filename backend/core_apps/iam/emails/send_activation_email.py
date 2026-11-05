from core_apps.users.models import User
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import formats, timezone
from django.utils.encoding import force_bytes
from django.utils.html import strip_tags
from django.utils.http import urlsafe_base64_encode
from django.utils.translation import gettext_lazy as _
from loguru import logger


def send_activation_email(user: User, token: str) -> None:
    uid = urlsafe_base64_encode(force_bytes(user.id))
    activation_url = f"{settings.FRONTEND_URL}/activate/{uid}/{token}"

    subject = _("Activate your account.")
    from_email = settings.DEFAULT_FROM_EMAIL
    recipient_list = [user.email]

    formatted_expiry = formats.date_format(
        timezone.localtime(user.activation_expires_at), "DATETIME_FORMAT"
    )
    context = {
        "activation_url": activation_url,
        "username": user.username,
        "expiry_time": formatted_expiry,
        "site_name": settings.SITE_NAME,
    }
    html_email = render_to_string("emails/auth/activation_email.html", context)
    plain_email = strip_tags(html_email)
    email = EmailMultiAlternatives(subject, plain_email, from_email, recipient_list)
    email.attach_alternative(html_email, "text/html")
    try:
        email.send()
        logger.info(f"Activation email sent successfully to: {user.email}")
    except Exception as e:  # noqa: BLE001
        logger.error(f"Failed to send activation email to {user.email}: Error: {e}")
