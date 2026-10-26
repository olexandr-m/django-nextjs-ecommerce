#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

exec celery -A "${CELERY_APP:-config.celery_app}" flower \
    --broker="${CELERY_BROKER_URL}" \
    --basic_auth="${CELERY_FLOWER_USER}:${CELERY_FLOWER_PASSWORD}"
