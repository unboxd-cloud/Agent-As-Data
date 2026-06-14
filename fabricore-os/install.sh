#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BIN_DIR="${HOME}/.local/bin"
TARGET="${BIN_DIR}/fabricore"

mkdir -p "$BIN_DIR"
chmod +x "$ROOT_DIR/fabricore-os/bin/fabricore"
ln -sf "$ROOT_DIR/fabricore-os/bin/fabricore" "$TARGET"

cat <<EOF
Fabricore OS CLI installed.

Binary:
  $TARGET

Add this to your shell profile if needed:
  export PATH="\$HOME/.local/bin:\$PATH"

Headless commands:
  fabricore check
  fabricore status
  fabricore prove

Build artifact:
  fabricore build dmg

Expected artifact:
  fabric.dmg
EOF
