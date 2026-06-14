#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

echo "== Fabric Mac Core: Start Control Pane =="

if [ -x fabric-metal-core/scripts/check-mac-metal.sh ]; then
  fabric-metal-core/scripts/check-mac-metal.sh
else
  echo "WARN: Metal Core check script is not executable. Run: chmod +x fabric-metal-core/scripts/check-mac-metal.sh"
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "FAIL: npm is required to run the Fabric Control Pane" >&2
  exit 1
fi

cd fabric-browser-mac
npm install
npm run dev
