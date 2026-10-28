from contextvars import ContextVar

from loguru import logger

request_context: ContextVar[dict | None] = ContextVar("request_context", default=None)


def set_request_context(context: dict):
    request_context.set(context)


def get_request_context() -> dict | None:
    return request_context.get()


def clear_request_context():
    request_context.set(None)


def get_logger():
    context = get_request_context()
    if context:
        return logger.bind(request=context)
    return logger
