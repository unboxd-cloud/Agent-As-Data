#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

ACTION="${1:-status}"

usage() {
  cat <<'USAGE'
Fabric Core Headless

Usage:
  fabric-core/scripts/headless.sh check
  fabric-core/scripts/headless.sh status
  fabric-core/scripts/headless.sh prove

Allowed actions:
  check   Run Apple Silicon machine checks
  status  Show local service/pod/port status
  prove   Run tenant-aware reconciliation proof
USAGE
}

case "$ACTION" in
  check)
    chmod +x fabric-metal-core/scripts/check-mac-metal.sh
    fabric-metal-core/scripts/check-mac-metal.sh
    ;;
  status)
    chmod +x pod-manager/scripts/status.sh
    pod-manager/scripts/status.sh
    ;;
  prove)
    chmod +x pod-manager/scripts/prove.sh scripts/k3s-reconcile-check.sh
    pod-manager/scripts/prove.sh
    ;;
  help|--help|-h)
    usage
    ;;
  *)
    echo "FAIL: unsupported headless action: $ACTION" >&2
    usage >&2
    exit 1
    ;;
esac
