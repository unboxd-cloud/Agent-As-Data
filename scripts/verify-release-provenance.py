#!/usr/bin/env python3
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
PROVENANCE = ROOT / "release-gates" / "fabricore-v0.1.0.provenance.json"

REQUIRED_FIELDS = [
    "release",
    "repository",
    "pullRequest",
    "baseBranch",
    "headBranch",
    "baseSha",
    "headSha",
    "releaseAuthority",
    "buildOperator",
    "workflow",
    "requiredArtifacts",
    "defaultSafeCommands",
    "explicitOptInCommands",
    "gateIssues",
    "approvalRequiredFrom",
]

EXPECTED = {
    "repository": "unboxd-cloud/Agent-As-Data",
    "releaseAuthority": "Chinmay Panda",
    "approvalRequiredFrom": "Chinmay Panda",
    "buildOperator": "GitHub Actions",
    "workflow": ".github/workflows/fabricore-release-flow.yaml",
    "defaultSafeCommands": ["check", "status", "prove"],
    "explicitOptInCommands": ["services start", "build dmg"],
}

REQUIRED_ARTIFACTS = {
    "dist/fabricore.jar",
    "dist/fabricore.jar.sha256",
    "fabric.dmg",
    "fabric.dmg.sha256",
}


def fail(message: str) -> None:
    print(f"FAIL: {message}", file=sys.stderr)
    sys.exit(1)


def main() -> None:
    if not PROVENANCE.exists():
        fail(f"missing provenance file: {PROVENANCE}")

    data = json.loads(PROVENANCE.read_text())

    for field in REQUIRED_FIELDS:
        if field not in data:
            fail(f"missing required provenance field: {field}")

    for field, expected in EXPECTED.items():
        if data[field] != expected:
            fail(f"provenance field {field} expected {expected!r}, got {data[field]!r}")

    for sha_field in ["baseSha", "headSha"]:
        value = data[sha_field]
        if not isinstance(value, str) or len(value) != 40 or not all(char in "0123456789abcdef" for char in value):
            fail(f"{sha_field} must be a 40-character lowercase git sha")

    artifacts = set(data["requiredArtifacts"])
    missing = REQUIRED_ARTIFACTS - artifacts
    if missing:
        fail(f"missing required artifacts: {sorted(missing)}")

    gate_issues = data["gateIssues"]
    if gate_issues.get("buildLoop") != 1 or gate_issues.get("releaseGate") != 2:
        fail("gateIssues must point to buildLoop #1 and releaseGate #2")

    print("OK: release provenance is enforceable and valid")


if __name__ == "__main__":
    main()
