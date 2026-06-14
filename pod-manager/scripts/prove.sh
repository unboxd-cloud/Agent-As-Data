#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

echo "== Fabric Pod Manager: Prove Reconciliation =="

if [ ! -x scripts/k3s-reconcile-check.sh ]; then
  chmod +x scripts/k3s-reconcile-check.sh
fi

scripts/k3s-reconcile-check.sh
