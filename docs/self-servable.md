# Self-Servable Agent-as-Data

Agent-as-Data is designed to be self-servable.

Self-servable means the user can onboard, deploy, run, inspect, recover, and upgrade the platform through clear product flows without depending on a managed-service operator.

## Principle

```text
Self-servable, not hidden.
Guided, not opaque.
Automated, not uncontrolled.
Governed, not blocked.
```

## What Self-Servable Means

A user must be able to:

- start the local stack
- open the Control Pane
- see tenant and workspace context
- declare an Agent
- validate the declaration
- run CI/CD checks
- reconcile into Kubernetes
- inspect the reconciler pod
- inspect SurrealDB truth
- read policy decisions
- see OpenFGA relationship checks
- recover failed pods
- retry failed reconciliation
- export contracts and artifacts

## Product Surfaces

```text
Control Pane
  ↓
Pod Manager
  ↓
Build Pack
  ↓
Metal Core
  ↓
Mac Core
  ↓
Kubernetes / Docker Compose
  ↓
SurrealDB + Reconciler
  ↓
Fabric Platform
```

## Pod Manager Role

Pod Manager is the self-service operations surface.

It lets the user inspect and control pods without hiding the reconciliation loop.

```text
Pod Manager can:
- show pod status
- show service status
- show logs
- start local services
- stop local services
- restart local services
- run health checks
- run reconciliation proof
```

```text
Pod Manager cannot:
- bypass policy
- bypass OpenFGA
- approve sensitive actions by itself
- become the source of truth
- replace CI/CD
```

## Self-Servable Flow

```text
Author opens Control Pane
  ↓
Control Pane validates tenant context
  ↓
AAGFE explains allowed actions
  ↓
API contract shapes request
  ↓
OPA evaluates policy
  ↓
OpenFGA checks relationships
  ↓
GitHub stores desired state
  ↓
CI/CD verifies
  ↓
Kubernetes reconciles pods
  ↓
Java Reconciler writes SurrealDB truth
  ↓
Pod Manager shows status and recovery actions
```

## Product Rule

```text
Every failure must produce a next action the user can take.
```

Examples:

```text
SurrealDB down → Start database
Reconciler down → Restart reconciler
Agent not reconciled → Run reconciliation proof
Tenant mismatch → Fix tenant context
Policy denied → Show policy reason
OpenFGA denied → Show missing relationship
CI failed → Show failed check
```

## Boundary

Self-servable does not mean unsafe self-approval.

Sensitive actions still require:

- tenant isolation
- relationship authorization
- separation of duty
- audit trail
- CI/CD verification
- reconciler status proof

## Canonical Statement

```text
Agent-as-Data is self-servable because every platform action is visible, guided, policy-checked, and recoverable by the author through product surfaces.
```
