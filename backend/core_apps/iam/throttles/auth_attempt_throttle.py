from core_apps.common.throttles import EmailIPThrottle, EmailOnlyThrottle
from rest_framework.throttling import AnonRateThrottle


class AuthAttemptsMinuteIPThrottle(AnonRateThrottle):
    scope = "auth_attempts_min_ip"


class AuthAttemptsMinuteEmailThrottle(EmailOnlyThrottle):
    scope = "auth_attempts_min_email"


class AuthAttemptsHourThrottle(EmailIPThrottle):
    scope = "auth_attempts_hour"


class AuthAttemptsDayThrottle(EmailIPThrottle):
    scope = "auth_attempts_day"
