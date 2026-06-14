#[derive(Debug, Clone, PartialEq, Eq)]
pub enum StreamEventKind {
    IntentDeclared,
    PlatformGateChecked,
    ProvenanceGateChecked,
    MetaKubeValidated,
    ArtifactBuilt,
    ReleaseBlocked,
    ReleaseReadyForReview,
    RepairLoopOpened,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct StreamEvent {
    pub sequence: u64,
    pub kind: StreamEventKind,
    pub subject: String,
    pub evidence: String,
}

impl StreamEvent {
    pub fn line(&self) -> String {
        format!(
            "seq={} kind={:?} subject={} evidence={}",
            self.sequence, self.kind, self.subject, self.evidence
        )
    }
}

pub fn fabricore_release_stream() -> Vec<StreamEvent> {
    vec![
        StreamEvent {
            sequence: 1,
            kind: StreamEventKind::IntentDeclared,
            subject: "fabricore-v0.1.0".to_string(),
            evidence: "release-gates/fabricore-v0.1.0.md".to_string(),
        },
        StreamEvent {
            sequence: 2,
            kind: StreamEventKind::PlatformGateChecked,
            subject: "platform-gate".to_string(),
            evidence: "platform/gates/platform-gate.yaml".to_string(),
        },
        StreamEvent {
            sequence: 3,
            kind: StreamEventKind::ProvenanceGateChecked,
            subject: "provenance-gate".to_string(),
            evidence: "release-gates/fabricore-v0.1.0.provenance.json".to_string(),
        },
        StreamEvent {
            sequence: 4,
            kind: StreamEventKind::MetaKubeValidated,
            subject: "meta-kube:fabricore-v0.1.0".to_string(),
            evidence: "fabricore meta-kube validate".to_string(),
        },
        StreamEvent {
            sequence: 5,
            kind: StreamEventKind::ArtifactBuilt,
            subject: "fabricore-artifacts".to_string(),
            evidence: "dist/fabricore + dist/fabricore.jar + fabric.dmg".to_string(),
        },
        StreamEvent {
            sequence: 6,
            kind: StreamEventKind::ReleaseReadyForReview,
            subject: "release-authority".to_string(),
            evidence: "Chinmay Panda".to_string(),
        },
    ]
}

pub fn validate_stream(events: &[StreamEvent]) -> Result<(), String> {
    if events.is_empty() {
        return Err("stream must not be empty".into());
    }

    for (index, event) in events.iter().enumerate() {
        let expected_sequence = (index as u64) + 1;
        if event.sequence != expected_sequence {
            return Err(format!(
                "stream sequence must be contiguous: expected {}, got {}",
                expected_sequence, event.sequence
            ));
        }

        if event.subject.trim().is_empty() {
            return Err("stream event subject must not be empty".into());
        }

        if event.evidence.trim().is_empty() {
            return Err("stream event evidence must not be empty".into());
        }
    }

    Ok(())
}
