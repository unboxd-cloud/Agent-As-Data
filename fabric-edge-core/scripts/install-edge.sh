#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

echo "== Fabric Edge Core: Install Edge Loop =="

if ! command -v k3s >/dev/null 2>&1; then
  echo "FAIL: k3s is required on the edge node before installing the Fabric edge loop." >&2
  echo "Install k3s first, then rerun this command." >&2
  exit 1
fi

chmod +x scripts/k3s-reconcile-check.sh
scripts/k3s-reconcile-check.sh

echo "== Fabric Edge Core install complete =="
