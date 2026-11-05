import pytest
from core_apps.common.models.content_view import ContentView

pytestmark = pytest.mark.django_db


@pytest.fixture
def obj(user_factory):
    return user_factory.create(
        username="unique user object",
    )


def test_record_view_creates_new(obj, user):
    ContentView.objects.record_view(obj, user=user, viewer_ip="127.0.0.1")

    view = ContentView.objects.get(object_id=obj.pkid)
    assert view.user == user
    assert view.viewer_ip == "127.0.0.1"


def test_record_view_deduplication(obj, user):
    first_view = ContentView.objects.record_view(obj, user=user, viewer_ip="127.0.0.1")
    second_view = ContentView.objects.record_view(obj, user=user, viewer_ip="127.0.0.1")

    assert ContentView.objects.count() == 1
    assert first_view.pkid == second_view.pkid


def test_record_view_anonymous_user(obj):
    ContentView.objects.record_view(obj, user=None, viewer_ip="127.0.0.1")

    view = ContentView.objects.first()

    assert view is not None
    assert view.user is None
    assert view.viewer_ip == "127.0.0.1"
