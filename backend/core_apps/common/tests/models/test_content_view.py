import pytest
from core_apps.common.models.content_view import ContentView
from core_apps.common.tests.factories import ContentViewFactory
from django.core.exceptions import ValidationError
from django.db import IntegrityError

pytestmark = pytest.mark.django_db


@pytest.fixture
def obj(user_factory):
    return user_factory.create(
        username="unique user object",
    )


def test_create_content_view():
    content_view = ContentViewFactory()

    assert content_view.content_type is not None
    assert content_view.object_id is not None
    assert content_view.content_object is not None
    assert content_view.user is not None
    assert content_view.viewer_ip is not None
    assert content_view.last_viewed is not None


def test_content_view_immutability():
    view = ContentViewFactory()
    view.viewer_ip = "1.1.1.1"

    with pytest.raises(ValidationError) as e:
        view.save()

    assert "This record is an immutable log and cannot be modified." in str(e.value)


def test_delete_content_view():
    content_view = ContentViewFactory()
    content_view_pk = content_view.pk
    content_view.delete()

    with pytest.raises(ContentView.DoesNotExist):
        ContentView.objects.get(pk=content_view_pk)


def test_content_view_user_relationship(obj, user):
    content_view = ContentView.objects.record_view(
        obj, user=user, viewer_ip="127.0.0.1"
    )

    content_view = ContentView.objects.first()

    assert content_view is not None
    assert content_view.user == user


def test_unique_constraint():
    content_view = ContentViewFactory()

    with pytest.raises(IntegrityError):
        ContentViewFactory(
            content_object=content_view.content_object,
            user=content_view.user,
            viewer_ip=content_view.viewer_ip,
        )


def test_content_view_str_authenticated():
    view = ContentViewFactory()
    user_name = view.user.full_name

    expected_str = f"{view.content_type} viewed by {user_name} from IP {view.viewer_ip}"
    assert str(view) == expected_str


def test_content_view_str_anonymous(obj):
    view = ContentViewFactory(content_object=obj, user=None, viewer_ip="10.0.0.1")

    expected_str = f"{view.content_type} viewed by Anonymous from IP {view.viewer_ip}"
    assert str(view) == expected_str
