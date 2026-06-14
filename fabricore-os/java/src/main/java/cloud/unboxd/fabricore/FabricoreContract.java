package cloud.unboxd.fabricore;

import java.util.List;

public record FabricoreContract(
        String name,
        String targetArtifact,
        String nativeRule,
        boolean headlessByDefault,
        List<FabricoreCommand> commands
) {
    public static FabricoreContract defaultContract() {
        return new FabricoreContract(
                "Fabricore OS",
                "fabric.dmg",
                "apple-silicon-arm64-only",
                true,
                List.of(
                        FabricoreCommand.CHECK,
                        FabricoreCommand.STATUS,
                        FabricoreCommand.PROVE,
                        FabricoreCommand.BUILD_DMG,
                        FabricoreCommand.SERVICES_START
                )
        );
    }
}
