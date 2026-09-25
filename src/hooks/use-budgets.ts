import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";

export function useBudgets() {
  const budgets = useLiveQuery(() => db.budgets.toArray(), []);

  const setBudget = async (category: string, amount: number) => {
    await db.budgets.put({ category, budget: amount });
  };

  const getBudget = (category: string): number => {
    return (budgets ?? []).find((b) => b.category === category)?.budget || 0;
  };

  const deleteBudget = async (category: string) => {
    await db.budgets.delete(category);
  };

  return {
    budgets: budgets ?? [],
    isLoading: budgets === undefined,
    setBudget,
    getBudget,
    deleteBudget,
  };
}
