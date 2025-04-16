import { Transaction, Category, DEFAULT_CATEGORIES } from '@/types';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/transactions';

interface CategoryPieChartProps {
  transactions: Transaction[];
}

export function CategoryPieChart({ transactions }: CategoryPieChartProps) {
  const categoryTotals = transactions.reduce((acc, transaction) => {
    const category = transaction.category || 'other';
    acc[category] = (acc[category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const data = DEFAULT_CATEGORIES
    .map(category => ({
      name: category.name,
      value: categoryTotals[category.id] || 0,
      color: category.color,
    }))
    .filter(item => item.value > 0);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No transaction data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                labelLine={{ strokeWidth: 1.5 }}
                label={({ name, value }) => 
                  `${name}: ${formatCurrency(value)}`
                }
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={50} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
