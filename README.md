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

## Fabric SaaS Control Pane

The Fabric SaaS Control Pane is published through GitHub Pages:

```text
https://unboxd-cloud.github.io/Agent-As-Data/
```

The Control Pane is the tenant-aware author interface for the Fabric Platform.

```text
Fabric SaaS Platform
├── Tenant Context
├── Runtime Face
├── Flow Face
└── Control Pane
```

## CI/CD

The repository uses GitHub Actions as the verification and publication loop.

Primary workflow:

```text
Full Agent-as-Data Pipeline
```

The full pipeline checks:

- repository structure
- required documentation phrases
- tenant isolation policy
- Kubernetes manifests
- Java reconciler build
- Java SDK build
- TypeScript SDK check
- Fabric Browser for Mac build
- Docker build gate
- GitHub Pages build gate

Published artifacts and outputs:

- GHCR reconciler image: `ghcr.io/unboxd-cloud/agent-as-data-reconciler-java:latest`
- Maven package: `cloud.unboxd.fabric:agent-as-data-reconciler:0.1.0`
- GitHub Pages Control Pane: `https://unboxd-cloud.github.io/Agent-As-Data/`

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
├── buildpacks/
│   └── mac-silicon/
├── crds/
│   └── agent-crd.yaml
├── deploy/
│   ├── fabric-reconciler-java.yaml
│   └── surrealdb.yaml
├── docs/
│   ├── architecture.md
│   └── saas-architecture.md
├── fabric-browser-mac/
├── fabric-mac-core/
├── fabric-metal-core/
├── operator-java/
├── policies/
│   └── tenant-isolation.rego
├── samples/
│   └── fabric-architect-agent.yaml
├── sdk-java/
├── sdk-python/
├── sdk-typescript/
└── scripts/
```

## Quick Start

Run the full local build pack on Apple Silicon Mac:

```bash
chmod +x install.sh
./install.sh
```

Start the Fabric SaaS Control Pane:

```bash
chmod +x fabric-mac-core/scripts/start-control-pane.sh
./fabric-mac-core/scripts/start-control-pane.sh
```

Run the live k3s reconciliation proof:

```bash
chmod +x scripts/self-check.sh scripts/k3s-reconcile-check.sh
scripts/self-check.sh
scripts/k3s-reconcile-check.sh
```

## SurrealDB Mapping

The sample Agent resource maps to a tenant-scoped SurrealDB record:

```sql
SELECT id, tenant_id, workspace_id, environment, name, objective FROM agent:fabric_architect;
```

Expected proof:

```text
id = agent:fabric_architect
tenant_id = demo-tenant
workspace_id = default
environment = local
```

## Status

This repository contains the declarative foundation for Agent-as-Data, the Java reconciler path, tenant-aware Agent data, SDK scaffolds, the Fabric SaaS Control Pane, Apple Silicon Mac/Metal Core checks, tenant isolation policy, and CI/CD publication through GitHub Actions and GitHub Pages.
