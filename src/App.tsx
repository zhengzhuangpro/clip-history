import { useState, useEffect } from "react";
import { Settings as SettingsIcon } from "lucide-react";
import "@/styles/globals.css";
import { HistoryList } from "@/components/HistoryList";
import { Settings } from "@/components/Settings";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/stores/settingsStore";
import { useTheme } from "@/hooks/useTheme";

export default function App() {
  const [view, setView] = useState<"history" | "settings">("history");
  const loadSettings = useSettingsStore((s) => s.loadSettings);

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
    </div>
  );
}
