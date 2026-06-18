#[derive(Debug, Clone, PartialEq, Eq)]
pub struct MetaKube {
    pub id: String,
    pub owner: String,
    pub tenant: String,
    pub workspace: String,
    pub contract: MetaKubeContract,
    pub provenance: MetaKubeProvenance,
    pub lifecycle: MetaKubeLifecycle,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct MetaKubeContract {
    pub allowed_actions: Vec<String>,
    pub forbidden_actions: Vec<String>,
    pub source_of_truth: String,
    pub release_gate: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct MetaKubeProvenance {
    pub repository: String,
    pub workflow: String,
    pub release_authority: String,
    pub artifact_targets: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum MetaKubeLifecycle {
    Declared,
    Verified,
    Reconciled,
    Released,
    Blocked,
    Repairing,
}

impl MetaKube {
    pub fn fabricore_release_gate() -> Self {
        Self {
            id: "meta-kube:fabricore-v0.1.0".to_string(),
            owner: "Chinmay Panda".to_string(),
            tenant: "default".to_string(),
            workspace: "release".to_string(),
            contract: MetaKubeContract {
                allowed_actions: vec!["check".into(), "status".into(), "prove".into()],
                forbidden_actions: vec!["arbitrary-shell".into(), "hidden-mutation".into(), "ungated-release".into()],
                source_of_truth: "SurrealDB / GitHub provenance gate".to_string(),
                release_gate: "Issue #2".to_string(),
            },
            provenance: MetaKubeProvenance {
                repository: "unboxd-cloud/Agent-As-Data".to_string(),
                workflow: ".github/workflows/fabricore-release-flow.yaml".to_string(),
                release_authority: "Chinmay Panda".to_string(),
                artifact_targets: vec![
                    "dist/fabricore.jar".into(),
                    "dist/fabricore.jar.sha256".into(),
                    "fabric.dmg".into(),
                    "fabric.dmg.sha256".into(),
                ],
            },
            lifecycle: MetaKubeLifecycle::Declared,
        }
    }

    pub fn validate(&self) -> Result<(), String> {
        if self.owner != "Chinmay Panda" {
            return Err("Meta Kube owner must be Chinmay Panda".into());
        }

        if !self.contract.allowed_actions.iter().any(|action| action == "check")
            || !self.contract.allowed_actions.iter().any(|action| action == "status")
            || !self.contract.allowed_actions.iter().any(|action| action == "prove")
        {
            return Err("Meta Kube must allow only the default safe Fabricore actions".into());
        }

        if self.provenance.release_authority != "Chinmay Panda" {
            return Err("Meta Kube release authority must be Chinmay Panda".into());
        }

        if self.provenance.artifact_targets.len() != 4 {
            return Err("Meta Kube must declare four release artifacts".into());
        }

        Ok(())
    }
}
