#[derive(Debug, Clone, PartialEq, Eq)]
pub enum StormEventKind {
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
pub struct StormEvent {
    pub sequence: u64,
    pub kind: StormEventKind,
    pub subject: String,
    pub evidence: String,
}

impl StormEvent {
    pub fn line(&self) -> String {
        format!(
            "storm seq={} kind={:?} subject={} evidence={}",
            self.sequence, self.kind, self.subject, self.evidence
        )
    }
}

pub fn fabricore_release_storm() -> Vec<StormEvent> {
    vec![
        StormEvent {
            sequence: 1,
            kind: StormEventKind::IntentDeclared,
            subject: "fabricore-v0.1.0".to_string(),
            evidence: "release-gates/fabricore-v0.1.0.md".to_string(),
        },
        StormEvent {
            sequence: 2,
            kind: StormEventKind::PlatformGateChecked,
            subject: "platform-gate".to_string(),
            evidence: "platform/gates/platform-gate.yaml".to_string(),
        },
        StormEvent {
            sequence: 3,
            kind: StormEventKind::ProvenanceGateChecked,
            subject: "provenance-gate".to_string(),
            evidence: "release-gates/fabricore-v0.1.0.provenance.json".to_string(),
        },
        StormEvent {
            sequence: 4,
            kind: StormEventKind::MetaKubeValidated,
            subject: "meta-kube:fabricore-v0.1.0".to_string(),
            evidence: "fabricore meta-kube validate".to_string(),
        },
        StormEvent {
            sequence: 5,
            kind: StormEventKind::ArtifactBuilt,
            subject: "fabricore-artifacts".to_string(),
            evidence: "dist/fabricore + dist/fabricore.jar + fabric.dmg".to_string(),
        },
        StormEvent {
            sequence: 6,
            kind: StormEventKind::ReleaseReadyForReview,
            subject: "release-authority".to_string(),
            evidence: "Chinmay Panda".to_string(),
        },
    ]
}

pub fn validate_storm(events: &[StormEvent]) -> Result<(), String> {
    if events.is_empty() {
        return Err("storm must not be empty".into());
    }

    for (index, event) in events.iter().enumerate() {
        let expected_sequence = (index as u64) + 1;
        if event.sequence != expected_sequence {
            return Err(format!(
                "storm sequence must be contiguous: expected {}, got {}",
                expected_sequence, event.sequence
            ));
        }

        if event.subject.trim().is_empty() {
            return Err("storm event subject must not be empty".into());
        }

        if event.evidence.trim().is_empty() {
            return Err("storm event evidence must not be empty".into());
        }
    }

    Ok(())
}
