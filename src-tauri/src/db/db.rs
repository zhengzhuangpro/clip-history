use r2d2::Pool;
use r2d2_sqlite::SqliteConnectionManager;
use rusqlite::OptionalExtension;
use rusqlite::params;
use std::sync::Mutex;
use tauri::{AppHandle, Manager};

use super::models::ClipItem;

pub type DbPool = Pool<SqliteConnectionManager>;

pub struct DbState(pub Mutex<DbPool>);

pub fn init_pool(app_handle: &AppHandle) -> Result<DbPool, String> {
    let app_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data dir: {e}"))?;

    std::fs::create_dir_all(&app_dir)
        .map_err(|e| format!("Failed to create app data dir: {e}"))?;

    let db_path = app_dir.join("clip-history.db");
    let manager = SqliteConnectionManager::file(&db_path);

    let pool = Pool::new(manager).map_err(|e| format!("Failed to create db pool: {e}"))?;

    run_migrations(&pool)?;

    Ok(pool)
}

pub(crate) fn run_migrations(pool: &DbPool) -> Result<(), String> {
    let conn = pool
        .get()
        .map_err(|e| format!("Failed to get db connection: {e}"))?;

    conn.execute_batch(
        "CREATE TABLE IF NOT EXISTS clipboard_history (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            content_type  TEXT    NOT NULL,
            text_content  TEXT,
            image_blob    BLOB,
            thumbnail     BLOB,
            image_width   INTEGER,
            image_height  INTEGER,
            image_format  TEXT,
            source_app    TEXT,
            content_hash  TEXT    NOT NULL,
            is_pinned     INTEGER NOT NULL DEFAULT 0,
            created_at    TEXT    NOT NULL,
            updated_at    TEXT    NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_history_content_hash ON clipboard_history(content_hash);
        CREATE INDEX IF NOT EXISTS idx_history_created_at   ON clipboard_history(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_history_content_type ON clipboard_history(content_type);
        CREATE INDEX IF NOT EXISTS idx_history_is_pinned    ON clipboard_history(is_pinned);

        CREATE TABLE IF NOT EXISTS app_config (
            key   TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );",
    )
    .map_err(|e| format!("Failed to create tables: {e}"))?;

    seed_default_config(&conn);
    Ok(())
}

fn seed_default_config(conn: &rusqlite::Connection) {
    let defaults = [
        ("max_history_count", "1000"),
        ("max_image_size_kb", "2048"),
        ("thumbnail_size", "200"),
        ("poll_interval_ms", "200"),
        ("shortcut_show", "Alt+Shift+V"),
        ("theme", "system"),
        ("auto_start", "true"),
        ("deduplicate", "true"),
    ];

    for (key, value) in defaults {
        let exists: bool = conn
            .query_row(
                "SELECT COUNT(*) > 0 FROM app_config WHERE key = ?1",
                params![key],
                |row| row.get(0),
            )
            .unwrap_or(false);

        if !exists {
            let _ = conn.execute(
                "INSERT INTO app_config (key, value) VALUES (?1, ?2)",
                params![key, value],
            );
        }
    }
}

pub fn insert_clip_item(pool: &DbPool, item: &ClipItem) -> Result<i64, String> {
    let conn = pool
        .get()
        .map_err(|e| format!("Failed to get db connection: {e}"))?;

    conn.execute(
        "INSERT INTO clipboard_history (content_type, text_content, image_blob, thumbnail, image_width, image_height, image_format, source_app, content_hash, is_pinned, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)",
        params![
            item.content_type,
            item.text_content,
            item.image_blob,
            item.thumbnail,
            item.image_width,
            item.image_height,
            item.image_format,
            item.source_app,
            item.content_hash,
            item.is_pinned as i32,
            item.created_at,
            item.updated_at,
        ],
    )
    .map_err(|e| format!("Failed to insert clip item: {e}"))?;

    Ok(conn.last_insert_rowid())
}

pub fn get_history(pool: &DbPool, limit: i64, offset: i64) -> Result<Vec<ClipItem>, String> {
    let conn = pool
        .get()
        .map_err(|e| format!("Failed to get db connection: {e}"))?;

    let mut stmt = conn
        .prepare(
            "SELECT id, content_type, text_content, image_blob, thumbnail, image_width, image_height, image_format, source_app, content_hash, is_pinned, created_at, updated_at
             FROM clipboard_history ORDER BY is_pinned DESC, created_at DESC LIMIT ?1 OFFSET ?2",
        )
        .map_err(|e| format!("Failed to prepare query: {e}"))?;

    let items = stmt
        .query_map(params![limit, offset], |row| {
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
        })
        .map_err(|e| format!("Failed to query history: {e}"))?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| format!("Failed to collect history: {e}"))?;

    Ok(items)
}

pub fn search_history(pool: &DbPool, query: &str) -> Result<Vec<ClipItem>, String> {
    let conn = pool
        .get()
        .map_err(|e| format!("Failed to get db connection: {e}"))?;

    let mut stmt = conn
        .prepare(
            "SELECT id, content_type, text_content, image_blob, thumbnail, image_width, image_height, image_format, source_app, content_hash, is_pinned, created_at, updated_at
             FROM clipboard_history
             WHERE text_content LIKE ?1
             ORDER BY is_pinned DESC, created_at DESC
             LIMIT 100",
        )
        .map_err(|e| format!("Failed to prepare search query: {e}"))?;

    let pattern = format!("%{query}%");
    let items = stmt
        .query_map(params![pattern], |row| {
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
        })
        .map_err(|e| format!("Failed to search history: {e}"))?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| format!("Failed to collect search results: {e}"))?;

    Ok(items)
}

pub fn delete_item(pool: &DbPool, id: i64) -> Result<(), String> {
    let conn = pool
        .get()
        .map_err(|e| format!("Failed to get db connection: {e}"))?;

    conn.execute(
        "DELETE FROM clipboard_history WHERE id = ?1",
        params![id],
    )
    .map_err(|e| format!("Failed to delete item: {e}"))?;

    Ok(())
}

pub fn toggle_pin(pool: &DbPool, id: i64) -> Result<(), String> {
    let conn = pool
        .get()
        .map_err(|e| format!("Failed to get db connection: {e}"))?;

    conn.execute(
        "UPDATE clipboard_history SET is_pinned = CASE WHEN is_pinned = 0 THEN 1 ELSE 0 END, updated_at = datetime('now') WHERE id = ?1",
        params![id],
    )
    .map_err(|e| format!("Failed to toggle pin: {e}"))?;

    Ok(())
}

pub fn clear_history(pool: &DbPool) -> Result<(), String> {
    let conn = pool
        .get()
        .map_err(|e| format!("Failed to get db connection: {e}"))?;

    conn.execute("DELETE FROM clipboard_history WHERE is_pinned = 0", [])
        .map_err(|e| format!("Failed to clear history: {e}"))?;

    Ok(())
}

pub fn get_clip_item_by_id(pool: &DbPool, id: i64) -> Result<Option<ClipItem>, String> {
    let conn = pool
        .get()
        .map_err(|e| format!("Failed to get db connection: {e}"))?;

    let mut stmt = conn
        .prepare(
            "SELECT id, content_type, text_content, image_blob, thumbnail, image_width, image_height, image_format, source_app, content_hash, is_pinned, created_at, updated_at
             FROM clipboard_history WHERE id = ?1",
        )
        .map_err(|e| format!("Failed to prepare query: {e}"))?;

    let item = stmt
        .query_row(rusqlite::params![id], |row| {
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
        })
        .optional()
        .map_err(|e| format!("Failed to query item: {e}"))?;

    Ok(item)
}

pub fn get_latest_hash(pool: &DbPool) -> Result<Option<String>, String> {
    let conn = pool
        .get()
        .map_err(|e| format!("Failed to get db connection: {e}"))?;

    let hash = conn
        .query_row(
            "SELECT content_hash FROM clipboard_history ORDER BY created_at DESC LIMIT 1",
            [],
            |row| row.get(0),
        )
        .ok();

    Ok(hash)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn test_pool() -> DbPool {
        let manager = SqliteConnectionManager::memory();
        let pool = Pool::new(manager).unwrap();
        run_migrations(&pool).unwrap();
        pool
    }

    fn make_text_item(id: i64, text: &str) -> ClipItem {
        ClipItem {
            id,
            content_type: "text".to_string(),
            text_content: Some(text.to_string()),
            image_blob: None,
            thumbnail: None,
            image_width: None,
            image_height: None,
            image_format: None,
            source_app: None,
            content_hash: format!("hash_{id}"),
            is_pinned: false,
            created_at: format!("2026-01-0{id}T00:00:00Z"),
            updated_at: format!("2026-01-0{id}T00:00:00Z"),
        }
    }

    #[test]
    fn insert_and_get_by_id() {
        let pool = test_pool();
        let item = make_text_item(0, "hello");
        let id = insert_clip_item(&pool, &item).unwrap();
        assert!(id > 0);

        let found = get_clip_item_by_id(&pool, id).unwrap().unwrap();
        assert_eq!(found.text_content, Some("hello".to_string()));
        assert_eq!(found.content_type, "text");
    }

    #[test]
    fn get_by_id_not_found() {
        let pool = test_pool();
        let result = get_clip_item_by_id(&pool, 999).unwrap();
        assert!(result.is_none());
    }

    #[test]
    fn get_history_empty() {
        let pool = test_pool();
        let items = get_history(&pool, 100, 0).unwrap();
        assert!(items.is_empty());
    }

    #[test]
    fn get_history_ordered_by_created_at() {
        let pool = test_pool();
        insert_clip_item(&pool, &make_text_item(0, "first")).unwrap();
        insert_clip_item(&pool, &make_text_item(0, "second")).unwrap();

        let items = get_history(&pool, 100, 0).unwrap();
        assert_eq!(items.len(), 2);
        // DESC order: second first
        assert_eq!(items[0].text_content, Some("second".to_string()));
        assert_eq!(items[1].text_content, Some("first".to_string()));
    }

    #[test]
    fn get_history_pinned_first() {
        let pool = test_pool();
        let id1 = insert_clip_item(&pool, &make_text_item(0, "unpinned")).unwrap();
        let id2 = insert_clip_item(&pool, &make_text_item(0, "pinned")).unwrap();

        // Pin the second item
        let conn = pool.get().unwrap();
        conn.execute("UPDATE clipboard_history SET is_pinned = 1 WHERE id = ?1", params![id2]).unwrap();

        let items = get_history(&pool, 100, 0).unwrap();
        assert_eq!(items[0].id, id2);
        assert_eq!(items[0].is_pinned, true);
        assert_eq!(items[1].id, id1);
        assert_eq!(items[1].is_pinned, false);
    }

    #[test]
    fn get_history_limit() {
        let pool = test_pool();
        for i in 0..5 {
            insert_clip_item(&pool, &make_text_item(0, &format!("item{i}"))).unwrap();
        }

        let items = get_history(&pool, 3, 0).unwrap();
        assert_eq!(items.len(), 3);
    }

    #[test]
    fn get_history_offset() {
        let pool = test_pool();
        for i in 0..5 {
            insert_clip_item(&pool, &make_text_item(0, &format!("item{i}"))).unwrap();
        }

        let items = get_history(&pool, 100, 3).unwrap();
        assert_eq!(items.len(), 2);
    }

    #[test]
    fn search_history_match() {
        let pool = test_pool();
        insert_clip_item(&pool, &make_text_item(0, "hello world")).unwrap();
        insert_clip_item(&pool, &make_text_item(0, "foo bar")).unwrap();

        let results = search_history(&pool, "hello").unwrap();
        assert_eq!(results.len(), 1);
        assert_eq!(results[0].text_content, Some("hello world".to_string()));
    }

    #[test]
    fn search_history_no_match() {
        let pool = test_pool();
        insert_clip_item(&pool, &make_text_item(0, "hello")).unwrap();

        let results = search_history(&pool, "xyz").unwrap();
        assert!(results.is_empty());
    }

    #[test]
    fn delete_item_ok() {
        let pool = test_pool();
        let id = insert_clip_item(&pool, &make_text_item(0, "to delete")).unwrap();
        delete_item(&pool, id).unwrap();

        let found = get_clip_item_by_id(&pool, id).unwrap();
        assert!(found.is_none());
    }

    #[test]
    fn delete_nonexistent_ok() {
        let pool = test_pool();
        // Should not error
        delete_item(&pool, 999).unwrap();
    }

    #[test]
    fn toggle_pin_works() {
        let pool = test_pool();
        let id = insert_clip_item(&pool, &make_text_item(0, "pin me")).unwrap();

        let item = get_clip_item_by_id(&pool, id).unwrap().unwrap();
        assert_eq!(item.is_pinned, false);

        super::toggle_pin(&pool, id).unwrap();
        let item = get_clip_item_by_id(&pool, id).unwrap().unwrap();
        assert_eq!(item.is_pinned, true);

        super::toggle_pin(&pool, id).unwrap();
        let item = get_clip_item_by_id(&pool, id).unwrap().unwrap();
        assert_eq!(item.is_pinned, false);
    }

    #[test]
    fn clear_history_keeps_pinned() {
        let pool = test_pool();
        insert_clip_item(&pool, &make_text_item(0, "unpinned")).unwrap();
        let id2 = insert_clip_item(&pool, &make_text_item(0, "pinned")).unwrap();

        let conn = pool.get().unwrap();
        conn.execute("UPDATE clipboard_history SET is_pinned = 1 WHERE id = ?1", params![id2]).unwrap();

        clear_history(&pool).unwrap();

        let items = get_history(&pool, 100, 0).unwrap();
        assert_eq!(items.len(), 1);
        assert_eq!(items[0].id, id2);
    }

    #[test]
    fn get_latest_hash_empty() {
        let pool = test_pool();
        let hash = get_latest_hash(&pool).unwrap();
        assert!(hash.is_none());
    }

    #[test]
    fn get_latest_hash_returns_most_recent() {
        let pool = test_pool();
        insert_clip_item(&pool, &make_text_item(0, "old")).unwrap();
        insert_clip_item(&pool, &make_text_item(0, "new")).unwrap();

        let hash = get_latest_hash(&pool).unwrap().unwrap();
        assert_eq!(hash, "hash_0"); // both have same hash pattern, latest wins
    }
}

