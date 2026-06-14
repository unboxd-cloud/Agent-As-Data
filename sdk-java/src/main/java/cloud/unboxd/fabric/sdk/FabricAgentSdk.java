package cloud.unboxd.fabric.sdk;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public final class FabricAgentSdk {
    public static final String FABRIC_PLATFORM_RULE = "Fabric is the Platform. Fabric provides Runtime and Flow. SDKs declare and observe; the reconciler reconciles.";

    private FabricAgentSdk() {
    }

    public static String toRecordId(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Agent name is required");
        }
        return "agent:" + name.trim().toLowerCase().replace('-', '_');
    }

    public static List<String> validateAgent(AgentDeclaration agent) {
        List<String> errors = new ArrayList<>();
        if (agent == null) {
            errors.add("agent is required");
            return errors;
        }
        if (agent.name() == null || agent.name().isBlank()) {
            errors.add("name is required");
        }
        if (agent.objective() == null || agent.objective().isBlank()) {
            errors.add("objective is required");
        }
        if (agent.trustScore() < 0 || agent.trustScore() > 100) {
            errors.add("trustScore must be between 0 and 100");
        }
        return errors;
    }

    public static FabricFlowEvent createFlowEvent(String type, String agentName) {
        return createFlowEvent(type, agentName, Map.of());
    }

    public static FabricFlowEvent createFlowEvent(String type, String agentName, Map<String, Object> payload) {
        return new FabricFlowEvent(type, toRecordId(agentName), Instant.now().toString(), payload);
    }
}
