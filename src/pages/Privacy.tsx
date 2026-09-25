import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="dark min-h-screen bg-[#0b0f14] text-slate-100">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <Link to="/" className="text-teal-400 hover:underline">&larr; FinTRX</Link>
        <h1 className="mt-6 text-3xl font-bold">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: September 25, 2026</p>
        <div className="mt-8 space-y-5 text-slate-300 leading-relaxed">
          <p>
            FinTRX is a local-first personal finance app. This policy is short
            because there is very little to say.
          </p>
          <h2 className="text-xl font-semibold text-slate-100">What we store</h2>
          <p>
            All transactions, budgets, and categories you enter are stored only
            in your device's own database (IndexedDB on web, SQLite on Android).
            FinTRX operates no server that holds your finance data, and there
            are no accounts.
          </p>
          <h2 className="text-xl font-semibold text-slate-100">AI features</h2>
          <p>
            When you explicitly use "Ask AI" or "Suggest with AI", the
            transactions or description needed for that single answer are sent
            over an encrypted connection through our stateless proxy to the AI
            provider (Groq) to produce that one answer. FinTRX itself runs no
            database and logs, caches, and stores nothing on any server. The AI
            provider's own data policy applies to its side of the request. If
            you never use these features, no data ever leaves your device.
          </p>
          <h2 className="text-xl font-semibold text-slate-100">Analytics and tracking</h2>
          <p>None. No analytics SDKs, no advertising, no trackers.</p>
          <h2 className="text-xl font-semibold text-slate-100">Your control</h2>
          <p>
            You can export all data as CSV at any time, and deleting the app or
            clearing site data removes everything permanently.
          </p>
          <h2 className="text-xl font-semibold text-slate-100">Contact</h2>
          <p>
            Questions: open an issue at{" "}
            <a
              href="https://github.com/rizvihasan/fintrx"
              target="_blank"
              rel="noreferrer"
              className="text-teal-400 hover:underline"
            >
              github.com/rizvihasan/fintrx
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
