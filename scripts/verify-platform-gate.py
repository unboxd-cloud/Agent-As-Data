#!/usr/bin/env python3
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "platform" / "gates" / "platform-gate.yaml"
CORE_DOCTRINE = ROOT / "docs" / "platform-core-doctrine.md"
AGENT_BOOK = ROOT / "agent-book" / "README.md"

REQUIRED_TEXT = [
    "releaseAuthority: Chinmay Panda",
    "bookBinding:",
    "name: Agent Book",
    "path: agent-book/README.md",
    "coreDoctrine:",
    "Agent as Data",
    "Mathematics as Meta",
    "Metal at Core",
    "requiredBookChapters:",
    "agent-book/01-agent-as-data.md",
    "agent-book/06-superstorm.md",
    "agent-book/07-repair-agent.md",
    "agent-book/08-release-gates.md",
    "docs/platform-core-doctrine.md",
    "docs/meta-mathematical-model.md",
    "docs/agentic-operational-excellence-at-scale.md",
    "release-gates/fabricore-v0.1.0.provenance.json",
    "No agent without data",
    "No scale without mathematics",
    "No runtime without metal",
    "No artifact without provenance",
    "No release without a named gate",
    "No platform without a bound book",
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

REQUIRED_BOOK_TEXT = [
    "Agent Book = the narrative and operational memory of the platform.",
    "The book explains the platform.",
    "The gates enforce the platform.",
    "The human releases the platform.",
    "Chinmay Panda",
]

REQUIRED_FILES = [
    "agent-book/README.md",
    "agent-book/01-agent-as-data.md",
    "agent-book/02-mathematics-as-meta.md",
    "agent-book/03-metal-at-core.md",
    "agent-book/04-meta-kube.md",
    "agent-book/05-storm.md",
    "agent-book/06-superstorm.md",
    "agent-book/07-repair-agent.md",
    "agent-book/08-release-gates.md",
    "agent-book/09-operational-excellence.md",
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

    if not AGENT_BOOK.exists():
        fail("missing Agent Book index")

    manifest = MANIFEST.read_text()
    for text in REQUIRED_TEXT:
        if text not in manifest:
            fail(f"platform gate missing required text: {text}")

    core_doctrine = CORE_DOCTRINE.read_text()
    for text in REQUIRED_CORE_DOCTRINE_TEXT:
        if text not in core_doctrine:
            fail(f"core doctrine missing required text: {text}")

    agent_book = AGENT_BOOK.read_text()
    for text in REQUIRED_BOOK_TEXT:
        if text not in agent_book:
            fail(f"Agent Book missing required text: {text}")

    for file_name in REQUIRED_FILES:
        if not (ROOT / file_name).exists():
            fail(f"platform gate required file missing: {file_name}")

    print("OK: platform gate, core doctrine, and Agent Book binding are enforceable")


if __name__ == "__main__":
    main()
