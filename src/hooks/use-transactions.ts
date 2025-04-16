
import { useState, useEffect } from "react";
import { Transaction, TransactionFormData } from "@/types";
import { generateId } from "@/utils/transactions";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load transactions from localStorage on initial render
  useEffect(() => {
    const storedTransactions = localStorage.getItem("transactions");
    if (storedTransactions) {
      try {
        setTransactions(JSON.parse(storedTransactions));
      } catch (error) {
        console.error("Failed to parse stored transactions:", error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("transactions", JSON.stringify(transactions));
    }
  }, [transactions, isLoading]);

  // Add a new transaction
  const addTransaction = (transactionData: TransactionFormData) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: generateId(),
    };

    setTransactions((prev) => [...prev, newTransaction]);
    return newTransaction;
  };

  // Update an existing transaction
  const updateTransaction = (id: string, transactionData: TransactionFormData) => {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === id
          ? { ...transactionData, id }
          : transaction
      )
    );
  };

  // Delete a transaction
  const deleteTransaction = (id: string) => {
    setTransactions((prev) =>
      prev.filter((transaction) => transaction.id !== id)
    );
  };

  return {
    transactions,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
