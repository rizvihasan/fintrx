import { Category, Transaction } from "@/types";

interface AiResponse {
  result?: string;
  error?: string;
}

async function callAi(payload: Record<string, unknown>): Promise<string> {
  const resp = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data: AiResponse = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(data.error || `AI request failed (${resp.status})`);
  return data.result || "";
}

const slim = (t: Transaction) => ({
  date: t.date,
  description: t.description,
  category: t.category,
  type: t.type,
  amount: t.amount,
});

export function askFintrx(
  question: string,
  transactions: Transaction[],
  categories: Category[]
): Promise<string> {
  const recent = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 500)
    .map(slim);
  return callAi({ mode: "ask", question, transactions: recent, categories });
}

export function suggestCategory(
  description: string,
  categories: Category[]
): Promise<string> {
  return callAi({ mode: "categorize", description, categories });
}

export function monthlyInsights(
  month: string, // YYYY-MM
  transactions: Transaction[]
): Promise<string> {
  const inMonth = transactions
    .filter((t) => t.date.startsWith(month))
    .map(slim);
  return callAi({ mode: "insights", month, transactions: inMonth });
}
