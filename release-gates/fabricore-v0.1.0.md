# Fabricore v0.1.0 Release Gate

This marker opens the release-gate pull request so CI/CD can run the Fabricore Release Flow before release.

## Release Authority

```text
Chinmay Panda
```

## Required Gates

```text
Java artifact gate
Mac DMG gate
Release gate handover
```

## Expected Artifacts

```text
dist/fabricore.jar
dist/fabricore.jar.sha256
fabric.dmg
fabric.dmg.sha256
```

## Decision

Do not release until Chinmay Panda reviews the gate outcome.
