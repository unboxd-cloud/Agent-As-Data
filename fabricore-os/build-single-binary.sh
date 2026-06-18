#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR/fabricore-os/cli"

TARGET="${FABRICORE_TARGET:-}"

echo "== Fabricore OS: Build single binary =="

if [[ -n "$TARGET" ]]; then
  rustup target add "$TARGET" >/dev/null 2>&1 || true
  cargo build --release --target "$TARGET"
  BINARY_PATH="target/$TARGET/release/fabricore"
else
  cargo build --release
  BINARY_PATH="target/release/fabricore"
fi

mkdir -p "$ROOT_DIR/dist"
cp "$BINARY_PATH" "$ROOT_DIR/dist/fabricore"
chmod +x "$ROOT_DIR/dist/fabricore"
shasum -a 256 "$ROOT_DIR/dist/fabricore" > "$ROOT_DIR/dist/fabricore.sha256"

ls -lh "$ROOT_DIR/dist/fabricore" "$ROOT_DIR/dist/fabricore.sha256"
cat "$ROOT_DIR/dist/fabricore.sha256"
