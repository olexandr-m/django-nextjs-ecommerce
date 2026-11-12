from drf_spectacular.utils import OpenApiExample

example_server_error = OpenApiExample(
    name="Internal Server Error",
    value={
        "status": 500,
        "message": "An unexpected error occurred on the server.",
    },
    response_only=True,
)

example_too_many_requests_error = OpenApiExample(
    name="Rate Limit Exceeded",
    value={
        "status": 429,
        "message": "Too many requests. Please try again in 60 seconds.",
    },
    response_only=True,
)

example_validation_error = OpenApiExample(
    name="Validation Error",
    value={
        "status": 400,
        "message": "Invalid input data.",
        "errors": {
            "field_name": ["This field is required."],
        },
    },
    response_only=True,
)

example_authentication_required_error = OpenApiExample(
    name="Authentication Required Error",
    value={
        "status": 401,
        "message": "Authentication credentials were not provided.",
    },
    response_only=True,
)
