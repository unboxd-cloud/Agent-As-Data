package cloud.unboxd.fabric;

import io.fabric8.kubernetes.api.model.GenericKubernetesResource;
import io.fabric8.kubernetes.api.model.GenericKubernetesResourceList;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.KubernetesClientBuilder;
import io.fabric8.kubernetes.client.Watcher;
import io.fabric8.kubernetes.client.WatcherException;
import io.fabric8.kubernetes.client.dsl.MixedOperation;
import io.fabric8.kubernetes.client.dsl.Resource;
import io.fabric8.kubernetes.client.dsl.base.ResourceDefinitionContext;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CountDownLatch;

public final class AgentReconcilerApp {
    private static final String GROUP = "fabric.agennext.io";
    private static final String VERSION = "v1alpha1";
    private static final String PLURAL = "agents";

    private final KubernetesClient kubernetes;
    private final MixedOperation<GenericKubernetesResource, GenericKubernetesResourceList, Resource<GenericKubernetesResource>> agents;
    private final SurrealDbClient surreal;

    public AgentReconcilerApp(KubernetesClient kubernetes, SurrealDbClient surreal) {
        this.kubernetes = kubernetes;
        this.surreal = surreal;

        ResourceDefinitionContext context = new ResourceDefinitionContext.Builder()
                .withGroup(GROUP)
                .withVersion(VERSION)
                .withPlural(PLURAL)
                .withNamespaced(true)
                .build();

        this.agents = kubernetes.genericKubernetesResources(context);
    }

    public static void main(String[] args) throws Exception {
        String endpoint = env("SURREAL_ENDPOINT", "http://surrealdb.fabric.svc.cluster.local:8000");
        String user = env("SURREAL_USER", "root");
        String pass = env("SURREAL_PASS", "ChangeMeNow");
        String ns = env("SURREAL_NS", "agennext");
        String db = env("SURREAL_DB", "fabric");

        System.out.println("Starting Java Fabric Agent Reconciler");
        System.out.println("SurrealDB endpoint: " + endpoint);

        KubernetesClient kubernetes = new KubernetesClientBuilder().build();
        SurrealDbClient surreal = new SurrealDbClient(endpoint, user, pass, ns, db);
        AgentReconcilerApp app = new AgentReconcilerApp(kubernetes, surreal);

        surreal.ensureSchema();
        app.reconcileExisting();
        app.watch();

        new CountDownLatch(1).await();
    }

    private void reconcileExisting() {
        agents.inAnyNamespace().list().getItems().forEach(this::reconcileSafely);
    }

    private void watch() {
        agents.inAnyNamespace().watch(new Watcher<>() {
            @Override
            public void eventReceived(Action action, GenericKubernetesResource resource) {
                if (resource == null || resource.getMetadata() == null) {
                    return;
                }

                if (action == Action.ADDED || action == Action.MODIFIED) {
                    reconcileSafely(resource);
                }

                if (action == Action.DELETED) {
                    deleteSafely(resource);
                }
            }

            @Override
            public void onClose(WatcherException cause) {
                if (cause != null) {
                    System.err.println("Agent watch closed with error: " + cause.getMessage());
                } else {
                    System.out.println("Agent watch closed");
                }
            }
        });
    }

    private void reconcileSafely(GenericKubernetesResource agent) {
        try {
            reconcile(agent);
        } catch (Exception error) {
            System.err.println("Reconcile failed for " + key(agent) + ": " + error.getMessage());
            error.printStackTrace(System.err);
        }
    }

    private void reconcile(GenericKubernetesResource agent) throws Exception {
        String recordId = "agent:" + toRecordId(agent.getMetadata().getName());
        Map<String, Object> data = toSurreal(agent);

        System.out.println("Reconciling " + key(agent) + " -> " + recordId);
        surreal.upsertAgent(recordId, data);
        patchStatus(agent, "Reconciled", recordId, "");
        System.out.println("Reconciled " + key(agent));
    }

    private void deleteSafely(GenericKubernetesResource agent) {
        try {
            String recordId = "agent:" + toRecordId(agent.getMetadata().getName());
            surreal.deleteAgent(recordId);
            System.out.println("Deleted " + recordId);
        } catch (Exception error) {
            System.err.println("Delete failed for " + key(agent) + ": " + error.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> toSurreal(GenericKubernetesResource agent) {
        Map<String, Object> spec = safeMap(agent.getAdditionalProperties().get("spec"));
        Map<String, Object> trust = safeMap(spec.get("trust"));
        Map<String, Object> lifecycle = safeMap(spec.get("lifecycle"));
        Map<String, Object> runtime = safeMap(spec.get("runtime"));

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("name", stringValue(spec.get("displayName"), agent.getMetadata().getName()));
        data.put("description", stringValue(spec.get("description"), ""));
        data.put("objective", stringValue(spec.get("objective"), ""));
        data.put("status", stringValue(spec.get("status"), "draft"));
        data.put("lifecycle", stringValue(lifecycle.get("state"), "Draft"));
        data.put("trust_score", numberValue(trust.get("score"), 0));
        data.put("runtime_mode", stringValue(runtime.get("mode"), "manual"));
        data.put("approvals", stringValue(runtime.get("approvals"), "required"));
        data.put("owner", safeMap(spec.get("owner")));
        data.put("skills", listValue(spec.get("skills")));
        data.put("tools", listValue(spec.get("tools")));
        data.put("policies", listValue(spec.get("policies")));
        data.put("constraints", safeMap(spec.get("constraints")));

        Map<String, Object> k8s = new LinkedHashMap<>();
        k8s.put("namespace", agent.getMetadata().getNamespace());
        k8s.put("name", agent.getMetadata().getName());
        k8s.put("uid", agent.getMetadata().getUid());
        k8s.put("resource_version", agent.getMetadata().getResourceVersion());
        k8s.put("generation", agent.getMetadata().getGeneration());
        data.put("kubernetes", k8s);

        data.put("updated_at", Instant.now().toString());
        return data;
    }

    private void patchStatus(GenericKubernetesResource agent, String phase, String recordId, String message) {
        try {
            Map<String, Object> status = new LinkedHashMap<>();
            status.put("phase", phase);
            status.put("observedGeneration", agent.getMetadata().getGeneration());
            status.put("surrealRecord", recordId);
            status.put("message", message);
            status.put("lastReconciledAt", Instant.now().toString());

            agent.setAdditionalProperty("status", status);
            agents.inNamespace(agent.getMetadata().getNamespace())
                    .withName(agent.getMetadata().getName())
                    .replaceStatus(agent);
        } catch (Exception error) {
            System.err.println("Status patch failed for " + key(agent) + ": " + error.getMessage());
        }
    }

    private static String key(GenericKubernetesResource resource) {
        return resource.getMetadata().getNamespace() + "/" + resource.getMetadata().getName();
    }

    private static String toRecordId(String name) {
        return name.replace('-', '_').toLowerCase();
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> safeMap(Object value) {
        if (value instanceof Map<?, ?> map) {
            return (Map<String, Object>) map;
        }
        return Map.of();
    }

    @SuppressWarnings("unchecked")
    private static List<Object> listValue(Object value) {
        if (value instanceof List<?> list) {
            return (List<Object>) list;
        }
        return List.of();
    }

    private static String stringValue(Object value, String fallback) {
        return value == null ? fallback : String.valueOf(value);
    }

    private static Number numberValue(Object value, Number fallback) {
        if (value instanceof Number number) {
            return number;
        }
        return fallback;
    }

    private static String env(String name, String fallback) {
        String value = System.getenv(name);
        return value == null || value.isBlank() ? fallback : value;
    }
}
