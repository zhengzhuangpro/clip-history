import { useEffect, useState, useCallback, useRef } from "react";
import { listen } from "@tauri-apps/api/event";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HistoryItem } from "@/components/HistoryItem";
import { ImagePreview } from "@/components/ImagePreview";
import { SearchBar } from "@/components/SearchBar";
import { useHistoryStore } from "@/stores/historyStore";
import {
  copyToClipboard,
  deleteHistoryItem,
  togglePin,
} from "@/lib/tauri";

function useDebounce(fn: (query: string) => void, delay: number) {
  const timer = useRef<ReturnType<typeof setTimeout>>();
  return useCallback(
    (query: string) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => fn(query), delay);
    },
    [fn, delay],
  );
}

export function HistoryList() {
  const {
    filteredItems,
    selectedItem,
    searchQuery,
    filterType,
    isLoading,
    loadItems,
    appendItem,
    setSearchQuery,
    setFilterType,
    setSelectedItem,
    removeItem,
  } = useHistoryStore();

  const [previewBlob, setPreviewBlob] = useState<Uint8Array | null>(null);
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const debouncedSetQuery = useDebounce(setSearchQuery, 200);

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

  const handleQueryChange = (q: string) => {
    setLocalQuery(q);
    debouncedSetQuery(q);
  };

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

  const handleSelect = (item: typeof filteredItems[0]) => {
    setSelectedItem(item);
    if (item.contentType === "image" && item.imageBlob) {
      setPreviewBlob(item.imageBlob);
    }
  };

  if (isLoading && filteredItems.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        <p className="text-sm">加载中...</p>
      </div>
    );
  }

  return (
    <>
      <SearchBar
        query={localQuery}
        filter={filterType}
        onQueryChange={handleQueryChange}
        onFilterChange={setFilterType}
      />

      {filteredItems.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          <p className="text-sm">
            {searchQuery || filterType !== "all"
              ? "没有匹配的记录"
              : "暂无剪贴板记录"}
          </p>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-0.5 p-2">
            {filteredItems.map((item) => (
              <HistoryItem
                key={item.id}
                item={item}
                query={searchQuery}
                isSelected={selectedItem?.id === item.id}
                onSelect={() => handleSelect(item)}
                onCopy={() => handleCopy(item.id)}
                onTogglePin={() => handleTogglePin(item.id)}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </div>
        </ScrollArea>
      )}

      <ImagePreview
        blob={previewBlob}
        open={previewBlob !== null}
        onClose={() => setPreviewBlob(null)}
      />
    </>
  );
}
