#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

python <<'PY'
import os
import socket
import sys
import time

host = os.environ.get("POSTGRES_HOST", "postgres")
port = int(os.environ.get("POSTGRES_PORT", "5432"))
deadline = time.time() + int(os.environ.get("POSTGRES_WAIT_TIMEOUT", "60"))

while True:
    try:
        with socket.create_connection((host, port), timeout=5):
            break
    except OSError as error:
        if time.time() > deadline:
            sys.stderr.write(f"PostgreSQL did not become available: {error}\n")
            raise

        sys.stderr.write("Waiting for PostgreSQL to become available...\n")
        time.sleep(2)

sys.stderr.write("PostgreSQL is available\n")
PY

exec "$@"
