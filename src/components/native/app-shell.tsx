import { useEffect, useState } from "react";
import {
  LayoutGrid,
  ArrowLeftRight,
  Sparkles,
  Target,
  Plus,
  Download,
} from "lucide-react";
import { Category, CategoryBudget, Transaction, TransactionFormData } from "@/types";
import { HomeScreen } from "@/components/native/home-screen";
import { TransactionsScreen } from "@/components/native/transactions-screen";
import { BudgetsScreen } from "@/components/native/budgets-screen";
import { AskAi } from "@/components/ask-ai";
import { TransactionForm } from "@/components/transaction-form";
import { BudgetForm } from "@/components/budget-form";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { transactionsToCsv, downloadCsv } from "@/utils/transactions";
import { cn } from "@/lib/utils";
import { hapticTap, hapticSuccess, hapticWarning, configureStatusBar } from "@/lib/platform";

type Tab = "home" | "transactions" | "ask" | "budgets";

const TABS: { id: Tab; label: string; icon: typeof LayoutGrid }[] = [
  { id: "home", label: "Home", icon: LayoutGrid },
  { id: "transactions", label: "Activity", icon: ArrowLeftRight },
  { id: "ask", label: "Ask AI", icon: Sparkles },
  { id: "budgets", label: "Budgets", icon: Target },
];

interface AppShellProps {
  transactions: Transaction[];
  categories: Category[];
  budgets: CategoryBudget[];
  addTransaction: (data: TransactionFormData) => Promise<Transaction>;
  updateTransaction: (id: string, data: Omit<Transaction, "id">) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  setBudget: (category: string, amount: number) => Promise<void>;
}

export function AppShell({
  transactions,
  categories,
  budgets,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  setBudget,
}: AppShellProps) {
  const [tab, setTab] = useState<Tab>("home");
  const [addOpen, setAddOpen] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);

  useEffect(() => {
    configureStatusBar();
  }, []);

  const switchTab = (t: Tab) => {
    if (t !== tab) hapticTap();
    setTab(t);
  };

  const handleAdd = async (data: TransactionFormData) => {
    await addTransaction(data);
    setAddOpen(false);
    hapticSuccess();
  };

  const handleEdit = async (data: TransactionFormData) => {
    if (!editing) return;
    await updateTransaction(editing.id, {
      amount: data.amount,
      date: data.date,
      description: data.description,
      category: data.category,
      type: data.type,
    });
    setEditing(null);
    hapticSuccess();
  };

  const handleDelete = async () => {
    if (!deleting) return;
    await deleteTransaction(deleting.id);
    setDeleting(null);
    hapticWarning();
  };

  const handleExport = () => {
    const csv = transactionsToCsv(transactions, categories);
    const stamp = new Date().toISOString().split("T")[0];
    downloadCsv(`fintrx-transactions-${stamp}.csv`, csv);
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col bg-background">
      {/* iOS-style large-title header */}
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 pb-2 pt-3">
          <h1 className="text-[28px] font-bold tracking-tight">
            Fin<span className="text-teal-500">TRX</span>
          </h1>
          <button
            onClick={handleExport}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground active:opacity-60"
            aria-label="Export CSV"
          >
            <Download className="h-[18px] w-[18px]" />
          </button>
        </div>
      </header>

      {/* Content with iOS-like fade/slide transitions between tabs */}
      <main className="flex-1">
        <div key={tab} className="animate-tab-enter">
          {tab === "home" && (
            <HomeScreen transactions={transactions} categories={categories} />
          )}
          {tab === "transactions" && (
            <TransactionsScreen
              transactions={transactions}
              categories={categories}
              onEdit={setEditing}
              onDelete={setDeleting}
            />
          )}
          {tab === "ask" && (
            <div className="px-4 pb-32 pt-4">
              <AskAi transactions={transactions} categories={categories} />
            </div>
          )}
          {tab === "budgets" && (
            <BudgetsScreen
              transactions={transactions}
              budgets={budgets}
              categories={categories}
              onSetBudget={() => setBudgetOpen(true)}
            />
          )}
        </div>
      </main>

      {/* FAB - 56dp, iOS-style floating action */}
      <button
        onClick={() => setAddOpen(true)}
        className="fixed bottom-24 right-4 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-teal-500 text-white shadow-lg shadow-teal-500/30 active:scale-95 transition-transform"
        aria-label="Add transaction"
        style={{ bottom: "calc(6rem + env(safe-area-inset-bottom))" }}
      >
        <Plus className="h-7 w-7" strokeWidth={2.5} />
      </button>

      {/* Bottom tab bar - iOS style, blurred, safe-area aware */}
      <nav
        className="fixed inset-x-0 bottom-0 z-20 border-t border-border/60 bg-background/85 backdrop-blur-xl"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto grid max-w-lg grid-cols-4">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => switchTab(id)}
              className="flex h-14 flex-col items-center justify-center gap-0.5 active:opacity-60"
              aria-current={tab === id ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "h-[22px] w-[22px]",
                  tab === id ? "text-teal-500" : "text-muted-foreground"
                )}
                strokeWidth={tab === id ? 2.4 : 1.8}
              />
              <span
                className={cn(
                  "text-[10px] font-medium",
                  tab === id ? "text-teal-500" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Add transaction sheet */}
      <Drawer open={addOpen} onOpenChange={setAddOpen}>
        <DrawerContent className="max-h-[92dvh]">
          <DrawerHeader>
            <DrawerTitle>New transaction</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-8">
            <TransactionForm onSubmit={handleAdd} />
          </div>
        </DrawerContent>
      </Drawer>

      {/* Edit transaction sheet */}
      <Drawer open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DrawerContent className="max-h-[92dvh]">
          <DrawerHeader>
            <DrawerTitle>Edit transaction</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-8">
            {editing && (
              <TransactionForm
                isEditing
                defaultValues={{
                  amount: editing.amount,
                  date: editing.date,
                  description: editing.description,
                  category: editing.category,
                  type: editing.type ?? "expense",
                }}
                onSubmit={handleEdit}
                onCancel={() => setEditing(null)}
              />
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {/* Budget sheet */}
      <Drawer open={budgetOpen} onOpenChange={setBudgetOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Set monthly budget</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8">
            <BudgetForm
              categories={categories}
              onSubmit={async (category, amount) => {
                await setBudget(category, amount);
                setBudgetOpen(false);
                hapticSuccess();
              }}
            />
          </div>
        </DrawerContent>
      </Drawer>

      {/* Delete confirmation - iOS-style alert */}
      <AlertDialog open={deleting !== null} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent className="max-w-xs rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting?.description} - this can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="rounded-xl bg-red-600 hover:bg-red-500"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
