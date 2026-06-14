# Fabric Metal Core

Fabric Metal Core is the local machine foundation for running Fabric components close to the hardware.

It is not the Fabric Platform itself. It is the substrate below Mac Core and the edge runtime.

## Layer Model

```text
Fabric Platform
  ↑
Fabric Mac Core
  ↑
Fabric Metal Core
  ↑
Mac Hardware / Local Machine / Edge Node
```

## Role

Fabric Metal Core provides the local execution substrate for:

- local developer machines
- macOS desktops
- edge nodes
- single-node clusters
- local testing environments
- offline or low-connectivity operation

## Responsibility

```text
Fabric Metal Core
├── Host capability detection
├── Local process supervision
├── Local container/runtime checks
├── Local Kubernetes/k3s readiness checks
├── Local port-forward helpers
├── Local SurrealDB connectivity checks
├── Local filesystem workspace layout
└── Local health and diagnostics
```

## Boundary

Metal Core does not own business state.

```text
Metal Core prepares the machine.
Mac Core provides the local shell.
Control Pane authors and observes.
GitHub stores desired state.
CI/CD verifies desired state.
k3s reconciles pods.
Java Reconciler reconciles Agent CRDs.
SurrealDB stores source-of-truth records.
Fabric Platform executes runtime and flow.
```

## Principle

```text
Fabric = Platform
Metal Core = Machine Substrate
Mac Core = Local Shell
Control Pane = Author Interface
SurrealDB = Source of Truth
Kubernetes = Reconciliation Engine
```

## First Commands

From the repo root:

```bash
./fabric-metal-core/scripts/check-mac-metal.sh
```

The check verifies:

- macOS host
- CPU architecture
- Git availability
- Node/npm availability
- Java availability
- Maven availability
- Docker availability
- kubectl/k3s availability
- local port availability for Fabric Browser and SurrealDB

## Design Rule

Metal Core must be boring, local, inspectable, and safe.

It prepares the machine; it does not hide the reconciliation loop.
