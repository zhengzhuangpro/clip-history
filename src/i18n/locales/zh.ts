export const zh = {
  appName: "Clip History",

  // SearchBar
  search_placeholder: "搜索剪贴板历史...",
  filter_all: "全部",
  filter_text: "文本",
  filter_image: "图片",

  // HistoryList
  copied: "已复制到剪贴板",
  copy_failed: "复制失败",
  deleted: "已删除",
  delete_failed: "删除失败",
  pin_updated: "已更新置顶状态",
  deleted_count: "已删除 {count} 条记录",
  batch_delete_failed: "批量删除失败",
  loading: "加载中...",
  records: "{count} 条记录",
  selected: " · 已选 {count} 条",
  select_all: "全选",
  delete: "删除",
  multi_select: "多选",
  no_match: "没有匹配的记录",
  no_history: "暂无剪贴板记录",
  scroll_more: "滚动加载更多",
  all_loaded: "已加载全部",

  // HistoryItem
  clipboard_image: "clipboard image",

  // ImagePreview
  image_preview: "图片预览",

  // Settings
  settings: "设置",
  language: "语言",
  language_system: "跟随系统",
  language_zh: "中文",
  language_en: "English",
  theme: "主题",
  theme_light: "浅色",
  theme_dark: "深色",
  theme_system: "跟随系统",
  auto_start: "开机自启动",
  deduplicate: "内容去重",
  max_history: "最大历史记录数",
  shortcut: "全局快捷键",
  data_cleanup: "数据清理",
  clear_warning: "清除所有未置顶的历史记录，此操作不可撤销。",
  clearing: "清理中...",
  clear_history: "清除历史记录",
  confirm_clear_title: "确认清除历史记录",
  confirm_clear_desc:
    "此操作将清除所有未置顶的历史记录，且不可撤销。确定要继续吗？",
  cancel: "取消",
  confirm_clear: "确认清除",
  press_shortcut: "按下快捷键...",
  press_esc: "按 Esc 取消",

  // App (update dialog)
  update_ready: "更新已就绪",
  update_desc: "新版本 {version} 已下载完成，重启应用即可完成更新。",
  later: "稍后",
  restart_now: "立即重启",
} as const;

export type TranslationKey = keyof typeof zh;
