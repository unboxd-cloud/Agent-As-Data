# Agent-as-Data Edge Guide

This guide is for running Agent-as-Data as a self-servable edge loop.

## Edge Principle

```text
Edge is the same governed reconciliation loop closer to work.
```

## Edge Stack

```text
Edge Node
  ↓
k3s
  ↓
Fabric Edge Core
  ↓
Pod Manager
  ↓
Agent CRD
  ↓
Java Reconciler Pod
  ↓
SurrealDB
  ↓
Fabric Platform Runtime + Flow
```

## Install

From repo root on the edge node:

```bash
chmod +x fabric-edge-core/scripts/*.sh scripts/*.sh
./fabric-edge-core/scripts/install-edge.sh
```

## Status

```bash
./fabric-edge-core/scripts/status-edge.sh
```

## Prove

```bash
./fabric-edge-core/scripts/prove-edge.sh
```

## Recover

```bash
./fabric-edge-core/scripts/recover-edge.sh
```

## One Build Pack

```bash
chmod +x buildpacks/edge-k3s/build.sh
./buildpacks/edge-k3s/build.sh
```

## Expected Proof

```text
k3s node is Ready
SurrealDB is Ready
Java reconciler is Ready
Agent CRD is Established
Agent fabric-architect is Reconciled
SurrealDB contains tenant-scoped Agent truth
```

## Boundary

```text
Edge Core can install, inspect, prove, and recover the edge loop.
Edge Core cannot bypass policy, relationship authorization, separation of duty, CI/CD, or SurrealDB truth.
```
