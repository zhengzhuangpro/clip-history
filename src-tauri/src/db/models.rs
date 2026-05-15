use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
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

#[cfg(test)]
mod tests {
    use super::*;

    fn make_item() -> ClipItem {
        ClipItem {
            id: 1,
            content_type: "text".to_string(),
            text_content: Some("hello".to_string()),
            image_blob: None,
            thumbnail: None,
            image_width: None,
            image_height: None,
            image_format: None,
            source_app: None,
            content_hash: "abc123".to_string(),
            is_pinned: false,
            created_at: "2026-01-01T00:00:00Z".to_string(),
            updated_at: "2026-01-01T00:00:00Z".to_string(),
        }
    }

    #[test]
    fn serde_roundtrip() {
        let item = make_item();
        let json = serde_json::to_string(&item).unwrap();
        let deserialized: ClipItem = serde_json::from_str(&json).unwrap();
        assert_eq!(item, deserialized);
    }

    #[test]
    fn camel_case_fields() {
        let item = make_item();
        let json = serde_json::to_string(&item).unwrap();
        assert!(json.contains("\"contentType\""));
        assert!(json.contains("\"textContent\""));
        assert!(json.contains("\"contentHash\""));
        assert!(json.contains("\"isPinned\""));
        assert!(json.contains("\"createdAt\""));
        assert!(json.contains("\"updatedAt\""));
        assert!(json.contains("\"imageBlob\""));
        assert!(json.contains("\"imageWidth\""));
        assert!(json.contains("\"imageFormat\""));
        assert!(json.contains("\"sourceApp\""));
    }

    #[test]
    fn optional_fields_null() {
        let item = make_item();
        let json = serde_json::to_string(&item).unwrap();
        assert!(json.contains("\"textContent\":\"hello\""));
        assert!(json.contains("\"imageBlob\":null"));
    }
}

