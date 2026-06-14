# Agent As Data

**Agent As Data** is a Kubernetes-native foundation for modeling intelligent agents as durable, declarative records while Fabric provides the runtime and flow that governs, routes, and executes them.

## Core Principle

```text
Agent = Data
Fabric = Runtime and Flow
Kubernetes = Reconciliation Engine
SurrealDB = Source of Truth
```

An agent is not a process first. An agent is a governed object with identity, objective, lifecycle, trust, skills, tools, policies, and memory. Fabric reads this object from the source of truth, evaluates policy, drives flow, executes work, and writes decisions, events, and audit records back into the Fabric graph.

## Authorship and Operating Model

This project is authored and governed by Chinmay Panda.

The human is not the agent.  
The human is the author, owner, and decision authority.

The agent is the reconciler loop:

```text
GitHub → CI/CD → k3s → Agent CRD → Java Reconciler Pod → SurrealDB → Fabric Runtime and Flow
```

Principles:

- Agent = Data
- Fabric = Runtime and Flow
- Kubernetes = Reconciliation Engine
- SurrealDB = Source of Truth
- Human = Author and Approval Gate

The author does not reconcile; the author defines what must be reconciled.

## Architecture

```text
GitHub
 ↓
CI/CD
 ↓
k3s
 ↓
Agent CRD
 ↓
Java Reconciler Pod
 ↓
SurrealDB
 ↓
Fabric Runtime and Flow
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

This repository contains the declarative foundation for Agent-as-Data. The Java reconciler is the primary operator path for reconciling Kubernetes Agent resources into SurrealDB records. Fabric is the runtime and flow layer that acts from the reconciled source-of-truth data.
