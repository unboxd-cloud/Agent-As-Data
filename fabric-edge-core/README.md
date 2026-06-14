# Fabric Edge Core

Fabric Edge Core extends the self-servable Agent-as-Data loop from a local Mac or server to an edge node.

## Principle

```text
Edge is not a separate product.
Edge is the same reconciliation loop placed closer to work.
```

## Layer Model

```text
Fabric Platform
  ↑
Fabric Edge Core
  ↑
Pod Manager
  ↑
k3s / Docker Compose
  ↑
Metal Core
  ↑
Edge Node
```

## Edge Responsibilities

Fabric Edge Core provides:

- edge node readiness checks
- k3s readiness checks
- SurrealDB readiness checks
- reconciler readiness checks
- Agent CRD reconciliation proof
- tenant/workspace/environment proof
- offline-first operational diagnostics
- recovery commands through Pod Manager

## Edge Boundary

```text
Edge Core runs the loop near the work.
It does not bypass governance.
It does not bypass OPA.
It does not bypass OpenFGA.
It does not bypass CI/CD.
It does not become the source of truth outside SurrealDB.
```

## Canonical Edge Loop

```text
Author / Operator
  ↓
Control Pane
  ↓
AAGFE
  ↓
API + MCP Contracts
  ↓
OPA + OpenFGA
  ↓
GitHub Desired State
  ↓
CI/CD
  ↓
Edge k3s
  ↓
Agent CRD
  ↓
Java Reconciler Pod
  ↓
SurrealDB
  ↓
Fabric Platform Runtime + Flow
```

## Edge Proof

From repo root:

```bash
./fabric-edge-core/scripts/prove-edge.sh
```

Expected proof:

```text
k3s node is Ready
SurrealDB is Ready
Java reconciler is Ready
Agent is Reconciled
SurrealDB contains tenant-scoped Agent record
```
