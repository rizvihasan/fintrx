
import { useMemo } from "react";
import { Transaction, ChartData } from "@/types";
import { groupTransactionsByMonth, formatCurrency } from "@/utils/transactions";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/ui/empty-state";
import { BarChart3 } from "lucide-react";

interface ExpenseChartProps {
  transactions: Transaction[];
}

// Custom tooltip component for the chart
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-md shadow-md border">
        <p className="font-medium">{label}</p>
        <p className="text-teal-500 font-semibold">
          {formatCurrency(payload[0].value as number)}
        </p>
      </div>
    );
  }

  return null;
};

export function ExpenseChart({ transactions }: ExpenseChartProps) {
  const isMobile = useIsMobile();
  
  // Process transaction data for the chart
  const chartData = useMemo(() => {
    return groupTransactionsByMonth(transactions);
  }, [transactions]);

  // Empty state when no transactions yet
  if (transactions.length === 0) {
    return (
      <Card className="w-full h-[400px]">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Monthly Expenses</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="flex items-center justify-center h-[320px]">
          <EmptyState
            icon={<BarChart3 className="h-12 w-12 opacity-50" />}
            title="No expense data yet"
            description="Add transactions to visualize your monthly spending patterns."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[450px]">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Monthly Expenses</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: isMobile ? 20 : 40,
              bottom: 30,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: isMobile ? 10 : 12 }}
              tickMargin={15}
              height={50}
              interval={0}
              angle={-45}
              textAnchor="end"
            />
            <YAxis
              tick={{ fontSize: isMobile ? 10 : 12 }}
              tickFormatter={(value) => `₹${value}`}
              width={isMobile ? 50 : 70}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="amount"
              fill="#0EA5E9"
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
