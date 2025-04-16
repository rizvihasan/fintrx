
import { useState } from "react";
import { Transaction } from "@/types";
import { formatCurrency, formatDate } from "@/utils/transactions";
import { TransactionForm } from "@/components/transaction-form";
import { EmptyState } from "@/components/ui/empty-state";

import {
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface TransactionListProps {
  transactions: Transaction[];
  onUpdate: (id: string, data: Omit<Transaction, "id">) => void;
  onDelete: (id: string) => void;
}

export function TransactionList({
  transactions,
  onUpdate,
  onDelete,
}: TransactionListProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Transaction;
    direction: "ascending" | "descending";
  }>({
    key: "date",
    direction: "descending",
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Handle sorting
  const requestSort = (key: keyof Transaction) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Sort and filter transactions
  const sortedTransactions = [...transactions]
    .filter((transaction) =>
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

  const getSortIcon = (key: keyof Transaction) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Transactions</CardTitle>
        <CardDescription>Manage your transactions</CardDescription>
        <div className="pt-2">
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        {transactions.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-12 w-12 opacity-50" />}
            title="No transactions yet"
            description="Add your first transaction to start tracking your expenses."
          />
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer whitespace-nowrap"
                    onClick={() => requestSort("date")}
                  >
                    <div className="flex items-center gap-1">
                      Date {getSortIcon("date")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => requestSort("description")}
                  >
                    <div className="flex items-center gap-1">
                      Description {getSortIcon("description")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer text-right whitespace-nowrap"
                    onClick={() => requestSort("amount")}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Amount {getSortIcon("amount")}
                    </div>
                  </TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                      No matching transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell className="font-medium">
                        {transaction.description}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <TransactionForm
                                isEditing
                                defaultValues={{
                                  amount: transaction.amount,
                                  date: transaction.date,
                                  description: transaction.description,
                                  category: transaction.category,
                                }}
                                onSubmit={(data) => {
                                  onUpdate(transaction.id, data);
                                }}
                              />
                            </DialogContent>
                          </Dialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-finance-danger hover:text-finance-danger hover:border-finance-danger"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Transaction
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this transaction? This action
                                  cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => onDelete(transaction.id)}
                                  className="bg-finance-danger hover:bg-finance-danger/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
