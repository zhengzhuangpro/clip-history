import { create } from "zustand";
import type { AppSettings } from "@/types";
import { getConfig, setConfig } from "@/lib/tauri";

const defaultSettings: AppSettings = {
  maxHistoryCount: 1000,
  maxImageSizeKb: 2048,
  thumbnailSize: 200,
  pollIntervalMs: 200,
  shortcutShow: "Alt+Shift+V",
  theme: "system",
  language: "zh",
  autoStart: true,
  deduplicate: true,
};

interface SettingsState {
  settings: AppSettings;
  isLoading: boolean;
  loadSettings: () => Promise<void>;
  updateSetting: <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: defaultSettings,
  isLoading: false,

  loadSettings: async () => {
    set({ isLoading: true });
    try {
      const config = await getConfig();
      set({
        settings: {
          maxHistoryCount:
            parseInt(config.max_history_count) || defaultSettings.maxHistoryCount,
          maxImageSizeKb:
            parseInt(config.max_image_size_kb) || defaultSettings.maxImageSizeKb,
          thumbnailSize:
            parseInt(config.thumbnail_size) || defaultSettings.thumbnailSize,
          pollIntervalMs:
            parseInt(config.poll_interval_ms) || defaultSettings.pollIntervalMs,
          shortcutShow:
            config.shortcut_show || defaultSettings.shortcutShow,
          theme: (config.theme as AppSettings["theme"]) || defaultSettings.theme,
          language:
            (config.language as AppSettings["language"]) ||
            defaultSettings.language,
          autoStart: config.auto_start !== "false",
          deduplicate: config.deduplicate !== "false",
        },
      });
    } catch (e) {
      console.error("Failed to load settings:", e);
    } finally {
      set({ isLoading: false });
    }
  },

  updateSetting: async (key, value) => {
    const keyMap: Record<keyof AppSettings, string> = {
      maxHistoryCount: "max_history_count",
      maxImageSizeKb: "max_image_size_kb",
      thumbnailSize: "thumbnail_size",
      pollIntervalMs: "poll_interval_ms",
      shortcutShow: "shortcut_show",
      theme: "theme",
      language: "language",
      autoStart: "auto_start",
      deduplicate: "deduplicate",
    };

    const configKey = keyMap[key];
    const configValue = String(value);

    try {
      await setConfig(configKey, configValue);
      set((state) => ({
        settings: { ...state.settings, [key]: value },
      }));
    } catch (e) {
      console.error("Failed to update setting:", e);
    }
  },
}));
