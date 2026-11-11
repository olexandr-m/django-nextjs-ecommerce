from django.urls import include, path

urlpatterns = [
    path("api/auth/", include("core_apps.iam.urls")),
]
