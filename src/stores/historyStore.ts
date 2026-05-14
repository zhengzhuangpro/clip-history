import { create } from "zustand";
import type { ClipItem } from "@/types";

interface HistoryState {
  items: ClipItem[];
  selectedItem: ClipItem | null;
  searchQuery: string;
  isLoading: boolean;

  setItems: (items: ClipItem[]) => void;
  addItem: (item: ClipItem) => void;
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

  setItems: (items) => set({ items }),
  addItem: (item) =>
    set((state) => ({ items: [item, ...state.items] })),
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
