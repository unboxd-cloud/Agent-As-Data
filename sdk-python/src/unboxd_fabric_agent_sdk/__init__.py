from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Literal

AgentLifecycleState = Literal["Draft", "Active", "Suspended", "Archived"]


@dataclass(frozen=True)
class AgentDeclaration:
    name: str
    objective: str
    namespace: str = "fabric"
    display_name: str | None = None
    description: str = ""
    status: str = "draft"
    lifecycle_state: AgentLifecycleState = "Draft"
    trust_score: int = 0
    runtime_mode: str = "manual"
    approvals: str = "required"
    owner: dict[str, Any] = field(default_factory=dict)
    skills: list[str] = field(default_factory=list)
    tools: list[str] = field(default_factory=list)
    policies: list[str] = field(default_factory=list)
    constraints: dict[str, Any] = field(default_factory=dict)


@dataclass(frozen=True)
class AgentStatus:
    phase: str | None = None
    surreal_record: str | None = None
    last_reconciled_at: str | None = None
    observed_generation: int | None = None
    message: str | None = None


@dataclass(frozen=True)
class FabricFlowEvent:
    type: str
    agent_record: str
    timestamp: str
    payload: dict[str, Any] = field(default_factory=dict)


def to_record_id(name: str) -> str:
    cleaned = name.strip().lower().replace("-", "_")
    if not cleaned:
        raise ValueError("Agent name is required")
    return f"agent:{cleaned}"


def validate_agent(agent: AgentDeclaration) -> list[str]:
    errors: list[str] = []
    if not agent.name.strip():
        errors.append("name is required")
    if not agent.objective.strip():
        errors.append("objective is required")
    if agent.trust_score < 0 or agent.trust_score > 100:
        errors.append("trust_score must be between 0 and 100")
    return errors


def create_flow_event(event_type: str, agent_name: str, payload: dict[str, Any] | None = None) -> FabricFlowEvent:
    return FabricFlowEvent(
        type=event_type,
        agent_record=to_record_id(agent_name),
        timestamp=datetime.now(timezone.utc).isoformat(),
        payload=payload or {},
    )


FABRIC_PLATFORM_RULE = "Fabric is the Platform. Fabric provides Runtime and Flow. SDKs declare and observe; the reconciler reconciles."
