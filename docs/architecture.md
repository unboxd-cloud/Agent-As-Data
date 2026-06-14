# Agent As Data Architecture

## Principle

```text
Agent = Data
Fabric = Runtime and Flow
Kubernetes = Reconciliation Engine
SurrealDB = Source of Truth
```

The platform treats every agent as a durable, declarative, governable object. The agent definition is stored in Kubernetes as a custom resource and materialized into SurrealDB as a graph record. Fabric consumes that source-of-truth record as both the runtime and the flow layer.

## Human Role

The human is the author.

The human defines intent, constraints, policy, and acceptance criteria.  
The software agent does not replace the author. It reconciles authored intent into runtime state.

In this architecture:

- Author declares intent.
- GitHub versions intent.
- CI/CD verifies intent.
- Kubernetes schedules and reconciles runtime components.
- Java Reconciler watches Agent resources.
- SurrealDB stores the reconciled Agent record.
- Fabric Runtime and Flow acts from the source-of-truth data.

The author does not reconcile; the author defines what must be reconciled.

## Fabric Flow Design

Fabric is designed as a governed flow framework.

A Fabric flow is the movement of authored intent into executable, observable, and auditable runtime state.

```text
Author Intent
  ↓
Declared Agent Data
  ↓
CI/CD Verification
  ↓
Kubernetes Reconciliation
  ↓
Java Agent Reconciliation
  ↓
SurrealDB Source of Truth
  ↓
Fabric Runtime Flow
  ↓
Decision / Event / Action
  ↓
Audit / Replay / Governance
```

The framework separates the flow into clear responsibility zones:

| Zone | Responsibility | Owner |
| --- | --- | --- |
| Authoring | Define intent, constraints, and acceptance criteria | Human author |
| Declaration | Store desired state as Git and Kubernetes data | GitHub + Agent CRD |
| Verification | Check structure, build, policy, and manifests | CI/CD |
| Reconciliation | Convert declared state into runtime truth | k3s + Java Reconciler |
| Source of Truth | Persist reconciled state, identity, memory, policy links, and events | SurrealDB |
| Runtime Flow | Route work, evaluate state, execute governed tasks, and emit decisions | Fabric |
| Governance | Audit, replay, inspect, approve, and improve | Human + Fabric controls |

A flow is valid only when it is traceable from authored intent to runtime decision and back to audit evidence.

## SDK Design

Fabric SDKs expose the Agent-as-Data model to applications without bypassing the reconciliation loop.

The SDKs must not become a hidden runtime. They should declare, read, validate, and observe Fabric state while preserving SurrealDB as the source of truth and Kubernetes as the reconciliation engine.

Initial SDK targets:

| SDK | Purpose | Package Target |
| --- | --- | --- |
| Java SDK | Native JVM access for the reconciler and enterprise services | `cloud.unboxd.fabric:agent-as-data-sdk` |
| TypeScript SDK | Web, CLI, dashboard, and developer tooling | `@unboxd/fabric-agent-sdk` |
| Python SDK | Automation, data workflows, notebooks, and testing | `unboxd-fabric-agent-sdk` |

Core SDK responsibilities:

1. Build Agent declarations.
2. Validate Agent data before submission.
3. Convert names to canonical SurrealDB record IDs.
4. Read reconciled Agent state.
5. Watch or poll Agent status.
6. Emit flow events.
7. Provide helpers for audit, replay, and governance.

SDK boundary rule:

```text
SDKs declare and observe.
The reconciler reconciles.
SurrealDB stores truth.
Fabric executes flow.
```

## Operating Model

```text
GitHub → CI/CD → k3s → Agent CRD → Java Reconciler Pod → SurrealDB → Fabric Runtime and Flow
```

## Layers

### 1. GitHub Layer

GitHub stores the desired state of agents, skills, tools, policies, and workspaces.

### 2. CI/CD Layer

CI/CD verifies repository structure, Java builds, container builds, and Kubernetes manifests before the reconciler is deployed.

### 3. k3s Kubernetes Layer

k3s stores declarative custom resources and provides the pod scheduling and reconciliation primitives.

### 4. Agent CRD Layer

The Agent CRD declares agents as Kubernetes-native data objects under `agents.fabric.agennext.io`.

### 5. Java Reconciler Pod Layer

The Java reconciler watches Agent custom resources and reconciles them into SurrealDB records.

### 6. SurrealDB Fabric Layer

SurrealDB stores identity, agent definitions, memory, tools, policy links, task state, decisions, and events.

### 7. Fabric Runtime and Flow Layer

Fabric reads from SurrealDB, evaluates governed state, routes work, drives flow, and executes tasks through governed tools and workflows.

### 8. SDK Layer

SDKs let applications declare, validate, read, and observe Fabric flow state without replacing the reconciler or bypassing governance.

## Agent Reconciliation Flow

```text
Agent YAML
  ↓
kubectl apply
  ↓
Kubernetes API
  ↓
Java Reconciler Pod
  ↓
SurrealDB agent record
  ↓
Fabric Runtime and Flow
```

## Minimal SurrealDB Shape

```sql
DEFINE TABLE agent SCHEMAFULL;
DEFINE FIELD name ON agent TYPE string;
DEFINE FIELD objective ON agent TYPE string;
DEFINE FIELD status ON agent TYPE string;
DEFINE FIELD trust_score ON agent TYPE number;
```

Example record:

```sql
CREATE agent:fabric_architect SET
  name = "Fabric Architect",
  objective = "Build and govern the Fabric",
  status = "active",
  trust_score = 100;
```

## Java Reconciler Responsibilities

The Java Reconciler should:

1. Watch Agent custom resources across all namespaces.
2. Validate required fields.
3. Convert Kubernetes names to SurrealDB record IDs.
4. Upsert agent records into SurrealDB.
5. Update Agent status with the SurrealDB record reference.
6. Delete SurrealDB records when Agent resources are deleted.
7. Emit logs and Kubernetes status updates on reconciliation success or failure.
8. Enforce policy before allowing runtime execution.

## Long-Term Resource Model

```text
Agent
├── Identity
├── Skill
├── Tool
├── Policy
├── Memory
├── Task
├── Decision
└── Event
```
