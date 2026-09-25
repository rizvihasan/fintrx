import Dexie, { type Table } from "dexie";
import {
  Category,
  CategoryBudget,
  DEFAULT_CATEGORIES,
  RecurringTemplate,
  Transaction,
} from "@/types";

interface MetaEntry {
  key: string;
  value: string;
}

class FintrxDB extends Dexie {
  transactions!: Table<Transaction, string>;
  budgets!: Table<CategoryBudget, string>;
  categories!: Table<Category, string>;
  recurring!: Table<RecurringTemplate, string>;
  meta!: Table<MetaEntry, string>;

  constructor() {
    super("fintrx");
    this.version(1).stores({
      transactions: "id, date, category, type",
      budgets: "category",
      categories: "id",
      recurring: "id",
      meta: "key",
    });
  }
}

export const db = new FintrxDB();

// One-time migration from the old localStorage format, and seeding of the
// default categories. Legacy transactions had no `type`; they were all
// expenses.
export async function migrateFromLocalStorage(): Promise<void> {
  const done = await db.meta.get("migrated_v1");
  if (done) return;

  await db.transaction(
    "rw",
    [db.transactions, db.budgets, db.categories, db.meta],
    async () => {
      const count = await db.categories.count();
      if (count === 0) {
        await db.categories.bulkAdd(DEFAULT_CATEGORIES);
      }

      try {
        const rawTx = localStorage.getItem("transactions");
        if (rawTx) {
          const legacy = JSON.parse(rawTx) as Array<Partial<Transaction>>;
          const rows: Transaction[] = legacy.map((t) => ({
            id: t.id || crypto.randomUUID(),
            amount: Number(t.amount) || 0,
            date: t.date || new Date().toISOString().split("T")[0],
            description: t.description || "",
            category: t.category || "other",
            type: t.type === "income" ? "income" : "expense",
          }));
          if (rows.length > 0) await db.transactions.bulkAdd(rows);
        }
      } catch {
        // Corrupt legacy data: skip migration rather than crash the app.
      }

      try {
        const rawBudgets = localStorage.getItem("budgets");
        if (rawBudgets) {
          const legacy = JSON.parse(rawBudgets) as Array<CategoryBudget>;
          const rows = legacy.filter((b) => b && typeof b.category === "string");
          if (rows.length > 0) await db.budgets.bulkPut(rows);
        }
      } catch {
        // Same reasoning as above.
      }

      await db.meta.put({ key: "migrated_v1", value: new Date().toISOString() });
    }
  );
}

// Materialize any due monthly recurring transactions. Idempotent per month:
// each template records the last month it generated.
export async function materializeRecurring(now = new Date()): Promise<number> {
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const templates = await db.recurring.toArray();
  let created = 0;

  for (const tpl of templates) {
    let month = tpl.lastGenerated
      ? nextMonth(tpl.lastGenerated)
      : tpl.startMonth;
    let guard = 0;
    while (month <= currentMonth && guard < 24) {
      const [y, m] = month.split("-").map(Number);
      const day = Math.min(tpl.dayOfMonth, daysInMonth(y, m));
      await db.transactions.add({
        id: crypto.randomUUID(),
        amount: tpl.amount,
        date: `${month}-${String(day).padStart(2, "0")}`,
        description: tpl.description,
        category: tpl.category,
        type: tpl.type,
        recurringId: tpl.id,
      });
      created += 1;
      month = nextMonth(month);
      guard += 1;
    }
    if (guard > 0) {
      await db.recurring.update(tpl.id, { lastGenerated: currentMonth });
    }
  }
  return created;
}

function nextMonth(month: string): string {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m, 1); // m is 1-based here, so this is the following month
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}
