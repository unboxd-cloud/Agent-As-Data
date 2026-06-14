#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

echo "== Fabric Pod Manager: Status =="

if command -v docker >/dev/null 2>&1; then
  echo "\n-- Docker Compose services --"
  docker compose -f deploy/self-hosted/docker-compose.yaml ps || true
else
  echo "WARN: docker not found"
fi

if command -v k3s >/dev/null 2>&1; then
  echo "\n-- k3s nodes --"
  sudo k3s kubectl get nodes || true

  echo "\n-- fabric namespace pods --"
  sudo k3s kubectl get pods -n fabric || true

  echo "\n-- fabric agents --"
  sudo k3s kubectl get agents -n fabric || true
else
  echo "WARN: k3s not found"
fi

echo "\n-- Local ports --"
for port in 5173 8000; do
  if lsof -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "RUNNING: port $port"
  else
    echo "STOPPED: port $port"
  fi
done
