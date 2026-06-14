#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod actions;

#[tauri::command]
fn list_fabric_core_actions() -> Result<actions::FabricCoreActions, String> {
    actions::load_actions()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![list_fabric_core_actions])
        .run(tauri::generate_context!())
        .expect("error while running Fabric Mac Core");
}
