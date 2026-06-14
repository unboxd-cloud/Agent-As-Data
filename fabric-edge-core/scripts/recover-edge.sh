#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

echo "== Fabric Edge Core: Recover Edge Loop =="

if ! command -v k3s >/dev/null 2>&1; then
  echo "FAIL: k3s not found. Cannot recover edge loop without k3s." >&2
  exit 1
fi

echo "-- Re-applying edge manifests --"
sudo k3s kubectl apply -f deploy/surrealdb.yaml
sudo k3s kubectl apply -f crds/agent-crd.yaml
sudo k3s kubectl apply -f deploy/fabric-reconciler-java.yaml
sudo k3s kubectl apply -f samples/fabric-architect-agent.yaml

echo "-- Restarting Java reconciler --"
sudo k3s kubectl rollout restart deployment/fabric-reconciler-java -n fabric || true
sudo k3s kubectl rollout status deployment/fabric-reconciler-java -n fabric --timeout=240s || true

echo "-- Running edge proof --"
chmod +x fabric-edge-core/scripts/prove-edge.sh
fabric-edge-core/scripts/prove-edge.sh

echo "== Fabric Edge Core recovery complete =="
