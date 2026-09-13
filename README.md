# Royal Oak Trip Command Center

Mobile-first Next.js operating app for the Sep 14–25, 2026 Royal Oak/Detroit trip. The Sep 13 update adds the current checked-in airport state, an **Airport Docs** center, a protected **Private Travel Vault**, offline document saving, current RBA execution steps, and preserves the existing local itinerary/budget/transport tools.

## Current travel state
- Air France online check-in: **COMPLETE** for both outbound segments.
- RBA→CDG DL8491: 10:35 departure, 10:05 boarding, seat 22D.
- CDG→DTW DL8719: 16:05 departure, 15:10 boarding, seat 38H.
- Air France could not issue the boarding pass online: obtain it at the **RBA Air France counter**.
- Leave Marina Rabat Suites / Salé about **06:30–06:45**; target RBA **07:00–07:15**.
- AF1258 return schedule changed; old return time is intentionally not treated as current.

## Run locally
1. `npm install`
2. Copy `.env.example` to `.env.local`
3. Set server-only `OPENAI_API_KEY` if using the concierge.
4. Set server-only `TRAVEL_VAULT_PIN` and a separate high-entropy `TRAVEL_VAULT_SECRET`.
5. Place the secure handoff's `private_docs/` directory at the project root.
6. `npm run dev`

## Security
This repository is public. Therefore:
- `private_docs/` is Git-ignored and must never be committed.
- Passport/license/exact-contact documents must never be placed under `public/`.
- Never expose `OPENAI_API_KEY`, `TRAVEL_VAULT_PIN`, or `TRAVEL_VAULT_SECRET` with `NEXT_PUBLIC_`.
- Vault responses use server routes and are excluded from service-worker caching.
- Offline private copies are saved only when the owner explicitly asks the app to store them in that browser's IndexedDB.

## PWA
This app is an installable Progressive Web App (`manifest.json`, PNG icons, service worker).

```bash
npm run build:pwa   # public static PWA in out/ — Grok Build / Grok Bot publish this
npm run build       # server PWA with optional private vault
```

Grok Build / Grok Bot: follow `GROK_BUILD_PUBLISH.md`. Publish the **public PWA**. Never commit `private_docs/`.

On iPhone: open the HTTPS URL → Share → **Add to Home Screen**.
On Android/Chrome: **Install app** / Install Trip HQ.

## Deployment
- **Public PWA (default):** `npm run build:pwa` then publish `out/` to HTTPS (GitHub Pages or Grok static host).
- **Private vault:** only on a server-capable host that can inject `private_docs/` off-Git. See `GROK_BUILD_PUBLISH.md`.
