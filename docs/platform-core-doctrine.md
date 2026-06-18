# Platform Core Doctrine

```text
Agent as Data
Mathematics as Meta
Metal at Core
```

This is the core doctrine of the platform.

## 1. Agent as Data

An agent is not only a process, worker, bot, or runtime. An agent is a durable data object with identity, contract, state, permissions, evidence, provenance, and lifecycle.

```text
Agent = Data(id, intent, contract, state, policy, evidence, provenance, lifecycle)
```

This means every agent can be stored, queried, governed, replayed, evaluated, reconciled, and repaired.

## 2. Mathematics as Meta

Mathematics is the meta layer that defines whether agentic work is valid.

It gives the platform a formal way to reason about:

```text
sets
relations
states
transitions
invariants
gates
proofs
release conditions
```

```text
Meta = Model(K, M, A, P, G, R, S, E, H, T, W, F, C)
```

The meta layer does not execute work. It proves whether the work is allowed, valid, complete, blocked, or repairable.

## 3. Metal at Core

Metal at Core means the platform must remain close to the real machine boundary.

The core must be:

```text
headless
minimal
native
verifiable
reproducible
self-hostable
edge-ready
```

Rust is the preferred metal-core language because it gives the platform strong memory safety, native binaries, small attack surface, and predictable runtime behavior.

```text
Metal Core = Rust runtime + headless commands + local proof + release artifacts
```

## Canonical Platform Equation

```text
Agentic Platform = Agent-as-Data + Mathematics-as-Meta + Metal-at-Core
```

## Operational Meaning

```text
Agent as Data      → everything is governable
Mathematics as Meta → everything is provable
Metal at Core      → everything is runnable close to the machine
```

## Release Rule

No platform release is valid unless all three are present:

```text
Agent-as-Data exists as model and state.
Mathematics-as-Meta exists as proof system.
Metal-at-Core exists as native/headless runtime.
```

## Non-Negotiable

```text
No agent without data.
No scale without mathematics.
No runtime without metal.
```
