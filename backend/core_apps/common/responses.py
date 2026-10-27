from rest_framework import status
from rest_framework.response import Response


def success(data=None, message=None, status_code=status.HTTP_200_OK) -> Response:
    payload = {"status": status_code}

    if message:
        payload["message"] = message

    if data is not None:
        payload["data"] = data

    return Response(payload, status=status_code)


def no_content() -> Response:
    return Response(status=status.HTTP_204_NO_CONTENT)


def error(message, status_code=status.HTTP_400_BAD_REQUEST, errors=None) -> Response:
    payload = {"message": message, "status": status_code}

    if errors:
        payload["errors"] = errors

    return Response(payload, status=status_code)
