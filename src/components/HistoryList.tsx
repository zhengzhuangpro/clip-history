import { useEffect, useState, useCallback, useRef } from "react";
import { listen } from "@tauri-apps/api/event";
import { useVirtualizer } from "@tanstack/react-virtual";
import { HistoryItem } from "@/components/HistoryItem";
import { ImagePreview } from "@/components/ImagePreview";
import { SearchBar } from "@/components/SearchBar";
import { useHistoryStore } from "@/stores/historyStore";
import { showToast } from "@/hooks/useToast";
import {
  copyToClipboard,
  deleteHistoryItem,
  togglePin,
} from "@/lib/tauri";
import { ListChecks, Trash2, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ITEM_HEIGHT = 80;

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
    selectedIndex,
    searchQuery,
    filterType,
    isLoading,
    hasMore,
    batchMode,
    selectedIds,
    loadItems,
    loadMore,
    appendItem,
    setSearchQuery,
    setFilterType,
    setSelectedItem,
    setSelectedIndex,
    removeItem,
    removeItems,
    toggleBatchMode,
    toggleBatchSelect,
    clearBatchSelect,
    selectAll,
  } = useHistoryStore();

  const [previewBlob, setPreviewBlob] = useState<Uint8Array | null>(null);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [copyFlashingId, setCopyFlashingId] = useState<number | null>(null);
  const [newItemIds, setNewItemIds] = useState<Set<number>>(new Set());
  const listRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Infinite scroll: load more when sentinel is visible
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { root: listRef.current, threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  const debouncedSetQuery = useDebounce(setSearchQuery, 200);

  const virtualizer = useVirtualizer({
    count: filteredItems.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 5,
  });

  useEffect(() => {
    loadItems();

    let unlisten: (() => void) | undefined;

    const setup = async () => {
      unlisten = await listen<number>("clipboard-new", (event) => {
        appendItem(event.payload);
        setNewItemIds((prev) => new Set(prev).add(event.payload));
        setTimeout(
          () =>
            setNewItemIds((prev) => {
              const next = new Set(prev);
              next.delete(event.payload);
              return next;
            }),
          250,
        );
      });
    };
    setup();

    return () => {
      unlisten?.();
    };
  }, [loadItems, appendItem]);

  // Keep selected item scrolled into view
  useEffect(() => {
    if (selectedIndex >= 0) {
      virtualizer.scrollToIndex(selectedIndex, { align: "auto" });
    }
  }, [selectedIndex, virtualizer]);

  const handleQueryChange = (q: string) => {
    setLocalQuery(q);
    debouncedSetQuery(q);
  };

  const handleCopy = async (id: number) => {
    try {
      await copyToClipboard(id);
      setCopyFlashingId(id);
      setTimeout(() => setCopyFlashingId((prev) => (prev === id ? null : prev)), 400);
      showToast("已复制到剪贴板");
    } catch (e) {
      console.error("Failed to copy:", e);
      showToast("复制失败", "error");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setDeletingIds((prev) => new Set(prev).add(id));
      await new Promise((r) => setTimeout(r, 250));
      await deleteHistoryItem(id);
      removeItem(id);
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      showToast("已删除");
    } catch (e) {
      console.error("Failed to delete:", e);
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      showToast("删除失败", "error");
    }
  };

  const handleTogglePin = async (id: number) => {
    try {
      await togglePin(id);
      await loadItems();
      showToast("已更新置顶状态");
    } catch (e) {
      console.error("Failed to toggle pin:", e);
    }
  };

  const handleSelect = (item: (typeof filteredItems)[0]) => {
    setSelectedItem(item);
    if (item.contentType === "image" && item.imageBlob) {
      setPreviewBlob(item.imageBlob);
    }
  };

  const handleBatchDelete = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    try {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.add(id));
        return next;
      });
      await new Promise((r) => setTimeout(r, 250));
      await Promise.all(ids.map((id) => deleteHistoryItem(id)));
      removeItems(ids);
      setDeletingIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
      showToast(`已删除 ${ids.length} 条记录`);
    } catch (e) {
      console.error("Failed to batch delete:", e);
      setDeletingIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
      showToast("批量删除失败", "error");
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if user is typing in search
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        if (e.key === "Escape") {
          (e.target as HTMLInputElement).blur();
          e.preventDefault();
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex(
            selectedIndex < 0 ? 0 : Math.min(selectedIndex + 1, filteredItems.length - 1),
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(Math.max(selectedIndex - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedItem) {
            handleCopy(selectedItem.id);
          }
          break;
        case "Delete":
        case "Backspace":
          if (selectedItem && !batchMode) {
            e.preventDefault();
            handleDelete(selectedItem.id);
          }
          break;
        case "Escape":
          e.preventDefault();
          if (batchMode) {
            clearBatchSelect();
          } else {
            setSelectedItem(null);
            setSelectedIndex(-1);
          }
          break;
        case "b":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            toggleBatchMode();
          }
          break;
        case "a":
          if ((e.ctrlKey || e.metaKey) && batchMode) {
            e.preventDefault();
            selectAll();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedIndex,
    selectedItem,
    filteredItems.length,
    batchMode,
    selectedIds,
    setSelectedIndex,
    setSelectedItem,
    clearBatchSelect,
    toggleBatchMode,
    selectAll,
  ]);

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

      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b">
        <span className="text-xs text-muted-foreground">
          {filteredItems.length} 条记录
          {batchMode && selectedIds.size > 0 && ` · 已选 ${selectedIds.size} 条`}
        </span>
        <div className="flex items-center gap-1">
          {batchMode ? (
            <>
              <Button variant="ghost" size="xs" onClick={selectAll}>
                全选
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={handleBatchDelete}
                disabled={selectedIds.size === 0}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-3 mr-1" />
                删除
              </Button>
              <Button variant="ghost" size="icon-xs" onClick={clearBatchSelect}>
                <X className="size-3" />
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="xs" onClick={toggleBatchMode}>
              <ListChecks className="size-3 mr-1" />
              多选
            </Button>
          )}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          <p className="text-sm">
            {searchQuery || filterType !== "all"
              ? "没有匹配的记录"
              : "暂无剪贴板记录"}
          </p>
        </div>
      ) : (
        <div ref={listRef} className="flex-1 overflow-auto">
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const item = filteredItems[virtualRow.index];
              return (
                <div
                  key={item.id}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div className="px-2 py-0.5">
                    <HistoryItem
                      item={item}
                      query={searchQuery}
                      isSelected={selectedItem?.id === item.id}
                      isBatchSelected={selectedIds.has(item.id)}
                      batchMode={batchMode}
                      isDeleting={deletingIds.has(item.id)}
                      isCopyFlashing={copyFlashingId === item.id}
                      isNew={newItemIds.has(item.id)}
                      onSelect={() => handleSelect(item)}
                      onCopy={() => handleCopy(item.id)}
                      onTogglePin={() => handleTogglePin(item.id)}
                      onDelete={() => handleDelete(item.id)}
                      onBatchToggle={() => toggleBatchSelect(item.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {/* Sentinel for infinite scroll */}
          <div ref={sentinelRef} className="flex items-center justify-center py-3">
            {isLoading && filteredItems.length > 0 ? (
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            ) : hasMore ? (
              <span className="text-xs text-muted-foreground/50">滚动加载更多</span>
            ) : filteredItems.length > 0 ? (
              <span className="text-xs text-muted-foreground/50">已加载全部</span>
            ) : null}
          </div>
        </div>
      )}

      <ImagePreview
        blob={previewBlob}
        open={previewBlob !== null}
        onClose={() => setPreviewBlob(null)}
      />
    </>
  );
}
