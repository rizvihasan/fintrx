import { Transaction, Category } from "@/types";
import { BudgetOverview } from "@/components/budget-overview";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface BudgetsScreenProps {
  transactions: Transaction[];
  budgets: { category: string; budget: number }[];
  categories: Category[];
  onSetBudget: () => void;
}

export function BudgetsScreen({
  transactions,
  budgets,
  categories,
  onSetBudget,
}: BudgetsScreenProps) {
  return (
    <div className="space-y-5 px-4 pb-32 pt-4">
      <BudgetOverview
        transactions={transactions}
        budgets={budgets}
        categories={categories}
      />
      <Button
        className="h-12 w-full rounded-xl bg-teal-500 text-base font-semibold hover:bg-teal-600"
        onClick={onSetBudget}
      >
        <Plus className="mr-2 h-5 w-5" />
        Set a budget
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Set a monthly limit per category. The bar turns red the moment you cross it.
      </p>
    </div>
  );
}
