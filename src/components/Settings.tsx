import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
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
import type { AppSettings } from "@/types";

interface SettingsProps {
  onBack: () => void;
}

export function Settings({ onBack }: SettingsProps) {
  const { settings, isLoading, loadSettings, updateSetting } =
    useSettingsStore();
  const [clearing, setClearing] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);

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
        加载中...
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center gap-2 border-b px-4 py-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="size-4" />
        </Button>
        <h2 className="text-sm font-semibold">设置</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5">
        {/* Theme */}
        <SettingRow label="主题">
          <Select
            value={settings.theme}
            onValueChange={(v) => {
              if (v) updateSetting("theme", v as AppSettings["theme"]);
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">浅色</SelectItem>
              <SelectItem value="dark">深色</SelectItem>
              <SelectItem value="system">跟随系统</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>

        {/* Auto start */}
        <SettingRow label="开机自启动">
          <Switch
            checked={settings.autoStart}
            onCheckedChange={(v: boolean) => updateSetting("autoStart", v)}
          />
        </SettingRow>

        {/* Deduplicate */}
        <SettingRow label="内容去重">
          <Switch
            checked={settings.deduplicate}
            onCheckedChange={(v: boolean) => updateSetting("deduplicate", v)}
          />
        </SettingRow>

        {/* Max history count */}
        <SettingRow label="最大历史记录数">
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
        <SettingRow label="全局快捷键">
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
          <Label>数据清理</Label>
          <p className="text-xs text-muted-foreground">
            清除所有未置顶的历史记录，此操作不可撤销。
          </p>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowClearDialog(true)}
            disabled={clearing}
          >
            <Trash2 className="size-4" />
            {clearing ? "清理中..." : "清除历史记录"}
          </Button>
        </div>

        <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>确认清除历史记录</DialogTitle>
              <DialogDescription>
                此操作将清除所有未置顶的历史记录，且不可撤销。确定要继续吗？
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowClearDialog(false)}
                disabled={clearing}
              >
                取消
              </Button>
              <Button
                variant="destructive"
                onClick={handleClearHistory}
                disabled={clearing}
              >
                {clearing ? "清理中..." : "确认清除"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
    ? pending || "按下快捷键..."
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
        <span className="text-xs text-muted-foreground">按 Esc 取消</span>
      )}
    </div>
  );
}
