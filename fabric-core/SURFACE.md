# Fabric Core Surface Hardening

Fabric Core is the Apple Silicon native local core. Its surface must be small, explicit, and recoverable.

## Surface Rule

```text
Every exposed action must be named, explained, allowlisted, auditable, and recoverable.
```

## Allowed Local Surfaces

```text
Fabric Mac Core.app
Fabric Control Pane
Fabric Core command bridge
Pod Manager scripts
Metal Core checks
Local SurrealDB connection profile
Tenant/workspace/environment profile
```

## Forbidden Surface Behavior

Fabric Core must not:

- execute arbitrary shell commands
- accept unsanitized command strings from the UI
- store raw credentials in the repo
- make the frontend the final security boundary
- bypass OPA
- bypass OpenFGA
- bypass separation of duty
- write source-of-truth Agent records directly from UI-only state
- hide failed checks
- hide Kubernetes, Docker, or SurrealDB state

## Command Bridge Boundary

The native command bridge may only call named Pod Manager actions.

Allowed actions:

```text
check-machine
start-control-pane
start-local-stack
stop-local-stack
show-status
show-logs
prove-reconciliation
recover-local-stack
```

Each action maps to a fixed script path. No user-provided command may be executed.

## Credential Boundary

```text
Credentials must be entered locally by the user or loaded from local secure storage.
Credentials must not be committed.
Credentials must not be printed in logs.
Credentials must not be embedded in generated app bundles.
```

## Tenant Boundary

Every action must carry or resolve:

```text
tenantId
workspaceId
environment
```

Tenant isolation must be enforced by policy/data layers, not only by frontend filtering.

## Recovery Boundary

Every failure must expose:

```text
what failed
why it failed, when known
which layer failed
next safe action
how to verify recovery
```

## Surface Map

```text
Mac UI button
  ↓
AAGFE explanation
  ↓
Named Fabric Core action
  ↓
Allowlisted Pod Manager script
  ↓
Visible local service / pod / proof output
```

## Canonical Statement

```text
Fabric Core hardens the Mac surface by reducing every local operation to a named, allowlisted, explainable, and recoverable action.
```
