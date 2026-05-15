import { create } from "zustand";
import type { ClipItem } from "@/types";
import { getHistory, getClipItem } from "@/lib/tauri";
import type { FilterType } from "@/components/SearchBar";

const PAGE_SIZE = 100;

interface HistoryState {
  items: ClipItem[];
  filteredItems: ClipItem[];
  selectedItem: ClipItem | null;
  selectedIndex: number;
  searchQuery: string;
  filterType: FilterType;
  isLoading: boolean;
  hasMore: boolean;
  batchMode: boolean;
  selectedIds: Set<number>;

  loadItems: () => Promise<void>;
  loadMore: () => Promise<void>;
  appendItem: (id: number) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setFilterType: (filter: FilterType) => void;
  setSelectedItem: (item: ClipItem | null) => void;
  setSelectedIndex: (index: number) => void;
  setLoading: (loading: boolean) => void;
  removeItem: (id: number) => void;
  removeItems: (ids: number[]) => void;
  toggleBatchMode: () => void;
  toggleBatchSelect: (id: number) => void;
  clearBatchSelect: () => void;
  selectAll: () => void;
}

function applyFilter(items: ClipItem[], query: string, filter: FilterType): ClipItem[] {
  let result = items;

  if (filter !== "all") {
    result = result.filter((item) => item.contentType === filter);
  }

  if (query.trim()) {
    const q = query.toLowerCase();
    result = result.filter((item) =>
      item.textContent?.toLowerCase().includes(q)
    );
  }

  return result;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
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

  loadItems: async () => {
    set({ isLoading: true });
    try {
      const items = await getHistory(PAGE_SIZE, 0);
      const { searchQuery, filterType } = get();
      set({
        items,
        filteredItems: applyFilter(items, searchQuery, filterType),
        hasMore: items.length >= PAGE_SIZE,
      });
    } catch (e) {
      console.error("Failed to load history:", e);
    } finally {
      set({ isLoading: false });
    }
  },

  loadMore: async () => {
    const { items, hasMore, isLoading, searchQuery, filterType } = get();
    if (!hasMore || isLoading) return;
    set({ isLoading: true });
    try {
      const more = await getHistory(PAGE_SIZE, items.length);
      const merged = [...items, ...more.filter((m) => !items.some((i) => i.id === m.id))];
      set({
        items: merged,
        filteredItems: applyFilter(merged, searchQuery, filterType),
        hasMore: more.length >= PAGE_SIZE,
      });
    } catch (e) {
      console.error("Failed to load more:", e);
    } finally {
      set({ isLoading: false });
    }
  },

  appendItem: async (id: number) => {
    try {
      const item = await getClipItem(id);
      if (item) {
        set((state) => {
          const items = [item, ...state.items.filter((i) => i.id !== id)];
          return {
            items,
            filteredItems: applyFilter(items, state.searchQuery, state.filterType),
          };
        });
      }
    } catch (e) {
      console.error("Failed to fetch new clip item:", e);
    }
  },

  setSearchQuery: (searchQuery: string) => {
    set((state) => ({
      searchQuery,
      filteredItems: applyFilter(state.items, searchQuery, state.filterType),
    }));
  },

  setFilterType: (filterType: FilterType) => {
    set((state) => ({
      filterType,
      filteredItems: applyFilter(state.items, state.searchQuery, filterType),
    }));
  },

  setSelectedItem: (selectedItem) => {
    const { filteredItems } = get();
    const index = selectedItem ? filteredItems.findIndex((i) => i.id === selectedItem.id) : -1;
    set({ selectedItem, selectedIndex: index });
  },
  setSelectedIndex: (selectedIndex) => {
    const { filteredItems } = get();
    const clamped = Math.max(-1, Math.min(selectedIndex, filteredItems.length - 1));
    set({
      selectedIndex: clamped,
      selectedItem: clamped >= 0 ? filteredItems[clamped] : null,
    });
  },
  setLoading: (isLoading) => set({ isLoading }),
  removeItem: (id) =>
    set((state) => {
      const items = state.items.filter((i) => i.id !== id);
      const filteredItems = applyFilter(items, state.searchQuery, state.filterType);
      return {
        items,
        filteredItems,
        selectedItem:
          state.selectedItem?.id === id ? null : state.selectedItem,
        selectedIndex: state.selectedItem?.id === id ? -1 : state.selectedIndex,
      };
    }),
  removeItems: (ids) =>
    set((state) => {
      const idSet = new Set(ids);
      const items = state.items.filter((i) => !idSet.has(i.id));
      const filteredItems = applyFilter(items, state.searchQuery, state.filterType);
      return {
        items,
        filteredItems,
        selectedItem: state.selectedItem && idSet.has(state.selectedItem.id) ? null : state.selectedItem,
        selectedIndex: state.selectedItem && idSet.has(state.selectedItem.id) ? -1 : state.selectedIndex,
        selectedIds: new Set(),
      };
    }),
  toggleBatchMode: () =>
    set((state) => ({
      batchMode: !state.batchMode,
      selectedIds: new Set(),
    })),
  toggleBatchSelect: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { selectedIds: next };
    }),
  clearBatchSelect: () => set({ selectedIds: new Set(), batchMode: false }),
  selectAll: () =>
    set((state) => ({
      selectedIds: new Set(state.filteredItems.map((i) => i.id)),
    })),
}));
