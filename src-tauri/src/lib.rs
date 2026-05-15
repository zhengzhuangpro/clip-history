mod clipboard;
mod commands;
mod db;

use tauri::Manager;

use db::db::DbState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let pool = db::db::init_pool(app.handle())?;
            app.manage(DbState(std::sync::Mutex::new(pool.clone())));

            clipboard::listener::start_clipboard_listener(app.handle().clone(), pool);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::history::get_history,
            commands::history::search_history,
            commands::history::copy_to_clipboard,
            commands::history::delete_history_item,
            commands::history::clear_history,
            commands::history::toggle_pin,
            commands::history::get_clip_item,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
