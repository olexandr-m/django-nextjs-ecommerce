from core_apps.common.responses import success
from rest_framework.pagination import PageNumberPagination


class GenericPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "per_page"
    max_page_size = 100

    def get_paginated_response(self, data):
        page = self.page
        paginator = page.paginator

        pagination = {
            "total": paginator.count,
            "per_page": self.get_page_size(self.request),
            "current_page": page.number,
            "last_page": paginator.num_pages,
            "from": page.start_index() if paginator.count > 0 else 0,
            "to": page.end_index() if paginator.count > 0 else 0,
        }

        payload_data = {"items": data, "pagination": pagination}

        return success(data=payload_data)
