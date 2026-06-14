import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { formatSurrealId, queryAgents, type SurrealAgentRecord } from "./surreal";
import "./styles.css";

type Pane = "runtime" | "flow" | "control" | "tenants";
type ChatRole = "author" | "fabric";

interface ChatMessage {
  role: ChatRole;
  content: string;
  timestamp: string;
}

interface TenantContext {
  tenantId: string;
  workspaceId: string;
  environment: "local" | "dev" | "staging" | "production";
}

function App() {
  const [pane, setPane] = useState<Pane>("runtime");
  const [tenant, setTenant] = useState<TenantContext>({ tenantId: "demo-tenant", workspaceId: "default", environment: "local" });
  const [surrealEndpoint, setSurrealEndpoint] = useState(import.meta.env.VITE_SURREAL_ENDPOINT ?? "http://localhost:8000");
  const [username, setUsername] = useState("root");
  const [password, setPassword] = useState("");
  const [namespace, setNamespace] = useState("agennext");
  const [database, setDatabase] = useState("fabric");
  const [agents, setAgents] = useState<SurrealAgentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paneDescription = useMemo(() => {
    if (pane === "runtime") return "Runtime Face shows what executes from reconciled Fabric state for the selected tenant and workspace.";
    if (pane === "flow") return "Flow Face shows how tenant-authored intent moves into execution, decision, audit, and replay.";
    if (pane === "tenants") return "Tenant Pane defines SaaS isolation context: tenant, workspace, and environment.";
    return "Control Pane is the author-facing command surface. It drafts tenant-scoped intent and explains state; it does not bypass reconciliation.";
  }, [pane]);

  async function refreshAgents() {
    setLoading(true);
    setError(null);
    try {
      const result = await queryAgents({ endpoint: surrealEndpoint, username, password, namespace, database, tenantId: tenant.tenantId, workspaceId: tenant.workspaceId });
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
        <p className="eyebrow">Agent-as-Data SaaS</p>
        <h1>Fabric Multi-Tenant Control Pane</h1>
        <p>
          Inspect the Fabric Platform as a SaaS control pane with tenant isolation, Runtime Face, Flow Face, and an author command surface.
        </p>
      </section>

      <section className="panel grid two">
        <div>
          <h2>Fabric SaaS Platform</h2>
          <pre>{`Fabric SaaS Platform\n├── Tenant Context\n├── Runtime Face\n├── Flow Face\n└── Control Pane`}</pre>
          <p className="muted">Active tenant: {tenant.tenantId} · Workspace: {tenant.workspaceId} · Environment: {tenant.environment}</p>
        </div>
        <div className="connection-form">
          <h2>Connection</h2>
          <label>SurrealDB Endpoint<input value={surrealEndpoint} onChange={(event) => setSurrealEndpoint(event.target.value)} /></label>
          <label>User<input value={username} onChange={(event) => setUsername(event.target.value)} /></label>
          <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter SurrealDB password" /></label>
          <label>Namespace<input value={namespace} onChange={(event) => setNamespace(event.target.value)} /></label>
          <label>Database<input value={database} onChange={(event) => setDatabase(event.target.value)} /></label>
          <button onClick={refreshAgents} disabled={loading}>{loading ? "Loading..." : "Load Tenant Agents"}</button>
          {error ? <p className="error">{error}</p> : null}
        </div>
      </section>

      <section className="control-pane">
        <header className="control-pane-header">
          <p className="eyebrow">Fabric Control Pane</p>
          <h2>{pane === "runtime" ? "Runtime Face" : pane === "flow" ? "Flow Face" : pane === "tenants" ? "Tenant Pane" : "Author Command Surface"}</h2>
          <p>{paneDescription}</p>
          <nav className="tabs">
            <button className={pane === "tenants" ? "active" : ""} onClick={() => setPane("tenants")}>Tenant Pane</button>
            <button className={pane === "runtime" ? "active" : ""} onClick={() => setPane("runtime")}>Runtime Face</button>
            <button className={pane === "flow" ? "active" : ""} onClick={() => setPane("flow")}>Flow Face</button>
            <button className={pane === "control" ? "active" : ""} onClick={() => setPane("control")}>Control Pane</button>
          </nav>
        </header>
        <section className="control-pane-body">
          {pane === "tenants" ? <TenantPane tenant={tenant} setTenant={setTenant} /> : pane === "runtime" ? <RuntimeFace agents={agents} tenant={tenant} /> : pane === "flow" ? <FlowFace tenant={tenant} /> : <ControlPane agents={agents} tenant={tenant} />}
        </section>
      </section>
    </main>
  );
}

function TenantPane({ tenant, setTenant }: { tenant: TenantContext; setTenant: (tenant: TenantContext) => void }) {
  return (
    <div className="tenant-grid">
      <article className="card">
        <p className="eyebrow">Tenant Context</p>
        <h3>SaaS Isolation Boundary</h3>
        <p>Every Agent, flow event, decision, and audit record must be scoped to a tenant and workspace.</p>
        <label>Tenant ID<input value={tenant.tenantId} onChange={(event) => setTenant({ ...tenant, tenantId: event.target.value })} /></label>
        <label>Workspace ID<input value={tenant.workspaceId} onChange={(event) => setTenant({ ...tenant, workspaceId: event.target.value })} /></label>
        <label>Environment<select value={tenant.environment} onChange={(event) => setTenant({ ...tenant, environment: event.target.value as TenantContext["environment"] })}><option value="local">local</option><option value="dev">dev</option><option value="staging">staging</option><option value="production">production</option></select></label>
      </article>
      <article className="card">
        <p className="eyebrow">Tenant Rule</p>
        <h3>Deny Cross-Tenant Access</h3>
        <p>Control Pane reads and writes must be tenant-scoped. Cross-tenant access requires explicit platform governance and audit evidence.</p>
        <pre>{`tenant_id = "${tenant.tenantId}"\nworkspace_id = "${tenant.workspaceId}"\nenvironment = "${tenant.environment}"`}</pre>
      </article>
    </div>
  );
}

function RuntimeFace({ agents, tenant }: { agents: SurrealAgentRecord[]; tenant: TenantContext }) {
  if (agents.length === 0) return <p className="muted">No agents loaded for {tenant.tenantId}/{tenant.workspaceId}. Connect to SurrealDB and click Load Tenant Agents.</p>;
  return <div className="cards">{agents.map((agent) => <article className="card" key={formatSurrealId(agent.id)}><p className="eyebrow">{formatSurrealId(agent.id)}</p><h3>{agent.name ?? agent.kubernetes?.name ?? "Unnamed Agent"}</h3><p>{agent.objective ?? "No objective recorded"}</p><dl><dt>Tenant</dt><dd>{tenant.tenantId}</dd><dt>Workspace</dt><dd>{tenant.workspaceId}</dd><dt>Status</dt><dd>{agent.status ?? "unknown"}</dd><dt>Lifecycle</dt><dd>{agent.lifecycle ?? "unknown"}</dd><dt>Trust</dt><dd>{agent.trust_score ?? 0}</dd><dt>Updated</dt><dd>{agent.updated_at ?? "unknown"}</dd></dl></article>)}</div>;
}

function FlowFace({ tenant }: { tenant: TenantContext }) {
  const steps = ["Tenant Intent", "Declaration", "Verification", "Reconciliation", "Source of Truth", "Runtime", "Decision", "Audit"];
  return <><p className="muted">Flow scoped to {tenant.tenantId}/{tenant.workspaceId}</p><ol className="flow">{steps.map((step) => <li key={step}>{step}</li>)}</ol></>;
}

function ControlPane({ agents, tenant }: { agents: SurrealAgentRecord[]; tenant: TenantContext }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "fabric", content: `I am the Fabric Control Pane for tenant ${tenant.tenantId}/${tenant.workspaceId}. I can help draft Agent intent, inspect loaded Agent records, and explain the next reconciliation step.`, timestamp: new Date().toISOString() }]);

  function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed) return;
    const now = new Date().toISOString();
    const authorMessage: ChatMessage = { role: "author", content: trimmed, timestamp: now };
    const fabricMessage: ChatMessage = { role: "fabric", content: respond(trimmed, agents, tenant), timestamp: new Date().toISOString() };
    setMessages((current) => [...current, authorMessage, fabricMessage]);
    setInput("");
  }

  return <div className="chat-shell"><div className="chat-log">{messages.map((message, index) => <article className={`chat-message ${message.role}`} key={`${message.timestamp}-${index}`}><p className="eyebrow">{message.role === "author" ? "Author" : "Fabric"}</p><p>{message.content}</p></article>)}</div><div className="chat-input-row"><input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") sendMessage(); }} placeholder="Describe tenant-scoped agent intent or ask about Fabric state..." /><button onClick={sendMessage}>Send</button></div><p className="muted">Boundary: Control Pane drafts tenant intent. GitHub stores intent. CI/CD verifies. Kubernetes and the Java reconciler reconcile. SurrealDB stores tenant-scoped truth.</p></div>;
}

function respond(input: string, agents: SurrealAgentRecord[], tenant: TenantContext): string {
  const lower = input.toLowerCase();
  if (lower.includes("tenant")) return `Active tenant context is ${tenant.tenantId}/${tenant.workspaceId} in ${tenant.environment}. All records must remain tenant-scoped.`;
  if (lower.includes("agent") || lower.includes("status")) {
    if (agents.length === 0) return `No Agent records are loaded for ${tenant.tenantId}/${tenant.workspaceId}. Load tenant agents from SurrealDB first.`;
    return `Loaded ${agents.length} Agent record(s) for ${tenant.tenantId}/${tenant.workspaceId}: ${agents.map((agent) => formatSurrealId(agent.id)).join(", ")}.`;
  }
  if (lower.includes("flow")) return "Fabric SaaS Flow is: Tenant Intent → Declaration → Verification → Reconciliation → Source of Truth → Runtime → Decision → Audit.";
  if (lower.includes("runtime")) return "The Runtime Face executes governed tenant-scoped work from reconciled SurrealDB state. It should not bypass policy, tenancy, status, or audit.";
  return `Draft this as tenant-scoped authored intent for ${tenant.tenantId}/${tenant.workspaceId}, commit it to GitHub, let CI/CD verify it, then let k3s and the Java reconciler reconcile it into SurrealDB for Fabric execution.`;
}

createRoot(document.getElementById("root")!).render(<App />);
