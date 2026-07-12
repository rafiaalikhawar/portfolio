/** Search view state: query, active filter, and recent searches (persisted). */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SearchFilter } from "@/lib/search";

const MAX_RECENT = 6;

type SearchState = {
  query: string;
  filter: SearchFilter;
  recentSearches: string[];
  setQuery: (q: string) => void;
  setFilter: (f: SearchFilter) => void;
  commitSearch: (q: string) => void;
  clearRecent: () => void;
};

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      query: "",
      filter: "all",
      recentSearches: [],
      setQuery: (q) => set({ query: q }),
      setFilter: (f) => set({ filter: f }),
      commitSearch: (q) =>
        set((s) => {
          const trimmed = q.trim();
          if (!trimmed) return s;
          return {
            query: trimmed,
            recentSearches: [
              trimmed,
              ...s.recentSearches.filter(
                (r) => r.toLowerCase() !== trimmed.toLowerCase(),
              ),
            ].slice(0, MAX_RECENT),
          };
        }),
      clearRecent: () => set({ recentSearches: [] }),
    }),
    {
      name: "softlab-search",
      partialize: (s) => ({ recentSearches: s.recentSearches }),
    },
  ),
);
