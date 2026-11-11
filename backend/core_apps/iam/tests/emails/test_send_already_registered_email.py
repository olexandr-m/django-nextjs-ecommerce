from typing import Any

import pytest
from core_apps.iam.emails.send_already_registered_email import (
    send_already_registered_email,
)
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core import mail

User = get_user_model()

pytestmark = pytest.mark.django_db


def test_it_sends_email(user):
    send_already_registered_email(user=user)

    assert len(mail.outbox) == 1


def test_it_sends_email_with_correct_subject_from_to_data(user):
    app_name = getattr(settings, "SITE_NAME", "Our App")
    send_already_registered_email(user=user)

    email = mail.outbox[0]

    assert email.subject == f"Attempted Registration at {app_name}"
    assert email.from_email == "E-commerce <noreply@e-commerce.com>"
    assert email.to == [user.email]


def test_it_sends_email_with_correct_context(user):
    login_url = f"{settings.FRONTEND_URL}/login"
    send_already_registered_email(user=user)

    email = mail.outbox[0]
    html_content: Any = email.alternatives[0][0]  # type: ignore

    assert login_url in html_content
    assert user.username in html_content
    assert settings.SITE_NAME in html_content
