# Native Mac DMG Build Gate

This document records the native Mac DMG build path for the Fabricore release gate.

## Gate Rule

```text
No placeholder DMG.
Native DMG required.
Checksum required.
Human review required.
```

## Build Path

```text
fabric-core/scripts/build-stack.sh
  ↓
fabric-browser-mac npm install && npm run build
  ↓
fabric-mac-core npm install && npm run build
  ↓
fabric-mac-core/src-tauri/target/release/bundle/dmg/*.dmg
  ↓
fabric.dmg
  ↓
fabric.dmg.sha256
```

## Tauri Frontend Path

Tauri commands run from `fabric-mac-core/src-tauri`, so the browser workspace must be referenced two levels up.

```json
{
  "beforeDevCommand": "cd ../../fabric-browser-mac && npm install && npm run dev",
  "beforeBuildCommand": "cd ../../fabric-browser-mac && npm install && npm run build",
  "frontendDist": "../../fabric-browser-mac/dist"
}
```

## Reconciliation Contract

```text
Agent Eye observes the DMG gate.
Cortex routes the first failing build path.
Repair Agent patches the smallest failing condition.
Storm records the repair event.
Superstorm aggregates the evidence.
Gate verifies the DMG and checksum.
Chinmay Panda reviews release readiness.
```

## Verification Commands

```bash
chmod +x fabricore-os/build-fabric-dmg.sh
./fabricore-os/build-fabric-dmg.sh
ls -lh fabric.dmg fabric.dmg.sha256
shasum -a 256 -c fabric.dmg.sha256
```
