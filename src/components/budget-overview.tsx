
import { useMemo } from 'react';
import { Transaction, DEFAULT_CATEGORIES } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/utils/transactions';

interface BudgetOverviewProps {
  transactions: Transaction[];
  budgets: { category: string; budget: number }[];
}

export function BudgetOverview({ transactions, budgets }: BudgetOverviewProps) {
  const categoryTotals = useMemo(() => {
    return transactions.reduce((acc, transaction) => {
      const category = transaction.category || 'other';
      acc[category] = (acc[category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);
  }, [transactions]);

  const budgetData = DEFAULT_CATEGORIES.map(category => {
    const spent = categoryTotals[category.id] || 0;
    const budget = budgets.find(b => b.category === category.id)?.budget || 0;
    const percentage = budget > 0 ? (spent / budget) * 100 : 0;

    return {
      name: category.name,
      color: category.color,
      spent,
      budget,
      percentage: Math.min(percentage, 100),
      overBudget: spent > budget && budget > 0,
    };
  }).filter(item => item.budget > 0);

  if (budgetData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[200px]">
          <p className="text-muted-foreground">No budgets set</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {budgetData.map((item) => (
            <div key={item.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.name}</span>
                <span className={item.overBudget ? 'text-destructive' : ''}>
                  {formatCurrency(item.spent)} / {formatCurrency(item.budget)}
                </span>
              </div>
              <Progress 
                value={item.percentage}
                className={`${item.overBudget ? 'bg-destructive/20' : ''} ${
                  item.overBudget ? '[&>div]:bg-destructive' : ''
                }`}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
