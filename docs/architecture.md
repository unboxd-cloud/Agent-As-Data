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
