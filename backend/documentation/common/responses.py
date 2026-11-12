from drf_spectacular.utils import OpenApiResponse

from .examples import (
    example_authentication_required_error,
    example_server_error,
    example_too_many_requests_error,
    example_validation_error,
)
from .serializers import ErrorSerializer, ValidationErrorSerializer

SERVER_ERROR_RESPONSE = OpenApiResponse(
    description="Internal server error.",
    response=ErrorSerializer,
    examples=[example_server_error],
)

TOO_MANY_REQUESTS_RESPONSE = OpenApiResponse(
    description="Too many requests.",
    response=ErrorSerializer,
    examples=[example_too_many_requests_error],
)

VALIDATION_ERROR_RESPONSE = OpenApiResponse(
    description="Validation failed.",
    response=ValidationErrorSerializer,
    examples=[example_validation_error],
)

AUTHENTICATION_REQUIRED_RESPONSE = OpenApiResponse(
    description="Authentication credentials were not provided.",
    response=ErrorSerializer,
    examples=[example_authentication_required_error],
)
