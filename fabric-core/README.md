# Fabric Core

Fabric Core is the Apple Silicon native core for the self-servable Agent-as-Data desktop path.

It is the local product core that connects the Mac app shell, Control Pane, Pod Manager, Metal Core checks, and Fabric Platform loop.

## Native Rule

```text
Apple Silicon arm64 native first.
Rosetta and x86_64 are not the target path.
```

## Position

```text
Apple Silicon Mac
  ↓
Fabric Metal Core
  ↓
Fabric Core
  ↓
Fabric Mac Core.app
  ↓
Fabric Control Pane
  ↓
Pod Manager
  ↓
SurrealDB + Reconciler
  ↓
Fabric Platform Runtime + Flow
```

## Responsibilities

Fabric Core owns the local product bridge:

- native Mac app boundary
- Apple Silicon host verification
- Control Pane launch path
- Pod Manager command bridge
- self-servable status/actions
- local SurrealDB connection profile
- local tenant/workspace/environment profile
- app packaging boundary
- offline diagnostics surface

## Boundaries

Fabric Core does not own source-of-truth Agent state.

```text
Fabric Core launches and coordinates.
Control Pane authors and observes.
Pod Manager operates local services.
GitHub stores desired state.
CI/CD verifies desired state.
Kubernetes reconciles pods.
Java Reconciler reconciles Agent CRDs.
SurrealDB stores source-of-truth records.
Fabric Platform executes runtime and flow.
```

## Self-Servable Product Rule

```text
Every Fabric Core failure must expose a recovery action.
```

Examples:

```text
Metal check failed → Show missing dependency
Control Pane down → Start Control Pane
SurrealDB down → Start SurrealDB
Reconciler down → Restart reconciler
Agent not reconciled → Run reconciliation proof
Tenant mismatch → Fix tenant context
Policy denied → Show OPA reason
OpenFGA denied → Show missing relationship
```

## Mac App Target

```text
Fabric Mac Core.app
├── Fabric Core bridge
├── Fabric Control Pane
├── Pod Manager commands
├── Metal Core checks
└── Local self-servable recovery actions
```

## Canonical Statement

```text
Fabric Core is the Apple Silicon native local core that makes Agent-as-Data self-servable on Mac without hiding the reconciliation loop.
```
