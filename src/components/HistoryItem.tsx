import { Pin, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ClipItem } from "@/types";

interface HistoryItemProps {
  item: ClipItem;
  isSelected: boolean;
  onSelect: () => void;
  onCopy: () => void;
  onTogglePin: () => void;
  onDelete: () => void;
}

export function HistoryItem({
  item,
  isSelected,
  onSelect,
  onCopy,
  onTogglePin,
  onDelete,
}: HistoryItemProps) {
  const preview =
    item.contentType === "text"
      ? item.textContent?.slice(0, 200) ?? ""
      : "[图片]";

  return (
    <div
      onClick={onSelect}
      onDoubleClick={onCopy}
      className={`group relative flex cursor-pointer flex-col gap-1 rounded-lg border px-3 py-2 transition-colors ${
        isSelected
          ? "border-primary bg-accent"
          : "border-transparent hover:bg-muted/50"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {new Date(item.createdAt).toLocaleString("zh-CN", {
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
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
      </div>
      <p className="text-sm leading-snug whitespace-pre-wrap break-all line-clamp-3">
        {preview}
      </p>
    </div>
  );
}
