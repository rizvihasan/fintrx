
import { useMemo } from "react";
import { Transaction } from "@/types";
import { calculateTotalExpenses, formatCurrency, formatDate } from "@/utils/transactions";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign, TrendingDown, TrendingUp, Calendar } from "lucide-react";

interface ExpenseSummaryProps {
  transactions: Transaction[];
}

export function ExpenseSummary({ transactions }: ExpenseSummaryProps) {
  // Calculate total expenses
  const totalExpenses = useMemo(() => 
    calculateTotalExpenses(transactions), [transactions]
  );

  // Get most recent transaction
  const mostRecentTransaction = useMemo(() => {
    if (transactions.length === 0) return null;
    
    return [...transactions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
  }, [transactions]);

  // Get highest expense
  const highestExpense = useMemo(() => {
    if (transactions.length === 0) return null;
    
    return [...transactions].sort((a, b) => b.amount - a.amount)[0];
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-teal-500">
            {formatCurrency(totalExpenses)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {transactions.length} transaction{transactions.length !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Highest Expense</CardTitle>
          <TrendingUp className="h-4 w-4 text-finance-danger" />
        </CardHeader>
        <CardContent>
          {highestExpense ? (
            <>
              <div className="text-2xl font-bold text-finance-danger">
                {formatCurrency(highestExpense.amount)}
              </div>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {highestExpense.description}
              </p>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">No data available</div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Most Recent</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {mostRecentTransaction ? (
            <>
              <div className="text-2xl font-bold">
                {formatCurrency(mostRecentTransaction.amount)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDate(mostRecentTransaction.date)}
              </p>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">No data available</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
