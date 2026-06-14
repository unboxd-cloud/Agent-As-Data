# Pod Manager Self-Servable Operations Contract

Pod Manager is the self-service operations surface for Agent-as-Data.

It exposes clear actions the user can take when the platform needs attention.

## Contract

```text
Every infrastructure state must map to a visible user action.
```

## Operations

| Operation | Purpose | Safety Boundary |
| --- | --- | --- |
| status | Show local service, pod, and port state | Read-only |
| up-compose | Start the local self-servable stack | Infrastructure action |
| down-compose | Stop the local self-servable stack | Infrastructure action |
| logs | Show service and reconciler logs | Read-only |
| prove | Run reconciliation proof | Verification action |
| recover | Restart failed local services | Infrastructure action |

## Required UI States

Pod Manager UI must show:

- SurrealDB status
- Control Pane status
- Reconciler status
- k3s status, when available
- Agent CRD status, when available
- last reconciliation proof status
- failed check reason
- next recommended action

## Required Explanations

Every action must explain:

```text
What will happen?
Which service is affected?
Is this read-only or mutating?
Does it require policy approval?
How can the user verify success?
```

## Forbidden Behavior

Pod Manager must not:

- silently mutate Agent intent
- approve sensitive actions
- bypass OPA
- bypass OpenFGA
- bypass CI/CD
- write source-of-truth Agent records directly
- hide Kubernetes or Docker state

## Recovery Rule

```text
A failure is acceptable only when the next recovery action is visible.
```

Examples:

| Failure | Next Action |
| --- | --- |
| port 8000 unavailable | Show process using port |
| SurrealDB unhealthy | Restart SurrealDB |
| Control Pane unavailable | Restart Control Pane |
| Reconciler unavailable | Restart reconciler |
| Agent not reconciled | Run reconciliation proof |
| tenant mismatch | Show expected tenant/workspace/environment |
| policy denied | Show OPA denial reason |
| relationship denied | Show missing OpenFGA relation |

## Boundary

```text
Pod Manager helps the author operate the loop.
It does not replace the loop.
```
