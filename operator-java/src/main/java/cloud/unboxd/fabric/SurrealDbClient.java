package cloud.unboxd.fabric;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Base64;
import java.util.Map;

public final class SurrealDbClient {
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final String endpoint;
    private final String namespace;
    private final String database;
    private final String basicAuth;

    public SurrealDbClient(String endpoint, String username, String password, String namespace, String database) {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        this.objectMapper = new ObjectMapper();
        this.endpoint = endpoint.endsWith("/") ? endpoint.substring(0, endpoint.length() - 1) : endpoint;
        this.namespace = namespace;
        this.database = database;
        this.basicAuth = Base64.getEncoder().encodeToString((username + ":" + password).getBytes(StandardCharsets.UTF_8));
    }

    public void ensureSchema() throws Exception {
        executeSql("""
            DEFINE TABLE IF NOT EXISTS agent SCHEMALESS;
            DEFINE FIELD IF NOT EXISTS name ON agent TYPE string;
            DEFINE FIELD IF NOT EXISTS description ON agent TYPE string;
            DEFINE FIELD IF NOT EXISTS objective ON agent TYPE string;
            DEFINE FIELD IF NOT EXISTS status ON agent TYPE string;
            DEFINE FIELD IF NOT EXISTS lifecycle ON agent TYPE string;
            DEFINE FIELD IF NOT EXISTS trust_score ON agent TYPE number;
            DEFINE FIELD IF NOT EXISTS runtime_mode ON agent TYPE string;
            DEFINE FIELD IF NOT EXISTS approvals ON agent TYPE string;
            DEFINE FIELD IF NOT EXISTS owner ON agent FLEXIBLE TYPE object;
            DEFINE FIELD IF NOT EXISTS skills ON agent TYPE array<string>;
            DEFINE FIELD IF NOT EXISTS tools ON agent TYPE array<string>;
            DEFINE FIELD IF NOT EXISTS policies ON agent TYPE array<string>;
            DEFINE FIELD IF NOT EXISTS constraints ON agent FLEXIBLE TYPE object;
            DEFINE FIELD IF NOT EXISTS kubernetes ON agent FLEXIBLE TYPE object;
            DEFINE FIELD IF NOT EXISTS updated_at ON agent TYPE datetime;
        """);
    }

    public void upsertAgent(String recordId, Map<String, Object> data) throws Exception {
        String json = objectMapper.writeValueAsString(data);
        String sql = "UPSERT " + recordId + " CONTENT " + json + ";";
        executeSql(sql);
    }

    public void deleteAgent(String recordId) throws Exception {
        executeSql("DELETE " + recordId + ";");
    }

    private void executeSql(String sql) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(endpoint + "/sql"))
                .timeout(Duration.ofSeconds(30))
                .header("Authorization", "Basic " + basicAuth)
                .header("NS", namespace)
                .header("DB", database)
                .header("Accept", "application/json")
                .header("Content-Type", "application/surrealql")
                .POST(HttpRequest.BodyPublishers.ofString(sql))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new IllegalStateException("SurrealDB request failed: HTTP " + response.statusCode() + " body=" + response.body());
        }
    }
}
