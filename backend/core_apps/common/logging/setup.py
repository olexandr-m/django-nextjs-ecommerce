import sys
from pathlib import Path

from core_apps.common.logging.formatter import human_friendly_format
from loguru import logger


def setup_logging(base_dir: Path):
    if "pytest" in sys.modules or "test" in sys.argv:
        logger.remove()
        return logger

    log_dir = base_dir / "logs"
    log_dir.mkdir(parents=True, exist_ok=True)

    logger.configure(
        handlers=[
            {
                "sink": log_dir / "info.log",
                "level": "DEBUG",
                "filter": lambda r: r["level"].no <= logger.level("WARNING").no,
                "format": human_friendly_format,
                "rotation": "10MB",
                "retention": "31 days",
                "compression": "zip",
            },
            {
                "sink": log_dir / "error.log",
                "level": "ERROR",
                "format": human_friendly_format,
                "rotation": "10MB",
                "retention": "31 days",
                "compression": "zip",
                "backtrace": False,
                "diagnose": False,
            },
        ]
    )

    return logger
