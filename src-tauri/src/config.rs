use rusqlite::params;

use crate::db::DbPool;

pub fn get_config_value(pool: &DbPool, key: &str) -> Result<Option<String>, String> {
    let conn = pool
        .get()
        .map_err(|e| format!("Failed to get db connection: {e}"))?;
    let val = conn
        .query_row(
            "SELECT value FROM app_config WHERE key = ?1",
            params![key],
            |row| row.get::<_, String>(0),
        )
        .ok();
    Ok(val)
}

pub fn set_config_value(pool: &DbPool, key: &str, value: &str) -> Result<(), String> {
    let conn = pool
        .get()
        .map_err(|e| format!("Failed to get db connection: {e}"))?;
    conn.execute(
        "INSERT INTO app_config (key, value) VALUES (?1, ?2)
         ON CONFLICT(key) DO UPDATE SET value = ?2",
        params![key, value],
    )
    .map_err(|e| format!("Failed to set config: {e}"))?;
    Ok(())
}

pub fn get_all_config(pool: &DbPool) -> Result<Vec<(String, String)>, String> {
    let conn = pool
        .get()
        .map_err(|e| format!("Failed to get db connection: {e}"))?;
    let mut stmt = conn
        .prepare("SELECT key, value FROM app_config")
        .map_err(|e| format!("Failed to prepare query: {e}"))?;
    let rows = stmt
        .query_map([], |row| Ok((row.get(0)?, row.get(1)?)))
        .map_err(|e| format!("Failed to query config: {e}"))?;
    let mut result = Vec::new();
    for row in rows {
        result.push(row.map_err(|e| format!("Row error: {e}"))?);
    }
    Ok(result)
}

#[cfg(test)]
mod tests {
    use super::*;
    use r2d2::Pool;
    use r2d2_sqlite::SqliteConnectionManager;

    fn test_pool() -> DbPool {
        let manager = SqliteConnectionManager::memory();
        let pool = Pool::new(manager).unwrap();
        crate::db::run_migrations(&pool).unwrap();
        pool
    }

    #[test]
    fn set_then_get() {
        let pool = test_pool();
        set_config_value(&pool, "my_key", "my_value").unwrap();
        let val = get_config_value(&pool, "my_key").unwrap();
        assert_eq!(val, Some("my_value".to_string()));
    }

    #[test]
    fn get_nonexistent_returns_none() {
        let pool = test_pool();
        let val = get_config_value(&pool, "no_such_key").unwrap();
        assert!(val.is_none());
    }

    #[test]
    fn set_overwrite() {
        let pool = test_pool();
        set_config_value(&pool, "key", "v1").unwrap();
        set_config_value(&pool, "key", "v2").unwrap();
        let val = get_config_value(&pool, "key").unwrap();
        assert_eq!(val, Some("v2".to_string()));
    }

    #[test]
    fn get_all_config_defaults() {
        let pool = test_pool();
        let all = get_all_config(&pool).unwrap();
        // 9 seeded defaults
        assert_eq!(all.len(), 9);
        let keys: Vec<&str> = all.iter().map(|(k, _)| k.as_str()).collect();
        assert!(keys.contains(&"max_history_count"));
        assert!(keys.contains(&"shortcut_show"));
        assert!(keys.contains(&"theme"));
    }

    #[test]
    fn get_all_config_includes_custom() {
        let pool = test_pool();
        set_config_value(&pool, "custom_key", "custom_val").unwrap();
        let all = get_all_config(&pool).unwrap();
        let found = all.iter().find(|(k, _)| k == "custom_key");
        assert!(found.is_some());
        assert_eq!(found.unwrap().1, "custom_val");
    }
}

