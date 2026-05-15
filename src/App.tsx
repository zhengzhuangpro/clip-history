import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Download } from "lucide-react";
import "@/styles/globals.css";
import { HistoryList } from "@/components/HistoryList";
import { Settings } from "@/components/Settings";
import { ToastContainer } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTheme } from "@/hooks/useTheme";
import { useUpdater } from "@/hooks/useUpdater";

export default function App() {
  const [view, setView] = useState<"history" | "settings">("history");
  const loadSettings = useSettingsStore((s) => s.loadSettings);
  const { updateInfo, downloaded, install, dismiss } = useUpdater();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useTheme();

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <header className="flex items-center justify-between border-b px-4 py-2">
        <h1 className="text-sm font-semibold">Clip History</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setView(view === "history" ? "settings" : "history")}
        >
          <SettingsIcon className="size-4" />
        </Button>
      </header>
      {view === "history" ? (
        <HistoryList />
      ) : (
        <Settings onBack={() => setView("history")} />
      )}
      <ToastContainer />

      <Dialog open={downloaded} onOpenChange={(open) => !open && dismiss()}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>更新已就绪</DialogTitle>
            <DialogDescription>
              新版本 {updateInfo?.version} 已下载完成，重启应用即可完成更新。
              {updateInfo?.body && (
                <span className="mt-2 block text-xs">{updateInfo.body}</span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={dismiss}>
              稍后
            </Button>
            <Button onClick={install}>
              <Download className="size-4" />
              立即重启
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
