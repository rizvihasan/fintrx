import { useMemo, useState } from "react";
import { Transaction, Category } from "@/types";
import { SwipeRow } from "@/components/native/swipe-row";
import { motion } from "framer-motion";
import { SearchX, ReceiptText, Plus } from "lucide-react";

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 320, damping: 30 } },
};
const list = { show: { transition: { staggerChildren: 0.045 } } };

interface TransactionsScreenProps {
  transactions: Transaction[];
  categories: Category[];
  onEdit: (t: Transaction) => void;
  onDelete: (t: Transaction) => void;
  onAdd?: () => void;
}

export function TransactionsScreen({
  transactions,
  categories,
  onEdit,
  onDelete,
  onAdd,
}: TransactionsScreenProps) {
  const [query, setQuery] = useState("");

  const catName = (t: Transaction) =>
    categories.find((c) => c.id === t.category)?.name ?? "Other";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    if (!q) return sorted;
    return sorted.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        catName(t).toLowerCase().includes(q) ||
        String(t.amount).includes(q)
    );
  }, [transactions, query, categories]);

  return (
    <div className="space-y-4 px-4 pb-32 pt-4">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search transactions"
        className="h-12 w-full rounded-2xl border-0 bg-secondary/50 px-4 text-[15px] outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-teal-500/40"
      />
      {transactions.length === 0 ? (
        <div className="rounded-2xl bg-secondary/50 px-4 py-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/15">
            <ReceiptText className="h-6 w-6 text-teal-400" />
          </div>
          <p className="text-[15px] font-semibold">Nothing logged yet</p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Everything you add shows up here, newest first.
          </p>
          {onAdd && (
            <button
              onClick={onAdd}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-teal-500 px-5 py-2.5 text-[14px] font-semibold text-white active:opacity-70"
            >
              <Plus className="h-4 w-4" /> Add your first transaction
            </button>
          )}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-secondary/50 px-4 py-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
            <SearchX className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-[15px] font-semibold">No matches for "{query}"</p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Try a name, category, or amount.
          </p>
        </div>
      ) : (
        <motion.div
          className="space-y-2"
          initial="hidden"
          animate="show"
          variants={list}
          key={query}
        >
          {filtered.map((t) => (
            <motion.div key={t.id} variants={item} layout={false}>
              <SwipeRow onEdit={() => onEdit(t)} onDelete={() => onDelete(t)}>
                <div className="flex items-center justify-between px-4 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-medium">{t.description}</p>
                    <p className="text-[12px] text-muted-foreground">
                      {catName(t)} ·{" "}
                      {new Date(t.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <p
                    className={
                      t.type === "income"
                        ? "text-[15px] font-semibold text-teal-400"
                        : "text-[15px] font-semibold"
                    }
                  >
                    {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
                  </p>
                </div>
              </SwipeRow>
            </motion.div>
          ))}
        </motion.div>
      )}
      <p className="pt-1 text-center text-[12px] text-muted-foreground">
        Swipe any transaction left to edit or delete.
      </p>
    </div>
  );
}
