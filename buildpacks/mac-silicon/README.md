# Apple Silicon Mac Build Pack

One build pack for running the local Fabric stack on Apple Silicon.

## Purpose

This build pack prepares and verifies the local Mac path:

```text
Fabric Metal Core → Fabric Mac Core → Fabric Control Pane → Fabric Platform
```

## Native Rule

```text
Apple Silicon arm64 first.
Rosetta/x86_64 fallback only.
```

## What it checks

- macOS host
- Apple Silicon architecture
- Git
- Node/npm
- Java 21
- Maven
- Docker
- kubectl/k3s availability
- Fabric Browser for Mac build
- Java SDK build
- Java reconciler build

## Run

From repo root:

```bash
chmod +x buildpacks/mac-silicon/build.sh
./buildpacks/mac-silicon/build.sh
```

## Launch Control Pane

```bash
cd fabric-browser-mac
npm run dev
```

Open:

```text
http://localhost:5173
```

## Boundary

```text
Build Pack prepares.
Metal Core checks machine.
Mac Core provides local shell.
Control Pane authors and observes.
GitHub stores desired state.
CI/CD verifies.
k3s reconciles pods.
Java Reconciler reconciles Agent CRDs.
SurrealDB stores truth.
Fabric executes runtime and flow.
```
