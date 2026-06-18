#!/usr/bin/env python3
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "platform" / "gates" / "platform-gate.yaml"
CORE_DOCTRINE = ROOT / "docs" / "platform-core-doctrine.md"
AGENT_BOOK = ROOT / "agent-book" / "README.md"
BOOK_SITE = ROOT / "book-site" / "index.html"
BOOK_PUBLISH_WORKFLOW = ROOT / ".github" / "workflows" / "publish-agent-book.yaml"
CORTEX = ROOT / "docs" / "cortex.md"
AGENT_EYE = ROOT / "docs" / "agent-eye.md"
AGENT_DESTINATION = ROOT / "docs" / "agent-destination.md"

REQUIRED_TEXT = [
    "releaseAuthority: Chinmay Panda",
    "bookBinding:",
    "name: Agent Book",
    "path: agent-book/README.md",
    "sitePath: book-site/index.html",
    "publishWorkflow: .github/workflows/publish-agent-book.yaml",
    "controlPrimitives:",
    "Agent Eye",
    "Cortex",
    "Repair Agent",
    "Storm",
    "Superstorm",
    "Agent Destination",
    "docs/cortex.md",
    "docs/agent-eye.md",
    "docs/agent-destination.md",
    "No Cortex without Agent Eye evidence",
    "No Repair Agent action without Cortex routing",
    "No Agent Destination without gate allowance",
    "No release destination without human authority",
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
    "book-site/index.html",
    "release-gates/fabricore-v0.1.0.provenance.json",
    "No agent without data",
    "No scale without mathematics",
    "No runtime without metal",
    "No artifact without provenance",
    "No release without a named gate",
    "No platform without a bound book",
    "No bound book without a publish path",
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

REQUIRED_SITE_TEXT = [
    "Agent Book",
    "A Platform Bound to a Book",
    "The book explains the platform.",
    "The gates enforce the platform.",
    "The human releases the platform.",
]

REQUIRED_PUBLISH_WORKFLOW_TEXT = [
    "name: Publish Agent Book",
    "actions/deploy-pages@v4",
    "book-site/**",
    "agent-book/**",
]

REQUIRED_CORTEX_TEXT = [
    "Cortex = the platform control layer",
    "Cortex may decide the next path.",
    "Cortex may not decide final release.",
]

REQUIRED_AGENT_EYE_TEXT = [
    "Agent Eye = the platform observation layer",
    "Agent Eye sees.",
    "Cortex reasons.",
]

REQUIRED_AGENT_DESTINATION_TEXT = [
    "Agent Destination = the approved target",
    "No destination without tenant scope.",
    "No release destination without human authority.",
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
    "book-site/index.html",
    "docs/cortex.md",
    "docs/agent-eye.md",
    "docs/agent-destination.md",
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
    ".github/workflows/publish-agent-book.yaml",
]


def fail(message: str) -> None:
    print(f"FAIL: {message}", file=sys.stderr)
    sys.exit(1)


def require_text(content: str, required: list[str], label: str) -> None:
    for text in required:
        if text not in content:
            fail(f"{label} missing required text: {text}")


def main() -> None:
    if not MANIFEST.exists():
        fail("missing platform gate manifest")
    if not CORE_DOCTRINE.exists():
        fail("missing platform core doctrine")
    if not AGENT_BOOK.exists():
        fail("missing Agent Book index")
    if not BOOK_SITE.exists():
        fail("missing Agent Book site")
    if not BOOK_PUBLISH_WORKFLOW.exists():
        fail("missing Agent Book publish workflow")
    if not CORTEX.exists():
        fail("missing Cortex document")
    if not AGENT_EYE.exists():
        fail("missing Agent Eye document")
    if not AGENT_DESTINATION.exists():
        fail("missing Agent Destination document")

    require_text(MANIFEST.read_text(), REQUIRED_TEXT, "platform gate")
    require_text(CORE_DOCTRINE.read_text(), REQUIRED_CORE_DOCTRINE_TEXT, "core doctrine")
    require_text(AGENT_BOOK.read_text(), REQUIRED_BOOK_TEXT, "Agent Book")
    require_text(BOOK_SITE.read_text(), REQUIRED_SITE_TEXT, "Agent Book site")
    require_text(BOOK_PUBLISH_WORKFLOW.read_text(), REQUIRED_PUBLISH_WORKFLOW_TEXT, "Agent Book publish workflow")
    require_text(CORTEX.read_text(), REQUIRED_CORTEX_TEXT, "Cortex")
    require_text(AGENT_EYE.read_text(), REQUIRED_AGENT_EYE_TEXT, "Agent Eye")
    require_text(AGENT_DESTINATION.read_text(), REQUIRED_AGENT_DESTINATION_TEXT, "Agent Destination")

    for file_name in REQUIRED_FILES:
        if not (ROOT / file_name).exists():
            fail(f"platform gate required file missing: {file_name}")

    print("OK: platform gate, Agent Book, Cortex, Agent Eye, Agent Destination, and publish path are enforceable")


if __name__ == "__main__":
    main()
