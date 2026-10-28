import pytest
from core_apps.common.pagination import GenericPagination
from rest_framework.exceptions import NotFound
from rest_framework.request import Request


@pytest.fixture
def paginator():
    return GenericPagination()


def test_it_returns_expected_structure(api_factory, paginator):
    items = list(range(25))
    request = Request(api_factory.get("/?page=1"))

    paginated = paginator.paginate_queryset(items, request)
    response = paginator.get_paginated_response(paginated)

    data = response.data
    assert data["status"] == 200
    assert "message" not in data
    assert "data" in data

    payload = data["data"]
    assert "items" in payload
    assert "pagination" in payload
    assert len(payload["items"]) == 10


def test_it_returns_expected_pagination(api_factory, paginator):
    items = list(range(25))
    request = Request(api_factory.get("/?page=1"))

    paginated = paginator.paginate_queryset(items, request)
    response = paginator.get_paginated_response(paginated)
    pagination = response.data["data"]["pagination"]

    assert pagination["total"] == 25
    assert pagination["per_page"] == 10
    assert pagination["current_page"] == 1
    assert pagination["last_page"] == 3
    assert pagination["from"] == 1
    assert pagination["to"] == 10


def test_custom_per_page(api_factory, paginator):
    items = list(range(50))
    request = Request(api_factory.get("/?page=1&per_page=5"))

    paginated = paginator.paginate_queryset(items, request)
    response = paginator.get_paginated_response(paginated)
    data = response.data["data"]

    assert len(data["items"]) == 5
    assert data["pagination"]["total"] == 50
    assert data["pagination"]["per_page"] == 5


def test_last_page(api_factory, paginator):
    items = list(range(23))
    paginator.page_size = 10
    request = Request(api_factory.get("/?page=3"))

    paginated = paginator.paginate_queryset(items, request)
    response = paginator.get_paginated_response(paginated)
    data = response.data["data"]

    assert len(data["items"]) == 3
    assert data["pagination"]["current_page"] == 3
    assert data["pagination"]["last_page"] == 3
    assert data["pagination"]["from"] == 21
    assert data["pagination"]["to"] == 23


def test_page_out_of_range_raises_not_found(api_factory, paginator):
    items = list(range(15))
    paginator.page_size = 10
    request = Request(api_factory.get("/?page=5"))

    with pytest.raises(NotFound):
        paginator.paginate_queryset(items, request)


def test_empty_list(api_factory, paginator):
    items = []
    request = Request(api_factory.get("/?page=1"))

    paginated = paginator.paginate_queryset(items, request)
    response = paginator.get_paginated_response(paginated)
    data = response.data["data"]

    assert data["items"] == []
    assert data["pagination"]["total"] == 0
