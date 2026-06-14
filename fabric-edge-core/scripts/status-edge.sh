#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

echo "== Fabric Edge Core: Status =="

if ! command -v k3s >/dev/null 2>&1; then
  echo "FAIL: k3s not found. Edge Core expects k3s on the edge node." >&2
  exit 1
fi

echo "-- Nodes --"
sudo k3s kubectl get nodes -o wide

echo "-- Fabric namespace --"
sudo k3s kubectl get namespace fabric || true

echo "-- Fabric pods --"
sudo k3s kubectl get pods -n fabric -o wide || true

echo "-- Fabric services --"
sudo k3s kubectl get svc -n fabric || true

echo "-- Agent CRDs --"
sudo k3s kubectl get crd agents.fabric.agennext.io || true

echo "-- Agents --"
sudo k3s kubectl get agents -n fabric -o wide || true
