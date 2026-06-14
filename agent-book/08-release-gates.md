# 8. Release Gates

A release gate is the authority boundary between machine proof and human release.

```text
ReleaseGate(k) = PlatformGate ∧ ProvenanceGate ∧ RustMetaKubeGate ∧ SuperstormGate ∧ JavaArtifactGate ∧ MacDmgGate ∧ HumanAuthorityGate
```

## Rule

```text
A build may pass automatically.
A release must be approved by the named authority.
```

Release authority:

```text
Chinmay Panda
```
