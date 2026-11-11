from core_apps.users.models import User
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.utils.translation import gettext_lazy as _
from loguru import logger


def send_already_registered_email(user: User) -> None:
    app_name = getattr(settings, "SITE_NAME", "Our App")
    login_url = f"{settings.FRONTEND_URL}/login"

    subject = _("Attempted Registration at %(app_name)s") % {"app_name": app_name}
    from_email = settings.DEFAULT_FROM_EMAIL
    recipient_list = [user.email]

    context = {
        "login_url": login_url,
        "username": user.username,
        "app_name": app_name,
    }
    html_email = render_to_string("emails/auth/already_registered_email.html", context)
    plain_email = strip_tags(html_email)
    email = EmailMultiAlternatives(subject, plain_email, from_email, recipient_list)
    email.attach_alternative(html_email, "text/html")
    try:
        email.send()
        logger.info(f"Already registered email sent successfully to: {user.email}")
    except Exception as e:  # noqa: BLE001
        logger.error(
            f"Failed to send already registered email to {user.email}: Error: {e}"
        )
