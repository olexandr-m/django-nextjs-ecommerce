from django.template.loader import render_to_string


def test_already_registered_email():
    username = "testuser"
    login_url = "http://localhost/api/login"
    app_name = "E-commerce"

    context = {
        "username": username,
        "login_url": login_url,
        "app_name": app_name,
    }
    html_content = render_to_string(
        "emails/auth/already_registered_email.html", context
    )

    assert f"Hello, {username}." in html_content
    assert login_url in html_content
    assert f"&copy; 2026 {app_name}. All rights reserved." in html_content
