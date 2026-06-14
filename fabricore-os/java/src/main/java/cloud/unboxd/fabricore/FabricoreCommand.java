package cloud.unboxd.fabricore;

public enum FabricoreCommand {
    CHECK("check", FabricoreMode.READ_ONLY),
    STATUS("status", FabricoreMode.READ_ONLY),
    PROVE("prove", FabricoreMode.VERIFICATION),
    BUILD_DMG("build dmg", FabricoreMode.BUILD),
    SERVICES_START("services start", FabricoreMode.EXPLICIT_OPT_IN_MUTATION);

    private final String cli;
    private final FabricoreMode mode;

    FabricoreCommand(String cli, FabricoreMode mode) {
        this.cli = cli;
        this.mode = mode;
    }

    public String cli() {
        return cli;
    }

    public FabricoreMode mode() {
        return mode;
    }

    public boolean isDefaultSafe() {
        return mode == FabricoreMode.READ_ONLY || mode == FabricoreMode.VERIFICATION;
    }
}
