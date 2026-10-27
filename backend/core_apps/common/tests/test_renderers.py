import json

import pytest
from core_apps.common.renderers import GenericJSONRenderer
from rest_framework.response import Response


@pytest.fixture
def renderer():
    return GenericJSONRenderer()


def build_context(status_code=200):
    return {"response": Response(status=status_code), "request": None}


def test_render_success_payload(renderer):
    data = {"test": "data"}
    context = build_context(200)

    result = renderer.render(data, renderer_context=context)
    decoded = result.decode("utf-8")
    data = json.loads(decoded)

    assert data["status"] == 200
    assert data["data"] == {"test": "data"}


def test_render_error_payload(renderer):
    data = {"detail": "Something went wrong"}
    context = build_context(500)

    result = renderer.render(data, renderer_context=context)
    decoded = result.decode("utf-8")
    data = json.loads(decoded)

    assert data["status"] == 500
    assert data["message"] == "Something went wrong"
    assert "data" not in data


def test_render_nested_status_removed(renderer):
    data = {"status": 200, "email": "test@example.com"}
    context = build_context(200)

    result = renderer.render(data, renderer_context=context)
    decoded = result.decode("utf-8")
    data = json.loads(decoded)

    assert data["status"] == 200
    assert "status" not in data["data"]


def test_render_nested_message_removed(renderer):
    data = {"message": "some message", "email": "test@example.com"}
    context = build_context(200)

    result = renderer.render(data, renderer_context=context)
    decoded = result.decode("utf-8")
    data = json.loads(decoded)

    assert data["message"] == "some message"
    assert "message" not in data["data"]


def test_render_empty_data_removed(renderer):
    data = {}
    context = build_context(400)

    result = renderer.render(data, renderer_context=context)
    decoded = result.decode("utf-8")
    data = json.loads(decoded)

    assert "data" not in data
