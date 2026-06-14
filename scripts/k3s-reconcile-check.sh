#!/usr/bin/env bash
set -euo pipefail

NAMESPACE="${NAMESPACE:-fabric}"
AGENT_NAME="${AGENT_NAME:-fabric-architect}"

echo "== k3s runtime reconciliation check =="

echo "\n[1/5] Applying desired state"
sudo k3s kubectl apply -f crds/agent-crd.yaml
sudo k3s kubectl apply -f samples/fabric-architect-agent.yaml
sudo k3s kubectl apply -f deploy/fabric-reconciler-java.yaml

echo "\n[2/5] Waiting for Java reconciler rollout"
sudo k3s kubectl rollout status deployment/fabric-reconciler-java -n "$NAMESPACE" --timeout=180s

echo "\n[3/5] Checking Kubernetes Agent status"
sudo k3s kubectl get agents -n "$NAMESPACE"
sudo k3s kubectl describe agent "$AGENT_NAME" -n "$NAMESPACE" || true

echo "\n[4/5] Checking reconciler logs"
sudo k3s kubectl logs deploy/fabric-reconciler-java -n "$NAMESPACE" --tail=100

echo "\n[5/5] Checking SurrealDB agent record through in-cluster curl"
sudo k3s kubectl run surrealdb-check \
  -n "$NAMESPACE" \
  --rm \
  -i \
  --restart=Never \
  --image=curlimages/curl:8.11.1 \
  --command -- sh -c "curl -sS -u root:ChangeMeNow -H 'NS: agennext' -H 'DB: fabric' -H 'Accept: application/json' -H 'Content-Type: application/surrealql' --data 'SELECT * FROM agent;' http://surrealdb.fabric.svc.cluster.local:8000/sql"

echo "\nRuntime reconciliation check complete"
