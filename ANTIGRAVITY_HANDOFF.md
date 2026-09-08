# ANTIGRAVITY — IMPLEMENTATION-ONLY JOB

## Mission
Take this repo and finish it as a production-ready mobile-first Royal Oak Trip Command Center. Do NOT publish, deploy, create public URLs, or change DNS. Publishing is explicitly reserved for GROK BUILD.

## Non-negotiables
- Preserve every trip datum already encoded in `app/data.js` unless a source-backed correction is available.
- Keep `OPENAI_API_KEY` server-side only. Never expose it through `NEXT_PUBLIC_*`, browser bundles, logs, screenshots, client storage, or checked-in files.
- AI route must use the OpenAI Responses API through the official SDK.
- Add `.gitignore` covering `.env*` except `.env.example`, `.next`, `node_modules`, logs.
- Run dependency install, build, lint/type checks if added, and smoke-test every tab on desktop + mobile widths.
- Flight warning for AF1258 must remain prominent until exact updated time is verified.
- No publishing. No Grok Build work. No Vercel/Netlify/Cloudflare deployment.

## Finish list
1. Verify/install dependencies and resolve build errors.
2. Improve responsive UI without deleting information.
3. Add offline/PWA manifest + icons if straightforward.
4. Add local editable state for budget assumptions and daily completed/not-completed status, persisted in localStorage.
5. Add a one-tap “Today” view that highlights the relevant itinerary row based on Detroit local date.
6. Add category filters for local food/shopping and transport.
7. Add estimated-vs-actual tracking to the Budget tab.
8. Add copy buttons for flight confirmation, ticket number, addresses and provider phone numbers.
9. Add map/deep-link buttons using ordinary Google Maps URLs generated client-side from addresses; do not add paid map APIs.
10. Add Uber Eats/open-site links for relevant vendors; label third-party dynamic prices clearly.
11. Ensure AI concierge gets current edited budget/state in its request payload, not stale constants.
12. Add accessible labels, keyboard navigation, clear loading/error states.
13. Add tests for total budget arithmetic and route payload validation.
14. Produce `ANTIGRAVITY_COMPLETION.md` with exact commands run, results, unresolved risks and files changed.
15. STOP. Do not publish.

## Definition of done
`npm install && npm run build` succeeds; core tabs work; AI endpoint fails safely without a key and works when key exists; no secret appears in client bundles; mobile layout usable at 390px width; handoff doc completed.
