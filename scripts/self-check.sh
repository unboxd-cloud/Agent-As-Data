#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "== Agent-As-Data self-check =="

echo "\n[1/6] Checking repository files"
test -f crds/agent-crd.yaml
test -f samples/fabric-architect-agent.yaml
test -f deploy/fabric-reconciler-java.yaml
test -f deploy/surrealdb.yaml
test -f operator-java/pom.xml
test -f operator-java/Dockerfile
test -f operator-java/src/main/java/cloud/unboxd/fabric/AgentReconcilerApp.java
test -f operator-java/src/main/java/cloud/unboxd/fabric/SurrealDbClient.java

echo "\n[2/6] Validating Kubernetes manifests with kubectl dry-run"
if command -v kubectl >/dev/null 2>&1; then
  kubectl apply --dry-run=client -f crds/agent-crd.yaml >/dev/null
  kubectl apply --dry-run=client -f deploy/surrealdb.yaml >/dev/null
  kubectl apply --dry-run=client -f deploy/fabric-reconciler-java.yaml >/dev/null
  echo "kubectl dry-run passed"
else
  echo "kubectl not found; skipping manifest dry-run"
fi

echo "\n[3/6] Compiling Java reconciler"
if command -v mvn >/dev/null 2>&1; then
  (cd operator-java && mvn -B -DskipTests package)
  echo "Maven build passed"
else
  echo "mvn not found; skipping local Maven build"
fi

echo "\n[4/6] Validating Docker build"
if command -v docker >/dev/null 2>&1; then
  docker build -t agent-as-data-reconciler-java:self-check operator-java
  echo "Docker build passed"
else
  echo "docker not found; skipping Docker build"
fi

echo "\n[5/6] Checking k3s cluster, if available"
if command -v k3s >/dev/null 2>&1; then
  sudo k3s kubectl get nodes
  sudo k3s kubectl get pods -n fabric || true
  sudo k3s kubectl get agents -n fabric || true
else
  echo "k3s not found; skipping live cluster checks"
fi

echo "\n[6/6] Self-check complete"
