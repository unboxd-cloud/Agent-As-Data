#!/usr/bin/env python3
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "platform" / "gates" / "platform-gate.yaml"

REQUIRED_TEXT = [
    "releaseAuthority: Chinmay Panda",
    "docs/agentic-operational-excellence-at-scale.md",
    "release-gates/fabricore-v0.1.0.provenance.json",
    "No artifact without provenance",
    "No release without a named gate",
    "No scale before surface minimization",
]

REQUIRED_FILES = [
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

    manifest = MANIFEST.read_text()
    for text in REQUIRED_TEXT:
        if text not in manifest:
            fail(f"platform gate missing required text: {text}")

    for file_name in REQUIRED_FILES:
        if not (ROOT / file_name).exists():
            fail(f"platform gate required file missing: {file_name}")

    print("OK: platform gate is enforceable")


if __name__ == "__main__":
    main()
