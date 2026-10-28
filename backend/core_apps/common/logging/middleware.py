import time
import uuid

from .context import clear_request_context, set_request_context


class LogRequestMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request_id = str(uuid.uuid4())
        start = time.monotonic()

        request_info = {
            "id": request_id,
            "ip": self.get_client_ip(request),
            "method": request.method,
            "path": request.path,
            "user": getattr(request.user, "username", "anonymous"),
        }

        set_request_context(request_info)

        try:
            response = self.get_response(request)
        finally:
            clear_request_context()

        duration = round(time.monotonic() - start, 3)
        request_info.update(
            {
                "status": getattr(response, "status_code", None),
                "duration": f"{duration}s",
            }
        )

        return response

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            return x_forwarded_for.split(",")[0].strip()
        return request.META.get("REMOTE_ADDR")
