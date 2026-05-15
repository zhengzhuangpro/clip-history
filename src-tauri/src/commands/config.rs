use std::collections::HashMap;

use tauri::{AppHandle, State};

use crate::db::DbState;

#[tauri::command]
pub fn get_config(state: State<'_, DbState>) -> Result<HashMap<String, String>, String> {
    let pool = state.0.lock().map_err(|e| format!("Lock error: {e}"))?;
    let pairs = crate::config::get_all_config(&pool)?;
    Ok(pairs.into_iter().collect())
}

#[tauri::command]
pub fn set_config(state: State<'_, DbState>, key: String, value: String) -> Result<(), String> {
    let pool = state.0.lock().map_err(|e| format!("Lock error: {e}"))?;
    crate::config::set_config_value(&pool, &key, &value)
}

#[tauri::command]
pub fn update_shortcut(
    app: AppHandle,
    state: State<'_, DbState>,
    shortcut: String,
) -> Result<(), String> {
    crate::shortcut::update_shortcut(&app, &shortcut)?;
    let pool = state.0.lock().map_err(|e| format!("Lock error: {e}"))?;
    crate::config::set_config_value(&pool, "shortcut_show", &shortcut)
}

#[tauri::command]
pub fn clear_shortcuts(app: AppHandle) -> Result<(), String> {
    crate::shortcut::clear_shortcuts(&app)
}
