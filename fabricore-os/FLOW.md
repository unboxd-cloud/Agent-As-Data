# Fabricore Release Flow

This flow defines the release path for Fabricore OS.

## Flow Contract

```text
Author Intent
  ↓
Repository Commit
  ↓
Fabricore Build Loop
  ↓
Java Artifact
  ↓
Contract Verification
  ↓
Release Gate
  ↓
Mac DMG Build
  ↓
Published Artifacts
  ↓
Repair Loop, when any gate fails
```

## Actors

```text
Author / Release Authority: Chinmay Panda
Build Operator: GitHub Actions
Runtime Operator: Fabricore Java CLI
Mac Artifact Operator: Fabric DMG workflow
Repair Operator: Issue #1 build loop
Release Gate: Issue #2
```

## Inputs

```text
fabricore-os/java/
fabricore-os/build-java.sh
fabricore-os/build-fabric-dmg.sh
fabricore-os/CONTRACT.md
fabric-core/CONTRACT.md
fabric-core/SURFACE.md
fabric-core/actions.json
```

## Outputs

```text
dist/fabricore.jar
dist/fabricore.jar.sha256
fabric.dmg
fabric.dmg.sha256
```

## Gate Rules

```text
1. Java build must pass.
2. Checksum must verify.
3. Contract command must pass.
4. Default surface must remain headless.
5. Default commands must remain non-mutating.
6. Service start must remain explicit opt-in.
7. DMG build must run only after Java artifact passes.
8. Failed release gates must be captured in the repair loop.
```

## Default Safe Commands

```text
check
status
prove
```

## Explicit Opt-in Commands

```text
services start
build dmg
```

## Release Flow Command

```bash
java -jar dist/fabricore.jar contract
java -jar dist/fabricore.jar build dmg
```

## Canonical Flow Statement

```text
Fabricore releases only when the headless Java operator can prove its contract and hand off to the Mac DMG artifact gate without expanding the default attack surface.
```
