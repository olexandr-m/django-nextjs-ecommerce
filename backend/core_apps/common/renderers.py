import json
from typing import Any

from django.utils.translation import gettext_lazy as _
from rest_framework.renderers import JSONRenderer


class GenericJSONRenderer(JSONRenderer):
    charset = "utf-8"
    object_label = "data"

    def render(
        self,
        data: Any,
        accepted_media_type: str | None = None,
        renderer_context: dict | None = None,
    ) -> bytes:

        renderer_context = renderer_context or {}
        response = renderer_context.get("response")
        if not response:
            raise ValueError(_("Response not found in renderer context."))

        status_code = response.status_code

        if data is None:
            return b""

        if isinstance(data, dict) and {"status", "data"}.issubset(data.keys()):
            return json.dumps(data, ensure_ascii=False).encode(self.charset)

        if isinstance(data, dict) and ("detail" in data or "errors" in data):
            payload = {
                "status": status_code,
                "message": data.get("detail") or data.get("message"),
                "errors": data.get("errors"),
            }
            return json.dumps(payload, ensure_ascii=False).encode(self.charset)

        payload = {
            "status": status_code,
            "data": data,
        }

        if "status" in payload["data"]:
            payload["data"].pop("status")

        if isinstance(data, dict) and "message" in data:
            payload["message"] = data.pop("message")

        if payload["data"] in (None, {}, []):
            payload.pop("data")

        return json.dumps(payload, ensure_ascii=False).encode(self.charset)
