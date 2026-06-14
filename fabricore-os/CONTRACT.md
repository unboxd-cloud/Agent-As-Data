# Fabricore OS Contract

Fabricore OS is the minimal headless operating surface for Fabric Core on Apple Silicon Mac.

## Artifact Target

```text
fabric.dmg
```

## Default Surface

```text
fabricore check
fabricore status
fabricore prove
```

## Contract

Fabricore OS must:

- run on Apple Silicon arm64
- stay headless by default
- expose only named actions
- avoid default mutation
- show visible output
- make recovery explicit
- keep service start opt-in
- produce a Mac install artifact named `fabric.dmg`

Fabricore OS must not:

- execute arbitrary commands
- accept raw shell input
- start services by default
- hide failed checks
- bypass OPA
- bypass OpenFGA
- bypass separation of duty
- bypass SurrealDB source of truth

## Proof

```bash
./fabricore-os/bin/fabricore check
./fabricore-os/bin/fabricore status
./fabricore-os/bin/fabricore prove
```

## Build Proof

```bash
./fabricore-os/build-fabric-dmg.sh
```

Expected output:

```text
fabric.dmg
```
