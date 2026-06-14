#!/usr/bin/env python3
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "platform" / "gates" / "platform-gate.yaml"
CORE_DOCTRINE = ROOT / "docs" / "platform-core-doctrine.md"

REQUIRED_TEXT = [
    "releaseAuthority: Chinmay Panda",
    "coreDoctrine:",
    "Agent as Data",
    "Mathematics as Meta",
    "Metal at Core",
    "docs/platform-core-doctrine.md",
    "docs/meta-mathematical-model.md",
    "docs/agentic-operational-excellence-at-scale.md",
    "release-gates/fabricore-v0.1.0.provenance.json",
    "No agent without data",
    "No scale without mathematics",
    "No runtime without metal",
    "No artifact without provenance",
    "No release without a named gate",
    "No scale before surface minimization",
]

REQUIRED_CORE_DOCTRINE_TEXT = [
    "Agent as Data",
    "Mathematics as Meta",
    "Metal at Core",
    "Agentic Platform = Agent-as-Data + Mathematics-as-Meta + Metal-at-Core",
    "No agent without data.",
    "No scale without mathematics.",
    "No runtime without metal.",
]

REQUIRED_FILES = [
    "docs/platform-core-doctrine.md",
    "docs/meta-mathematical-model.md",
    "docs/agentic-operational-excellence-at-scale.md",
    "platform/README.md",
    "fabricore-os/CONTRACT.md",
    "fabricore-os/FLOW.md",
    "fabric-core/CONTRACT.md",
    "fabric-core/SURFACE.md",
    "release-gates/fabricore-v0.1.0.provenance.json",
    ".github/workflows/fabricore-release-flow.yaml",
    ".github/workflows/fabricore-loop.yaml",
]


def fail(message: str) -> None:
    print(f"FAIL: {message}", file=sys.stderr)
    sys.exit(1)


def main() -> None:
    if not MANIFEST.exists():
        fail("missing platform gate manifest")

    if not CORE_DOCTRINE.exists():
        fail("missing platform core doctrine")

    manifest = MANIFEST.read_text()
    for text in REQUIRED_TEXT:
        if text not in manifest:
            fail(f"platform gate missing required text: {text}")

    core_doctrine = CORE_DOCTRINE.read_text()
    for text in REQUIRED_CORE_DOCTRINE_TEXT:
        if text not in core_doctrine:
            fail(f"core doctrine missing required text: {text}")

    for file_name in REQUIRED_FILES:
        if not (ROOT / file_name).exists():
            fail(f"platform gate required file missing: {file_name}")

    print("OK: platform gate and core doctrine are enforceable")


if __name__ == "__main__":
    main()
