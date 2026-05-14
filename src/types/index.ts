export type ClipItemType = "text" | "image";

export interface ClipItem {
  id: number;
  contentType: ClipItemType;
  textContent: string | null;
  imageBlob: Uint8Array | null;
  thumbnail: Uint8Array | null;
  imageWidth: number | null;
  imageHeight: number | null;
  imageFormat: string | null;
  sourceApp: string | null;
  contentHash: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  maxHistoryCount: number;
  maxImageSizeKb: number;
  thumbnailSize: number;
  pollIntervalMs: number;
  shortcutShow: string;
  theme: "light" | "dark" | "system";
  autoStart: boolean;
  deduplicate: boolean;
}
