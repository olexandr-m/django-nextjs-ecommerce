from django.urls import path

from .views.registration_view import RegistrationView

urlpatterns = [
    path("register/", RegistrationView.as_view(), name="register"),
]
