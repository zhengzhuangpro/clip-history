use tauri::{AppHandle, Manager};
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};

use crate::db::db::DbPool;

fn parse_shortcut(s: &str) -> Option<Shortcut> {
    let parts: Vec<&str> = s.split('+').map(|p| p.trim()).collect();
    let mut modifiers = Modifiers::empty();
    let mut code = None;

    for part in &parts {
        match part.to_lowercase().as_str() {
            "alt" | "option" => modifiers |= Modifiers::ALT,
            "shift" => modifiers |= Modifiers::SHIFT,
            "ctrl" | "control" => modifiers |= Modifiers::CONTROL,
            "cmd" | "command" | "super" | "meta" => modifiers |= Modifiers::SUPER,
            key => {
                code = match key.to_uppercase().as_str() {
                    "A" => Some(Code::KeyA),
                    "B" => Some(Code::KeyB),
                    "C" => Some(Code::KeyC),
                    "D" => Some(Code::KeyD),
                    "E" => Some(Code::KeyE),
                    "F" => Some(Code::KeyF),
                    "G" => Some(Code::KeyG),
                    "H" => Some(Code::KeyH),
                    "I" => Some(Code::KeyI),
                    "J" => Some(Code::KeyJ),
                    "K" => Some(Code::KeyK),
                    "L" => Some(Code::KeyL),
                    "M" => Some(Code::KeyM),
                    "N" => Some(Code::KeyN),
                    "O" => Some(Code::KeyO),
                    "P" => Some(Code::KeyP),
                    "Q" => Some(Code::KeyQ),
                    "R" => Some(Code::KeyR),
                    "S" => Some(Code::KeyS),
                    "T" => Some(Code::KeyT),
                    "U" => Some(Code::KeyU),
                    "V" => Some(Code::KeyV),
                    "W" => Some(Code::KeyW),
                    "X" => Some(Code::KeyX),
                    "Y" => Some(Code::KeyY),
                    "Z" => Some(Code::KeyZ),
                    "0" => Some(Code::Digit0),
                    "1" => Some(Code::Digit1),
                    "2" => Some(Code::Digit2),
                    "3" => Some(Code::Digit3),
                    "4" => Some(Code::Digit4),
                    "5" => Some(Code::Digit5),
                    "6" => Some(Code::Digit6),
                    "7" => Some(Code::Digit7),
                    "8" => Some(Code::Digit8),
                    "9" => Some(Code::Digit9),
                    "SPACE" => Some(Code::Space),
                    "F1" => Some(Code::F1),
                    "F2" => Some(Code::F2),
                    "F3" => Some(Code::F3),
                    "F4" => Some(Code::F4),
                    "F5" => Some(Code::F5),
                    "F6" => Some(Code::F6),
                    "F7" => Some(Code::F7),
                    "F8" => Some(Code::F8),
                    "F9" => Some(Code::F9),
                    "F10" => Some(Code::F10),
                    "F11" => Some(Code::F11),
                    "F12" => Some(Code::F12),
                    _ => None,
                };
            }
        }
    }

    code.map(|c| Shortcut::new(Some(modifiers), c))
}

pub fn toggle_window(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        match window.is_visible() {
            Ok(true) => {
                let _ = window.hide();
            }
            Ok(false) => {
                let _ = window.show();
                let _ = window.set_focus();
            }
            Err(e) => {
                eprintln!("Failed to check window visibility: {e}");
            }
        }
    }
}

pub fn register_shortcut(app: &AppHandle, pool: &DbPool) -> Result<(), String> {
    let shortcut_str = crate::config::get_config_value(pool, "shortcut_show")?
        .unwrap_or_else(|| "Alt+Shift+V".to_string());

    let shortcut =
        parse_shortcut(&shortcut_str).ok_or_else(|| format!("Invalid shortcut: {shortcut_str}"))?;

    let app_handle = app.clone();
    app.global_shortcut()
        .on_shortcut(shortcut, move |_app, _shortcut, event| {
            if event.state == ShortcutState::Pressed {
                toggle_window(&app_handle);
            }
        })
        .map_err(|e| format!("Failed to register shortcut: {e}"))?;

    Ok(())
}

pub fn update_shortcut(app: &AppHandle, new_shortcut_str: &str) -> Result<(), String> {
    let shortcut = parse_shortcut(new_shortcut_str)
        .ok_or_else(|| format!("Invalid shortcut: {new_shortcut_str}"))?;

    app.global_shortcut()
        .unregister_all()
        .map_err(|e| format!("Failed to unregister shortcuts: {e}"))?;

    let app_handle = app.clone();
    app.global_shortcut()
        .on_shortcut(shortcut, move |_app, _shortcut, event| {
            if event.state == ShortcutState::Pressed {
                toggle_window(&app_handle);
            }
        })
        .map_err(|e| format!("Failed to register shortcut: {e}"))?;

    Ok(())
}

pub fn clear_shortcuts(app: &AppHandle) -> Result<(), String> {
    app.global_shortcut()
        .unregister_all()
        .map_err(|e| format!("Failed to unregister shortcuts: {e}"))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parse_alt_shift_v() {
        let s = parse_shortcut("Alt+Shift+V").unwrap();
        assert!(s.mods.contains(Modifiers::ALT));
        assert!(s.mods.contains(Modifiers::SHIFT));
        assert_eq!(s.key, Code::KeyV);
    }

    #[test]
    fn parse_ctrl_c() {
        let s = parse_shortcut("Ctrl+C").unwrap();
        assert!(s.mods.contains(Modifiers::CONTROL));
        assert_eq!(s.key, Code::KeyC);
    }

    #[test]
    fn parse_cmd_shift_a() {
        let s = parse_shortcut("Cmd+Shift+A").unwrap();
        assert!(s.mods.contains(Modifiers::SUPER));
        assert!(s.mods.contains(Modifiers::SHIFT));
        assert_eq!(s.key, Code::KeyA);
    }

    #[test]
    fn parse_case_insensitive() {
        let s1 = parse_shortcut("alt+shift+v").unwrap();
        let s2 = parse_shortcut("ALT+SHIFT+V").unwrap();
        assert_eq!(s1.key, s2.key);
        assert_eq!(s1.mods, s2.mods);
    }

    #[test]
    fn parse_option_alias() {
        let s = parse_shortcut("Option+V").unwrap();
        assert!(s.mods.contains(Modifiers::ALT));
    }

    #[test]
    fn parse_control_alias() {
        let s = parse_shortcut("Control+V").unwrap();
        assert!(s.mods.contains(Modifiers::CONTROL));
    }

    #[test]
    fn parse_command_alias() {
        let s = parse_shortcut("Command+V").unwrap();
        assert!(s.mods.contains(Modifiers::SUPER));
    }

    #[test]
    fn parse_super_alias() {
        let s = parse_shortcut("Super+V").unwrap();
        assert!(s.mods.contains(Modifiers::SUPER));
    }

    #[test]
    fn parse_meta_alias() {
        let s = parse_shortcut("Meta+V").unwrap();
        assert!(s.mods.contains(Modifiers::SUPER));
    }

    #[test]
    fn parse_digit_keys() {
        let s = parse_shortcut("Ctrl+0").unwrap();
        assert_eq!(s.key, Code::Digit0);

        let s = parse_shortcut("Ctrl+9").unwrap();
        assert_eq!(s.key, Code::Digit9);
    }

    #[test]
    fn parse_function_keys() {
        let s = parse_shortcut("Ctrl+F1").unwrap();
        assert_eq!(s.key, Code::F1);

        let s = parse_shortcut("Ctrl+F12").unwrap();
        assert_eq!(s.key, Code::F12);
    }

    #[test]
    fn parse_space() {
        let s = parse_shortcut("Ctrl+Space").unwrap();
        assert_eq!(s.key, Code::Space);
    }

    #[test]
    fn parse_invalid_key_returns_none() {
        assert!(parse_shortcut("Alt+Qwerty").is_none());
    }

    #[test]
    fn parse_single_modifier() {
        let s = parse_shortcut("Ctrl+V").unwrap();
        assert!(s.mods.contains(Modifiers::CONTROL));
        assert_eq!(s.key, Code::KeyV);
    }
}

