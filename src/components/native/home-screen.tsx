import { Transaction, Category } from "@/types";
import { ExpenseChart } from "@/components/expense-chart";
import { CountUp } from "@/components/native/count-up";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet, ArrowRight, Plus } from "lucide-react";

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 28 } },
};
const list = { show: { transition: { staggerChildren: 0.06 } } };

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

interface HomeScreenProps {
  transactions: Transaction[];
  categories: Category[];
  onSeeAll?: () => void;
  onAdd?: () => void;
}

export function HomeScreen({ transactions, categories, onSeeAll, onAdd }: HomeScreenProps) {
  const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter((t) => t.type !== "income").reduce((s, t) => s + t.amount, 0);
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const catName = (t: Transaction) =>
    categories.find((c) => c.id === t.category)?.name ?? "Other";

  return (
    <motion.div
      className="space-y-6 px-4 pb-32 pt-4"
      initial="hidden"
      animate="show"
      variants={list}
    >
      <motion.div variants={item}>
        <p className="text-[15px] text-muted-foreground">{greeting()}</p>
        <h2 className="text-[22px] font-bold tracking-tight">Your money, at a glance</h2>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-secondary/50 p-4">
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5 text-teal-400" /> Income
          </div>
          <p className="mt-1.5 text-[22px] font-bold tracking-tight text-teal-400">
            <CountUp value={income} />
          </p>
        </div>
        <div className="rounded-2xl bg-secondary/50 p-4">
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground">
            <TrendingDown className="h-3.5 w-3.5 text-red-400" /> Expenses
          </div>
          <p className="mt-1.5 text-[22px] font-bold tracking-tight text-red-400">
            <CountUp value={expenses} />
          </p>
        </div>
        <div className="col-span-2 rounded-2xl bg-secondary/50 p-4">
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground">
            <Wallet className="h-3.5 w-3.5" /> Balance
          </div>
          <p className="mt-1.5 text-[28px] font-bold tracking-tight">
            <CountUp value={income - expenses} />
          </p>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <div className="mb-2 flex items-baseline justify-between">
          <h3 className="text-[17px] font-semibold tracking-tight">Recent activity</h3>
          {recent.length > 0 && (
            <button
              onClick={onSeeAll}
              className="flex items-center gap-0.5 text-[13px] font-medium text-teal-400 active:opacity-60"
            >
              See all <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        {recent.length === 0 ? (
          <div className="rounded-2xl bg-secondary/50 px-4 py-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/15">
              <Plus className="h-6 w-6 text-teal-400" />
            </div>
            <p className="text-[15px] font-semibold">No transactions yet</p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Tap + to log your first one. It takes five seconds.
            </p>
            {onAdd && (
              <button
                onClick={onAdd}
                className="mt-4 rounded-xl bg-teal-500 px-5 py-2.5 text-[14px] font-semibold text-white active:opacity-70"
              >
                Add a transaction
              </button>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-border/50 overflow-hidden rounded-2xl bg-secondary/50">
            {recent.map((t) => (
              <li key={t.id} className="flex items-center justify-between px-4 py-3.5">
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-medium">{t.description}</p>
                  <p className="text-[12px] text-muted-foreground">
                    {catName(t)} · {new Date(t.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
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
              </li>
            ))}
          </ul>
        )}
      </motion.div>

      <motion.div variants={item}>
        <h3 className="mb-2 text-[17px] font-semibold tracking-tight">Monthly expenses</h3>
        <div className="rounded-2xl bg-secondary/50 p-3">
          <ExpenseChart transactions={transactions} />
        </div>
      </motion.div>
    </motion.div>
  );
}
