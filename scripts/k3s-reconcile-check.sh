#!/usr/bin/env bash
set -euo pipefail

NAMESPACE="${NAMESPACE:-fabric}"
AGENT_NAME="${AGENT_NAME:-fabric-architect}"
RECORD_ID="agent:${AGENT_NAME//-/_}"
KUBECTL="${KUBECTL:-sudo k3s kubectl}"

log() {
  printf '\n== %s ==\n' "$1"
}

require() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Missing required command: $1" >&2
    exit 1
  }
}

log "k3s runtime reconciliation check"
require sudo
require k3s

log "[1/7] Applying namespace and SurrealDB"
$KUBECTL apply -f deploy/surrealdb.yaml

log "[2/7] Waiting for SurrealDB readiness"
$KUBECTL rollout status statefulset/surrealdb -n "$NAMESPACE" --timeout=240s
$KUBECTL wait --for=condition=Ready pod -l app.kubernetes.io/name=surrealdb -n "$NAMESPACE" --timeout=240s

log "[3/7] Applying Agent CRD"
$KUBECTL apply -f crds/agent-crd.yaml
$KUBECTL wait --for condition=Established crd/agents.fabric.agennext.io --timeout=120s

log "[4/7] Applying Java reconciler"
$KUBECTL apply -f deploy/fabric-reconciler-java.yaml
$KUBECTL rollout status deployment/fabric-reconciler-java -n "$NAMESPACE" --timeout=240s
$KUBECTL wait --for=condition=Ready pod -l app.kubernetes.io/name=fabric-reconciler-java -n "$NAMESPACE" --timeout=240s

log "[5/7] Applying sample Agent"
$KUBECTL apply -f samples/fabric-architect-agent.yaml

log "[6/7] Waiting for Agent status reconciliation"
for i in $(seq 1 30); do
  PHASE="$($KUBECTL get agent "$AGENT_NAME" -n "$NAMESPACE" -o jsonpath='{.status.phase}' 2>/dev/null || true)"
  SURREAL_RECORD="$($KUBECTL get agent "$AGENT_NAME" -n "$NAMESPACE" -o jsonpath='{.status.surrealRecord}' 2>/dev/null || true)"
  if [ "$PHASE" = "Reconciled" ] && [ "$SURREAL_RECORD" = "$RECORD_ID" ]; then
    echo "Agent status reconciled: phase=$PHASE surrealRecord=$SURREAL_RECORD"
    break
  fi
  if [ "$i" = "30" ]; then
    echo "Agent did not reach expected status. phase=$PHASE surrealRecord=$SURREAL_RECORD" >&2
    $KUBECTL describe agent "$AGENT_NAME" -n "$NAMESPACE" || true
    $KUBECTL logs deploy/fabric-reconciler-java -n "$NAMESPACE" --tail=200 || true
    exit 1
  fi
  sleep 5
done

log "[7/7] Proving Kubernetes pod, Agent, logs, and SurrealDB record"
$KUBECTL get pods -n "$NAMESPACE" -l app.kubernetes.io/name=fabric-reconciler-java
$KUBECTL get agent "$AGENT_NAME" -n "$NAMESPACE" -o wide
$KUBECTL get agent "$AGENT_NAME" -n "$NAMESPACE" -o jsonpath='{.status}' && echo

echo "-- Reconciler logs --"
$KUBECTL logs deploy/fabric-reconciler-java -n "$NAMESPACE" --tail=200 | tee /tmp/agent-as-data-reconciler.log

grep -q "Starting Java Fabric Agent Reconciler" /tmp/agent-as-data-reconciler.log
grep -q "Reconciling ${NAMESPACE}/${AGENT_NAME} -> ${RECORD_ID}" /tmp/agent-as-data-reconciler.log
grep -q "Reconciled ${NAMESPACE}/${AGENT_NAME}" /tmp/agent-as-data-reconciler.log

echo "-- SurrealDB query --"
QUERY_OUTPUT="$($KUBECTL run surrealdb-check \
  -n "$NAMESPACE" \
  --rm \
  -i \
  --restart=Never \
  --image=curlimages/curl:8.11.1 \
  --command -- sh -c "curl -sS -u root:ChangeMeNow -H 'NS: agennext' -H 'DB: fabric' -H 'Accept: application/json' -H 'Content-Type: application/surrealql' --data 'SELECT * FROM ${RECORD_ID};' http://surrealdb.fabric.svc.cluster.local:8000/sql")"

echo "$QUERY_OUTPUT"
echo "$QUERY_OUTPUT" | grep -q "$RECORD_ID"

log "Runtime reconciliation check complete"
echo "PASS: fabric-reconciler-java pod is Running"
echo "PASS: agent.fabric.agennext.io/${AGENT_NAME} exists"
echo "PASS: Java reconciler logs show reconciliation"
echo "PASS: SurrealDB query returns ${RECORD_ID}"
