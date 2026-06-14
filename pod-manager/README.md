# Fabric Pod Manager

Fabric Pod Manager is the self-servable control layer for managing local Fabric pods and services.

It is not the source of truth and it is not the Fabric Platform.

## Purpose

```text
Pod Manager starts, stops, inspects, and verifies pods.
Kubernetes reconciles pods.
SurrealDB stores truth.
Fabric executes runtime and flow.
```

## Role

Fabric Pod Manager provides a self-service interface for:

- local pod health
- self-servable service status
- SurrealDB pod checks
- reconciler pod checks
- Control Pane status
- Agent CRD status
- logs and diagnostics
- restart-safe operator commands

## Boundary

```text
Pod Manager observes and commands infrastructure.
It does not author Agent intent.
It does not approve sensitive actions.
It does not replace CI/CD.
It does not bypass OPA or OpenFGA.
It does not become the source of truth.
```

## Local Stack

```text
Self-Servable Local Host
  ↓
Pod Manager
  ↓
Docker Compose or k3s
  ↓
SurrealDB + Reconciler + Control Pane
  ↓
Agent CRD / SurrealDB record
  ↓
Fabric Platform
```

## Commands

From repo root:

```bash
./pod-manager/scripts/status.sh
./pod-manager/scripts/up-compose.sh
./pod-manager/scripts/down-compose.sh
```

## Design Rule

```text
Expose the pod loop. Do not hide the pod loop.
```
