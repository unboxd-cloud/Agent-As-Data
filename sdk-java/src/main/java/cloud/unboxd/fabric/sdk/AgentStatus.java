package cloud.unboxd.fabric.sdk;

public record AgentStatus(
        String phase,
        String surrealRecord,
        String lastReconciledAt,
        Long observedGeneration,
        String message
) {
}
