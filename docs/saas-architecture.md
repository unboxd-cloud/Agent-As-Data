# Agent-as-Data Multi-Tenant SaaS Architecture

## Canonical Model

```text
Fabric = Platform
Fabric Platform = Runtime Face + Flow Face
Control Pane = SaaS author interface
Mac Core = local shell
Metal Core = machine substrate
SurrealDB = source of truth
Kubernetes = reconciliation engine
```

## Tenant Boundary

Every Agent record must be scoped by:

```text
tenant_id
workspace_id
environment
```

The Kubernetes Agent declaration uses:

```yaml
spec:
  tenancy:
    tenantId: demo-tenant
    workspaceId: default
    environment: local
```

The Java reconciler persists these as SurrealDB fields:

```text
tenant_id = demo-tenant
workspace_id = default
environment = local
```

## Current SaaS Flow

```text
Tenant Author
  ↓
Fabric Control Pane
  ↓
GitHub desired state
  ↓
CI/CD verification
  ↓
k3s Agent CRD
  ↓
Java Reconciler Pod
  ↓
SurrealDB tenant-scoped Agent record
  ↓
Fabric Platform Runtime Face + Flow Face
  ↓
Decision / Event / Audit
```

## Control Pane Boundary

The Control Pane is not the source of truth.

```text
Control Pane drafts and observes.
GitHub stores desired state.
CI/CD verifies desired state.
Kubernetes declares runtime intent.
Java Reconciler reconciles declared Agent data.
SurrealDB stores tenant-scoped truth.
Fabric Platform executes runtime and flow.
```

## Production Hardening Required

The current implementation establishes the tenant-aware data path. Production SaaS requires the following hardening before live customer use:

1. Replace root SurrealDB credentials with tenant-safe auth.
2. Add server-side tenant enforcement.
3. Prevent browser-side cross-tenant filtering from being the only isolation layer.
4. Add OIDC/SSO login.
5. Add organization, tenant, workspace, and role models.
6. Add OpenFGA or equivalent authorization checks.
7. Add audit records for every read/write/control action.
8. Add secret storage for local Mac credentials.
9. Add environment-specific deployment profiles.
10. Add migration/versioning for SurrealDB schema changes.

## Isolation Rule

```text
Tenant isolation must be enforced at the platform and data layer, not only in the UI.
```

## Current Proof Target

The live reconciliation proof must show:

```text
agent:fabric_architect
tenant_id = demo-tenant
workspace_id = default
environment = local
phase = Reconciled
```
