package cloud.unboxd.fabric.sdk;

import java.util.List;
import java.util.Map;

public record AgentDeclaration(
        String name,
        String namespace,
        String displayName,
        String objective,
        String description,
        String status,
        String lifecycleState,
        int trustScore,
        String runtimeMode,
        String approvals,
        Map<String, Object> owner,
        List<String> skills,
        List<String> tools,
        List<String> policies,
        Map<String, Object> constraints
) {
    public AgentDeclaration {
        namespace = namespace == null || namespace.isBlank() ? "fabric" : namespace;
        description = description == null ? "" : description;
        status = status == null || status.isBlank() ? "draft" : status;
        lifecycleState = lifecycleState == null || lifecycleState.isBlank() ? "Draft" : lifecycleState;
        runtimeMode = runtimeMode == null || runtimeMode.isBlank() ? "manual" : runtimeMode;
        approvals = approvals == null || approvals.isBlank() ? "required" : approvals;
        owner = owner == null ? Map.of() : Map.copyOf(owner);
        skills = skills == null ? List.of() : List.copyOf(skills);
        tools = tools == null ? List.of() : List.copyOf(tools);
        policies = policies == null ? List.of() : List.copyOf(policies);
        constraints = constraints == null ? Map.of() : Map.copyOf(constraints);
    }
}
