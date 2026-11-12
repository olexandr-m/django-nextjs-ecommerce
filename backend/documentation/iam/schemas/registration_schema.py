from drf_spectacular.utils import OpenApiResponse, inline_serializer
from rest_framework import serializers

from documentation.common.responses import (
    SERVER_ERROR_RESPONSE,
    TOO_MANY_REQUESTS_RESPONSE,
    VALIDATION_ERROR_RESPONSE,
)
from documentation.common.serializers import SuccessSerializer
from documentation.iam.examples.registration_examples import (
    example_register_success,
)

RegisterInlineSchema = inline_serializer(
    name="RegisterRequest",
    fields={
        "email": serializers.EmailField(default="user@example.com"),
        "username": serializers.CharField(default="username"),
        "password": serializers.CharField(default="Password123!"),
        "confirmed_password": serializers.CharField(default="Password123!"),
    },
)

register_schema = {
    "auth": [],
    "request": RegisterInlineSchema,
    "responses": {
        201: OpenApiResponse(
            description="Successful registration",
            response=SuccessSerializer,
            examples=[example_register_success],
        ),
        400: VALIDATION_ERROR_RESPONSE,
        429: TOO_MANY_REQUESTS_RESPONSE,
        500: SERVER_ERROR_RESPONSE,
    },
    "tags": ["auth"],
    "operation_id": "auth.register",
    "summary": "Register a new user",
}
