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

## SEO

Full SEO stack is wired in. Before deploying, **replace every occurrence of
`https://illustration-atelier.com/` with your real domain** in these files:

- `index.html` — canonical, OG, Twitter, JSON-LD
- `public/sitemap.xml` — `<loc>` and image URLs
- `public/robots.txt` — sitemap line

### What's included

- Full primary meta (title, description, keywords, author, robots, referrer)
- Open Graph + Twitter Card meta with a 1200×630 OG image (`public/og-image.png`)
- Canonical URL + hreflang
- `robots.txt` with explicit allow rules for GPTBot, ClaudeBot, Google-Extended, PerplexityBot
- `sitemap.xml` with image sitemap entry
- `site.webmanifest` (PWA-installable with proper icons)
- Apple touch icon, SVG favicon, ICO fallback, mask icon, theme-color
- JSON-LD structured data: `WebApplication`, `Organization`, `Person`, `WebSite`, `FAQPage`
- Performance: preconnect to fonts.googleapis.com, api.openai.com, checkout.flutterwave.com
- Deferred Flutterwave script so it doesn't block first paint
- `<noscript>` fallback with the headline content for JS-disabled crawlers
- Runtime `useSeo` hook in `src/lib/seo.ts` that updates `<title>` and meta description when the user generates a plate
- Semantic landmarks (`<header>`, `<main>`, `<aside>`, `<section>`, `<footer>`)
- Skip-to-content link, screen-reader-only headings, focus rings, `aria-live` on the plate area

### Caveat — SPA + crawlers

This is a single-page app, so the initial HTML is mostly empty. Google renders
JS and will index the running app fine, but social previewers (Twitter, LinkedIn,
Slack, iMessage, Discord) read raw HTML only. That's why every share-critical
meta tag and the noscript headline content live in `index.html` — those work
without JS. For multiple shareable pages with per-page OG images, you'd want
SSR/SSG (Next.js, Astro, vite-ssg).
