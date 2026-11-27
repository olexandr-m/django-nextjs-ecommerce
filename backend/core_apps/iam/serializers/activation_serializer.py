import uuid

from core_apps.iam.exceptions import InvalidActivationException
from django.contrib.auth import get_user_model
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from rest_framework import serializers

User = get_user_model()


class ActivationSerializer(serializers.Serializer):
    uid = serializers.CharField(write_only=True)
    token = serializers.CharField(write_only=True)

    def validate(self, attrs):
        encoded_uid = attrs.get("uid")

        try:
            uid_str = force_str(urlsafe_base64_decode(encoded_uid))
            user_uuid = uuid.UUID(uid_str)
            user = User.objects.get(id=user_uuid)
        except Exception:  # noqa: BLE001
            raise InvalidActivationException()

        attrs["user"] = user
        return attrs
