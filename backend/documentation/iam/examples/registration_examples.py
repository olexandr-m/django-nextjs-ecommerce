from drf_spectacular.utils import OpenApiExample

from documentation.iam.constants import USER_DATA_EXAMPLE

example_register_success = OpenApiExample(
    "RegisterSuccess",
    value={
        "status": 201,
        "message": "Registration successful. Check your email to activate your account.",
        "data": {"user": USER_DATA_EXAMPLE},
    },
    response_only=True,
)
