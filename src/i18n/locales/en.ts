import type { zh } from "./zh";

export const en: Record<keyof typeof zh, string> = {
  appName: "Clip History",

  // SearchBar
  search_placeholder: "Search clipboard history...",
  filter_all: "All",
  filter_text: "Text",
  filter_image: "Image",

  // HistoryList
  copied: "Copied to clipboard",
  copy_failed: "Copy failed",
  deleted: "Deleted",
  delete_failed: "Delete failed",
  pin_updated: "Pin status updated",
  deleted_count: "Deleted {count} records",
  batch_delete_failed: "Batch delete failed",
  loading: "Loading...",
  records: "{count} records",
  selected: " · {count} selected",
  select_all: "Select All",
  delete: "Delete",
  multi_select: "Multi-select",
  no_match: "No matching records",
  no_history: "No clipboard history",
  scroll_more: "Scroll to load more",
  all_loaded: "All loaded",

  // HistoryItem
  clipboard_image: "clipboard image",

  // ImagePreview
  image_preview: "Image Preview",

  // Settings
  settings: "Settings",
  language: "Language",
  language_system: "Follow System",
  language_zh: "中文",
  language_en: "English",
  theme: "Theme",
  theme_light: "Light",
  theme_dark: "Dark",
  theme_system: "Follow System",
  auto_start: "Auto start on boot",
  deduplicate: "Content deduplication",
  max_history: "Max history count",
  shortcut: "Global shortcut",
  data_cleanup: "Data cleanup",
  clear_warning:
    "Clear all unpinned history records. This action cannot be undone.",
  clearing: "Clearing...",
  clear_history: "Clear history",
  confirm_clear_title: "Confirm clear history",
  confirm_clear_desc:
    "This will clear all unpinned history records and cannot be undone. Are you sure?",
  cancel: "Cancel",
  confirm_clear: "Confirm",
  press_shortcut: "Press shortcut key...",
  press_esc: "Press Esc to cancel",

  // App (update dialog)
  update_ready: "Update Ready",
  update_desc:
    "Version {version} has been downloaded. Restart the app to apply the update.",
  later: "Later",
  restart_now: "Restart Now",
};
