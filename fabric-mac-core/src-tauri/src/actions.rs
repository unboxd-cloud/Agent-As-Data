use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::process::Command;

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct FabricCoreActions {
    pub version: String,
    #[serde(rename = "nativeRule")]
    pub native_rule: String,
    pub actions: Vec<FabricCoreAction>,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct FabricCoreAction {
    pub id: String,
    pub label: String,
    pub description: String,
    pub mode: String,
    pub script: String,
}

#[derive(Debug, Serialize)]
pub struct FabricCoreActionOutput {
    pub action_id: String,
    pub status: String,
    pub stdout: String,
    pub stderr: String,
}

pub fn load_actions() -> Result<FabricCoreActions, String> {
    let actions_path = repo_root()?.join("fabric-core/actions.json");
    let raw = fs::read_to_string(&actions_path)
        .map_err(|error| format!("failed to read {}: {error}", actions_path.display()))?;

    let actions: FabricCoreActions = serde_json::from_str(&raw)
        .map_err(|error| format!("failed to parse {}: {error}", actions_path.display()))?;

    validate_actions(&actions)?;
    Ok(actions)
}

pub fn execute_action(action_id: String) -> Result<FabricCoreActionOutput, String> {
    if action_id.trim().is_empty() || action_id.contains('/') || action_id.contains("..") {
        return Err("invalid Fabric Core action id".into());
    }

    let root = repo_root()?;
    let actions = load_actions()?;
    let action = actions
        .actions
        .into_iter()
        .find(|candidate| candidate.id == action_id)
        .ok_or_else(|| format!("Fabric Core action not allowlisted: {action_id}"))?;

    let script_path = root.join(&action.script);
    if !script_path.starts_with(&root) {
        return Err(format!("action {} resolves outside repo root", action.id));
    }

    if !script_path.exists() {
        return Err(format!("action {} script not found: {}", action.id, script_path.display()));
    }

    let output = Command::new("/bin/bash")
        .arg(script_path)
        .current_dir(root)
        .output()
        .map_err(|error| format!("failed to execute action {}: {error}", action.id))?;

    Ok(FabricCoreActionOutput {
        action_id: action.id,
        status: if output.status.success() { "success".into() } else { "failed".into() },
        stdout: String::from_utf8_lossy(&output.stdout).to_string(),
        stderr: String::from_utf8_lossy(&output.stderr).to_string(),
    })
}

pub fn validate_actions(actions: &FabricCoreActions) -> Result<(), String> {
    if actions.native_rule != "apple-silicon-arm64-only" {
        return Err("Fabric Core actions must target apple-silicon-arm64-only".into());
    }

    for action in &actions.actions {
        if action.id.trim().is_empty() {
            return Err("Fabric Core action id must not be empty".into());
        }

        if action.id.contains('/') || action.id.contains("..") {
            return Err(format!("action {} has unsafe id", action.id));
        }

        if action.script.starts_with('/') || action.script.contains("..") {
            return Err(format!("action {} has unsafe script path", action.id));
        }

        if !action.script.ends_with(".sh") {
            return Err(format!("action {} must map to a shell script", action.id));
        }
    }

    Ok(())
}

fn repo_root() -> Result<PathBuf, String> {
    std::env::current_dir().map_err(|error| format!("failed to resolve current directory: {error}"))
}
