mod clipboard;
mod commands;
mod config;
mod db;
mod shortcut;
mod tray;

use tauri::Manager;
use tauri_plugin_autostart::ManagerExt;

use db::db::DbState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            None::<Vec<&str>>,
        ))
        .setup(|app| {
            let pool = db::db::init_pool(app.handle())?;
            app.manage(DbState(std::sync::Mutex::new(pool.clone())));

            // macOS native menu bar
            tray::build_app_menu(app)?;

            // System tray icon and menu
            tray::create_tray(app)?;

            // Register global shortcut from DB config
            {
                let state = app.state::<DbState>();
                let pool = state.0.lock().map_err(|e| format!("Lock error: {e}"))?;
                shortcut::register_shortcut(app.handle(), &pool)?;
            }

            // Auto-start based on DB config
            {
                let state = app.state::<DbState>();
                let pool = state.0.lock().map_err(|e| format!("Lock error: {e}"))?;
                let auto_start = config::get_config_value(&pool, "auto_start")?
                    .map(|v| v == "true")
                    .unwrap_or(true);
                if auto_start {
                    app.autolaunch().enable().ok();
                }
            }

            // Start clipboard listener
            clipboard::listener::start_clipboard_listener(app.handle().clone(), pool);

            Ok(())
        })
        .on_window_event(|window, event| match event {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                api.prevent_close();
                let _ = window.hide();
            }
            tauri::WindowEvent::Focused(focused) => {
                if !focused && window.label() == "main" {
                    let _ = window.hide();
                }
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![
            commands::history::get_history,
            commands::history::search_history,
            commands::history::copy_to_clipboard,
            commands::history::delete_history_item,
            commands::history::clear_history,
            commands::history::toggle_pin,
            commands::history::get_clip_item,
            commands::config::get_config,
            commands::config::set_config,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
