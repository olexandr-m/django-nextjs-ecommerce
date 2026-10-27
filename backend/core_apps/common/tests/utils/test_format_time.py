import pytest
from core_apps.common.utils.format_time import format_seconds_to_time_string


@pytest.mark.parametrize(
    "wait, expected",
    [
        (0, "0 seconds"),
        (1, "1 second"),
        (30, "30 seconds"),
        (60, "1 minute"),
        (90, "1 minute"),
        (3600, "1 hour"),
        (3660, "1 hour, 1 minute"),
        (3723, "1 hour, 2 minutes"),
        (86400, "1 day"),
        (90061, "1 day, 1 hour, 1 minute"),
        (172800, "2 days"),
        (90000, "1 day, 1 hour"),
        (0.5, "0 seconds"),
    ],
)
def test_format_seconds_to_time_string(wait, expected):
    result = format_seconds_to_time_string(wait)
    assert result == expected
