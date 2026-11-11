SPECTACULAR_SETTINGS = {
    "TITLE": "E-commerce API",
    "VERSION": "1.0.0",
    "DESCRIPTION": "An API built for e-commerce.",
    "SERVE_INCLUDE_SCHEMA": False,
    "COMPONENT_SPLIT_REQUEST": True,
    "SECURITY": [{"jwt_cookie": [], "csrf_token": []}],
    "APPEND_COMPONENTS": {
        "securitySchemes": {
            "jwt_cookie": {
                "type": "apiKey",
                "in": "cookie",
                "name": "access_token",
            },
            "csrf_token": {
                "type": "apiKey",
                "in": "header",
                "name": "X-CSRF-TOKEN",
            },
        },
    },
    "SWAGGER_UI_SETTINGS": {
        "defaultModelsExpandDepth": -1,
        "docExpansion": "none",
    },
    "SERVERS": [
        {"url": "http://localhost:8080/", "description": "Local Dev Server"},
    ],
}
