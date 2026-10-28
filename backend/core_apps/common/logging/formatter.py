from core_apps.common.logging.context import get_request_context


def human_friendly_format(record):
    context = get_request_context()

    base = (
        f"[{record['time'].strftime('%Y-%m-%d %H:%M:%S')}] "
        f"{record['level'].name}: {record['message']}\n"
        f"  Location: {record['name']}:{record['function']}:{record['line']}"
    )

    if context:
        base += "\n  Request Info:"
        for key, value in context.items():
            base += f"\n    {key.capitalize()}: {value}"

    return base + "\n\n"
