import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { formatSurrealId, queryAgents, type SurrealAgentRecord } from "./surreal";
import "./styles.css";

type Face = "runtime" | "flow" | "chat";
type ChatRole = "author" | "fabric";

interface ChatMessage {
  role: ChatRole;
  content: string;
  timestamp: string;
}

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
    if (face === "runtime") return "Runtime Face shows what executes from reconciled Fabric state.";
    if (face === "flow") return "Flow Face shows how authored intent moves into execution, decision, audit, and replay.";
    return "Chat UI is the author-facing intent surface. It drafts intent; it does not bypass reconciliation.";
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
          Inspect the Fabric Platform as two faces: Runtime Face and Flow Face. Use Chat as the author-facing surface for shaping intent before it becomes reconciled data.
        </p>
      </section>

      <section className="panel grid two">
        <div>
          <h2>Fabric Platform</h2>
          <pre>{`Fabric Platform\n├── Runtime Face\n├── Flow Face\n└── Chat Surface`}</pre>
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
        <button className={face === "chat" ? "active" : ""} onClick={() => setFace("chat")}>Chat UI</button>
      </section>

      <section className="panel">
        <h2>{face === "runtime" ? "Runtime Face" : face === "flow" ? "Flow Face" : "Author Chat UI"}</h2>
        <p>{faceDescription}</p>
        {face === "runtime" ? <RuntimeFace agents={agents} /> : face === "flow" ? <FlowFace /> : <ChatFace agents={agents} />}
      </section>
    </main>
  );
}

function RuntimeFace({ agents }: { agents: SurrealAgentRecord[] }) {
  if (agents.length === 0) return <p className="muted">No agents loaded yet. Connect to SurrealDB and click Load Agents.</p>;
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
  return <ol className="flow">{steps.map((step) => <li key={step}>{step}</li>)}</ol>;
}

function ChatFace({ agents }: { agents: SurrealAgentRecord[] }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "fabric",
      content: "I am the Fabric authoring surface. I can help draft Agent intent, inspect loaded Agent records, and explain the next reconciliation step. I do not directly reconcile; the Java reconciler does that.",
      timestamp: new Date().toISOString()
    }
  ]);

  function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed) return;
    const now = new Date().toISOString();
    const authorMessage: ChatMessage = { role: "author", content: trimmed, timestamp: now };
    const fabricMessage: ChatMessage = { role: "fabric", content: respond(trimmed, agents), timestamp: new Date().toISOString() };
    setMessages((current) => [...current, authorMessage, fabricMessage]);
    setInput("");
  }

  return (
    <div className="chat-shell">
      <div className="chat-log">
        {messages.map((message, index) => (
          <article className={`chat-message ${message.role}`} key={`${message.timestamp}-${index}`}>
            <p className="eyebrow">{message.role === "author" ? "Author" : "Fabric"}</p>
            <p>{message.content}</p>
          </article>
        ))}
      </div>
      <div className="chat-input-row">
        <input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") sendMessage(); }} placeholder="Describe the agent intent or ask about Fabric state..." />
        <button onClick={sendMessage}>Send</button>
      </div>
      <p className="muted">Boundary: Chat drafts intent. GitHub stores intent. CI/CD verifies. Kubernetes and the Java reconciler reconcile. SurrealDB stores truth.</p>
    </div>
  );
}

function respond(input: string, agents: SurrealAgentRecord[]): string {
  const lower = input.toLowerCase();
  if (lower.includes("agent") || lower.includes("status")) {
    if (agents.length === 0) return "No Agent records are loaded yet. Load agents from SurrealDB first, then I can summarize runtime state.";
    return `Loaded ${agents.length} Agent record(s): ${agents.map((agent) => formatSurrealId(agent.id)).join(", ")}.`;
  }
  if (lower.includes("flow")) return "Fabric Flow is: Intent → Declaration → Verification → Reconciliation → Source of Truth → Runtime → Decision → Audit.";
  if (lower.includes("runtime")) return "The Runtime Face executes governed work from reconciled SurrealDB state. It should not bypass policy, status, or audit.";
  return "Draft this as authored intent, commit it to GitHub, let CI/CD verify it, then let k3s and the Java reconciler reconcile it into SurrealDB for Fabric execution.";
}

createRoot(document.getElementById("root")!).render(<App />);
