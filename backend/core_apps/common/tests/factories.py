import factory
from core_apps.common.models.content_view import ContentView
from core_apps.users.tests.factories import UserFactory
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from factory.declarations import LazyAttribute, LazyFunction, SelfAttribute, SubFactory


class ContentViewFactory(factory.django.DjangoModelFactory):
    class Meta:  # type: ignore[override]
        model = ContentView

    content_object = SubFactory(
        UserFactory,
        first_name="Test",
        last_name="Object",
        username="object",
        email="object@example.com",
    )
    content_type = LazyAttribute(
        lambda o: ContentType.objects.get_for_model(o.content_object)
    )
    object_id = SelfAttribute("content_object.pkid")
    user = SubFactory(
        UserFactory,
        first_name="Test",
        last_name="User",
        username="user",
        email="test@example.com",
    )
    viewer_ip = "127.0.0.1"
    last_viewed = LazyFunction(timezone.now)
