import { Transaction, ChartData, DEFAULT_CATEGORIES } from "@/types";

// Generate a unique ID for transactions
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Format a currency amount to Indian Rupees
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Format a date to display format
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// Get month name from date string
export const getMonthFromDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
};

// Get year from date string
export const getYearFromDate = (dateString: string): number => {
  const date = new Date(dateString);
  return date.getFullYear();
};

// Group transactions by category for chart
export const groupTransactionsByCategory = (transactions: Transaction[]): ChartData[] => {
  const categoryMap: Record<string, number> = {};
  
  transactions.forEach((transaction) => {
    const category = transaction.category || 'other';
    if (!categoryMap[category]) {
      categoryMap[category] = 0;
    }
    categoryMap[category] += transaction.amount;
  });
  
  return Object.entries(categoryMap).map(([category, amount]) => ({
    name: DEFAULT_CATEGORIES.find(c => c.id === category)?.name || category,
    amount,
  }));
};

// Calculate category spending percentage
export const calculateCategoryPercentage = (
  transactions: Transaction[],
  category: string
): number => {
  const totalExpenses = calculateTotalExpenses(transactions);
  if (totalExpenses === 0) return 0;
  
  const categoryExpenses = transactions
    .filter(t => t.category === category)
    .reduce((sum, t) => sum + t.amount, 0);
    
  return (categoryExpenses / totalExpenses) * 100;
};

// Group transactions by month for chart
export const groupTransactionsByMonth = (transactions: Transaction[]): ChartData[] => {
  const monthMap: Record<string, number> = {};
  
  // Sort transactions by date
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Group by month-year
  sortedTransactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const monthYear = `${date.getFullYear()}-${date.getMonth()}`;
    const monthName = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
    
    if (!monthMap[monthYear]) {
      monthMap[monthYear] = 0;
    }
    
    monthMap[monthYear] += transaction.amount;
  });
  
  // Convert to chart data format
  return Object.entries(monthMap).map(([monthYear, amount]) => {
    const [year, month] = monthYear.split('-');
    const date = new Date(parseInt(year), parseInt(month));
    const name = new Intl.DateTimeFormat('en-US', { month: 'short', year: '2-digit' }).format(date);
    
    return {
      name,
      amount,
    };
  });
};

// Calculate total expenses from transactions
export const calculateTotalExpenses = (transactions: Transaction[]): number => {
  return transactions.reduce((total, transaction) => total + transaction.amount, 0);
};

// Sort transactions by date (newest first)
export const sortTransactionsByDate = (transactions: Transaction[]): Transaction[] => {
  return [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};
