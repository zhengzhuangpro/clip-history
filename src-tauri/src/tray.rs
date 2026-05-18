use tauri::{
    menu::{Menu, MenuBuilder, MenuItem, PredefinedMenuItem, SubmenuBuilder},
    tray::{MouseButton, MouseButtonState, TrayIcon, TrayIconBuilder, TrayIconEvent},
    Manager,
};

use crate::db::DbState;

fn is_english(app: &tauri::AppHandle) -> bool {
    let state = app.state::<DbState>();
    if let Ok(pool) = state.0.lock() {
        if let Ok(Some(lang)) = crate::config::get_config_value(&pool, "language") {
            if lang == "en" {
                return true;
            }
            if lang == "system" {
                // Fallback: check system locale
                if let Ok(locale) = std::env::var("LANG") {
                    return !locale.starts_with("zh");
                }
                return false;
            }
        }
    }
    false
}

pub struct TrayState(pub TrayIcon);

pub fn create_tray(app: &tauri::App) -> Result<TrayIcon, Box<dyn std::error::Error>> {
    let en = is_english(app.handle());
    let show_label = if en { "Show Clip History" } else { "显示剪贴板历史" };
    let quit_label = if en { "Quit" } else { "退出" };

    let show_item = MenuItem::with_id(app, "show", show_label, true, None::<&str>)?;
    let quit_item = MenuItem::with_id(app, "quit", quit_label, true, None::<&str>)?;

    let menu = Menu::with_items(
        app,
        &[
            &show_item,
            &PredefinedMenuItem::separator(app)?,
            &quit_item,
        ],
    )?;

    let tray = TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .tooltip("Clip History")
        .menu(&menu)
        .on_menu_event(|app, event| {
            let id = event.id.as_ref();
            if id == "show" {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            } else if id == "quit" {
                app.exit(0);
            } else if let Some(item_id) = id.strip_prefix("copy:") {
                if let Ok(item_id) = item_id.parse::<i64>() {
                    copy_item_from_tray(app, item_id);
                }
            } else if let Some(item_id) = id.strip_prefix("pin:") {
                if let Ok(item_id) = item_id.parse::<i64>() {
                    toggle_pin_from_tray(app, item_id);
                }
            }
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                let app = tray.app_handle();
                crate::shortcut::toggle_window(app);
            }
        })
        .build(app)?;

    Ok(tray)
}

pub fn rebuild_tray_menu(app: &tauri::AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let en = is_english(app);

    let state = app.state::<DbState>();
    let pool = state.0.lock().map_err(|e| format!("Lock error: {e}"))?;
    let items = crate::db::get_history(&pool, 10, 0)?;
    drop(pool);

    let mut menu_items: Vec<Box<dyn tauri::menu::IsMenuItem<tauri::Wry>>> = Vec::new();

    for item in &items {
        let label = if item.content_type == "image" {
            if en { "[Image]" } else { "[图片]" }.to_string()
        } else {
            let text = item.text_content.as_deref().unwrap_or("");
            truncate_text(text, 20)
        };

        let label = if item.is_pinned {
            format!("\u{1F4CC} {label}")
        } else {
            label
        };

        let menu_item =
            MenuItem::with_id(app, format!("copy:{}", item.id), label, true, None::<&str>)?;
        menu_items.push(Box::new(menu_item));
    }

    if !items.is_empty() {
        menu_items.push(Box::new(PredefinedMenuItem::separator(app)?));
    }

    let show_label = if en { "Show Clip History" } else { "显示剪贴板历史" };
    let quit_label = if en { "Quit" } else { "退出" };

    let show_item = MenuItem::with_id(app, "show", show_label, true, None::<&str>)?;
    let quit_item = MenuItem::with_id(app, "quit", quit_label, true, None::<&str>)?;
    menu_items.push(Box::new(show_item));
    menu_items.push(Box::new(PredefinedMenuItem::separator(app)?));
    menu_items.push(Box::new(quit_item));

    let refs: Vec<&dyn tauri::menu::IsMenuItem<tauri::Wry>> =
        menu_items.iter().map(|b| b.as_ref()).collect();
    let menu = Menu::with_items(app, &refs)?;

    let tray_state = app.state::<TrayState>();
    tray_state.0.set_menu(Some(menu))?;

    Ok(())
}

fn copy_item_from_tray(app: &tauri::AppHandle, id: i64) {
    let state = app.state::<DbState>();
    let pool = match state.0.lock() {
        Ok(pool) => pool,
        Err(e) => {
            eprintln!("Tray copy: lock error: {e}");
            return;
        }
    };

    let item = match crate::db::get_clip_item_by_id(&pool, id) {
        Ok(Some(item)) => item,
        Ok(None) => {
            eprintln!("Tray copy: item {id} not found");
            return;
        }
        Err(e) => {
            eprintln!("Tray copy: db error: {e}");
            return;
        }
    };

    let mut clipboard = match arboard::Clipboard::new() {
        Ok(cb) => cb,
        Err(e) => {
            eprintln!("Tray copy: clipboard error: {e}");
            return;
        }
    };

    crate::clipboard::listener::skip_next_clipboard_change();

    match item.content_type.as_str() {
        "text" => {
            if let Some(text) = item.text_content {
                let _ = clipboard.set_text(&text);
            }
        }
        "image" => {
            if let Some(blob) = item.image_blob {
                if let Ok(img) = image::load_from_memory(&blob) {
                    let rgba = img.to_rgba8();
                    let (w, h) = rgba.dimensions();
                    let img_data = arboard::ImageData {
                        width: w as usize,
                        height: h as usize,
                        bytes: std::borrow::Cow::Owned(rgba.into_raw()),
                    };
                    let _ = clipboard.set_image(img_data);
                }
            }
        }
        _ => {}
    }
}

fn toggle_pin_from_tray(app: &tauri::AppHandle, id: i64) {
    let state = app.state::<DbState>();
    let pool = match state.0.lock() {
        Ok(pool) => pool,
        Err(e) => {
            eprintln!("Tray pin: lock error: {e}");
            return;
        }
    };

    if let Err(e) = crate::db::toggle_pin(&pool, id) {
        eprintln!("Tray pin: error: {e}");
        return;
    }

    drop(pool);

    if let Err(e) = rebuild_tray_menu(app) {
        eprintln!("Tray pin: rebuild error: {e}");
    }
}

fn truncate_text(text: &str, max_len: usize) -> String {
    let cleaned: String = text
        .chars()
        .map(|c| if c.is_control() { ' ' } else { c })
        .collect();
    let trimmed = cleaned.trim();
    if trimmed.chars().count() <= max_len {
        trimmed.to_string()
    } else {
        let truncated: String = trimmed.chars().take(max_len).collect();
        format!("{truncated}...")
    }
}

pub fn build_app_menu(app: &tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    // 只在 macOS 上显示应用菜单，Windows 上禁用
    #[cfg(target_os = "macos")]
    {
        let app_menu = SubmenuBuilder::new(app, "Clip History")
            .item(&PredefinedMenuItem::about(app, None, None)?)
            .separator()
            .item(&PredefinedMenuItem::hide(app, None)?)
            .item(&PredefinedMenuItem::hide_others(app, None)?)
            .item(&PredefinedMenuItem::show_all(app, None)?)
            .separator()
            .item(&PredefinedMenuItem::quit(app, None)?)
            .build()?;

        let edit_menu = SubmenuBuilder::new(app, "Edit")
            .item(&PredefinedMenuItem::undo(app, None)?)
            .item(&PredefinedMenuItem::redo(app, None)?)
            .separator()
            .item(&PredefinedMenuItem::cut(app, None)?)
            .item(&PredefinedMenuItem::copy(app, None)?)
            .item(&PredefinedMenuItem::paste(app, None)?)
            .item(&PredefinedMenuItem::select_all(app, None)?)
            .build()?;

        let menu = MenuBuilder::new(app)
            .item(&app_menu)
            .item(&edit_menu)
            .build()?;

        app.set_menu(menu)?;
    }

    Ok(())
}
