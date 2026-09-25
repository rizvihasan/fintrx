// FinTRX AI proxy - STATELESS by design.
// Receives the minimal data needed for one answer, forwards it to Groq,
// returns the result. No database, no logging of payloads, no persistence:
// user finance data never leaves the device except inside a single
// request/response the user explicitly triggers.

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL_SMART = "openai/gpt-oss-120b";
const MODEL_FAST = "openai/gpt-oss-20b";

// Best-effort per-IP limiter on warm serverless instances (20 req/hour).
// Cold instances reset it; Groq's own free-tier limits are the hard ceiling.
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const windowStart = now - 3600_000;
  const list = (hits.get(ip) || []).filter((t) => t > windowStart);
  if (list.length >= 20) return true;
  list.push(now);
  hits.set(ip, list);
  return false;
}

const trimTx = (t) => ({
  date: String(t.date || "").slice(0, 10),
  description: String(t.description || "").slice(0, 100),
  category: String(t.category || "other").slice(0, 40),
  type: t.type === "income" ? "income" : "expense",
  amount: Number(t.amount) || 0,
});

async function groq(messages, model, maxTokens) {
  const resp = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      max_completion_tokens: maxTokens,
      temperature: 0.3,
    }),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`groq ${resp.status}: ${text.slice(0, 200)}`);
  }
  const data = await resp.json();
  return data.choices?.[0]?.message?.content?.trim() || "";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method not allowed" });
  }
  if (!process.env.GROQ_API_KEY) {
    return res.status(503).json({ error: "AI is not configured on this deployment" });
  }
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || "unknown";
  if (rateLimited(ip)) {
    return res.status(429).json({ error: "Rate limit reached - try again in a bit" });
  }

  const body = req.body || {};
  const mode = body.mode;
  const transactions = Array.isArray(body.transactions)
    ? body.transactions.slice(0, 600).map(trimTx)
    : [];
  const categories = Array.isArray(body.categories)
    ? body.categories.slice(0, 50).map((c) => ({
        id: String(c.id || "").slice(0, 40),
        name: String(c.name || "").slice(0, 40),
      }))
    : [];

  try {
    if (mode === "categorize") {
      const description = String(body.description || "").slice(0, 100);
      if (!description) return res.status(400).json({ error: "description required" });
      const result = await groq(
        [
          {
            role: "system",
            content:
              "Pick the single best matching category id for an Indian personal-finance transaction. Reply with ONLY the category id, nothing else.",
          },
          {
            role: "user",
            content: `Categories: ${JSON.stringify(categories)}\nTransaction: ${description}`,
          },
        ],
        MODEL_FAST,
        20
      );
      const match = categories.find((c) => c.id === result.trim());
      return res.status(200).json({ result: match ? match.id : "other" });
    }

    if (mode === "ask") {
      const question = String(body.question || "").slice(0, 500);
      if (!question) return res.status(400).json({ error: "question required" });
      const result = await groq(
        [
          {
            role: "system",
            content: [
              "You are FinTRX, a personal finance assistant for a user in India.",
              "Answer using ONLY the transaction data provided (JSON array, amounts in INR).",
              "Be concise. Use rupee amounts with the ₹ symbol. Short bullet points when listing.",
              "If the data cannot answer the question, say so plainly instead of guessing.",
            ].join(" "),
          },
          {
            role: "user",
            content: `Transactions (newest first): ${JSON.stringify(transactions)}\n\nQuestion: ${question}`,
          },
        ],
        MODEL_SMART,
        800
      );
      return res.status(200).json({ result });
    }

    if (mode === "insights") {
      const month = String(body.month || "").slice(0, 7);
      if (transactions.length === 0) {
        return res.status(200).json({ result: "No transactions this month yet." });
      }
      const result = await groq(
        [
          {
            role: "system",
            content: [
              "You are FinTRX, a personal finance assistant for a user in India.",
              "Give 3 to 5 short, concrete insights about the month provided (amounts in INR, ₹ symbol).",
              "Notice patterns: biggest category, unusual items, income vs spend, budget risks.",
              "One line per insight, plain bullet points, no fluff.",
            ].join(" "),
          },
          {
            role: "user",
            content: `Month: ${month}\nTransactions: ${JSON.stringify(transactions)}`,
          },
        ],
        MODEL_SMART,
        600
      );
      return res.status(200).json({ result });
    }

    return res.status(400).json({ error: "unknown mode" });
  } catch (err) {
    return res.status(502).json({ error: "AI request failed", detail: String(err).slice(0, 200) });
  }
}
