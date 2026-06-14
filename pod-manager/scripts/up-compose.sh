#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

echo "== Fabric Pod Manager: Up Compose =="

if ! command -v docker >/dev/null 2>&1; then
  echo "FAIL: docker is required for compose mode" >&2
  exit 1
fi

docker compose -f deploy/self-hosted/docker-compose.yaml up -d

echo "== Started self-servable local stack =="
echo "Control Pane: http://localhost:5173"
echo "SurrealDB:     http://localhost:8000"
