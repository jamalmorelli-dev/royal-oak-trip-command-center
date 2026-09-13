# GROK BUILD / GROK BOT — PUBLISH THE TRIP HQ PWA

Do not redesign the app. Publish the **public installable PWA**. Never commit or upload `private_docs/`.

The owner flies **Mon Sep 14, 2026**. Public facts that MUST appear after publish:

- CHECKED IN for both outbound segments
- **RBA: COLLECT PHYSICAL BOARDING PASS AT THE AIR FRANCE DESK**
- DL8491 seat **22D** — boarding **10:05** / departure **10:35**
- DL8719 seat **38H** — boarding **15:10** / departure **16:05**
- Leave hotel **06:30–06:45**, target RBA **07:00–07:15**
- Two free checked bags, 23 kg / 50 lb each; bag tags must say **DTW**
- AF1258 return time is **not** current — show VERIFY IN MY BOOKINGS

Private passport/license/contact files are **not** in this repo and must **not** be published.

## Track A — public PWA (default for Grok Build / Grok Bot)

This is the publishable artifact. It is a standalone PWA (manifest, PNG icons, service worker, Add to Home Screen). Vault APIs are omitted from the static export so GitHub Pages / static HTTPS hosts work.

```bash
npm ci
npm run build:pwa
```

Publish the `out/` directory to HTTPS.

Install/verify:

1. Open the HTTPS URL on phone and desktop.
2. Confirm CHECK-IN COMPLETE, RBA desk rule, seats 22D / 38H.
3. Confirm `manifest.json`, `icon-192.png`, `icon-512.png`, `sw.js` return 200.
4. Add to Home Screen (Android Install / iPhone Share → Add to Home Screen).
5. Turn the network off and confirm the app shell + public airport facts still open.
6. Confirm no passport/license files in page source, `out/`, or Git.
7. Concierge and private vault are **not** required on this track.

## Track B — server PWA with private vault (only if private payload can be injected off-Git)

```bash
npm ci
npm run build
npm start
```

Server-only env (never `NEXT_PUBLIC_`):

- `TRAVEL_VAULT_PIN`
- `TRAVEL_VAULT_SECRET` (≥ 32 random characters)
- `OPENAI_API_KEY` only if concierge is enabled

Copy `private_docs/` into the server build context from the owner ZIP. Do not put it in Git or `/public`.

If the host cannot inject those files, **do not** upload identity documents to GitHub. Ship Track A instead.

## Do not

- Put passport, PA license, PennDOT camera card, or exact Detroit contact files in the public PWA
- Use the old static GitHub Pages path as a place to host the vault
- Treat the Air France PDF as a boarding pass — it is a check-in confirmation only
