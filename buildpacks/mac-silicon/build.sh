#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

echo "== Agent-as-Data Apple Silicon Mac Build Pack =="

chmod +x fabric-metal-core/scripts/check-mac-metal.sh
./fabric-metal-core/scripts/check-mac-metal.sh

if command -v mvn >/dev/null 2>&1; then
  echo "== Building Java reconciler =="
  (cd operator-java && mvn -B -DskipTests package)

  echo "== Building Java SDK =="
  (cd sdk-java && mvn -B -DskipTests package)
else
  echo "WARN: mvn not found; skipping Java builds"
fi

if command -v npm >/dev/null 2>&1; then
  echo "== Checking TypeScript SDK =="
  (cd sdk-typescript && npm install && npm run check)

  echo "== Building Fabric Browser for Mac =="
  (cd fabric-browser-mac && npm install && npm run build)
else
  echo "WARN: npm not found; skipping TypeScript and browser builds"
fi

if [ -x scripts/self-check.sh ]; then
  echo "== Running repo self-check =="
  scripts/self-check.sh
else
  echo "WARN: scripts/self-check.sh is not executable; run chmod +x scripts/self-check.sh"
fi

echo "== Build pack complete =="
echo "Launch Fabric Control Pane:"
echo "  cd fabric-browser-mac && npm run dev"
