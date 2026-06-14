use serde::Deserialize;
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Deserialize, Clone)]
pub struct FabricCoreActions {
    pub version: String,
    #[serde(rename = "nativeRule")]
    pub native_rule: String,
    pub actions: Vec<FabricCoreAction>,
}

#[derive(Debug, Deserialize, Clone)]
pub struct FabricCoreAction {
    pub id: String,
    pub label: String,
    pub description: String,
    pub mode: String,
    pub script: String,
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

pub fn validate_actions(actions: &FabricCoreActions) -> Result<(), String> {
    if actions.native_rule != "apple-silicon-arm64-only" {
        return Err("Fabric Core actions must target apple-silicon-arm64-only".into());
    }

    for action in &actions.actions {
        if action.id.trim().is_empty() {
            return Err("Fabric Core action id must not be empty".into());
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
