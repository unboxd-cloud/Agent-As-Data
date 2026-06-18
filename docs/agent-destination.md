# Agent Destination

Agent Destination is the governed target layer of the bound-book platform.

## Canonical Definition

```text
Agent Destination = the approved target where an agent, artifact, repair loop, workflow, or release may go after Agent Eye observes, Cortex reasons, Superstorm proves, and gates allow movement.
```

## Position

```text
Agent Eye observes
  ↓
Cortex reasons
  ↓
Superstorm proves
  ↓
Gate allows
  ↓
Agent Destination receives
  ↓
Human Review / Runtime / Archive / Marketplace
```

## Destination Types

```text
review
runtime
repair-loop
archive
book
registry
marketplace
tenant-workspace
release-channel
```

## Destination Record

```text
agent_destination = (
  id,
  tenant_id,
  workspace_id,
  environment,
  destination_type,
  allowed_subjects,
  required_gates,
  required_evidence,
  policy_context,
  provenance_context,
  authority
)
```

## Routing Rule

```text
No destination without tenant scope.
No destination without policy approval.
No destination without evidence.
No release destination without human authority.
```

## Cortex Contract

Cortex may select a destination candidate.

Cortex may not force final release.

```text
Cortex selects path.
Gate allows movement.
Human approves release.
Destination receives only governed work.
```

## Agent Eye Contract

Agent Eye observes destination readiness but does not move work.

```text
Agent Eye sees destination state.
Cortex reasons about destination fit.
Gate authorizes movement.
```

## Non-Negotiables

```text
No blind destination.
No cross-tenant destination without explicit relation.
No runtime destination without policy approval.
No marketplace destination without provenance.
No release destination without Chinmay Panda review.
```

## One-Line Summary

```text
Agent Destination gives every governed agentic action an approved place to land.
```
