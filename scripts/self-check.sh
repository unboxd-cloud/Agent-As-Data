#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "== Agent-As-Data self-check =="

echo "\n[1/10] Checking repository files"
test -f README.md
test -f docs/architecture.md
test -f docs/saas-architecture.md
test -f policies/tenant-isolation.rego
test -f crds/agent-crd.yaml
test -f samples/fabric-architect-agent.yaml
test -f deploy/fabric-reconciler-java.yaml
test -f deploy/surrealdb.yaml
test -f operator-java/pom.xml
test -f operator-java/Dockerfile
test -f operator-java/src/main/java/cloud/unboxd/fabric/AgentReconcilerApp.java
test -f operator-java/src/main/java/cloud/unboxd/fabric/SurrealDbClient.java
test -f sdk-java/pom.xml
test -f sdk-java/src/main/java/cloud/unboxd/fabric/sdk/FabricAgentSdk.java
test -f sdk-typescript/package.json
test -f sdk-typescript/src/index.ts
test -f sdk-python/pyproject.toml
test -f sdk-python/src/unboxd_fabric_agent_sdk/__init__.py
test -f fabric-browser-mac/package.json
test -f fabric-browser-mac/src/main.tsx
test -f fabric-browser-mac/src/surreal.ts

echo "\n[2/10] Checking required documentation phrases"
grep -q "Fabric = Platform with Two Faces" README.md
grep -q "Fabric = Runtime and Flow" docs/architecture.md
grep -q "Tenant isolation must be enforced" docs/saas-architecture.md
grep -q "GitHub → CI/CD → k3s → Agent CRD → Java Reconciler Pod → SurrealDB" README.md

echo "\n[3/10] Validating tenant isolation policy"
if command -v opa >/dev/null 2>&1; then
  opa fmt --check policies/tenant-isolation.rego
  opa check policies/tenant-isolation.rego
  echo "OPA policy validation passed"
else
  grep -q "default allow := false" policies/tenant-isolation.rego
  grep -q "cross-tenant access denied" policies/tenant-isolation.rego
  grep -q "cross-workspace access denied" policies/tenant-isolation.rego
  echo "opa not found; basic tenant policy checks passed"
fi

echo "\n[4/10] Validating Kubernetes manifests with kubectl dry-run"
if command -v kubectl >/dev/null 2>&1; then
  kubectl apply --dry-run=client -f crds/agent-crd.yaml >/dev/null
  kubectl apply --dry-run=client -f deploy/surrealdb.yaml >/dev/null
  kubectl apply --dry-run=client -f deploy/fabric-reconciler-java.yaml >/dev/null
  kubectl apply --dry-run=client -f samples/fabric-architect-agent.yaml >/dev/null
  echo "kubectl dry-run passed"
else
  echo "kubectl not found; skipping manifest dry-run"
fi

echo "\n[5/10] Compiling Java reconciler"
if command -v mvn >/dev/null 2>&1; then
  (cd operator-java && mvn -B -DskipTests package)
  echo "Java reconciler Maven build passed"
else
  echo "mvn not found; skipping Java reconciler Maven build"
fi

echo "\n[6/10] Compiling Java SDK"
if command -v mvn >/dev/null 2>&1; then
  (cd sdk-java && mvn -B -DskipTests package)
  echo "Java SDK Maven build passed"
else
  echo "mvn not found; skipping Java SDK Maven build"
fi

echo "\n[7/10] Checking TypeScript SDK"
if command -v npm >/dev/null 2>&1; then
  (cd sdk-typescript && npm install && npm run check)
  echo "TypeScript SDK check passed"
else
  echo "npm not found; skipping TypeScript SDK check"
fi

echo "\n[8/10] Checking Fabric Browser for Mac"
if command -v npm >/dev/null 2>&1; then
  (cd fabric-browser-mac && npm install && npm run build)
  echo "Fabric Browser Mac build passed"
else
  echo "npm not found; skipping Fabric Browser Mac build"
fi

echo "\n[9/10] Validating Docker build"
if command -v docker >/dev/null 2>&1; then
  docker build -t agent-as-data-reconciler-java:self-check operator-java
  echo "Docker build passed"
else
  echo "docker not found; skipping Docker build"
fi

echo "\n[10/10] Checking k3s cluster, if available"
if command -v k3s >/dev/null 2>&1; then
  sudo k3s kubectl get nodes
  sudo k3s kubectl get pods -n fabric || true
  sudo k3s kubectl get agents -n fabric || true
else
  echo "k3s not found; skipping live cluster checks"
fi

echo "\nSelf-check complete"
