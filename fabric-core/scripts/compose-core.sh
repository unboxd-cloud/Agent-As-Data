#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

echo "== Fabric Core: Compose Headless Mac Stack =="

chmod +x fabric-core/scripts/headless.sh
chmod +x fabric-core/scripts/build-stack.sh

fabric-core/scripts/headless.sh check

echo "== Building native Apple Silicon app stack =="
fabric-core/scripts/build-stack.sh

echo "== Headless status =="
fabric-core/scripts/headless.sh status

echo "== Fabric Core headless stack composed =="
echo "No local services were started by default."
echo "To opt in to local services, run: fabric-core/scripts/start-local-services.sh"
echo "Native app build output: fabric-mac-core/src-tauri/target/release/bundle"
