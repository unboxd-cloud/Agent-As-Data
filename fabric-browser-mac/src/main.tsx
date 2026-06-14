import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { formatSurrealId, queryAgents, type SurrealAgentRecord } from "./surreal";
import "./styles.css";

type Face = "runtime" | "flow";

function App() {
  const [face, setFace] = useState<Face>("runtime");
  const [surrealEndpoint, setSurrealEndpoint] = useState(import.meta.env.VITE_SURREAL_ENDPOINT ?? "http://localhost:8000");
  const [username, setUsername] = useState("root");
  const [password, setPassword] = useState("");
  const [namespace, setNamespace] = useState("agennext");
  const [database, setDatabase] = useState("fabric");
  const [agents, setAgents] = useState<SurrealAgentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const faceDescription = useMemo(() => {
    if (face === "runtime") {
      return "Runtime Face shows what executes from reconciled Fabric state.";
    }
    return "Flow Face shows how authored intent moves into execution, decision, audit, and replay.";
  }, [face]);

  async function refreshAgents() {
    setLoading(true);
    setError(null);
    try {
      const result = await queryAgents({ endpoint: surrealEndpoint, username, password, namespace, database });
      setAgents(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

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
        <div className="connection-form">
          <h2>Connection</h2>
          <label>SurrealDB Endpoint<input value={surrealEndpoint} onChange={(event) => setSurrealEndpoint(event.target.value)} /></label>
          <label>User<input value={username} onChange={(event) => setUsername(event.target.value)} /></label>
          <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter SurrealDB password" /></label>
          <label>Namespace<input value={namespace} onChange={(event) => setNamespace(event.target.value)} /></label>
          <label>Database<input value={database} onChange={(event) => setDatabase(event.target.value)} /></label>
          <button onClick={refreshAgents} disabled={loading}>{loading ? "Loading..." : "Load Agents"}</button>
          {error ? <p className="error">{error}</p> : null}
        </div>
      </section>

      <section className="tabs">
        <button className={face === "runtime" ? "active" : ""} onClick={() => setFace("runtime")}>Runtime Face</button>
        <button className={face === "flow" ? "active" : ""} onClick={() => setFace("flow")}>Flow Face</button>
      </section>

      <section className="panel">
        <h2>{face === "runtime" ? "Runtime Face" : "Flow Face"}</h2>
        <p>{faceDescription}</p>
        {face === "runtime" ? <RuntimeFace agents={agents} /> : <FlowFace />}
      </section>
    </main>
  );
}

function RuntimeFace({ agents }: { agents: SurrealAgentRecord[] }) {
  if (agents.length === 0) {
    return <p className="muted">No agents loaded yet. Connect to SurrealDB and click Load Agents.</p>;
  }

  return (
    <div className="cards">
      {agents.map((agent) => (
        <article className="card" key={formatSurrealId(agent.id)}>
          <p className="eyebrow">{formatSurrealId(agent.id)}</p>
          <h3>{agent.name ?? agent.kubernetes?.name ?? "Unnamed Agent"}</h3>
          <p>{agent.objective ?? "No objective recorded"}</p>
          <dl>
            <dt>Status</dt><dd>{agent.status ?? "unknown"}</dd>
            <dt>Lifecycle</dt><dd>{agent.lifecycle ?? "unknown"}</dd>
            <dt>Trust</dt><dd>{agent.trust_score ?? 0}</dd>
            <dt>Updated</dt><dd>{agent.updated_at ?? "unknown"}</dd>
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
