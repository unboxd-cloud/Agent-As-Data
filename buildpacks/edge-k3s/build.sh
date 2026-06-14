#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

echo "== Agent-as-Data Edge k3s Build Pack =="

chmod +x fabric-edge-core/scripts/status-edge.sh
chmod +x fabric-edge-core/scripts/prove-edge.sh

fabric-edge-core/scripts/status-edge.sh
fabric-edge-core/scripts/prove-edge.sh

echo "== Edge k3s build pack complete =="
