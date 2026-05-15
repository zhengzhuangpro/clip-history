use arboard::Clipboard;
use image::{imageops::FilterType, DynamicImage, ImageFormat};
use sha2::{Digest, Sha256};
use std::io::Cursor;
use std::sync::atomic::{AtomicBool, Ordering};
use std::thread;
use std::time::Duration;
use tauri::{AppHandle, Emitter};

use crate::db::db::{get_latest_hash, insert_clip_item, DbPool};
use crate::db::models::ClipItem;

static SKIP_NEXT: AtomicBool = AtomicBool::new(false);

const MAX_IMAGE_SIZE: u32 = 2048;
const THUMBNAIL_SIZE: u32 = 200;

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

            if SKIP_NEXT.swap(false, Ordering::SeqCst) {
                update_last_hash(&mut clipboard, &mut last_hash);
                continue;
            }

            if let Some(item) = read_clipboard(&mut clipboard, &last_hash) {
                let hash = item.content_hash.clone();
                last_hash = Some(hash);

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
        }
    });
}

fn update_last_hash(clipboard: &mut Clipboard, last_hash: &mut Option<String>) {
    if let Ok(t) = clipboard.get_text() {
        if !t.is_empty() {
            *last_hash = Some(compute_hash(t.as_bytes()));
            return;
        }
    }
    if let Ok(img) = clipboard.get_image() {
        if !img.bytes.is_empty() {
            *last_hash = Some(compute_hash(&img.bytes));
        }
    }
}

fn read_clipboard(clipboard: &mut Clipboard, last_hash: &Option<String>) -> Option<ClipItem> {
    // Try text first
    if let Ok(text) = clipboard.get_text() {
        if !text.is_empty() {
            let hash = compute_hash(text.as_bytes());
            if last_hash.as_ref() == Some(&hash) {
                return None;
            }
            let now = chrono::Utc::now().to_rfc3339();
            return Some(ClipItem {
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
            });
        }
    }

    // Try image
    if let Ok(img_data) = clipboard.get_image() {
        if img_data.bytes.is_empty() {
            return None;
        }
        let hash = compute_hash(&img_data.bytes);
        if last_hash.as_ref() == Some(&hash) {
            return None;
        }

        let width = img_data.width as u32;
        let height = img_data.height as u32;

        let rgba_bytes: Vec<u8> = img_data.bytes.iter().copied().collect();
        let img = match image::RgbaImage::from_raw(width, height, rgba_bytes) {
            Some(img) => img,
            None => {
                eprintln!("Failed to create image from clipboard data");
                return None;
            }
        };

        // Resize if too large
        let dynamic = DynamicImage::ImageRgba8(img);
        let resized = if width > MAX_IMAGE_SIZE || height > MAX_IMAGE_SIZE {
            dynamic.resize(MAX_IMAGE_SIZE, MAX_IMAGE_SIZE, FilterType::Lanczos3)
        } else {
            dynamic
        };

        // Generate thumbnail
        let thumbnail = resized.thumbnail(THUMBNAIL_SIZE, THUMBNAIL_SIZE);

        let blob = encode_png(&resized.to_rgba8());
        let thumb_blob = encode_png(&thumbnail.to_rgba8());

        let now = chrono::Utc::now().to_rfc3339();
        return Some(ClipItem {
            id: 0,
            content_type: "image".to_string(),
            text_content: None,
            image_blob: Some(blob),
            thumbnail: Some(thumb_blob),
            image_width: Some(resized.width() as i64),
            image_height: Some(resized.height() as i64),
            image_format: Some("png".to_string()),
            source_app: None,
            content_hash: hash,
            is_pinned: false,
            created_at: now.clone(),
            updated_at: now,
        });
    }

    None
}

fn encode_png(img: &image::RgbaImage) -> Vec<u8> {
    let mut buf = Cursor::new(Vec::new());
    img.write_to(&mut buf, ImageFormat::Png)
        .expect("Failed to encode PNG");
    buf.into_inner()
}

fn compute_hash(data: &[u8]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(data);
    format!("{:x}", hasher.finalize())
}
