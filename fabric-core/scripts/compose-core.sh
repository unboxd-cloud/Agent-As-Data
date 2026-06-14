#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

echo "== Fabric Core: Compose Self-Servable Mac Stack =="

chmod +x fabric-metal-core/scripts/check-mac-metal.sh
chmod +x pod-manager/scripts/*.sh
chmod +x fabric-core/scripts/build-stack.sh

fabric-metal-core/scripts/check-mac-metal.sh

echo "== Starting local self-servable services =="
pod-manager/scripts/up-compose.sh

echo "== Building native Apple Silicon app stack =="
fabric-core/scripts/build-stack.sh

echo "== Fabric Core status =="
pod-manager/scripts/status.sh

echo "== Fabric Core composed =="
echo "Control Pane: http://localhost:5173"
echo "Native app build output: fabric-mac-core/src-tauri/target/release/bundle"
