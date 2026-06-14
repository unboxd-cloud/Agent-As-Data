# Fabric Browser for Mac

Fabric Browser for Mac is a local browser shell for inspecting Agent-as-Data Fabric Platform state.

Fabric is the Platform with two faces:

```text
Fabric Platform
├── Runtime Face
└── Flow Face
```

The browser observes Fabric state. It does not replace the Java reconciler, Kubernetes reconciliation, or SurrealDB source of truth.

## Run locally on Mac

```bash
cd fabric-browser-mac
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Optional SurrealDB endpoint

When running SurrealDB locally or through port-forwarding, set:

```bash
VITE_SURREAL_ENDPOINT=http://localhost:8000 npm run dev
```

For k3s port-forwarding:

```bash
sudo k3s kubectl port-forward -n fabric svc/surrealdb 8000:8000
```

## Boundary Rule

```text
Browser observes.
SDKs declare and observe.
The reconciler reconciles.
SurrealDB stores truth.
Fabric executes runtime and flow.
```
