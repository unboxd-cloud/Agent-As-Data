# Cortex

Cortex is the reasoning and control layer of the bound-book platform.

## Canonical Definition

```text
Cortex = the platform control layer that reads the bound book, evaluates Superstorm evidence, selects repair or release paths, and routes decisions to gates without taking human release authority.
```

## Position

```text
Agent Book
  ↓
Cortex
  ↓
Superstorm
  ↓
Repair Agent / Release Gate
  ↓
Human Review
```

## Responsibilities

```text
read doctrine
interpret gates
evaluate multivariate signals
select first failing path
route repair loops
preserve tenant boundaries
preserve modality provenance
preserve human release authority
```

## Forbidden Responsibilities

```text
approve release
bypass gates
ignore the bound book
collapse tenant boundaries
hide evidence
override human authority
```

## Cortex Rule

```text
Cortex may decide the next path.
Cortex may not decide final release.
```

## Cortex Inputs

```text
Agent Book
Platform Gate
Meta Kube
Storm
Superstorm
Repair Agent status
CI/CD results
Artifact checksums
Policy results
Provenance records
```

## Cortex Outputs

```text
next_path
repair_required
review_required
blocked_reason
evidence_reference
gate_status
```

## One-Line Summary

```text
Cortex gives the platform a governed brain without removing human authority.
```
