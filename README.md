# FinTRX

Your money stays on your phone. FinTRX is a privacy-first personal finance
tracker for India: income and expenses, budgets, recurring transactions, and
an AI you can ask questions - with no accounts and no cloud copy of your
finances.

Live app: https://fintrx.vercel.app

## Features

- Track income and expenses in INR with Indian categories
- Monthly per-category budgets with overage indicators
- Recurring monthly transactions (rent, salary, subscriptions)
- Custom categories
- Ask AI: plain-language questions about your money, monthly insights, and
  AI category suggestions
- CSV export of all transactions
- Dark mode, responsive, mobile-first
- Android app (Capacitor) - signed release AAB built by CI

## Privacy model

All finance data is stored only on the device (IndexedDB on web, via the
Capacitor shell on Android). There is no FinTRX server holding user data and
no account system. AI features send only the transactions needed for one
answer through a stateless proxy (`api/ai.js`) to the AI provider for that
single response; FinTRX stores nothing server-side. See
https://fintrx.vercel.app/privacy.

## Tech

- Vite + React 18 + TypeScript, shadcn/ui, Tailwind, Recharts
- Dexie (IndexedDB) for local-first storage
- Vercel serverless function proxying Groq for AI features
- Capacitor for Android; GitHub Actions builds the signed AAB

## Development

```bash
npm install
npm run dev
```

The AI features need `GROQ_API_KEY` set as a Vercel environment variable for
the deployed `/api/ai` function.

## Android release

`.github/workflows/android.yml` builds `app-release.aab` on every relevant
push and uploads it as a build artifact. Signing secrets live in GitHub
Actions secrets; the keystore is never committed.

## License

MIT
