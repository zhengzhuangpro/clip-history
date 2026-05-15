import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HistoryItem } from "@/components/HistoryItem";
import { ImagePreview } from "@/components/ImagePreview";
import { useHistoryStore } from "@/stores/historyStore";
import {
  copyToClipboard,
  deleteHistoryItem,
  togglePin,
} from "@/lib/tauri";

export function HistoryList() {
  const {
    items,
    selectedItem,
    isLoading,
    loadItems,
    appendItem,
    setSelectedItem,
    removeItem,
  } = useHistoryStore();

  const [previewBlob, setPreviewBlob] = useState<Uint8Array | null>(null);

  useEffect(() => {
    loadItems();

    let unlisten: (() => void) | undefined;

    const setup = async () => {
      unlisten = await listen<number>("clipboard-new", (event) => {
        appendItem(event.payload);
      });
    };
    setup();

    return () => {
      unlisten?.();
    };
  }, [loadItems, appendItem]);

  const handleCopy = async (id: number) => {
    try {
      await copyToClipboard(id);
    } catch (e) {
      console.error("Failed to copy:", e);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteHistoryItem(id);
      removeItem(id);
    } catch (e) {
      console.error("Failed to delete:", e);
    }
  };

  const handleTogglePin = async (id: number) => {
    try {
      await togglePin(id);
      await loadItems();
    } catch (e) {
      console.error("Failed to toggle pin:", e);
    }
  };

  const handleSelect = (item: typeof items[0]) => {
    setSelectedItem(item);
    if (item.contentType === "image" && item.imageBlob) {
      setPreviewBlob(item.imageBlob);
    }
  };

  if (isLoading && items.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        <p className="text-sm">加载中...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        <p className="text-sm">暂无剪贴板记录</p>
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-0.5 p-2">
          {items.map((item) => (
            <HistoryItem
              key={item.id}
              item={item}
              isSelected={selectedItem?.id === item.id}
              onSelect={() => handleSelect(item)}
              onCopy={() => handleCopy(item.id)}
              onTogglePin={() => handleTogglePin(item.id)}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </div>
      </ScrollArea>

      <ImagePreview
        blob={previewBlob}
        open={previewBlob !== null}
        onClose={() => setPreviewBlob(null)}
      />
    </>
  );
}
