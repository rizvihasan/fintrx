
export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
}

export type TransactionFormData = Omit<Transaction, 'id'>;

export interface ChartData {
  name: string;
  amount: number;
}

export interface CategoryBudget {
  category: string;
  budget: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "groceries", name: "Groceries", color: "#0ea5e9" },
  { id: "utilities", name: "Utilities", color: "#f97316" },
  { id: "rent", name: "Rent", color: "#8b5cf6" },
  { id: "entertainment", name: "Entertainment", color: "#22c55e" },
  { id: "transport", name: "Transport", color: "#eab308" },
  { id: "healthcare", name: "Healthcare", color: "#ec4899" },
  { id: "education", name: "Education", color: "#14b8a6" },
  { id: "household", name: "Household", color: "#6366f1" },
  { id: "other", name: "Other", color: "#64748b" }
];
