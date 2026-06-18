# Agent Eye

Agent Eye is the observation layer of the bound-book platform.

## Canonical Definition

```text
Agent Eye = the platform observation layer that watches workflows, artifacts, evidence, tenants, modalities, policies, and failures, then reports structured signals to Cortex without directly mutating the platform.
```

## Position

```text
Workflows / Artifacts / Events / Metrics
  ↓
Agent Eye
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
observe workflow status
observe gate results
observe artifact presence
observe checksum evidence
observe tenant scope
observe policy status
observe provenance status
observe modality records
observe failure patterns
emit observation signals
```

## Forbidden Responsibilities

```text
approve release
patch code directly
bypass gates
change policy
mutate source of truth
cross tenant boundaries
hide failures
```

## Observation Record

```text
agent_eye_observation = (
  id,
  tenant_id,
  workspace_id,
  environment,
  source,
  signal_type,
  subject,
  status,
  evidence,
  observed_at
)
```

## Agent Eye Rule

```text
Agent Eye sees.
Cortex reasons.
Repair Agent repairs.
Gate enforces.
Human releases.
```

## One-Line Summary

```text
Agent Eye gives the platform governed sight without giving sight unchecked authority.
```
