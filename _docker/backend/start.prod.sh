#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

exec gunicorn "${DJANGO_WSGI_MODULE:-config.wsgi:application}" \
    --bind "0.0.0.0:8000" \
    --workers "${GUNICORN_WORKERS:-3}" \
    --threads "${GUNICORN_THREADS:-2}" \
    --timeout "${GUNICORN_TIMEOUT:-60}" \
    --access-logfile "-" \
    --error-logfile "-"
