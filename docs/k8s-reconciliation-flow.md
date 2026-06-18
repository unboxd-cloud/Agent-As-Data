# Kubernetes Reconciliation Flow

The Kubernetes flow turns the bound-book platform into a running reconciliation model.

## Canonical Flow

```text
Agent Eye observes
  ↓
Cortex reasons
  ↓
Repair Agent repairs
  ↓
Storm records
  ↓
Superstorm aggregates
  ↓
Gate enforces
  ↓
Chinmay Panda releases
```

## Kubernetes Objects

```text
Namespace: fabric
ConfigMap: bound-book-platform-flow
Deployment: agent-eye
Deployment: cortex
Deployment: repair-agent
```

## Role Boundaries

### Agent Eye

```text
mode = observe-only
```

Agent Eye watches workflows, artifacts, events, metrics, and failures. It does not patch.

### Cortex

```text
mode = route-only
```

Cortex reasons over Agent Eye observations and Superstorm evidence. It selects the next path. It does not approve release.

### Repair Agent

```text
mode = human-gated-repair
```

Repair Agent proposes or executes repair loops only through routed, governed paths.

## Reconciliation Rule

```text
Observe → Reason → Repair → Record → Aggregate → Enforce → Human Review
```

## Non-Negotiables

```text
No Cortex without Agent Eye evidence.
No Repair Agent action without Cortex routing.
No release from Kubernetes alone.
No tenantless reconciliation.
No hidden mutation.
```

## Apply

```bash
kubectl apply -f k8s/fabric-platform-flow.yaml
```

## Verify

```bash
kubectl -n fabric get configmap bound-book-platform-flow
kubectl -n fabric get deploy agent-eye cortex repair-agent
```
