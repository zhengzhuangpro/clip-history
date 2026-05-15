import { Pin, Trash2, Copy, Image, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { blobToDataUrl } from "@/lib/utils";
import { splitByHighlight } from "@/lib/highlight";
import type { ClipItem } from "@/types";

interface HistoryItemProps {
  item: ClipItem;
  query: string;
  isSelected: boolean;
  isBatchSelected: boolean;
  batchMode: boolean;
  isDeleting?: boolean;
  isCopyFlashing?: boolean;
  isNew?: boolean;
  onSelect: () => void;
  onCopy: () => void;
  onTogglePin: () => void;
  onDelete: () => void;
  onBatchToggle: () => void;
}

function highlightText(text: string, query: string) {
  const segments = splitByHighlight(text, query);
  if (segments.length === 1 && !segments[0].highlighted) return text;
  return segments.map((seg, i) =>
    seg.highlighted ? (
      <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">
        {seg.text}
      </mark>
    ) : (
      seg.text
    ),
  );
}

export function HistoryItem({
  item,
  query,
  isSelected,
  isBatchSelected,
  batchMode,
  isDeleting,
  isCopyFlashing,
  isNew,
  onSelect,
  onCopy,
  onTogglePin,
  onDelete,
  onBatchToggle,
}: HistoryItemProps) {
  const isImage = item.contentType === "image";

  const animationStyle = isDeleting
    ? { animation: "item-delete 250ms ease-out forwards" }
    : isNew
      ? { animation: "item-new 200ms ease-out" }
      : undefined;

  return (
    <div
      onClick={batchMode ? onBatchToggle : onSelect}
      onDoubleClick={batchMode ? undefined : onCopy}
      style={animationStyle}
      className={`group relative flex cursor-pointer flex-col gap-1 rounded-lg border px-3 py-2 transition-all duration-150 ${
        isSelected && !batchMode
          ? "border-primary bg-accent"
          : isBatchSelected
            ? "border-primary/50 bg-primary/5"
            : "border-transparent hover:bg-muted/50"
      } ${isCopyFlashing ? "animate-[item-copy-flash_400ms_ease-out]" : ""}`}
      data-selected={isSelected}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {batchMode && (
            <div
              className={`flex size-4 items-center justify-center rounded border transition-colors ${
                isBatchSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/30"
              }`}
            >
              {isBatchSelected && <Check className="size-3" />}
            </div>
          )}
          {isImage && <Image className="size-3 text-muted-foreground" />}
          <span className="text-xs text-muted-foreground">
            {new Date(item.createdAt).toLocaleString("zh-CN", {
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        {!batchMode && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {item.isPinned && (
              <Pin className="size-3 text-primary fill-primary" />
            )}
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin();
              }}
            >
              <Pin className="size-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={(e) => {
                e.stopPropagation();
                onCopy();
              }}
            >
              <Copy className="size-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="size-3" />
            </Button>
          </div>
        )}
      </div>

      {isImage && item.thumbnail ? (
        <img
          src={blobToDataUrl(item.thumbnail)}
          alt="clipboard image"
          className="max-h-32 rounded border object-contain"
        />
      ) : (
        <p className="text-sm leading-snug whitespace-pre-wrap break-all line-clamp-3">
          {item.textContent
            ? highlightText(item.textContent.slice(0, 200), query)
            : ""}
        </p>
      )}
    </div>
  );
}
