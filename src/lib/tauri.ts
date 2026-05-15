import { invoke } from "@tauri-apps/api/core";
import type { ClipItem } from "@/types";

export async function getHistory(
  limit: number = 100,
  offset: number = 0,
): Promise<ClipItem[]> {
  return invoke("get_history", { limit, offset });
}

export async function searchHistory(query: string): Promise<ClipItem[]> {
  return invoke("search_history", { query });
}

export async function copyToClipboard(id: number): Promise<void> {
  return invoke("copy_to_clipboard", { id });
}

export async function deleteHistoryItem(id: number): Promise<void> {
  return invoke("delete_history_item", { id });
}

export async function clearHistory(): Promise<void> {
  return invoke("clear_history");
}

export async function togglePin(id: number): Promise<void> {
  return invoke("toggle_pin", { id });
}

export async function getClipItem(id: number): Promise<ClipItem | null> {
  return invoke("get_clip_item", { id });
}

export async function getConfig(): Promise<Record<string, string>> {
  return invoke("get_config");
}

export async function setConfig(key: string, value: string): Promise<void> {
  return invoke("set_config", { key, value });
}

export async function updateShortcut(shortcut: string): Promise<void> {
  return invoke("update_shortcut", { shortcut });
}

export async function clearShortcuts(): Promise<void> {
  return invoke("clear_shortcuts");
}
