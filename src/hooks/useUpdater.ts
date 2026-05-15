import { useState, useEffect, useCallback } from "react";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

interface UpdateInfo {
  version: string;
  body: string | null;
}

export function useUpdater() {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const checkAndUpdate = useCallback(async () => {
    try {
      const update = await check();
      if (!update) return;

      setUpdateInfo({
        version: update.version,
        body: update.body ?? null,
      });

      setDownloading(true);
      await update.downloadAndInstall();
      setDownloading(false);
      setDownloaded(true);
    } catch (e) {
      console.error("Update check failed:", e);
      setDownloading(false);
    }
  }, []);

  useEffect(() => {
    checkAndUpdate();
  }, [checkAndUpdate]);

  const install = useCallback(async () => {
    try {
      await relaunch();
    } catch (e) {
      console.error("Relaunch failed:", e);
    }
  }, []);

  const dismiss = useCallback(() => {
    setUpdateInfo(null);
    setDownloaded(false);
  }, []);

  return {
    updateInfo,
    downloading,
    downloaded,
    install,
    dismiss,
  };
}
