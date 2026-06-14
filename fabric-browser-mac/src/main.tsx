import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

type Face = "runtime" | "flow";

interface AgentRecord {
  id: string;
  name: string;
  objective: string;
  status: string;
  phase: string;
  lastReconciledAt: string;
}

const sampleAgents: AgentRecord[] = [
  {
    id: "agent:fabric_architect",
    name: "Fabric Architect",
    objective: "Build and govern the Fabric",
    status: "active",
    phase: "Reconciled",
    lastReconciledAt: new Date().toISOString()
  }
];

function App() {
  const [face, setFace] = useState<Face>("runtime");
  const [surrealEndpoint, setSurrealEndpoint] = useState(import.meta.env.VITE_SURREAL_ENDPOINT ?? "http://localhost:8000");

  const faceDescription = useMemo(() => {
    if (face === "runtime") {
      return "Runtime Face shows what executes from reconciled Fabric state.";
    }
    return "Flow Face shows how authored intent moves into execution, decision, audit, and replay.";
  }, [face]);

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Agent-as-Data</p>
        <h1>Fabric Browser for Mac</h1>
        <p>
          Inspect the Fabric Platform as two faces: Runtime Face and Flow Face. This browser observes state; it does not replace the reconciler or SurrealDB source of truth.
        </p>
      </section>

      <section className="panel grid two">
        <div>
          <h2>Fabric Platform</h2>
          <pre>{`Fabric Platform\n├── Runtime Face\n└── Flow Face`}</pre>
        </div>
        <div>
          <h2>Connection</h2>
          <label>
            SurrealDB Endpoint
            <input value={surrealEndpoint} onChange={(event) => setSurrealEndpoint(event.target.value)} />
          </label>
          <p className="muted">Namespace: agennext · Database: fabric</p>
        </div>
      </section>

      <section className="tabs">
        <button className={face === "runtime" ? "active" : ""} onClick={() => setFace("runtime")}>Runtime Face</button>
        <button className={face === "flow" ? "active" : ""} onClick={() => setFace("flow")}>Flow Face</button>
      </section>

      <section className="panel">
        <h2>{face === "runtime" ? "Runtime Face" : "Flow Face"}</h2>
        <p>{faceDescription}</p>
        {face === "runtime" ? <RuntimeFace agents={sampleAgents} /> : <FlowFace />}
      </section>
    </main>
  );
}

function RuntimeFace({ agents }: { agents: AgentRecord[] }) {
  return (
    <div className="cards">
      {agents.map((agent) => (
        <article className="card" key={agent.id}>
          <p className="eyebrow">{agent.id}</p>
          <h3>{agent.name}</h3>
          <p>{agent.objective}</p>
          <dl>
            <dt>Status</dt><dd>{agent.status}</dd>
            <dt>Phase</dt><dd>{agent.phase}</dd>
            <dt>Last Reconciled</dt><dd>{agent.lastReconciledAt}</dd>
          </dl>
        </article>
      ))}
    </div>
  );
}

function FlowFace() {
  const steps = ["Intent", "Declaration", "Verification", "Reconciliation", "Source of Truth", "Runtime", "Decision", "Audit"];
  return (
    <ol className="flow">
      {steps.map((step) => (
        <li key={step}>{step}</li>
      ))}
    </ol>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
