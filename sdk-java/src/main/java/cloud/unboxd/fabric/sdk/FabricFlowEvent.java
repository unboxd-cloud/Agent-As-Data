package cloud.unboxd.fabric.sdk;

import java.util.Map;

public record FabricFlowEvent(
        String type,
        String agentRecord,
        String timestamp,
        Map<String, Object> payload
) {
    public FabricFlowEvent {
        payload = payload == null ? Map.of() : Map.copyOf(payload);
    }
}
