from core_apps.common.responses import error, no_content, success
from rest_framework import status


def test_success_default_status_code():
    response = success()

    assert response.data is not None
    assert response.data["status"] == status.HTTP_200_OK
    assert response.status_code == status.HTTP_200_OK


def test_success_custom_status_code():
    response = success(data={}, status_code=status.HTTP_201_CREATED)

    assert response.data is not None
    assert response.data["status"] == status.HTTP_201_CREATED
    assert response.status_code == status.HTTP_201_CREATED


def test_success_with_message_and_data():
    data = {"email": "test@example.com"}
    message = "Success message"

    response = success(data=data, message=message)

    assert response.data is not None
    assert response.data["data"] == data
    assert response.data["message"] == message


def test_success_without_message_and_data():
    response = success()

    assert response.data is not None
    assert "message" not in response.data
    assert "data" not in response.data


def test_success_with_empty_list():
    response = success(data=[])

    assert response.data is not None
    assert response.data["data"] == []
    assert "data" in response.data


def test_no_content():
    response = no_content()
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert response.data is None


def test_error_default():
    message = "An error occurred"

    response = error(message)

    assert response.data is not None
    assert response.data["status"] == status.HTTP_400_BAD_REQUEST
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data["message"] == "An error occurred"
    assert "errors" not in response.data


def test_error_with_custom_status():
    message = "An error occurred"
    status_code = status.HTTP_409_CONFLICT

    response = error(message=message, status_code=status_code)

    assert response.data is not None
    assert response.data["status"] == status.HTTP_409_CONFLICT
    assert response.status_code == status.HTTP_409_CONFLICT


def test_error_with_extra_errors():
    errors = {"field": ["Invalid value"]}
    response = error(message="Validation failed", errors=errors)

    assert response.data is not None
    assert "errors" in response.data
    assert response.data["errors"]["field"] == ["Invalid value"]
