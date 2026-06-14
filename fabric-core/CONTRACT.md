# Fabric Core Stack Contract

Fabric Core is the Apple Silicon native self-servable core for Agent-as-Data on Mac.

This contract defines what each layer promises, what each layer must not do, and how the stack proves that it is working.

## Canonical Stack

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
Local Services
  ├── SurrealDB
  └── Java Reconciler / Kubernetes path
  ↓
SurrealDB Source of Truth
  ↓
Fabric Platform Runtime + Flow
```

## 1. Apple Silicon Mac Contract

The host machine provides the native execution substrate.

### Must Provide

```text
macOS
arm64 architecture
local filesystem
network loopback
process execution
```

### Must Not

```text
Pretend x86_64/Rosetta is the primary target
Hide architecture mismatch
```

### Proof

```bash
uname -s
uname -m
```

Expected:

```text
Darwin
arm64
```

## 2. Fabric Metal Core Contract

Fabric Metal Core verifies machine readiness.

### Must Provide

```text
Apple Silicon detection
local dependency checks
port availability checks
Node/npm check
Java/Maven check
Docker check
kubectl/k3s check, when available
```

### Must Not

```text
Start business logic
Own Agent state
Bypass Fabric Core
```

### Proof

```bash
fabric-metal-core/scripts/check-mac-metal.sh
```

## 3. Fabric Core Contract

Fabric Core is the local product core and hardened action boundary.

### Must Provide

```text
allowlisted local actions
safe command bridge
Apple Silicon native rule
self-servable recovery actions
contract-visible failure output
```

### Must Not

```text
Execute arbitrary shell commands
Accept raw command strings from UI
Accept user-provided script paths
Commit or print credentials
Bypass OPA
Bypass OpenFGA
Bypass separation of duty
Write source-of-truth Agent records from UI-only state
```

### Proof

```bash
test -f fabric-core/SURFACE.md
test -f fabric-core/actions.json
grep -q "apple-silicon-arm64-only" fabric-core/actions.json
```

## 4. Fabric Mac Core.app Contract

Fabric Mac Core.app is the Apple Silicon native app shell.

### Must Provide

```text
Tauri native shell
Control Pane embedding
safe action listing
safe action execution by actionId only
visible stdout/stderr/status for local actions
```

### Must Not

```text
Expose arbitrary shell execution
Bypass fabric-core/actions.json
Hide failed action output
```

### Proof

```bash
cd fabric-mac-core
npm run build
```

## 5. Fabric Control Pane Contract

The Control Pane is the author-facing interface.

### Must Provide

```text
tenant context
workspace context
environment context
Runtime Face
Flow Face
Author Command Surface
Fabric Core action buttons, when native bridge is present
browser-safe disabled action mode, when native bridge is absent
```

### Must Not

```text
Act as final security boundary
Write source-of-truth records directly
Bypass GitHub, CI/CD, Kubernetes, Reconciler, OPA, or OpenFGA
```

### Proof

```bash
cd fabric-browser-mac
npm run build
```

## 6. Pod Manager Contract

Pod Manager is the self-servable local operations surface.

### Must Provide

```text
status
up-compose
down-compose
logs
prove
recover
```

### Must Not

```text
Author Agent intent
Approve sensitive action
Bypass CI/CD
Bypass OPA/OpenFGA
Become source of truth
```

### Proof

```bash
pod-manager/scripts/status.sh
```

## 7. Local Services Contract

Local services provide the self-servable runtime substrate.

### Must Provide

```text
SurrealDB endpoint
Control Pane endpoint
local service status
persistent local data volume, when compose mode is used
```

### Must Not

```text
Hide health status
Use committed credentials
Pretend UI filtering is tenant isolation
```

### Proof

```bash
pod-manager/scripts/up-compose.sh
pod-manager/scripts/status.sh
```

## 8. SurrealDB Source-of-Truth Contract

SurrealDB stores reconciled Agent truth.

### Must Provide

```text
agent records
tenant_id
workspace_id
environment
status
lifecycle
trust_score
runtime_mode
kubernetes metadata
updated_at
```

### Must Not

```text
Trust browser-only tenant filtering
Accept ungoverned source-of-truth writes as the final model
```

### Proof

```sql
SELECT id, tenant_id, workspace_id, environment, name, objective FROM agent:fabric_architect;
```

## 9. Fabric Platform Contract

Fabric Platform acts from reconciled source-of-truth data.

### Must Provide

```text
Runtime Face
Flow Face
decision path
audit path
replayable state movement
```

### Must Not

```text
Execute from hidden UI state
Bypass source-of-truth reconciliation
Bypass tenant/workspace/environment context
```

## Full Stack Proof

```bash
fabric-core/scripts/compose-core.sh
```

Expected proof path:

```text
Apple Silicon host detected
Fabric Core surface validated
local services started
Fabric Browser built
Fabric Mac Core.app built
Pod Manager status shown
```

## Canonical Statement

```text
Fabric Core is valid only when the Mac user can see, run, verify, and recover every local platform action through a named, allowlisted, tenant-aware, and self-servable surface.
```
