import { describe, it, expect, beforeEach } from "vitest";
import { applyFilter, useHistoryStore } from "./historyStore";
import type { ClipItem } from "@/types";

function makeItem(overrides: Partial<ClipItem> = {}): ClipItem {
  return {
    id: 1,
    contentType: "text",
    textContent: "hello world",
    imageBlob: null,
    thumbnail: null,
    imageWidth: null,
    imageHeight: null,
    imageFormat: null,
    sourceApp: null,
    contentHash: "abc123",
    isPinned: false,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

describe("applyFilter", () => {
  const items: ClipItem[] = [
    makeItem({ id: 1, contentType: "text", textContent: "hello world" }),
    makeItem({ id: 2, contentType: "text", textContent: "foo bar" }),
    makeItem({ id: 3, contentType: "image", textContent: null }),
    makeItem({ id: 4, contentType: "text", textContent: "Hello World" }),
  ];

  it("returns all items when filter is 'all' and query is empty", () => {
    expect(applyFilter(items, "", "all")).toEqual(items);
  });

  it("filters by contentType when filter is 'text'", () => {
    const result = applyFilter(items, "", "text");
    expect(result).toHaveLength(3);
    expect(result.every((i) => i.contentType === "text")).toBe(true);
  });

  it("filters by contentType when filter is 'image'", () => {
    const result = applyFilter(items, "", "image");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(3);
  });

  it("filters by case-insensitive substring match", () => {
    const result = applyFilter(items, "hello", "all");
    expect(result).toHaveLength(2);
    expect(result.map((i) => i.id)).toEqual([1, 4]);
  });

  it("combines type filter AND query filter", () => {
    const result = applyFilter(items, "hello", "text");
    expect(result).toHaveLength(2);
  });

  it("excludes image items with null textContent from text query", () => {
    const result = applyFilter(items, "hello", "image");
    expect(result).toHaveLength(0);
  });

  it("returns empty array for empty items", () => {
    expect(applyFilter([], "test", "all")).toEqual([]);
  });

  it("handles whitespace-only query as empty", () => {
    expect(applyFilter(items, "   ", "all")).toEqual(items);
  });
});

describe("historyStore actions", () => {
  beforeEach(() => {
    useHistoryStore.setState({
      items: [],
      filteredItems: [],
      selectedItem: null,
      selectedIndex: -1,
      searchQuery: "",
      filterType: "all",
      isLoading: false,
      hasMore: true,
      batchMode: false,
      selectedIds: new Set(),
    });
  });

  describe("setSelectedIndex", () => {
    it("clamps to -1", () => {
      const items = [makeItem({ id: 1 }), makeItem({ id: 2 })];
      useHistoryStore.setState({ filteredItems: items });
      useHistoryStore.getState().setSelectedIndex(-5);
      expect(useHistoryStore.getState().selectedIndex).toBe(-1);
      expect(useHistoryStore.getState().selectedItem).toBeNull();
    });

    it("clamps to last index", () => {
      const items = [makeItem({ id: 1 }), makeItem({ id: 2 })];
      useHistoryStore.setState({ filteredItems: items });
      useHistoryStore.getState().setSelectedIndex(10);
      expect(useHistoryStore.getState().selectedIndex).toBe(1);
      expect(useHistoryStore.getState().selectedItem?.id).toBe(2);
    });

    it("sets selectedItem for valid index", () => {
      const items = [makeItem({ id: 1 }), makeItem({ id: 2 })];
      useHistoryStore.setState({ filteredItems: items });
      useHistoryStore.getState().setSelectedIndex(0);
      expect(useHistoryStore.getState().selectedIndex).toBe(0);
      expect(useHistoryStore.getState().selectedItem?.id).toBe(1);
    });
  });

  describe("removeItem", () => {
    it("removes from items and filteredItems", () => {
      const items = [makeItem({ id: 1 }), makeItem({ id: 2 })];
      useHistoryStore.setState({ items, filteredItems: items });
      useHistoryStore.getState().removeItem(1);
      const state = useHistoryStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].id).toBe(2);
      expect(state.filteredItems).toHaveLength(1);
    });

    it("clears selection if removed item was selected", () => {
      const items = [makeItem({ id: 1 }), makeItem({ id: 2 })];
      useHistoryStore.setState({
        items,
        filteredItems: items,
        selectedItem: items[0],
        selectedIndex: 0,
      });
      useHistoryStore.getState().removeItem(1);
      const state = useHistoryStore.getState();
      expect(state.selectedItem).toBeNull();
      expect(state.selectedIndex).toBe(-1);
    });
  });

  describe("removeItems", () => {
    it("removes multiple items", () => {
      const items = [makeItem({ id: 1 }), makeItem({ id: 2 }), makeItem({ id: 3 })];
      useHistoryStore.setState({ items, filteredItems: items });
      useHistoryStore.getState().removeItems([1, 3]);
      const state = useHistoryStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].id).toBe(2);
    });

    it("clears batch selection", () => {
      const items = [makeItem({ id: 1 }), makeItem({ id: 2 })];
      useHistoryStore.setState({ items, filteredItems: items, selectedIds: new Set([1, 2]) });
      useHistoryStore.getState().removeItems([1]);
      expect(useHistoryStore.getState().selectedIds.size).toBe(0);
    });
  });

  describe("toggleBatchMode", () => {
    it("toggles batchMode", () => {
      expect(useHistoryStore.getState().batchMode).toBe(false);
      useHistoryStore.getState().toggleBatchMode();
      expect(useHistoryStore.getState().batchMode).toBe(true);
      useHistoryStore.getState().toggleBatchMode();
      expect(useHistoryStore.getState().batchMode).toBe(false);
    });

    it("resets selectedIds on toggle", () => {
      useHistoryStore.setState({ selectedIds: new Set([1, 2]) });
      useHistoryStore.getState().toggleBatchMode();
      expect(useHistoryStore.getState().selectedIds.size).toBe(0);
    });
  });

  describe("toggleBatchSelect", () => {
    it("adds id on first call", () => {
      useHistoryStore.getState().toggleBatchSelect(1);
      expect(useHistoryStore.getState().selectedIds.has(1)).toBe(true);
    });

    it("removes id on second call", () => {
      useHistoryStore.getState().toggleBatchSelect(1);
      useHistoryStore.getState().toggleBatchSelect(1);
      expect(useHistoryStore.getState().selectedIds.has(1)).toBe(false);
    });
  });

  describe("selectAll", () => {
    it("selects all filtered item ids", () => {
      const items = [makeItem({ id: 1 }), makeItem({ id: 2 }), makeItem({ id: 3 })];
      useHistoryStore.setState({ filteredItems: items });
      useHistoryStore.getState().selectAll();
      const ids = useHistoryStore.getState().selectedIds;
      expect(ids.size).toBe(3);
      expect(ids.has(1)).toBe(true);
      expect(ids.has(2)).toBe(true);
      expect(ids.has(3)).toBe(true);
    });
  });

  describe("clearBatchSelect", () => {
    it("resets selectedIds and batchMode", () => {
      useHistoryStore.setState({ selectedIds: new Set([1, 2]), batchMode: true });
      useHistoryStore.getState().clearBatchSelect();
      const state = useHistoryStore.getState();
      expect(state.selectedIds.size).toBe(0);
      expect(state.batchMode).toBe(false);
    });
  });

  describe("setSearchQuery", () => {
    it("updates searchQuery and recomputes filteredItems", () => {
      const items = [
        makeItem({ id: 1, textContent: "hello" }),
        makeItem({ id: 2, textContent: "world" }),
      ];
      useHistoryStore.setState({ items, filteredItems: items });
      useHistoryStore.getState().setSearchQuery("hello");
      const state = useHistoryStore.getState();
      expect(state.searchQuery).toBe("hello");
      expect(state.filteredItems).toHaveLength(1);
      expect(state.filteredItems[0].id).toBe(1);
    });
  });

  describe("setFilterType", () => {
    it("updates filterType and recomputes filteredItems", () => {
      const items = [
        makeItem({ id: 1, contentType: "text" }),
        makeItem({ id: 2, contentType: "image" }),
      ];
      useHistoryStore.setState({ items, filteredItems: items });
      useHistoryStore.getState().setFilterType("image");
      const state = useHistoryStore.getState();
      expect(state.filterType).toBe("image");
      expect(state.filteredItems).toHaveLength(1);
      expect(state.filteredItems[0].id).toBe(2);
    });
  });
});
