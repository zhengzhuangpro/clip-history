import { Search, X, Image, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type FilterType = "all" | "text" | "image";

interface SearchBarProps {
  query: string;
  filter: FilterType;
  onQueryChange: (query: string) => void;
  onFilterChange: (filter: FilterType) => void;
}

export function SearchBar({
  query,
  filter,
  onQueryChange,
  onFilterChange,
}: SearchBarProps) {
  return (
    <div className="flex flex-col gap-2 border-b px-3 py-2">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="搜索剪贴板历史..."
          className="pl-8 pr-8 h-8 text-sm"
        />
        {query && (
          <button
            onClick={() => onQueryChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
      <div className="flex gap-1">
        <FilterButton
          active={filter === "all"}
          onClick={() => onFilterChange("all")}
        >
          全部
        </FilterButton>
        <FilterButton
          active={filter === "text"}
          onClick={() => onFilterChange("text")}
        >
          <FileText className="size-3" />
          文本
        </FilterButton>
        <FilterButton
          active={filter === "image"}
          onClick={() => onFilterChange("image")}
        >
          <Image className="size-3" />
          图片
        </FilterButton>
      </div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      size="xs"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
