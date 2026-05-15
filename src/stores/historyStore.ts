import { create } from "zustand";
import type { ClipItem } from "@/types";
import { getHistory, getClipItem } from "@/lib/tauri";
import type { FilterType } from "@/components/SearchBar";

interface HistoryState {
  items: ClipItem[];
  filteredItems: ClipItem[];
  selectedItem: ClipItem | null;
  searchQuery: string;
  filterType: FilterType;
  isLoading: boolean;

  loadItems: () => Promise<void>;
  appendItem: (id: number) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setFilterType: (filter: FilterType) => void;
  setSelectedItem: (item: ClipItem | null) => void;
  setLoading: (loading: boolean) => void;
  removeItem: (id: number) => void;
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
  searchQuery: "",
  filterType: "all",
  isLoading: false,

  loadItems: async () => {
    set({ isLoading: true });
    try {
      const items = await getHistory();
      const { searchQuery, filterType } = get();
      set({ items, filteredItems: applyFilter(items, searchQuery, filterType) });
    } catch (e) {
      console.error("Failed to load history:", e);
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

  setSelectedItem: (selectedItem) => set({ selectedItem }),
  setLoading: (isLoading) => set({ isLoading }),
  removeItem: (id) =>
    set((state) => {
      const items = state.items.filter((i) => i.id !== id);
      return {
        items,
        filteredItems: applyFilter(items, state.searchQuery, state.filterType),
        selectedItem:
          state.selectedItem?.id === id ? null : state.selectedItem,
      };
    }),
}));
