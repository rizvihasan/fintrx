import { Transaction, ChartData, Category, DEFAULT_CATEGORIES } from "@/types";

export const generateId = (): string => crypto.randomUUID();

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

// Legacy rows predate the type field and are all expenses.
export const isExpense = (t: Transaction): boolean => t.type !== "income";
export const isIncome = (t: Transaction): boolean => t.type === "income";

export const calculateTotalExpenses = (transactions: Transaction[]): number =>
  transactions.filter(isExpense).reduce((sum, t) => sum + t.amount, 0);

export const calculateTotalIncome = (transactions: Transaction[]): number =>
  transactions.filter(isIncome).reduce((sum, t) => sum + t.amount, 0);

export const groupTransactionsByCategory = (
  transactions: Transaction[],
  categories: Category[] = DEFAULT_CATEGORIES
): ChartData[] => {
  const categoryMap: Record<string, number> = {};

  transactions.filter(isExpense).forEach((t) => {
    const category = t.category || "other";
    categoryMap[category] = (categoryMap[category] || 0) + t.amount;
  });

  return Object.entries(categoryMap).map(([category, amount]) => ({
    name: categories.find((c) => c.id === category)?.name || category,
    amount,
  }));
};

export const groupExpensesByMonth = (transactions: Transaction[]): ChartData[] => {
  const monthMap: Record<string, number> = {};

  const sorted = [...transactions].filter(isExpense).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  sorted.forEach((t) => {
    const date = new Date(t.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    monthMap[key] = (monthMap[key] || 0) + t.amount;
  });

  return Object.entries(monthMap).map(([key, amount]) => {
    const [year, month] = key.split("-");
    const date = new Date(parseInt(year), parseInt(month));
    const name = new Intl.DateTimeFormat("en-IN", {
      month: "short",
      year: "2-digit",
    }).format(date);
    return { name, amount };
  });
};

export const sortTransactionsByDate = (transactions: Transaction[]): Transaction[] =>
  [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

const csvEscape = (value: string): string => {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
};

export function transactionsToCsv(
  transactions: Transaction[],
  categories: Category[] = DEFAULT_CATEGORIES
): string {
  const header = "date,description,category,type,amount_inr";
  const rows = sortTransactionsByDate(transactions).map((t) => {
    const categoryName =
      categories.find((c) => c.id === t.category)?.name || t.category;
    return [
      t.date,
      csvEscape(t.description),
      csvEscape(categoryName),
      isExpense(t) ? "expense" : "income",
      t.amount.toFixed(2),
    ].join(",");
  });
  return [header, ...rows].join("\n");
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
