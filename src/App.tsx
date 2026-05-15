import { useState, useEffect } from "react";
import { Download } from "lucide-react";
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
import { useTranslation } from "@/i18n";

export default function App() {
  const [view, setView] = useState<"history" | "settings">("history");
  const loadSettings = useSettingsStore((s) => s.loadSettings);
  const { updateInfo, downloaded, install, dismiss } = useUpdater();
  const { t, locale } = useTranslation();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [locale]);

  useTheme();

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      {view === "history" ? (
        <HistoryList onSettingsClick={() => setView("settings")} />
      ) : (
        <Settings onBack={() => setView("history")} />
      )}
      <ToastContainer />

      <Dialog open={downloaded} onOpenChange={(open) => !open && dismiss()}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{t("update_ready")}</DialogTitle>
            <DialogDescription>
              {t("update_desc", { version: updateInfo?.version ?? "" })}
              {updateInfo?.body && (
                <span className="mt-2 block text-xs">{updateInfo.body}</span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={dismiss}>
              {t("later")}
            </Button>
            <Button onClick={install}>
              <Download className="size-4" />
              {t("restart_now")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
