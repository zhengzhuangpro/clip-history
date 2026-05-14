use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ClipItem {
    pub id: i64,
    pub content_type: String,
    pub text_content: Option<String>,
    pub image_blob: Option<Vec<u8>>,
    pub thumbnail: Option<Vec<u8>>,
    pub image_width: Option<i64>,
    pub image_height: Option<i64>,
    pub image_format: Option<String>,
    pub source_app: Option<String>,
    pub content_hash: String,
    pub is_pinned: bool,
    pub created_at: String,
    pub updated_at: String,
}
