use arboard::Clipboard;
use sha2::{Digest, Sha256};
use std::sync::atomic::{AtomicBool, Ordering};
use std::thread;
use std::time::Duration;
use tauri::{AppHandle, Emitter};

use crate::db::db::{get_latest_hash, insert_clip_item, DbPool};
use crate::db::models::ClipItem;

static SKIP_NEXT: AtomicBool = AtomicBool::new(false);

pub fn skip_next_clipboard_change() {
    SKIP_NEXT.store(true, Ordering::SeqCst);
}

pub fn start_clipboard_listener(app: AppHandle, pool: DbPool) {
    println!("Starting clipboard listener...");
    thread::spawn(move || {
        let mut last_hash: Option<String> = None;
        let mut clipboard = match Clipboard::new() {
            Ok(cb) => cb,
            Err(e) => {
                eprintln!("Failed to initialize clipboard: {e}");
                return;
            }
        };

        if let Ok(hash) = get_latest_hash(&pool) {
            last_hash = hash;
        }

        loop {
            thread::sleep(Duration::from_millis(200));

            // Skip if we just programmatically set the clipboard
            if SKIP_NEXT.swap(false, Ordering::SeqCst) {
                // Read the current clipboard to update last_hash
                if let Ok(t) = clipboard.get_text() {
                    if !t.is_empty() {
                        last_hash = Some(compute_hash(&t));
                    }
                }
                continue;
            }

            let text = match clipboard.get_text() {
                Ok(t) if !t.is_empty() => t,
                _ => continue,
            };

            let hash = compute_hash(&text);

            if last_hash.as_ref() == Some(&hash) {
                continue;
            }

            last_hash = Some(hash.clone());

            let now = chrono::Utc::now().to_rfc3339();
            let item = ClipItem {
                id: 0,
                content_type: "text".to_string(),
                text_content: Some(text),
                image_blob: None,
                thumbnail: None,
                image_width: None,
                image_height: None,
                image_format: None,
                source_app: None,
                content_hash: hash,
                is_pinned: false,
                created_at: now.clone(),
                updated_at: now,
            };

            match insert_clip_item(&pool, &item) {
                Ok(id) => {
                    println!("New clipboard item saved: id={id}");
                    let _ = app.emit("clipboard-new", id);
                }
                Err(e) => {
                    eprintln!("Failed to insert clip item: {e}");
                }
            }
        }
    });
}

fn compute_hash(content: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(content.as_bytes());
    format!("{:x}", hasher.finalize())
}
