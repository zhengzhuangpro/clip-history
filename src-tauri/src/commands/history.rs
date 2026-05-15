use tauri::State;

use crate::db::db::DbState;
use crate::db::models::ClipItem;

#[tauri::command]
pub fn get_history(
    state: State<'_, DbState>,
    limit: Option<i64>,
    offset: Option<i64>,
) -> Result<Vec<ClipItem>, String> {
    let pool = state.0.lock().map_err(|e| format!("Lock error: {e}"))?;
    crate::db::db::get_history(&pool, limit.unwrap_or(100), offset.unwrap_or(0))
}

#[tauri::command]
pub fn search_history(
    state: State<'_, DbState>,
    query: String,
) -> Result<Vec<ClipItem>, String> {
    let pool = state.0.lock().map_err(|e| format!("Lock error: {e}"))?;
    crate::db::db::search_history(&pool, &query)
}

#[tauri::command]
pub fn copy_to_clipboard(
    state: State<'_, DbState>,
    id: i64,
) -> Result<(), String> {
    let pool = state.0.lock().map_err(|e| format!("Lock error: {e}"))?;

    let conn = pool.get().map_err(|e| format!("Failed to get db connection: {e}"))?;
    let item = conn
        .query_row(
            "SELECT id, content_type, text_content, image_blob, thumbnail, image_width, image_height, image_format, source_app, content_hash, is_pinned, created_at, updated_at
             FROM clipboard_history WHERE id = ?1",
            rusqlite::params![id],
            |row| {
                Ok(ClipItem {
                    id: row.get(0)?,
                    content_type: row.get(1)?,
                    text_content: row.get(2)?,
                    image_blob: row.get(3)?,
                    thumbnail: row.get(4)?,
                    image_width: row.get(5)?,
                    image_height: row.get(6)?,
                    image_format: row.get(7)?,
                    source_app: row.get(8)?,
                    content_hash: row.get(9)?,
                    is_pinned: row.get::<_, i32>(10)? != 0,
                    created_at: row.get(11)?,
                    updated_at: row.get(12)?,
                })
            },
        )
        .map_err(|e| format!("Item not found: {e}"))?;

    let mut clipboard = arboard::Clipboard::new()
        .map_err(|e| format!("Failed to access clipboard: {e}"))?;

    // Tell the listener to skip detecting this programmatic change
    crate::clipboard::listener::skip_next_clipboard_change();

    match item.content_type.as_str() {
        "text" => {
            let text = item.text_content.ok_or("No text content")?;
            clipboard.set_text(&text)
                .map_err(|e| format!("Failed to set clipboard text: {e}"))?;
        }
        "image" => {
            let blob = item.image_blob.ok_or("No image data")?;
            let img = image::load_from_memory(&blob)
                .map_err(|e| format!("Failed to load image: {e}"))?;
            let rgba = img.to_rgba8();
            let (w, h) = rgba.dimensions();
            let img_data = arboard::ImageData {
                width: w as usize,
                height: h as usize,
                bytes: std::borrow::Cow::Owned(rgba.into_raw()),
            };
            clipboard.set_image(img_data)
                .map_err(|e| format!("Failed to set clipboard image: {e}"))?;
        }
        _ => return Err(format!("Unknown content type: {}", item.content_type)),
    }

    Ok(())
}

#[tauri::command]
pub fn delete_history_item(
    state: State<'_, DbState>,
    id: i64,
) -> Result<(), String> {
    let pool = state.0.lock().map_err(|e| format!("Lock error: {e}"))?;
    crate::db::db::delete_item(&pool, id)
}

#[tauri::command]
pub fn clear_history(
    state: State<'_, DbState>,
) -> Result<(), String> {
    let pool = state.0.lock().map_err(|e| format!("Lock error: {e}"))?;
    crate::db::db::clear_history(&pool)
}

#[tauri::command]
pub fn toggle_pin(
    state: State<'_, DbState>,
    id: i64,
) -> Result<(), String> {
    let pool = state.0.lock().map_err(|e| format!("Lock error: {e}"))?;
    crate::db::db::toggle_pin(&pool, id)
}

#[tauri::command]
pub fn get_clip_item(
    state: State<'_, DbState>,
    id: i64,
) -> Result<Option<ClipItem>, String> {
    let pool = state.0.lock().map_err(|e| format!("Lock error: {e}"))?;
    crate::db::db::get_clip_item_by_id(&pool, id)
}
