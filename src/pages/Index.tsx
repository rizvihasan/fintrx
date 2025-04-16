
import { useState } from "react";
import { useTransactions } from "@/hooks/use-transactions";
import { useBudgets } from "@/hooks/use-budgets";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlusCircle, PieChart, BarChart, List } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ExpenseSummary } from "@/components/expense-summary";
import { ExpenseChart } from "@/components/expense-chart";
import { CategoryPieChart } from "@/components/category-pie-chart";
import { BudgetOverview } from "@/components/budget-overview";
import { TransactionList } from "@/components/transaction-list";
import { TransactionForm } from "@/components/transaction-form";
import { BudgetForm } from "@/components/budget-form";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

const Index = () => {
  const { 
    transactions, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction 
  } = useTransactions();
  const {
    budgets,
    setBudget,
  } = useBudgets();
  const [mobileDialogOpen, setMobileDialogOpen] = useState(false);
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 space-y-8">
      <header className="space-y-2 flex justify-between items-start">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            FinTRX
          </h1>
          <p className="text-muted-foreground">
            Track, visualize, and manage your personal expenses
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleDarkMode}
          className="rounded-full"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </header>

      {/* Expense Summary */}
      <ExpenseSummary transactions={transactions} />

      {/* Mobile Action Buttons */}
      <div className="md:hidden space-y-2">
        <Dialog open={mobileDialogOpen} onOpenChange={setMobileDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-teal-500 hover:bg-teal-600">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <TransactionForm 
              onSubmit={(data) => {
                addTransaction(data);
                setMobileDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={budgetDialogOpen} onOpenChange={setBudgetDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              Set Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <BudgetForm 
              onSubmit={(category, amount) => {
                setBudget(category, amount);
                setBudgetDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forms (Desktop) */}
        <div className="hidden md:flex md:flex-col space-y-6">
          <TransactionForm onSubmit={addTransaction} />
          <BudgetForm onSubmit={setBudget} />
        </div>

        {/* Charts and Transactions */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="charts" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="charts">
                <BarChart className="h-4 w-4 mr-2" />
                Charts
              </TabsTrigger>
              <TabsTrigger value="budget">
                <PieChart className="h-4 w-4 mr-2" />
                Budget
              </TabsTrigger>
              <TabsTrigger value="transactions">
                <List className="h-4 w-4 mr-2" />
                Transactions
              </TabsTrigger>
            </TabsList>
            <Separator className="my-2" />
            <TabsContent value="charts" className="space-y-6">
              <ExpenseChart transactions={transactions} />
              <CategoryPieChart transactions={transactions} />
            </TabsContent>
            <TabsContent value="budget">
              <BudgetOverview 
                transactions={transactions}
                budgets={budgets}
              />
            </TabsContent>
            <TabsContent value="transactions">
              <TransactionList
                transactions={transactions}
                onUpdate={updateTransaction}
                onDelete={deleteTransaction}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <footer className="mt-12 border-t pt-6 text-sm text-muted-foreground">
        <p>FinTRX - Track and manage your expenses</p>
      </footer>
    </div>
  );
};

export default Index;
