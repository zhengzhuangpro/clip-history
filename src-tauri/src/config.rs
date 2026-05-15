use rusqlite::params;

use crate::db::db::DbPool;

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
