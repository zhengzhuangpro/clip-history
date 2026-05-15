import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import { getVersion } from "@tauri-apps/api/app";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSettingsStore } from "@/stores/settingsStore";
import { clearHistory, clearShortcuts, updateShortcut } from "@/lib/tauri";
import { useTranslation } from "@/i18n";
import type { AppSettings } from "@/types";

interface SettingsProps {
  onBack: () => void;
}

export function Settings({ onBack }: SettingsProps) {
  const { t } = useTranslation();
  const { settings, isLoading, loadSettings, updateSetting } =
    useSettingsStore();
  const [clearing, setClearing] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [version, setVersion] = useState("");

  useEffect(() => {
    getVersion().then(setVersion).catch(() => {});
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleClearHistory = async () => {
    setClearing(true);
    try {
      await clearHistory();
      setShowClearDialog(false);
    } finally {
      setClearing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground text-sm">
        {t("loading")}
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center gap-2 border-b px-4 py-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="size-4" />
        </Button>
        <h2 className="text-sm font-semibold">{t("settings")}</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5">
        {/* Language */}
        <SettingRow label={t("language")}>
          <Select
            value={settings.language}
            onValueChange={(v) => {
              if (v) updateSetting("language", v as AppSettings["language"]);
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue>
                {settings.language === "system" && t("language_system")}
                {settings.language === "zh" && t("language_zh")}
                {settings.language === "en" && t("language_en")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">{t("language_system")}</SelectItem>
              <SelectItem value="zh">{t("language_zh")}</SelectItem>
              <SelectItem value="en">{t("language_en")}</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>

        {/* Theme */}
        <SettingRow label={t("theme")}>
          <Select
            value={settings.theme}
            onValueChange={(v) => {
              if (v) updateSetting("theme", v as AppSettings["theme"]);
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue>
                {settings.theme === "light" && t("theme_light")}
                {settings.theme === "dark" && t("theme_dark")}
                {settings.theme === "system" && t("theme_system")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">{t("theme_light")}</SelectItem>
              <SelectItem value="dark">{t("theme_dark")}</SelectItem>
              <SelectItem value="system">{t("theme_system")}</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>

        {/* Auto start */}
        <SettingRow label={t("auto_start")}>
          <Switch
            checked={settings.autoStart}
            onCheckedChange={(v: boolean) => updateSetting("autoStart", v)}
          />
        </SettingRow>

        {/* Deduplicate */}
        <SettingRow label={t("deduplicate")}>
          <Switch
            checked={settings.deduplicate}
            onCheckedChange={(v: boolean) => updateSetting("deduplicate", v)}
          />
        </SettingRow>

        {/* Max history count */}
        <SettingRow label={t("max_history")}>
          <Input
            type="number"
            className="w-24 text-right"
            value={settings.maxHistoryCount}
            min={10}
            max={10000}
            onChange={(e) => {
              const v = parseInt(e.target.value);
              if (!isNaN(v) && v > 0) {
                updateSetting("maxHistoryCount", v);
              }
            }}
          />
        </SettingRow>

        {/* Shortcut */}
        <SettingRow label={t("shortcut")}>
          <ShortcutRecorder
            value={settings.shortcutShow}
            onChange={async (v) => {
              useSettingsStore.setState((s) => ({
                settings: { ...s.settings, shortcutShow: v },
              }));
              try {
                await updateShortcut(v);
              } catch (e) {
                console.error("Failed to update shortcut:", e);
              }
            }}
          />
        </SettingRow>

        <Separator />

        {/* Data cleanup */}
        <div className="space-y-2">
          <Label>{t("data_cleanup")}</Label>
          <p className="text-xs text-muted-foreground">
            {t("clear_warning")}
          </p>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowClearDialog(true)}
            disabled={clearing}
          >
            <Trash2 className="size-4" />
            {clearing ? t("clearing") : t("clear_history")}
          </Button>
        </div>

        <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>{t("confirm_clear_title")}</DialogTitle>
              <DialogDescription>
                {t("confirm_clear_desc")}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowClearDialog(false)}
                disabled={clearing}
              >
                {t("cancel")}
              </Button>
              <Button
                variant="destructive"
                onClick={handleClearHistory}
                disabled={clearing}
              >
                {clearing ? t("clearing") : t("confirm_clear")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {version && (
          <p className="text-center text-xs text-muted-foreground pt-2">
            Clip History v{version}
          </p>
        )}
      </div>
    </div>
  );
}

function SettingRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function ShortcutRecorder({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const { t } = useTranslation();
  const [recording, setRecording] = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const [localValue, setLocalValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!recording) setLocalValue(value);
  }, [value, recording]);

  const startRecording = useCallback(() => {
    clearShortcuts();
    setRecording(true);
    setPending(null);
  }, []);

  const cancelRecording = useCallback(() => {
    setRecording(false);
    setPending(null);
    updateShortcut(value);
  }, [value]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.code === "Escape") {
        cancelRecording();
        return;
      }

      const modifiers: string[] = [];
      if (e.altKey) modifiers.push("Alt");
      if (e.shiftKey) modifiers.push("Shift");
      if (e.ctrlKey) modifiers.push("Ctrl");
      if (e.metaKey) modifiers.push("Cmd");

      const code = e.code;
      if (["AltLeft", "AltRight", "ShiftLeft", "ShiftRight", "ControlLeft", "ControlRight", "MetaLeft", "MetaRight"].includes(code)) {
        setPending(modifiers.join("+") + "+");
        return;
      }

      let key = "";
      if (code.startsWith("Key")) {
        key = code.slice(3);
      } else if (code.startsWith("Digit")) {
        key = code.slice(5);
      } else if (code === "Space") {
        key = "Space";
      } else if (/^F\d+$/.test(code)) {
        key = code;
      } else {
        return;
      }

      const combo = [...modifiers, key].join("+");
      setLocalValue(combo);
      setPending(combo);
      setTimeout(() => {
        setPending(null);
        setRecording(false);
      }, 100);
      onChange(combo);
    },
    [onChange, cancelRecording],
  );

  useEffect(() => {
    if (!recording) return;
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [recording, handleKeyDown]);

  useEffect(() => {
    if (!recording) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        cancelRecording();
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [recording, cancelRecording]);

  const display = recording
    ? pending || t("press_shortcut")
    : localValue || value;

  return (
    <div ref={containerRef} className="flex items-center gap-2">
      <button
        type="button"
        className={`min-w-32 rounded-md border px-3 py-1.5 text-sm ${
          recording
            ? "border-ring bg-muted"
            : "border-input bg-transparent hover:bg-muted"
        }`}
        onClick={startRecording}
      >
        {display}
      </button>
      {recording && (
        <span className="text-xs text-muted-foreground">{t("press_esc")}</span>
      )}
    </div>
  );
}
