import { useMemo } from "react";
import { Transaction } from "@/types";
import {
  calculateTotalExpenses,
  calculateTotalIncome,
  formatCurrency,
  formatDate,
} from "@/utils/transactions";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Wallet, Calendar } from "lucide-react";

interface ExpenseSummaryProps {
  transactions: Transaction[];
}

export function ExpenseSummary({ transactions }: ExpenseSummaryProps) {
  const totalIncome = useMemo(() => calculateTotalIncome(transactions), [transactions]);
  const totalExpenses = useMemo(() => calculateTotalExpenses(transactions), [transactions]);
  const balance = totalIncome - totalExpenses;

  const mostRecentTransaction = useMemo(() => {
    if (transactions.length === 0) return null;
    return [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
  }, [transactions]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Income</CardTitle>
          <TrendingUp className="h-4 w-4 text-teal-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-teal-500">
            {formatCurrency(totalIncome)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {transactions.filter((t) => t.type === "income").length} entr
            {transactions.filter((t) => t.type === "income").length === 1 ? "y" : "ies"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-finance-danger" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-finance-danger">
            {formatCurrency(totalExpenses)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {transactions.filter((t) => t.type !== "income").length} transaction
            {transactions.filter((t) => t.type !== "income").length !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Balance</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${balance >= 0 ? "" : "text-finance-danger"}`}
          >
            {formatCurrency(balance)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">income minus expenses</p>
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
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {mostRecentTransaction.description} - {formatDate(mostRecentTransaction.date)}
              </p>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">No data yet</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
