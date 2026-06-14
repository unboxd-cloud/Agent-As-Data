# Agent As Data Architecture

## Principle

```text
Agent = Data
Fabric = Runtime
Kubernetes = Reconciliation Engine
SurrealDB = Source of Truth
```

The platform treats every agent as a durable, declarative, governable object. The agent definition is stored in Kubernetes as a custom resource and materialized into SurrealDB as a graph record.

## Layers

### 1. Git Layer

Git stores the desired state of agents, skills, tools, policies, and workspaces.

### 2. Kubernetes Layer

Kubernetes stores declarative custom resources and provides reconciliation primitives.

### 3. Fabric Operator Layer

The operator watches custom resources and reconciles them into SurrealDB.

### 4. SurrealDB Fabric Layer

SurrealDB stores identity, agent definitions, memory, tools, policy links, task state, decisions, and events.

### 5. Runtime Layer

The Fabric runtime reads from SurrealDB and executes tasks through governed tools and workflows.

## Agent Reconciliation Flow

```text
Agent YAML
  ↓
kubectl apply
  ↓
Kubernetes API
  ↓
Fabric Operator
  ↓
SurrealDB agent record
  ↓
Fabric Runtime
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

## Next Operator Responsibilities

The Fabric Operator should:

1. Watch Agent custom resources.
2. Validate required fields.
3. Convert Kubernetes names to SurrealDB record IDs.
4. Upsert agent records into SurrealDB.
5. Update Agent status with the SurrealDB record reference.
6. Emit Kubernetes events on reconciliation success or failure.
7. Enforce policy before allowing runtime execution.

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
