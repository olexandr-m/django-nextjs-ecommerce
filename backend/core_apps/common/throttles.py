from rest_framework.throttling import SimpleRateThrottle


class EmailIPThrottle(SimpleRateThrottle):
    def get_cache_key(self, request, view):
        email = str(request.data.get("email", "anonymous")).strip().lower()
        ident = self.get_ident(request)

        return f"throttle_{self.scope}_{email}_{ident}"


class EmailOnlyThrottle(SimpleRateThrottle):
    def get_cache_key(self, request, view):
        email = str(request.data.get("email", "anonymous")).strip().lower()

        return f"throttle_{self.scope}_{email}"
