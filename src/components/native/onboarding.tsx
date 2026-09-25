import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Wallet, Hand, Sparkles } from "lucide-react";
import { hapticSuccess, hapticTap } from "@/lib/platform";

const SLIDES = [
  {
    icon: Wallet,
    tint: "text-teal-400",
    bg: "bg-teal-500/15",
    title: "Your money, at a glance",
    body: "Log income and expenses in seconds. Everything stays on this phone - no account, no cloud copy, nothing to sign into.",
  },
  {
    icon: Hand,
    tint: "text-teal-400",
    bg: "bg-teal-500/15",
    title: "Made for your thumb",
    body: "Tap + to add a transaction. Swipe left on any row to edit or delete it. That's most of what you'll ever do here.",
  },
  {
    icon: Sparkles,
    tint: "text-teal-400",
    bg: "bg-teal-500/15",
    title: "Ask your money anything",
    body: '"How much did I spend on food this month?" Ask in plain language and get answers from your own data, privately.',
  },
];

export function Onboarding({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const last = index === SLIDES.length - 1;
  const slide = SLIDES[index];
  const Icon = slide.icon;

  const finish = () => {
    hapticSuccess();
    onDone();
  };

  return (
    <div className="app-shell flex min-h-dvh flex-col bg-background">
      <div className="flex justify-end px-6 pt-5">
        {!last && (
          <button
            onClick={finish}
            className="text-[15px] font-medium text-muted-foreground active:opacity-60"
          >
            Skip
          </button>
        )}
      </div>
      <div className="flex flex-1 items-center justify-center px-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className={`mb-8 flex h-24 w-24 items-center justify-center rounded-[28px] ${slide.bg}`}
            >
              <Icon className={`h-11 w-11 ${slide.tint}`} strokeWidth={1.8} />
            </motion.div>
            <h1 className="text-[26px] font-bold tracking-tight">{slide.title}</h1>
            <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-muted-foreground">
              {slide.body}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="px-6 pb-12" style={{ paddingBottom: "calc(3rem + env(safe-area-inset-bottom))" }}>
        <div className="mb-6 flex justify-center gap-2">
          {SLIDES.map((_, i) => (
            <motion.span
              key={i}
              animate={{ width: i === index ? 20 : 6, opacity: i === index ? 1 : 0.35 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="h-1.5 rounded-full bg-teal-500"
            />
          ))}
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            if (last) {
              finish();
            } else {
              hapticTap();
              setIndex(index + 1);
            }
          }}
          className="h-14 w-full rounded-2xl bg-teal-500 text-[17px] font-semibold text-white"
        >
          {last ? "Get started" : "Continue"}
        </motion.button>
      </div>
    </div>
  );
}
