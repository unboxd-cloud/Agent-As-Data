#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR/fabricore-os/cli"

echo "== Fabricore OS: Build single binary =="

rustup target add aarch64-apple-darwin >/dev/null 2>&1 || true
cargo build --release --target aarch64-apple-darwin

mkdir -p "$ROOT_DIR/dist"
cp target/aarch64-apple-darwin/release/fabricore "$ROOT_DIR/dist/fabricore"
chmod +x "$ROOT_DIR/dist/fabricore"
shasum -a 256 "$ROOT_DIR/dist/fabricore" > "$ROOT_DIR/dist/fabricore.sha256"

ls -lh "$ROOT_DIR/dist/fabricore" "$ROOT_DIR/dist/fabricore.sha256"
cat "$ROOT_DIR/dist/fabricore.sha256"
