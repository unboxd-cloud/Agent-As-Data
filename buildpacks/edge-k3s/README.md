# Edge k3s Build Pack

One build pack for proving Agent-as-Data on an edge k3s node.

## Purpose

```text
Edge node → k3s → Agent CRD → Java Reconciler → SurrealDB → Fabric Platform
```

## Run

From repo root on the edge node:

```bash
chmod +x buildpacks/edge-k3s/build.sh
./buildpacks/edge-k3s/build.sh
```

## Checks

The build pack verifies:

- k3s is installed
- edge node is visible
- Fabric namespace exists or can be created
- SurrealDB can run
- Agent CRD can be applied
- Java reconciler can run
- sample Agent reconciles
- SurrealDB contains tenant-scoped Agent truth

## Boundary

```text
The edge build pack proves the loop.
It does not bypass GitHub, CI/CD, OPA, OpenFGA, or SurrealDB truth.
```
