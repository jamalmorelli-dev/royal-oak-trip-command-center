# GROK BUILD — PUBLISHING-ONLY JOB

Do not redesign or reinterpret the app. Antigravity owns implementation/testing. Your job begins only after `ANTIGRAVITY_COMPLETION.md` says the build passes.

## Publish checklist
1. Import the completed repo.
2. Configure server environment secret `OPENAI_API_KEY` from the owner-provided secret store. Never paste it into source or expose it client-side.
3. Run the production build and refuse deployment if it fails.
4. Publish HTTPS production build.
5. Verify `/api/concierge` works server-side and the key is absent from page source/client JS.
6. Verify every tab on mobile and desktop.
7. Return the production URL plus deployment/runtime logs for the final successful build.
8. Do not alter travel data except for a clearly verified flight-time update supplied by the owner/source.
