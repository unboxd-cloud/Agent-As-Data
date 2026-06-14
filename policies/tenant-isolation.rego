package fabric.tenant

# Tenant isolation policy for Agent-as-Data.
# This is an initial governance stub used by CI and future OPA enforcement.

# Default deny.
default allow := false

# Allow only when the actor tenant and resource tenant match.
allow if {
  input.actor.tenant_id == input.resource.tenant_id
  input.actor.workspace_id == input.resource.workspace_id
}

# Production rule:
# UI filtering is not sufficient isolation. Platform/data-layer policy must enforce tenant boundaries.
deny[msg] if {
  input.actor.tenant_id != input.resource.tenant_id
  msg := "cross-tenant access denied"
}

deny[msg] if {
  input.actor.workspace_id != input.resource.workspace_id
  msg := "cross-workspace access denied"
}
