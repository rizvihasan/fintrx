import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { Transaction, TransactionFormData } from "@/types";

export function useTransactions() {
  const transactions = useLiveQuery(
    () => db.transactions.toArray(),
    []
  );

  const addTransaction = async (data: TransactionFormData) => {
    const { recurring, ...fields } = data;
    const tx: Transaction = { ...fields, id: crypto.randomUUID() };
    await db.transactions.add(tx);

    if (recurring) {
      const month = tx.date.slice(0, 7);
      const dayOfMonth = Number(tx.date.slice(8, 10)) || 1;
      await db.recurring.add({
        id: crypto.randomUUID(),
        amount: tx.amount,
        description: tx.description,
        category: tx.category,
        type: tx.type,
        dayOfMonth,
        startMonth: month,
        lastGenerated: month,
      });
    }
    return tx;
  };

  const updateTransaction = async (id: string, data: Omit<Transaction, "id">) => {
    const { recurringId, ...fields } = data;
    await db.transactions.update(id, fields);
  };

  const deleteTransaction = async (id: string) => {
    await db.transactions.delete(id);
  };

  return {
    transactions: transactions ?? [],
    isLoading: transactions === undefined,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
