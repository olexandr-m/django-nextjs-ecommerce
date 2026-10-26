#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

rm -f celerybeat.pid

exec celery -A "${CELERY_APP:-config.celery_app}" beat \
    --loglevel="${CELERY_LOG_LEVEL:-INFO}"
