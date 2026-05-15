import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/tauri", () => ({
  getConfig: vi.fn(),
  setConfig: vi.fn(),
}));

import { useSettingsStore } from "./settingsStore";
import { getConfig, setConfig } from "@/lib/tauri";
import type { AppSettings } from "@/types";

const mockedGetConfig = vi.mocked(getConfig);
const mockedSetConfig = vi.mocked(setConfig);

describe("settingsStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSettingsStore.setState({
      settings: {
        maxHistoryCount: 1000,
        maxImageSizeKb: 2048,
        thumbnailSize: 200,
        pollIntervalMs: 200,
        shortcutShow: "Alt+Shift+V",
        theme: "system",
        language: "zh",
        autoStart: true,
        deduplicate: true,
      },
      isLoading: false,
    });
  });

  describe("loadSettings", () => {
    it("parses snake_case keys to camelCase", async () => {
      mockedGetConfig.mockResolvedValue({
        max_history_count: "500",
        max_image_size_kb: "1024",
        thumbnail_size: "100",
        poll_interval_ms: "300",
        shortcut_show: "Ctrl+Shift+C",
        theme: "dark",
        auto_start: "true",
        deduplicate: "false",
      });

      await useSettingsStore.getState().loadSettings();
      const settings = useSettingsStore.getState().settings;

      expect(settings.maxHistoryCount).toBe(500);
      expect(settings.maxImageSizeKb).toBe(1024);
      expect(settings.thumbnailSize).toBe(100);
      expect(settings.pollIntervalMs).toBe(300);
      expect(settings.shortcutShow).toBe("Ctrl+Shift+C");
      expect(settings.theme).toBe("dark");
      expect(settings.autoStart).toBe(true);
      expect(settings.deduplicate).toBe(false);
    });

    it("falls back to defaults for missing values", async () => {
      mockedGetConfig.mockResolvedValue({});

      await useSettingsStore.getState().loadSettings();
      const settings = useSettingsStore.getState().settings;

      expect(settings.maxHistoryCount).toBe(1000);
      expect(settings.shortcutShow).toBe("Alt+Shift+V");
      expect(settings.theme).toBe("system");
    });

    it("autoStart 'false' maps to false, anything else to true", async () => {
      mockedGetConfig.mockResolvedValue({ auto_start: "false" });
      await useSettingsStore.getState().loadSettings();
      expect(useSettingsStore.getState().settings.autoStart).toBe(false);

      mockedGetConfig.mockResolvedValue({ auto_start: "true" });
      await useSettingsStore.getState().loadSettings();
      expect(useSettingsStore.getState().settings.autoStart).toBe(true);
    });

    it("deduplicate 'false' maps to false", async () => {
      mockedGetConfig.mockResolvedValue({ deduplicate: "false" });
      await useSettingsStore.getState().loadSettings();
      expect(useSettingsStore.getState().settings.deduplicate).toBe(false);
    });
  });

  describe("updateSetting", () => {
    it("calls setConfig with correct snake_case key", async () => {
      mockedSetConfig.mockResolvedValue(undefined);

      await useSettingsStore.getState().updateSetting("maxHistoryCount", 500);
      expect(mockedSetConfig).toHaveBeenCalledWith("max_history_count", "500");
    });

    it("updates local state on success", async () => {
      mockedSetConfig.mockResolvedValue(undefined);

      await useSettingsStore.getState().updateSetting("theme", "dark");
      expect(useSettingsStore.getState().settings.theme).toBe("dark");
    });

    it("maps all keys correctly", async () => {
      mockedSetConfig.mockResolvedValue(undefined);

      const mappings: Array<[keyof AppSettings, string]> = [
        ["maxHistoryCount", "max_history_count"],
        ["maxImageSizeKb", "max_image_size_kb"],
        ["thumbnailSize", "thumbnail_size"],
        ["pollIntervalMs", "poll_interval_ms"],
        ["shortcutShow", "shortcut_show"],
        ["theme", "theme"],
        ["language", "language"],
        ["autoStart", "auto_start"],
        ["deduplicate", "deduplicate"],
      ];

      for (const [camel, snake] of mappings) {
        mockedSetConfig.mockClear();
        const current = useSettingsStore.getState().settings;
        await useSettingsStore.getState().updateSetting(camel, current[camel]);
        expect(mockedSetConfig).toHaveBeenCalledWith(snake, expect.any(String));
      }
    });
  });
});
