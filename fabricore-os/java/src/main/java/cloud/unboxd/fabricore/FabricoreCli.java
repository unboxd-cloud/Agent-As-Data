package cloud.unboxd.fabricore;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public final class FabricoreCli {
    private FabricoreCli() {
    }

    public static void main(String[] args) throws Exception {
        int exitCode = run(args);
        if (exitCode != 0) {
            System.exit(exitCode);
        }
    }

    static int run(String[] args) throws IOException, InterruptedException {
        String command = args.length > 0 ? args[0] : "help";
        String subcommand = args.length > 1 ? args[1] : "";
        Path root = findRepoRoot();

        return switch (command) {
            case "check" -> runScript(root, "fabric-core/scripts/headless.sh", List.of("check"));
            case "status" -> runScript(root, "fabric-core/scripts/headless.sh", List.of("status"));
            case "prove" -> runScript(root, "fabric-core/scripts/headless.sh", List.of("prove"));
            case "build" -> {
                if (!"dmg".equals(subcommand)) {
                    usage();
                    yield 1;
                }
                yield runScript(root, "fabricore-os/build-fabric-dmg.sh", List.of());
            }
            case "services" -> {
                if (!"start".equals(subcommand)) {
                    usage();
                    yield 1;
                }
                yield runScript(root, "fabric-core/scripts/start-local-services.sh", List.of());
            }
            case "contract" -> {
                printContract();
                yield 0;
            }
            case "help", "--help", "-h" -> {
                usage();
                yield 0;
            }
            default -> {
                usage();
                yield 1;
            }
        };
    }

    private static int runScript(Path root, String script, List<String> args) throws IOException, InterruptedException {
        if (script.startsWith("/") || script.contains("..") || !script.endsWith(".sh")) {
            throw new IllegalArgumentException("unsafe script path: " + script);
        }

        Path scriptPath = root.resolve(script).normalize();
        if (!scriptPath.startsWith(root) || !Files.exists(scriptPath)) {
            throw new IllegalStateException("script not found or outside root: " + scriptPath);
        }

        ProcessBuilder builder = new ProcessBuilder();
        builder.command().add("/bin/bash");
        builder.command().add(scriptPath.toString());
        builder.command().addAll(args);
        builder.directory(root.toFile());
        builder.environment().clear();
        builder.environment().put("PATH", "/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin");
        builder.inheritIO();

        Process process = builder.start();
        return process.waitFor();
    }

    private static Path findRepoRoot() {
        String envRoot = System.getenv("FABRICORE_ROOT");
        if (envRoot != null && !envRoot.isBlank()) {
            Path root = Path.of(envRoot).toAbsolutePath().normalize();
            if (Files.exists(root.resolve("fabric-core/scripts/headless.sh"))) {
                return root;
            }
        }

        Path current = Path.of("").toAbsolutePath().normalize();
        while (current != null) {
            if (Files.exists(current.resolve("fabric-core/scripts/headless.sh"))) {
                return current;
            }
            current = current.getParent();
        }

        throw new IllegalStateException("cannot locate repo root; set FABRICORE_ROOT");
    }

    private static void printContract() {
        FabricoreContract contract = FabricoreContract.defaultContract();
        System.out.println("name=" + contract.name());
        System.out.println("targetArtifact=" + contract.targetArtifact());
        System.out.println("nativeRule=" + contract.nativeRule());
        System.out.println("headlessByDefault=" + contract.headlessByDefault());
        contract.commands().forEach(command -> System.out.println(command.cli() + " mode=" + command.mode()));
    }

    private static void usage() {
        System.out.println("""
                Fabricore OS Java

                Usage:
                  java -jar fabricore.jar check
                  java -jar fabricore.jar status
                  java -jar fabricore.jar prove
                  java -jar fabricore.jar build dmg
                  java -jar fabricore.jar services start
                  java -jar fabricore.jar contract

                Default commands are non-mutating. Service start is explicit opt-in.
                """);
    }
}
