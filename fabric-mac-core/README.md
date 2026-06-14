# Fabric Mac Core

Fabric Mac Core is the local macOS shell for the Fabric Platform.

It packages the Fabric Control Pane for Mac as a local desktop-oriented core while preserving the Agent-as-Data reconciliation boundary.

## Role

```text
Fabric Mac Core
├── Local Control Pane
├── Tenant Context
├── Runtime Face Viewer
├── Flow Face Viewer
└── Author Command Surface
```

Mac Core observes and authors intent. It does not replace Kubernetes, the Java reconciler, or SurrealDB.

## Boundary

```text
Mac Core drafts and observes.
GitHub stores desired state.
CI/CD verifies desired state.
k3s schedules and reconciles pods.
Java Reconciler reconciles Agent CRDs.
SurrealDB stores source-of-truth records.
Fabric Platform executes runtime and flow.
```

## Development

The first implementation reuses the browser control pane:

```bash
cd fabric-browser-mac
npm install
npm run dev
```

Future native packaging targets:

- Tauri shell for lightweight macOS packaging
- Signed `.app` build
- Optional local menu bar agent
- Optional secure local credential storage

## Principle

```text
Fabric = Platform
Mac Core = Local Shell
Control Pane = Author Interface
SurrealDB = Source of Truth
Kubernetes = Reconciliation Engine
```
