#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod actions;

#[tauri::command]
fn list_fabric_core_actions() -> Result<actions::FabricCoreActions, String> {
    actions::load_actions()
}

#[tauri::command]
fn execute_fabric_core_action(action_id: String) -> Result<actions::FabricCoreActionOutput, String> {
    actions::execute_action(action_id)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            list_fabric_core_actions,
            execute_fabric_core_action
        ])
        .run(tauri::generate_context!())
        .expect("error while running Fabric Mac Core");
}
