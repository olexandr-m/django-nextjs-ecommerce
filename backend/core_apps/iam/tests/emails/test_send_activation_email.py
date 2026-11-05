from typing import Any

import pytest
from core_apps.iam.emails.send_activation_email import send_activation_email
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core import mail
from django.utils import formats, timezone
from freezegun import freeze_time

User = get_user_model()

pytestmark = pytest.mark.django_db


def test_it_sends_email(user):
    token = "activation_token"
    send_activation_email(user=user, token=token)

    assert len(mail.outbox) == 1


def test_it_sends_email_with_correct_subject_from_to_data(user):
    token = "activation_token"
    send_activation_email(user=user, token=token)

    email = mail.outbox[0]

    assert email.subject == "Activate your account."
    assert email.from_email == "E-commerce <noreply@e-commerce.com>"
    assert email.to == [user.email]


@freeze_time("2001-01-01 01:01:01")
def test_it_sends_email_with_correct_context(user):
    fixed_now = timezone.now()
    expiry_time = formats.date_format(
        timezone.localtime(user.activation_expires_at), "DATETIME_FORMAT"
    )
    user.activation_expires_at = fixed_now
    user.save()

    token = "activation_token"
    send_activation_email(user=user, token=token)

    email = mail.outbox[0]
    html_content: Any = email.alternatives[0][0]  # type: ignore

    assert token in html_content
    assert user.username in html_content
    assert expiry_time in html_content
    assert settings.SITE_NAME in html_content
