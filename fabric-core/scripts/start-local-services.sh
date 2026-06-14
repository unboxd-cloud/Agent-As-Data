#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

echo "== Fabric Core: Start Local Services =="

echo "This is an explicit opt-in mutating action. It starts local compose services."

chmod +x pod-manager/scripts/up-compose.sh
chmod +x pod-manager/scripts/status.sh

pod-manager/scripts/up-compose.sh
pod-manager/scripts/status.sh
