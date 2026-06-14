mod meta_kube;

use std::env;
use std::path::{Path, PathBuf};
use std::process::{Command, ExitCode};

fn main() -> ExitCode {
    match run() {
        Ok(()) => ExitCode::SUCCESS,
        Err(error) => {
            eprintln!("FAIL: {error}");
            ExitCode::FAILURE
        }
    }
}

fn run() -> Result<(), String> {
    let args: Vec<String> = env::args().skip(1).collect();
    let command = args.first().map(String::as_str).unwrap_or("help");
    let subcommand = args.get(1).map(String::as_str).unwrap_or("");
    let root = repo_root()?;

    match command {
        "check" => run_script(&root, "fabric-core/scripts/headless.sh", &["check"]),
        "status" => run_script(&root, "fabric-core/scripts/headless.sh", &["status"]),
        "prove" => run_script(&root, "fabric-core/scripts/headless.sh", &["prove"]),
        "meta-kube" if subcommand == "validate" => validate_meta_kube(),
        "build" if subcommand == "dmg" => run_script(&root, "fabricore-os/build-fabric-dmg.sh", &[]),
        "services" if subcommand == "start" => run_script(&root, "fabric-core/scripts/start-local-services.sh", &[]),
        "help" | "--help" | "-h" => {
            usage();
            Ok(())
        }
        _ => {
            usage();
            Err(format!("unsupported command: {} {}", command, subcommand).trim().to_string())
        }
    }
}

fn validate_meta_kube() -> Result<(), String> {
    let meta_kube = meta_kube::MetaKube::fabricore_release_gate();
    meta_kube.validate()?;
    println!("OK: Meta Kube is valid");
    println!("id={}", meta_kube.id);
    println!("owner={}", meta_kube.owner);
    println!("release_gate={}", meta_kube.contract.release_gate);
    Ok(())
}

fn run_script(root: &Path, script: &str, args: &[&str]) -> Result<(), String> {
    if script.starts_with('/') || script.contains("..") || !script.ends_with(".sh") {
        return Err(format!("unsafe script path: {script}"));
    }

    let script_path = root.join(script);
    if !script_path.exists() {
        return Err(format!("script not found: {}", script_path.display()));
    }

    let status = Command::new("/bin/bash")
        .arg(script_path)
        .args(args)
        .current_dir(root)
        .env_clear()
        .env("PATH", "/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin")
        .status()
        .map_err(|error| format!("failed to run {script}: {error}"))?;

    if !status.success() {
        return Err(format!("script failed: {script}"));
    }

    Ok(())
}

fn repo_root() -> Result<PathBuf, String> {
    if let Ok(value) = env::var("FABRICORE_ROOT") {
        let root = PathBuf::from(value);
        if root.join("fabric-core/scripts/headless.sh").exists() {
            return Ok(root);
        }
    }

    let current = env::current_dir().map_err(|error| format!("cannot resolve current directory: {error}"))?;
    let mut candidate = Some(current.as_path());

    while let Some(path) = candidate {
        if path.join("fabric-core/scripts/headless.sh").exists() {
            return Ok(path.to_path_buf());
        }
        candidate = path.parent();
    }

    Err("cannot locate repo root; set FABRICORE_ROOT".into())
}

fn usage() {
    println!(r#"Fabricore OS

Usage:
  fabricore check
  fabricore status
  fabricore prove
  fabricore meta-kube validate
  fabricore build dmg
  fabricore services start

Default commands are non-mutating. Service start is explicit opt-in.
"#);
}
