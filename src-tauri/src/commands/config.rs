use std::collections::HashMap;

use tauri::State;

use crate::db::db::DbState;

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
