# FinTRX

A personal finance tracker that lives on your phone and in your browser. Every rupee you log stays on your device - no accounts, no servers holding your data.

## The app (Android)

FinTRX is a native Android app first. It boots straight into an iOS-grade interface built for one-handed use:

<p>
  <img src="docs/screenshots/app-home.png" width="240" alt="FinTRX home" />
  <img src="docs/screenshots/app-swipe.png" width="240" alt="Swipe to edit or delete" />
  <img src="docs/screenshots/app-add.png" width="240" alt="Add transaction sheet" />
</p>

**Download the latest APK:** [fintrx-v1.2.0.apk](https://github.com/rizvihasan/fintrx/releases/download/v1.2/fintrx-v1.2.0.apk) - install it, allow your browser to install unknown apps, and you're in. All releases: [github.com/rizvihasan/fintrx/releases](https://github.com/rizvihasan/fintrx/releases)

What the app feels like:

- **Bottom tab navigation** - Home, Activity, Ask AI, Budgets, always a thumb-reach away
- **Gesture-driven rows** - swipe any transaction left to edit or delete; it tracks your finger, flicks open on a fast swipe, and springs to rest
- **Spring physics everywhere** - tab transitions, staggered lists, count-up balances, a FAB that reacts to your touch
- **Bottom-sheet forms** - add or edit a transaction in a sheet that swipes away
- **Haptics** - taps, adds, and deletes you can feel
- **Copy that talks to you** - a time-aware greeting, empty states that point at the next step, confirmations that name exactly what you're deleting

Signed release builds (APK + Play-ready AAB) are built by GitHub Actions on every push to `master`.

## The web app

The same tracker runs in the browser at **[fintrx.vercel.app](https://fintrx.vercel.app)** - the tracker lives at `/app`. On desktop you get a wide dashboard with charts, budgets, transactions, and Ask AI side by side; on a phone-sized screen the web app adapts to the same mobile shell as the native app. Data is stored per device (IndexedDB), so your phone and laptop each keep their own books.

## What it does

- Log income and expenses with categories (or let the AI suggest one from your description)
- Monthly expense chart and income/expense/balance summaries
- Per-category monthly budgets with progress bars that turn red when you cross a limit
- **Ask AI** - ask questions about your own spending ("How much did I spend on groceries this month?") and get answers computed from your data
- Recurring transactions for rent, salary, and subscriptions
- CSV export, one tap, any time

## Privacy

Transactions, budgets, and categories live only in your device's local storage. FinTRX stores nothing server-side. Ask AI sends a single stateless request per question through FinTRX's own proxy to the AI provider (Groq) - the provider's own privacy policy applies to that request, and nothing is retained by FinTRX.

## Tech

- **App shell:** Capacitor (Android), signed with a GitHub Actions-kept keystore
- **UI:** React 18, TypeScript, Vite, Tailwind, shadcn/ui, framer-motion
- **Data:** Dexie (IndexedDB) - fully local-first
- **AI:** stateless Vercel serverless proxy in front of Groq (API key stays server-side)
- **CI/CD:** GitHub Actions builds signed AAB + APK on every push; Vercel deploys the web app from `master`

## Build it yourself

```bash
npm install
npm run dev          # web at localhost:5173

npx cap sync android # then open android/ in Android Studio
```

Release signing reads `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `KEY_ALIAS`, and `KEY_PASSWORD` - see `.github/workflows/android.yml`.
