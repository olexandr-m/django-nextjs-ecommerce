#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

exec celery -A "${CELERY_APP:-config.celery_app}" worker \
    --loglevel="${CELERY_LOG_LEVEL:-INFO}" \
    --concurrency="${CELERY_WORKER_CONCURRENCY:-2}"
