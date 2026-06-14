#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo "== Agent-as-Data One Build Pack Installer =="

if [ -x buildpacks/mac-silicon/build.sh ]; then
  buildpacks/mac-silicon/build.sh
else
  chmod +x buildpacks/mac-silicon/build.sh
  buildpacks/mac-silicon/build.sh
fi

echo "== Install complete =="
echo "Start the Fabric SaaS Control Pane:"
echo "  chmod +x fabric-mac-core/scripts/start-control-pane.sh"
echo "  ./fabric-mac-core/scripts/start-control-pane.sh"
