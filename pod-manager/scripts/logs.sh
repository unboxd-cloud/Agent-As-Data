#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

SERVICE="${1:-}"

echo "== Fabric Pod Manager: Logs =="

if command -v docker >/dev/null 2>&1; then
  if [ -n "$SERVICE" ]; then
    docker compose -f deploy/self-hosted/docker-compose.yaml logs --tail=200 "$SERVICE" || true
  else
    docker compose -f deploy/self-hosted/docker-compose.yaml logs --tail=200 || true
  fi
else
  echo "WARN: docker not found; skipping compose logs"
fi

if command -v k3s >/dev/null 2>&1; then
  echo "\n-- k3s reconciler logs --"
  sudo k3s kubectl logs deploy/fabric-reconciler-java -n fabric --tail=200 || true
else
  echo "WARN: k3s not found; skipping k3s logs"
fi
