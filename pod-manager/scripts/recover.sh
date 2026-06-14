#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

echo "== Fabric Pod Manager: Recover =="

if command -v docker >/dev/null 2>&1; then
  echo "-- Restarting self-servable compose services --"
  docker compose -f deploy/self-hosted/docker-compose.yaml restart || true
else
  echo "WARN: docker not found; skipping compose recovery"
fi

if command -v k3s >/dev/null 2>&1; then
  echo "-- Restarting k3s Java reconciler deployment --"
  sudo k3s kubectl rollout restart deployment/fabric-reconciler-java -n fabric || true
  sudo k3s kubectl rollout status deployment/fabric-reconciler-java -n fabric --timeout=180s || true
else
  echo "WARN: k3s not found; skipping k3s recovery"
fi

./pod-manager/scripts/status.sh
