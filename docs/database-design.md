# 数据库设计

## 概述

使用 SQLite 作为本地存储引擎，通过 Rust 的 `rusqlite` crate 操作。
数据库文件存储在 Tauri 应用数据目录下（`~/.local/share/clip-history/` 或 `%APPDATA%/clip-history/`）。

## 表结构

### clipboard_history — 剪贴板历史记录

```sql
CREATE TABLE clipboard_history (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    content_type  TEXT    NOT NULL,          -- 'text' | 'image'
    text_content  TEXT,                      -- 文本内容（content_type='text' 时有值）
    image_blob    BLOB,                      -- 图片二进制数据（content_type='image' 时有值）
    thumbnail     BLOB,                      -- 缩略图二进制（用于列表快速显示）
    image_width   INTEGER,                   -- 原图宽度
    image_height  INTEGER,                   -- 原图高度
    image_format  TEXT,                      -- 图片格式：'png' | 'jpg' | 'webp'
    source_app    TEXT,                      -- 来源应用名（可选，尽力获取）
    content_hash  TEXT    NOT NULL,          -- 内容 SHA256 哈希，用于去重
    is_pinned     INTEGER NOT NULL DEFAULT 0, -- 是否置顶收藏（0/1）
    created_at    TEXT    NOT NULL,          -- 创建时间 ISO8601
    updated_at    TEXT    NOT NULL           -- 更新时间 ISO8601
);

-- 索引
CREATE INDEX idx_history_content_hash ON clipboard_history(content_hash);
CREATE INDEX idx_history_created_at   ON clipboard_history(created_at DESC);
CREATE INDEX idx_history_content_type ON clipboard_history(content_type);
CREATE INDEX idx_history_is_pinned    ON clipboard_history(is_pinned);
CREATE INDEX idx_history_text_search  ON clipboard_history(text_content);
```

### app_config — 应用配置

```sql
CREATE TABLE app_config (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- 默认配置
INSERT INTO app_config (key, value) VALUES
    ('max_history_count',   '1000'),
    ('max_image_size_kb',   '2048'),
    ('thumbnail_size',      '200'),
    ('poll_interval_ms',    '200'),
    ('shortcut_show',       'Alt+Shift+V'),
    ('theme',               'system'),
    ('auto_start',          'true'),
    ('deduplicate',         'true');
```

## 数据管理策略

### 去重机制
- 每次写入前计算 `content_hash`（SHA256）
- 与最近一条记录的 hash 对比，相同则跳过
- 可选：全局去重（保留最新时间戳，删除旧记录）

### 容量控制
- 默认保留最近 1000 条记录（可配置）
- 超出限制时自动清理最旧的未置顶记录
- 图片 Blob 按大小压缩存储

### 数据迁移
- 数据库文件包含 `user_version` 标记
- 应用启动时检查版本号，按顺序执行迁移脚本
- 每个迁移脚本包含 `UP` 和 `DOWN`，保证可回滚
