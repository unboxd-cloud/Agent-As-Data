export interface SurrealAgentRecord {
  id?: string | { tb: string; id: string };
  name?: string;
  objective?: string;
  status?: string;
  lifecycle?: string;
  trust_score?: number;
  runtime_mode?: string;
  approvals?: string;
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
  return payload.flatMap((entry) => entry.result ?? []);
}
