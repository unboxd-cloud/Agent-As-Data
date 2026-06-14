export type AgentLifecycleState = "Draft" | "Active" | "Suspended" | "Archived";

export interface AgentDeclaration {
  name: string;
  namespace?: string;
  displayName?: string;
  objective: string;
  description?: string;
  status?: string;
  lifecycle?: {
    state: AgentLifecycleState;
  };
  trust?: {
    score: number;
  };
  runtime?: {
    mode: string;
    approvals: string;
  };
  owner?: Record<string, unknown>;
  skills?: string[];
  tools?: string[];
  policies?: string[];
  constraints?: Record<string, unknown>;
}

export interface AgentStatus {
  phase?: string;
  surrealRecord?: string;
  lastReconciledAt?: string;
  observedGeneration?: number;
  message?: string;
}

export interface FabricFlowEvent {
  type: string;
  agentRecord: string;
  timestamp: string;
  payload?: Record<string, unknown>;
}

export function toRecordId(name: string): string {
  if (!name || !name.trim()) {
    throw new Error("Agent name is required");
  }
  return `agent:${name.trim().toLowerCase().replaceAll("-", "_")}`;
}

export function validateAgent(agent: AgentDeclaration): string[] {
  const errors: string[] = [];
  if (!agent.name || !agent.name.trim()) errors.push("name is required");
  if (!agent.objective || !agent.objective.trim()) errors.push("objective is required");
  if (agent.trust && (agent.trust.score < 0 || agent.trust.score > 100)) {
    errors.push("trust.score must be between 0 and 100");
  }
  return errors;
}

export function createFlowEvent(type: string, agentName: string, payload: Record<string, unknown> = {}): FabricFlowEvent {
  return {
    type,
    agentRecord: toRecordId(agentName),
    timestamp: new Date().toISOString(),
    payload
  };
}

export const FABRIC_PLATFORM_RULE = "Fabric is the Platform. Fabric provides Runtime and Flow. SDKs declare and observe; the reconciler reconciles.";
