from datetime import timedelta

from django.template.loader import render_to_string
from django.utils import timezone


def test_activation_email():
    expiry_time = timezone.now() + timedelta(hours=24)
    formatted_expiry = expiry_time.strftime("%Y-%m-%d %H:%M")
    expected_string = f"This link will expire on <strong>{formatted_expiry}</strong>"

    context = {
        "username": "testuser",
        "activation_url": "http://localhost/api/activate/token",
        "expiry_time": formatted_expiry,
        "site_name": "E-commerce",
    }
    html_content = render_to_string("emails/auth/activation_email.html", context)

    assert "Hello, testuser." in html_content
    assert "http://localhost/api/activate/token" in html_content
    assert expected_string in html_content
    assert "&copy; 2026 E-commerce. All rights reserved." in html_content
