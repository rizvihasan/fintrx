import { useMemo, useState } from "react";
import { Transaction, Category, TransactionFormData } from "@/types";
import { SwipeRow } from "@/components/native/swipe-row";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate, sortTransactionsByDate } from "@/utils/transactions";
import { FileText } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

interface TransactionsScreenProps {
  transactions: Transaction[];
  categories: Category[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export function TransactionsScreen({
  transactions,
  categories,
  onEdit,
  onDelete,
}: TransactionsScreenProps) {
  const [search, setSearch] = useState("");
  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    const sorted = sortTransactionsByDate(transactions);
    if (!term) return sorted;
    return sorted.filter((t) => t.description.toLowerCase().includes(term));
  }, [transactions, search]);

  const categoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name || id;

  return (
    <div className="px-4 pb-32 pt-4">
      <Input
        placeholder="Search transactions..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 h-12 rounded-xl text-base"
      />
      {rows.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-12 w-12 opacity-50" />}
          title={transactions.length === 0 ? "No transactions yet" : "No matches"}
          description={
            transactions.length === 0
              ? "Tap + to add your first transaction."
              : "Try a different search."
          }
        />
      ) : (
        <div className="space-y-2">
          {rows.map((t) => (
            <SwipeRow key={t.id} onEdit={() => onEdit(t)} onDelete={() => onDelete(t)}>
              <div className="flex items-center justify-between rounded-2xl bg-secondary/50 px-4 py-3.5">
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
              </div>
            </SwipeRow>
          ))}
        </div>
      )}
    </div>
  );
}
