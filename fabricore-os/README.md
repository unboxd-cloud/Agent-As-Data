# Fabricore OS

Fabricore OS is the headless Apple Silicon native operating surface for Fabric Core.

It is not a kernel and not a general-purpose operating system. It is the minimal local operator layer for the Agent-as-Data Fabric loop on Mac.

## Default Surface

```text
fabricore check
fabricore status
fabricore prove
```

The default surface is intentionally non-mutating.

## Layer Model

```text
Apple Silicon Mac
  ↓
Fabricore OS
  ↓
Fabric Core
  ↓
Headless Actions
  ↓
Pod Manager
  ↓
SurrealDB / k3s / Reconciler proof
  ↓
Fabric Platform Runtime + Flow
```

## Rule

```text
Expose the loop. Do not expand the attack surface.
```

## Commands

From repo root:

```bash
chmod +x fabricore-os/bin/fabricore
./fabricore-os/bin/fabricore check
./fabricore-os/bin/fabricore status
./fabricore-os/bin/fabricore prove
```

## Explicit Opt-in Service Commands

Services are not started by default.

```bash
./fabricore-os/bin/fabricore services start
```

## Boundary

Fabricore OS must not:

- execute arbitrary commands
- accept raw shell input
- start services by default
- hide failed checks
- bypass OPA
- bypass OpenFGA
- bypass separation of duty
- bypass SurrealDB source of truth
