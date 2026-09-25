import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { Category } from "@/types";
import { DEFAULT_CATEGORIES } from "@/types";

const PALETTE = [
  "#f43f5e", "#a855f7", "#06b6d4", "#84cc16", "#f59e0b",
  "#3b82f6", "#d946ef", "#10b981", "#f97316", "#64748b",
];

export function useCategories() {
  const categories = useLiveQuery(() => db.categories.toArray(), []);

  const addCategory = async (name: string): Promise<Category> => {
    const id = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") || crypto.randomUUID();
    const existing = (categories ?? []).find((c) => c.id === id);
    if (existing) return existing;
    const color = PALETTE[(categories ?? []).length % PALETTE.length];
    const category: Category = { id, name: name.trim(), color };
    await db.categories.add(category);
    return category;
  };

  return {
    categories: categories ?? DEFAULT_CATEGORIES,
    isLoading: categories === undefined,
    addCategory,
  };
}
