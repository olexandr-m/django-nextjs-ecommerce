from datetime import timedelta
from unittest.mock import patch

import pytest
from core_apps.iam.services.activation_service import ActivationService
from core_apps.users.models import User
from django.core import mail
from django.utils import timezone
from freezegun import freeze_time

pytestmark = pytest.mark.django_db


# ------------------------------------------------------------------------------
# _hmac_hash
# ------------------------------------------------------------------------------
def test_hmac_hash_produce_same_hash():
    raw_token = "test_token"

    hash1 = ActivationService._hmac_hash(raw_token)
    hash2 = ActivationService._hmac_hash(raw_token)

    assert hash1 == hash2
    assert isinstance(hash1, str)
    assert len(hash1) == 64


# ------------------------------------------------------------------------------
# generate_token
# ------------------------------------------------------------------------------
@freeze_time("2001-01-01 01:01:01")
@patch("secrets.token_urlsafe", return_value="test_token")
def test_generate_token_sets_user_fields(user):
    fixed_now = timezone.now()
    raw_token = ActivationService.generate_token(user)

    assert raw_token == "test_token"

    assert user.activation_token == ActivationService._hmac_hash("test_token")
    assert user.activation_expires_at == fixed_now + timedelta(
        hours=ActivationService.ACTIVATION_TOKEN_EXPIRY_HOURS
    )


@freeze_time("2001-01-01 01:01:01")
def test_generate_token_produce_different_tokens(user):
    token1 = ActivationService.generate_token(user)
    token2 = ActivationService.generate_token(user)

    assert token1 != token2
    assert user.activation_token == ActivationService._hmac_hash(token2)


# ------------------------------------------------------------------------------
# verify_token
# ------------------------------------------------------------------------------
def test_verify_token_returns_true_for_valid_token(user):
    raw_token = "test_token"

    user.activation_token = ActivationService._hmac_hash(raw_token)
    user.activation_expires_at = timezone.now() + timedelta(hours=1)
    user.save()

    assert ActivationService.verify_token(user, raw_token) is True


def test_verify_token_returns_false_for_wrong_token(user):
    user.activation_token = ActivationService._hmac_hash("test_token")
    user.activation_expires_at = timezone.now() + timedelta(hours=1)
    user.save()

    assert ActivationService.verify_token(user, "wrong_token") is False


def test_verify_token_returns_false_if_token_is_empty_string(user):
    raw_token = ""

    user.activation_token = ActivationService._hmac_hash(raw_token)
    user.activation_expires_at = timezone.now() + timedelta(hours=1)
    user.save()

    assert ActivationService.verify_token(user, raw_token) is False


def test_verify_token_returns_false_if_user_expiries_at_is_null(user):
    user.activation_token = ActivationService._hmac_hash("test_token")
    user.activation_expires_at = None
    user.save()

    assert ActivationService.verify_token(user, "test_token") is False


def test_verify_token_returns_false_if_user_token_is_null(user):
    user.activation_token = None
    user.activation_expires_at = timezone.now() + timedelta(hours=1)
    user.save()

    assert ActivationService.verify_token(user, "test_token") is False


def test_verify_token_returns_false_if_expired(user):
    raw_token = "test_token"

    user.activation_token = ActivationService._hmac_hash(raw_token)
    user.activation_expires_at = timezone.now() - timedelta(minutes=1)
    user.save()

    assert ActivationService.verify_token(user, raw_token) is False


def test_verify_token_returns_false_if_account_status_is_active(user):
    raw_token = "test_token"

    user.activation_token = ActivationService._hmac_hash("test_token")
    user.activation_expires_at = timezone.now() + timedelta(hours=1)
    user.account_status = User.AccountStatus.ACTIVE
    user.save()

    assert ActivationService.verify_token(user, raw_token) is False


def test_verify_token_returns_false_if_account_status_is_locked(user):
    raw_token = "test_token"

    user.activation_token = ActivationService._hmac_hash("test_token")
    user.activation_expires_at = timezone.now() + timedelta(hours=1)
    user.account_status = User.AccountStatus.LOCKED
    user.save()

    assert ActivationService.verify_token(user, raw_token) is False


# ------------------------------------------------------------------------------
# handle_resend_request
# ------------------------------------------------------------------------------
def test_handle_resend_request_returns_false_if_there_is_no_user_with_such_an_email():
    email = "not_existing@email.com"

    assert ActivationService.handle_resend_request(email) is False


def test_handle_resend_request_returns_false_if_user_status_is_not_inactive(user):
    user.account_status = User.AccountStatus.LOCKED
    user.save()

    assert ActivationService.handle_resend_request(user.email) is False


@patch.object(ActivationService, "generate_token")
def test_handle_resend_request_fail_do_not_call_generate_token_method(
    mock_activation_service, user
):
    mock_activation_service.return_value = "dummy-token"
    email = "not_existing@email.com"

    with patch("django.db.transaction.on_commit", side_effect=lambda func: func()):
        ActivationService.handle_resend_request(email)

    mock_activation_service.assert_not_called()


def test_handle_resend_request_fail_do_not_send_activation_email():
    email = "not_existing@email.com"

    with patch("django.db.transaction.on_commit", side_effect=lambda func: func()):
        ActivationService.handle_resend_request(email)

    assert len(mail.outbox) == 0


@patch.object(ActivationService, "generate_token")
def test_handle_resend_request_success_calls_generate_token_method(
    mock_activation_service, user
):
    mock_activation_service.return_value = "dummy-token"

    with patch("django.db.transaction.on_commit", side_effect=lambda func: func()):
        ActivationService.handle_resend_request(user.email)

    mock_activation_service.assert_called_once_with(user)


def test_handle_resend_request_success_sends_activation_email(user):
    with patch("django.db.transaction.on_commit", side_effect=lambda func: func()):
        ActivationService.handle_resend_request(user.email)

    assert len(mail.outbox) == 1
    email = mail.outbox[0]
    assert email.subject == "Activate your account."


def test_handle_resend_request_success_returns_true(user):
    assert ActivationService.handle_resend_request(user.email) is True


# ------------------------------------------------------------------------------
# activate_user
# ------------------------------------------------------------------------------
@freeze_time("2001-01-01 01:01:01")
def test_activate_user_sets_user_fields(user):
    fixed_now = timezone.now()

    user.activation_token = "test_token"
    user.activation_expires_at = fixed_now + timedelta(hours=1)
    user.account_status = User.AccountStatus.INACTIVE
    user.save()

    returned_user = ActivationService.activate_user(user)

    assert returned_user.account_status == User.AccountStatus.ACTIVE
    assert returned_user.activated_at == fixed_now
    assert returned_user.activation_token is None
    assert returned_user.activation_expires_at is None
