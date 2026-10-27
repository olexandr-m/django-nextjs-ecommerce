from datetime import timedelta

from django.utils.translation import gettext as _
from django.utils.translation import ngettext


def format_seconds_to_time_string(wait: float | None) -> str:
    wait_seconds = wait or 0

    duration = timedelta(seconds=wait_seconds)
    days = duration.days
    seconds = duration.seconds
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60

    parts = []
    if days > 0:
        parts.append(
            ngettext("%(count)d day", "%(count)d days", days) % {"count": days}
        )
    if hours > 0:
        parts.append(
            ngettext("%(count)d hour", "%(count)d hours", hours) % {"count": hours}
        )
    if minutes > 0:
        parts.append(
            ngettext("%(count)d minute", "%(count)d minutes", minutes)
            % {"count": minutes}
        )
    if 0 < seconds < 60:
        parts.append(
            ngettext("%(count)d second", "%(count)d seconds", seconds)
            % {"count": seconds}
        )

    if not parts:
        return _("0 seconds")

    return ", ".join(parts)
