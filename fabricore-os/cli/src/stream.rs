#[derive(Debug, Clone, PartialEq, Eq)]
pub enum StormEventKind {
    IntentDeclared,
    PlatformGateChecked,
    ProvenanceGateChecked,
    MetaKubeValidated,
    MultivariateSignalEvaluated,
    ArtifactBuilt,
    ReleaseBlocked,
    ReleaseReadyForReview,
    RepairLoopOpened,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct StormVariables {
    pub tenant_id: String,
    pub workspace_id: String,
    pub environment: String,
    pub policy_result: String,
    pub provenance_result: String,
    pub path_result: String,
    pub artifact_result: String,
    pub authority_result: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct StormEvent {
    pub sequence: u64,
    pub kind: StormEventKind,
    pub subject: String,
    pub evidence: String,
    pub variables: StormVariables,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Superstorm {
    pub id: String,
    pub tenant_id: String,
    pub workspace_id: String,
    pub environment: String,
    pub paths: Vec<String>,
    pub modalities: Vec<String>,
    pub variables: Vec<String>,
    pub events: Vec<StormEvent>,
}

impl StormVariables {
    pub fn fabricore_default(path_result: &str, artifact_result: &str, authority_result: &str) -> Self {
        Self {
            tenant_id: "default".to_string(),
            workspace_id: "release".to_string(),
            environment: "pr-gate".to_string(),
            policy_result: "PASS".to_string(),
            provenance_result: "PASS".to_string(),
            path_result: path_result.to_string(),
            artifact_result: artifact_result.to_string(),
            authority_result: authority_result.to_string(),
        }
    }
}

impl StormEvent {
    pub fn line(&self) -> String {
        format!(
            "storm seq={} kind={:?} subject={} tenant={} workspace={} environment={} policy={} provenance={} path={} artifact={} authority={} evidence={}",
            self.sequence,
            self.kind,
            self.subject,
            self.variables.tenant_id,
            self.variables.workspace_id,
            self.variables.environment,
            self.variables.policy_result,
            self.variables.provenance_result,
            self.variables.path_result,
            self.variables.artifact_result,
            self.variables.authority_result,
            self.evidence
        )
    }
}

impl Superstorm {
    pub fn line(&self) -> String {
        format!(
            "superstorm id={} tenant={} workspace={} environment={} paths={} modalities={} variables={} events={}",
            self.id,
            self.tenant_id,
            self.workspace_id,
            self.environment,
            self.paths.join(","),
            self.modalities.join(","),
            self.variables.join(","),
            self.events.len()
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
            variables: StormVariables::fabricore_default("DECLARED", "PENDING", "PENDING"),
        },
        StormEvent {
            sequence: 2,
            kind: StormEventKind::PlatformGateChecked,
            subject: "platform-gate".to_string(),
            evidence: "platform/gates/platform-gate.yaml".to_string(),
            variables: StormVariables::fabricore_default("PASS", "PENDING", "PENDING"),
        },
        StormEvent {
            sequence: 3,
            kind: StormEventKind::ProvenanceGateChecked,
            subject: "provenance-gate".to_string(),
            evidence: "release-gates/fabricore-v0.1.0.provenance.json".to_string(),
            variables: StormVariables::fabricore_default("PASS", "PENDING", "PENDING"),
        },
        StormEvent {
            sequence: 4,
            kind: StormEventKind::MetaKubeValidated,
            subject: "meta-kube:fabricore-v0.1.0".to_string(),
            evidence: "fabricore meta-kube validate".to_string(),
            variables: StormVariables::fabricore_default("PASS", "PENDING", "PENDING"),
        },
        StormEvent {
            sequence: 5,
            kind: StormEventKind::MultivariateSignalEvaluated,
            subject: "multivariate-release-vector".to_string(),
            evidence: "tenant + workspace + policy + provenance + path + artifact + authority".to_string(),
            variables: StormVariables::fabricore_default("PASS", "PENDING", "REVIEW"),
        },
        StormEvent {
            sequence: 6,
            kind: StormEventKind::ArtifactBuilt,
            subject: "fabricore-artifacts".to_string(),
            evidence: "dist/fabricore + dist/fabricore.jar + fabric.dmg".to_string(),
            variables: StormVariables::fabricore_default("PASS", "PASS", "REVIEW"),
        },
        StormEvent {
            sequence: 7,
            kind: StormEventKind::ReleaseReadyForReview,
            subject: "release-authority".to_string(),
            evidence: "Chinmay Panda".to_string(),
            variables: StormVariables::fabricore_default("PASS", "PASS", "REVIEW"),
        },
    ]
}

pub fn fabricore_release_superstorm() -> Superstorm {
    Superstorm {
        id: "superstorm:fabricore-v0.1.0".to_string(),
        tenant_id: "default".to_string(),
        workspace_id: "release".to_string(),
        environment: "pr-gate".to_string(),
        paths: vec![
            "platform-doctrine-path".into(),
            "provenance-path".into(),
            "rust-meta-kube-path".into(),
            "storm-evidence-path".into(),
            "java-artifact-path".into(),
            "mac-dmg-path".into(),
            "release-handover-path".into(),
        ],
        modalities: vec!["text".into(), "code".into(), "artifact".into(), "workflow".into(), "metric".into()],
        variables: vec![
            "tenant_id".into(),
            "workspace_id".into(),
            "environment".into(),
            "policy_result".into(),
            "provenance_result".into(),
            "path_result".into(),
            "artifact_result".into(),
            "authority_result".into(),
        ],
        events: fabricore_release_storm(),
    }
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

        validate_variables(&event.variables)?;
    }

    Ok(())
}

pub fn validate_superstorm(superstorm: &Superstorm) -> Result<(), String> {
    if superstorm.id.trim().is_empty() {
        return Err("superstorm id must not be empty".into());
    }
    if superstorm.tenant_id.trim().is_empty() || superstorm.workspace_id.trim().is_empty() {
        return Err("superstorm must be tenant and workspace scoped".into());
    }
    if superstorm.paths.len() < 3 {
        return Err("superstorm must contain multiple governed paths".into());
    }
    if superstorm.modalities.len() < 3 {
        return Err("superstorm must contain multiple modalities".into());
    }
    if superstorm.variables.len() < 6 {
        return Err("superstorm must contain multivariate signals".into());
    }
    validate_storm(&superstorm.events)?;
    Ok(())
}

fn validate_variables(variables: &StormVariables) -> Result<(), String> {
    if variables.tenant_id.trim().is_empty() {
        return Err("storm variable tenant_id must not be empty".into());
    }
    if variables.workspace_id.trim().is_empty() {
        return Err("storm variable workspace_id must not be empty".into());
    }
    if variables.environment.trim().is_empty() {
        return Err("storm variable environment must not be empty".into());
    }
    if variables.policy_result != "PASS" {
        return Err("storm policy_result must be PASS for release path".into());
    }
    if variables.provenance_result != "PASS" {
        return Err("storm provenance_result must be PASS for release path".into());
    }

    Ok(())
}
