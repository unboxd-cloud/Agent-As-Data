#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "== Fabricore OS: Build native fabric.dmg =="

chmod +x fabric-core/scripts/build-stack.sh
fabric-core/scripts/build-stack.sh

DMG_SOURCE="$(find fabric-mac-core/src-tauri/target/release/bundle/dmg -maxdepth 1 -name '*.dmg' 2>/dev/null | head -n 1 || true)"

if [ -z "$DMG_SOURCE" ]; then
  echo "FAIL: no native DMG produced by Fabric Mac Core build" >&2
  echo "Expected: fabric-mac-core/src-tauri/target/release/bundle/dmg/*.dmg" >&2
  exit 1
fi

rm -f fabric.dmg fabric.dmg.sha256
cp "$DMG_SOURCE" fabric.dmg
shasum -a 256 fabric.dmg > fabric.dmg.sha256

echo "== Built native fabric.dmg =="
ls -lh fabric.dmg fabric.dmg.sha256
cat fabric.dmg.sha256
