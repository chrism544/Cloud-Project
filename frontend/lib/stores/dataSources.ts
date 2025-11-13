import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DataSource {
  id: string;
  name: string;
  type: "rest" | "graphql" | "static";
  url?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: string;
  staticData?: any;
  transformScript?: string; // JavaScript code to transform response
}

interface DataSourceState {
  sources: DataSource[];
  addSource: (source: Omit<DataSource, "id">) => void;
  updateSource: (id: string, updates: Partial<DataSource>) => void;
  deleteSource: (id: string) => void;
  getSource: (id: string) => DataSource | undefined;
}

export const useDataSourceStore = create<DataSourceState>()(
  persist(
    (set, get) => ({
      sources: [],
      addSource: (source) =>
        set((state) => ({
          sources: [
            ...state.sources,
            { ...source, id: crypto.randomUUID() },
          ],
        })),
      updateSource: (id, updates) =>
        set((state) => ({
          sources: state.sources.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),
      deleteSource: (id) =>
        set((state) => ({
          sources: state.sources.filter((s) => s.id !== id),
        })),
      getSource: (id) => get().sources.find((s) => s.id === id),
    }),
    {
      name: "data-sources-storage",
    }
  )
);
