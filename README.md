# Royal Oak Trip Command Center

A mobile-first Next.js trip operating app containing the Royal Oak September 2026 itinerary, flights, budget, food/grocery/clothing shortlist, Uber Eats rules, school transportation candidates, and a server-side OpenAI concierge.

## Run
1. `npm install`
2. Copy `.env.example` to `.env.local`
3. Set `OPENAI_API_KEY=...`
4. `npm run dev`

## Security
Never use `NEXT_PUBLIC_OPENAI_API_KEY`. The key must remain server-side. Do not commit `.env.local`.

## Publishing boundary
Antigravity: implement/test/fix only. Grok Build: publish/deploy only after local build passes.
