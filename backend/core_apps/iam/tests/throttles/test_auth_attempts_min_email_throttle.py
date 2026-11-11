import pytest
from core_apps.common.responses import error
from core_apps.iam.throttles.auth_attempt_throttle import (
    AuthAttemptsMinuteEmailThrottle,
)
from django.core.cache import cache
from rest_framework import status
from rest_framework.exceptions import Throttled
from rest_framework.parsers import JSONParser
from rest_framework.request import Request


@pytest.fixture(autouse=True)
def clear_cache():
    cache.clear()


@pytest.fixture
def drf_request(api_factory):
    def make_request(email="user@example.com", ip="127.0.0.1"):
        wsgi_request = api_factory.post(
            "/api/send-email/", {"email": email}, format="json"
        )
        wsgi_request.META["REMOTE_ADDR"] = ip

        return Request(wsgi_request, parsers=[JSONParser()])

    return make_request


def test_allows_requests_under_the_limit(drf_request):
    throttle = AuthAttemptsMinuteEmailThrottle()
    request = drf_request()

    assert throttle.allow_request(request, None) is True
    assert throttle.allow_request(request, None) is True


def test_denis_requests_over_the_limit(drf_request):
    throttle = AuthAttemptsMinuteEmailThrottle()
    request = drf_request()

    for _ in range(5):
        throttle.allow_request(request, None)

    assert throttle.allow_request(request, None) is False


def test_requests_over_the_limit_response(drf_request):
    throttle = AuthAttemptsMinuteEmailThrottle()
    request = drf_request()

    for _ in range(5):
        throttle.allow_request(request, None)

    with pytest.raises(Throttled) as exception:
        raise Throttled(wait=throttle.wait())

    response = error(
        message=str(exception.value.detail),
        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
    )

    assert response.status_code == 429
    assert isinstance(response.data, dict)
    assert (
        "Request was throttled. Expected available in 60 seconds."
        == response.data["message"]
    )


def test_throttle_different_email(drf_request):
    throttle = AuthAttemptsMinuteEmailThrottle()
    request_with_same_email = drf_request()
    request_with_new_email = drf_request(email="new_email@example.com")

    for _ in range(5):
        throttle.allow_request(request_with_same_email, None)

    assert throttle.allow_request(request_with_same_email, None) is False
    assert throttle.allow_request(request_with_new_email, None) is True
