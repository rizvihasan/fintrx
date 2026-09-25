import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Wallet,
  Sparkles,
  Target,
  Repeat,
  BarChart3,
  Download,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Local-first by design",
    body: "Every rupee you record lives in your device's own database. There is no FinTRX server holding your finances, no account to breach, nothing to leak.",
  },
  {
    icon: Sparkles,
    title: "Ask your money",
    body: "Plain questions, straight answers. \"What did I spend on food this month?\" The AI reads only what you choose to send, answers, and forgets. Nothing is stored.",
  },
  {
    icon: Wallet,
    title: "Income and expenses",
    body: "Salary in, spending out, balance always in view. Built for India: rupee-first, Indian categories, Indian date formats.",
  },
  {
    icon: Target,
    title: "Budgets that bite",
    body: "Set a monthly budget per category and watch the bars fill. Over budget shows red before it shows up in your bank statement.",
  },
  {
    icon: Repeat,
    title: "Recurring, remembered",
    body: "Rent, salary, subscriptions: mark once and they appear every month on their own. Miss a month and it catches up.",
  },
  {
    icon: BarChart3,
    title: "Charts that explain",
    body: "Monthly trend and category breakdown, the two pictures that actually change behavior.",
  },
  {
    icon: Download,
    title: "Your data, exportable",
    body: "One click downloads everything as CSV. No lock-in: it is your data, take it anywhere.",
  },
  {
    icon: Smartphone,
    title: "Built for your pocket",
    body: "Fully responsive, dark-mode native, and coming to the Play Store as a real Android app.",
  },
];

const STEPS = [
  { n: "1", title: "Open the app", body: "No sign-up, no email, no password. The app is ready the second it loads." },
  { n: "2", title: "Log what happens", body: "Add income and expenses in seconds. AI suggests the category as you type." },
  { n: "3", title: "Ask anything", body: "Trends, totals, budget health: ask in plain words and get answers from your own numbers." },
];

export default function Landing() {
  return (
    <div className="dark min-h-screen bg-[#0b0f14] text-slate-100">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="text-xl font-bold tracking-tight">
          Fin<span className="text-teal-400">TRX</span>
        </div>
        <Link to="/app">
          <Button className="bg-teal-500 hover:bg-teal-600 text-white">
            Open the app <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-20 text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-teal-400">
          Privacy-first finance tracker
        </p>
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Your money stays
          <br />
          on <span className="text-teal-400">your phone.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-slate-400">
          FinTRX tracks income and expenses, keeps budgets honest, and answers
          questions about your money with AI. No accounts. No cloud copy of
          your finances. No cost.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/app">
            <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white px-8">
              Start tracking <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <a href="#how">
            <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              How it works
            </Button>
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5"
            >
              <f.icon className="mb-3 h-5 w-5 text-teal-400" />
              <h3 className="mb-1.5 font-semibold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-slate-800/80">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="mb-10 text-center text-2xl font-bold">Up and running in a minute</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="text-center">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-teal-500/40 bg-teal-500/10 font-bold text-teal-400">
                  {s.n}
                </div>
                <h3 className="mb-2 font-semibold">{s.title}</h3>
                <p className="text-sm text-slate-400">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="border-t border-slate-800/80 bg-slate-900/30">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <ShieldCheck className="mx-auto mb-4 h-8 w-8 text-teal-400" />
          <h2 className="mb-4 text-2xl font-bold">The privacy math is simple</h2>
          <p className="text-slate-400 leading-relaxed">
            Your transactions are stored in your device's own database and never
            uploaded. When you ask the AI a question, the transactions needed
            for that one answer travel with the request and are discarded
            immediately - the AI service keeps no copy, and neither does
            FinTRX. You can export or delete everything, any time, because it
            was always yours.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row">
          <div>
            Fin<span className="text-teal-500">TRX</span> - your money, your device
          </div>
          <div className="flex gap-6">
            <Link to="/app" className="hover:text-slate-300">Open the app</Link>
            <a
              href="https://github.com/rizvihasan/fintrx"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300"
            >
              Source on GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
