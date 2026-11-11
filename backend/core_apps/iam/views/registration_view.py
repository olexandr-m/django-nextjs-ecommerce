from typing import Any, cast

from core_apps.common.responses import success
from core_apps.iam.serializers.registration_serializer import RegistrationSerializer
from core_apps.iam.services.registration_service import RegistrationService
from core_apps.iam.throttles.auth_attempt_throttle import (
    AuthAttemptsDayThrottle,
    AuthAttemptsHourThrottle,
    AuthAttemptsMinuteEmailThrottle,
    AuthAttemptsMinuteIPThrottle,
)
from core_apps.users.serializers.user_serializer import UserSerializer
from django.utils.translation import gettext as _
from rest_framework import permissions, status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView


class RegistrationView(APIView):
    permission_classes = (permissions.AllowAny,)
    throttle_classes = (
        AuthAttemptsDayThrottle,
        AuthAttemptsHourThrottle,
        AuthAttemptsMinuteEmailThrottle,
        AuthAttemptsMinuteIPThrottle,
    )

    def post(self, request: Request) -> Response:
        serializer = RegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = cast(dict[str, Any], serializer.validated_data)

        user, _is_new = RegistrationService.register_user(validated_data)

        response_data = {
            "user": UserSerializer(user, context={"request": request}).data
        }

        return success(
            data=response_data,
            message=_(
                "Registration successful. Check your email to activate your account."
            ),
            status_code=status.HTTP_201_CREATED,
        )
