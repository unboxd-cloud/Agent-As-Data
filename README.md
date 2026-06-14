# Agent As Data

**Agent As Data** is a Kubernetes-native foundation for modeling intelligent agents as durable, declarative records while the Fabric runtime reconciles, governs, and executes them.

## Core Principle

```text
Agent = Data
Fabric = Runtime
Kubernetes = Reconciliation Engine
SurrealDB = Source of Truth
```

An agent is not a process first. An agent is a governed object with identity, objective, lifecycle, trust, skills, tools, policies, and memory. The runtime reads this object, evaluates policy, executes work, and writes decisions, events, and audit records back into the Fabric graph.

## Architecture

```text
Git
 ↓
Kubernetes Manifest
 ↓
Agent Custom Resource
 ↓
Fabric Operator
 ↓
SurrealDB Record
 ↓
Fabric Runtime
```

## Repository Layout

```text
.
├── crds/
│   └── agent-crd.yaml
├── samples/
│   └── fabric-architect-agent.yaml
├── deploy/
│   └── surrealdb.yaml
├── docs/
│   └── architecture.md
└── .github/
    └── workflows/
        └── validate.yaml
```

## Quick Start

Create the Fabric namespace:

```bash
sudo k3s kubectl create namespace fabric
```

Deploy SurrealDB:

```bash
sudo k3s kubectl apply -f deploy/surrealdb.yaml
```

Install the Agent CRD:

```bash
sudo k3s kubectl apply -f crds/agent-crd.yaml
```

Create the first agent:

```bash
sudo k3s kubectl apply -f samples/fabric-architect-agent.yaml
```

Verify:

```bash
sudo k3s kubectl get agents -A
sudo k3s kubectl describe agent fabric-architect -n fabric
```

## SurrealDB Mapping

The sample Agent resource maps to a SurrealDB record:

```sql
CREATE agent:fabric_architect SET
  name = "Fabric Architect",
  objective = "Build and govern the Fabric",
  status = "active",
  trust_score = 100;
```

## Status

This repository currently contains the declarative foundation. The next step is the Fabric Operator, which will reconcile Kubernetes Agent resources into SurrealDB records.
