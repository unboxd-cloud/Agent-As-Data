#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "== Fabricore OS: Build fabric.dmg =="

chmod +x fabric-core/scripts/build-stack.sh
fabric-core/scripts/build-stack.sh

DMG_SOURCE="$(find fabric-mac-core/src-tauri/target/release/bundle/dmg -name '*.dmg' -maxdepth 1 2>/dev/null | head -n 1 || true)"

if [ -z "$DMG_SOURCE" ]; then
  echo "FAIL: no DMG produced by Tauri build" >&2
  exit 1
fi

cp "$DMG_SOURCE" fabric.dmg

echo "== Built fabric.dmg =="
ls -lh fabric.dmg
