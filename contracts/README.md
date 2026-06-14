# Agent-as-Data Contract Stack

This directory defines the contract stack for the Agent-as-Data platform.

## 1. API Contract

The API contract defines the external request and response shape for platform operations.

It answers:

```text
What can a caller ask for?
What payload is accepted?
What response is returned?
What tenant/workspace/environment scope is required?
```

Primary file:

```text
contracts/openapi/fabric-control-plane.yaml
```

Boundary:

```text
API defines shape.
API does not decide authorization alone.
API does not become source of truth.
```

## 2. MCP Contract

The MCP contract defines tool capability boundaries.

It answers:

```text
Which tools exist?
What can each tool do?
What input does the tool accept?
What output does the tool return?
Which actions are read-only?
Which actions are mutating?
Which actions require approval?
```

Boundary:

```text
MCP exposes capabilities.
MCP does not bypass OPA, OpenFGA, or separation-of-duty checks.
```

## 3. OPA Contract

The OPA contract defines policy decisions.

It answers:

```text
Is this action allowed under policy?
Is tenant isolation satisfied?
Is workspace isolation satisfied?
Is the action sensitive?
Does the action require approval?
Does the action violate separation of duty?
```

Primary file:

```text
policies/tenant-isolation.rego
```

Boundary:

```text
OPA decides policy.
OPA does not store relationship graph state.
OPA can call or consume OpenFGA relationship results.
```

## 4. Separation of Duty

Separation of duty ensures that the same actor cannot perform conflicting governance steps.

It answers:

```text
Who authored the intent?
Who reviewed it?
Who approved it?
Who executed it?
Are any conflicting roles held by the same actor?
```

Rule:

```text
The author of sensitive intent must not be the sole approver of that same intent.
```

Boundary:

```text
Author declares.
Reviewer reviews.
Approver approves.
Reconciler executes declared state.
Auditor verifies after the fact.
```

## 5. Separation of Concern

Separation of concern ensures every layer has one clear responsibility.

It answers:

```text
Which layer owns UI?
Which layer owns API shape?
Which layer owns tool capability?
Which layer owns policy?
Which layer owns relationship authorization?
Which layer owns reconciliation?
Which layer owns source-of-truth data?
Which layer owns runtime execution?
```

Rule:

```text
No layer should silently absorb another layer's responsibility.
```

Boundary:

```text
Control Pane shows and drafts.
API shapes requests.
MCP exposes tools.
OPA decides policy.
OpenFGA checks relationships.
GitHub stores desired state.
CI/CD verifies desired state.
Kubernetes declares runtime intent.
Java Reconciler reconciles.
SurrealDB stores source of truth.
Fabric executes runtime and flow.
```

## 6. OpenFGA Contract

The OpenFGA contract defines relationship authorization.

It answers:

```text
Is this actor related to this tenant?
Is this actor a workspace member?
Is this actor an agent owner?
Is this actor an approver?
Is this actor an auditor?
Can this actor read, declare, review, approve, or audit this agent?
```

Primary file:

```text
contracts/openfga/authorization-model.fga
```

Boundary:

```text
OpenFGA answers relationship questions.
OpenFGA does not decide non-relationship policy alone.
OPA combines policy, context, risk, and OpenFGA results.
```

## 7. AAGFE Contract

AAGFE means Agent-as-Governed Frontend Enforcement.

It answers:

```text
What should the frontend show?
What should the frontend hide?
What should the frontend disable?
What explanation should the frontend give before action?
What checks must be requested before submitting intent?
```

Rule:

```text
AAGFE improves safety and clarity, but it is not the final security boundary.
```

Boundary:

```text
AAGFE guides the author.
OPA and OpenFGA enforce on the backend/control layer.
GitHub, CI/CD, Kubernetes, Reconciler, and SurrealDB preserve the authoritative loop.
```

## Full Contract Flow

```text
AAGFE
  ↓
API Contract
  ↓
MCP Contract, when tool-backed
  ↓
OPA Policy Decision
  ↓
OpenFGA Relationship Check
  ↓
Separation-of-Duty Check
  ↓
GitHub Desired State
  ↓
CI/CD Verification
  ↓
Kubernetes Agent CRD
  ↓
Java Reconciler
  ↓
SurrealDB Source of Truth
  ↓
Fabric Platform
```
