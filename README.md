# The Illustration Atelier

An AI illustration generator — React + Vite + TypeScript, styled with Tailwind CSS,
powered by OpenAI's `gpt-image-1`. Editorial "small print press" aesthetic.

## Setup

```bash
npm install
cp .env.example .env      # then add your keys
npm run dev
```

`.env` keys:

```
VITE_OPENAI_API_KEY=sk-...           # required — image generation
VITE_FLW_PUBLIC_KEY=FLWPUBK-...      # required — quota upgrade checkout
```

Restart the dev server after editing `.env`.

## Features

- Free-text brief with example prompts
- 7 "house styles" and 3 plate formats / quality tiers
- Plate viewer with download + session archive
- **Quota system** — 3 free commissions, then upgrade to 10
- **Flutterwave checkout** — inline card / transfer / USSD payment to upgrade

## Quota & payments

Free users get **3** generations (only successful ones count). When the quota is
reached, an upgrade modal opens; paying via Flutterwave raises the limit to **10**.

The quota lives in React state, so it resets on refresh — fine for a demo. For a
real product, persist it per-user in a backend.

> **Security note:** Flutterwave's browser callback reports `status` and a
> `transaction_id`, but a malicious user can spoof a client-side success. Before
> granting the upgrade in production, verify `transaction_id` server-side against
> Flutterwave's `/transactions/:id/verify` endpoint. The spot for this is marked
> in `src/lib/flutterwave.ts`. Likewise, proxy the OpenAI call through a backend
> so the API key isn't exposed to the browser.
