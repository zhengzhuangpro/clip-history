import { Pin, Trash2, Copy, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { blobToDataUrl } from "@/lib/utils";
import type { ClipItem } from "@/types";

interface HistoryItemProps {
  item: ClipItem;
  query: string;
  isSelected: boolean;
  onSelect: () => void;
  onCopy: () => void;
  onTogglePin: () => void;
  onDelete: () => void;
}

function highlightText(text: string, query: string) {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

export function HistoryItem({
  item,
  query,
  isSelected,
  onSelect,
  onCopy,
  onTogglePin,
  onDelete,
}: HistoryItemProps) {
  const isImage = item.contentType === "image";

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
        <div className="flex items-center gap-1.5">
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
