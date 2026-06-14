#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

echo "== Fabric Core: Build Apple Silicon Mac Stack =="

chmod +x fabric-metal-core/scripts/check-mac-metal.sh
fabric-metal-core/scripts/check-mac-metal.sh

echo "== Validating hardened Fabric Core surface =="
test -f fabric-core/SURFACE.md
test -f fabric-core/actions.json
grep -q "apple-silicon-arm64-only" fabric-core/actions.json
grep -q "execute arbitrary shell commands" fabric-core/SURFACE.md

echo "== Building Fabric Browser =="
(cd fabric-browser-mac && npm install && npm run build)

echo "== Building Fabric Mac Core.app =="
(cd fabric-mac-core && npm install && npm run build)

echo "== Fabric Core stack build complete =="
