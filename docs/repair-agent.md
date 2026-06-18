# Repair Agent

The Repair Agent is the platform operator that turns failed gates into governed repair loops.

## Canonical Definition

```text
Repair Agent = a human-gated agent that observes failed gates, captures evidence, identifies the first failing condition, proposes the smallest safe repair, and routes the result back through CI/CD without approving release.
```

## Position in the Platform

```text
Gate Failure
  ↓
Repair Agent
  ↓
Failure Evidence
  ↓
Minimal Patch Proposal
  ↓
CI/CD Rerun
  ↓
Gate PASS or BLOCKED
  ↓
Human Review
```

## Authority Boundary

The Repair Agent can repair loops.

The Repair Agent cannot approve releases.

```text
Repair Agent ≠ Release Authority
Release Authority = Chinmay Panda
```

## Allowed Actions

```text
inspect failed workflow
identify first failing gate
create repair issue
propose minimal patch
update repair evidence
request human review
```

## Forbidden Actions

```text
approve release
bypass gate
disable policy
delete evidence
mutate production without approval
cross tenant boundary without explicit relation
```

## Repair Rule

```text
Every failed gate must create or update a repair loop.
Every repair loop must preserve evidence.
Every patch must be minimal.
Every repair must rerun the gate.
```

## First-Failure-First Policy

The Repair Agent does not patch everything at once.

It follows:

```text
1. Find the earliest failing gate.
2. Capture evidence.
3. Patch the smallest cause.
4. Rerun the gate.
5. Continue only after the first gate is clean.
```

## Storm / Superstorm Role

Repair events are written into Storm and aggregated into Superstorm.

```text
Failure → Storm event → Superstorm aggregate → Repair loop → Gate rerun
```

## One-Line Summary

```text
The Repair Agent converts failure into accountable forward motion without taking release authority away from the human.
```
