# Agent As Data

**Agent As Data** is a Kubernetes-native foundation for modeling intelligent agents as durable, declarative records while Fabric provides the platform, runtime, and flow that governs, routes, and executes them.

## Core Principle

```text
Agent = Data
Fabric = Platform with Two Faces: Runtime and Flow
Kubernetes = Reconciliation Engine
SurrealDB = Source of Truth
```

An agent is not a process first. An agent is a governed object with identity, objective, lifecycle, trust, skills, tools, policies, and memory. Fabric reads this object from the source of truth, evaluates policy, drives flow, executes work, and writes decisions, events, and audit records back into the Fabric graph.

## Fabric as a Two-Faced Platform

Fabric is the platform.

Fabric has two faces:

```text
Fabric Platform
├── Runtime Face
└── Flow Face
```

### Runtime Face

The Runtime Face is responsible for execution.

It reads reconciled state from SurrealDB and uses that state to execute governed work through tools, skills, policies, memory, and runtime services.

### Flow Face

The Flow Face is responsible for movement.

It carries authored intent from declaration to verification, reconciliation, source-of-truth storage, execution, decision, event, audit, and replay.

```text
Intent → Declaration → Verification → Reconciliation → Source of Truth → Runtime → Decision → Audit
```

The two faces are not separate products. They are two views of the same Fabric Platform:

- Runtime Face answers: what executes?
- Flow Face answers: how does intent move safely into execution?

## Fabric Framework as Flow

The Fabric Framework is a governed flow framework.

Fabric does not start from a process. Fabric starts from authored intent. That intent is declared as data, verified by CI/CD, reconciled by Kubernetes and the Java Reconciler, stored in SurrealDB, and then executed as governed runtime flow.

```text
Intent
  ↓
Declaration
  ↓
Verification
  ↓
Reconciliation
  ↓
Source of Truth
  ↓
Runtime Flow
  ↓
Decision
  ↓
Audit
```

In this design:

- Intent is authored by the human.
- Declaration is stored in GitHub and Kubernetes.
- Verification is performed by CI/CD.
- Reconciliation is performed by k3s and the Java Reconciler.
- Source of Truth is stored in SurrealDB.
- Runtime Flow is executed by Fabric.
- Decisions and events are written back for audit, replay, and governance.

Fabric is therefore not only the runtime. Fabric is the platform that exposes runtime as one face and governed flow as the other face.

## Authorship and Operating Model

This project is authored and governed by Chinmay Panda.

The human is not the agent.  
The human is the author, owner, and decision authority.

The agent is the reconciler loop:

```text
GitHub → CI/CD → k3s → Agent CRD → Java Reconciler Pod → SurrealDB → Fabric Platform
```

Principles:

- Agent = Data
- Fabric = Platform with Runtime Face and Flow Face
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
Fabric Platform
 ├─ Runtime Face
 └─ Flow Face
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

This repository contains the declarative foundation for Agent-as-Data. The Java reconciler is the primary operator path for reconciling Kubernetes Agent resources into SurrealDB records. Fabric is the platform that acts from the reconciled source-of-truth data through its Runtime Face and Flow Face.
