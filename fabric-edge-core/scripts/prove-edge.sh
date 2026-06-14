#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

echo "== Fabric Edge Core: Prove Edge Loop =="

if ! command -v k3s >/dev/null 2>&1; then
  echo "FAIL: k3s is required for edge proof" >&2
  exit 1
fi

echo "-- Edge node --"
sudo k3s kubectl get nodes

echo "-- Running reconciliation proof --"
chmod +x scripts/k3s-reconcile-check.sh
scripts/k3s-reconcile-check.sh

echo "== Edge proof complete =="
