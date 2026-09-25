import { useMemo } from "react";
import { Transaction, Category } from "@/types";
import { ExpenseSummary } from "@/components/expense-summary";
import { ExpenseChart } from "@/components/expense-chart";
import { formatCurrency, formatDate, sortTransactionsByDate } from "@/utils/transactions";

interface HomeScreenProps {
  transactions: Transaction[];
  categories: Category[];
}

export function HomeScreen({ transactions, categories }: HomeScreenProps) {
  const recent = useMemo(
    () => sortTransactionsByDate(transactions).slice(0, 5),
    [transactions]
  );
  const categoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name || id;

  return (
    <div className="space-y-6 px-4 pb-32 pt-4">
      <ExpenseSummary transactions={transactions} />
      <ExpenseChart transactions={transactions} />
      <section>
        <h2 className="mb-3 text-base font-semibold">Recent activity</h2>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing yet - tap + to add your first transaction.
          </p>
        ) : (
          <ul className="divide-y divide-border/50 overflow-hidden rounded-2xl bg-secondary/50">
            {recent.map((t) => (
              <li key={t.id} className="flex items-center justify-between px-4 py-3.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{t.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {categoryName(t.category)} - {formatDate(t.date)}
                  </p>
                </div>
                <span
                  className={`ml-3 whitespace-nowrap text-sm font-semibold ${
                    t.type === "income" ? "text-teal-500" : ""
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}
                  {formatCurrency(t.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
