export interface SurrealAgentRecord {
  id?: string | { tb: string; id: string };
  name?: string;
  objective?: string;
  status?: string;
  lifecycle?: string;
  trust_score?: number;
  runtime_mode?: string;
  approvals?: string;
  tenant_id?: string;
  workspace_id?: string;
  updated_at?: string;
  kubernetes?: {
    namespace?: string;
    name?: string;
    uid?: string;
    generation?: number;
  };
}

export interface SurrealConnection {
  endpoint: string;
  username: string;
  password: string;
  namespace: string;
  database: string;
  tenantId?: string;
  workspaceId?: string;
}

export interface SurrealQueryResult<T> {
  status: string;
  time: string;
  result: T;
}

export function formatSurrealId(id: SurrealAgentRecord["id"]): string {
  if (!id) return "unknown";
  if (typeof id === "string") return id;
  return `${id.tb}:${id.id}`;
}

export async function queryAgents(connection: SurrealConnection): Promise<SurrealAgentRecord[]> {
  const response = await fetch(`${connection.endpoint.replace(/\/$/, "")}/sql`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${connection.username}:${connection.password}`)}`,
      Accept: "application/json",
      "Content-Type": "application/surrealql",
      NS: connection.namespace,
      DB: connection.database
    },
    body: "SELECT * FROM agent;"
  });

  if (!response.ok) {
    throw new Error(`SurrealDB request failed: HTTP ${response.status}`);
  }

  const payload = (await response.json()) as SurrealQueryResult<SurrealAgentRecord[]>[];
  const agents = payload.flatMap((entry) => entry.result ?? []);
  return agents.filter((agent) => {
    const tenantMatches = !connection.tenantId || !agent.tenant_id || agent.tenant_id === connection.tenantId;
    const workspaceMatches = !connection.workspaceId || !agent.workspace_id || agent.workspace_id === connection.workspaceId;
    return tenantMatches && workspaceMatches;
  });
}
