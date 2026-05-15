import { create } from "zustand";
import type { ClipItem } from "@/types";
import { getHistory, getClipItem } from "@/lib/tauri";

interface HistoryState {
  items: ClipItem[];
  selectedItem: ClipItem | null;
  searchQuery: string;
  isLoading: boolean;

  loadItems: () => Promise<void>;
  appendItem: (id: number) => Promise<void>;
  setItems: (items: ClipItem[]) => void;
  setSelectedItem: (item: ClipItem | null) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  removeItem: (id: number) => void;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  items: [],
  selectedItem: null,
  searchQuery: "",
  isLoading: false,

  loadItems: async () => {
    set({ isLoading: true });
    try {
      console.log("Loading history items...");
      const items = await getHistory();
      console.log("Loaded items:", items.length);
      set({ items });
    } catch (e) {
      console.error("Failed to load history:", e);
    } finally {
      set({ isLoading: false });
    }
  },

  appendItem: async (id: number) => {
    try {
      console.log("Fetching clip item:", id);
      const item = await getClipItem(id);
      console.log("Got clip item:", item);
      if (item) {
        set((state) => ({
          items: [item, ...state.items.filter((i) => i.id !== id)],
        }));
      }
    } catch (e) {
      console.error("Failed to fetch new clip item:", e);
    }
  },

  setItems: (items) => set({ items }),
  setSelectedItem: (selectedItem) => set({ selectedItem }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setLoading: (isLoading) => set({ isLoading }),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
      selectedItem:
        state.selectedItem?.id === id ? null : state.selectedItem,
    })),
}));
