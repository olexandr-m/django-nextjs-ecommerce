from core_apps.users.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(
        source="profile.avatar", read_only=True, allow_null=True, default=None
    )

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "username",
            "first_name",
            "last_name",
            "account_status",
            "role",
            "avatar",
            "created_at",
        )
        read_only_fields = fields
