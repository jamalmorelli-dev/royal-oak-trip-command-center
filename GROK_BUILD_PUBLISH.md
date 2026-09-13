# GROK BUILD — SEP 13 AIRPORT DOCS + PRIVATE VAULT

## Mission
Take branch `grok-airport-docs-2026-09-13`, add the private deployment files from the secure handoff package, complete the vault/mobile/offline acceptance tests, and deploy on a **server-capable Next.js host**. Do not use GitHub Pages/static export for this branch.

The owner flies tomorrow: **Sep 14, RBA 10:35 → CDG → DTW**.

## Facts that must remain exactly correct
- Legal/travel name: **Benjamin Swayne Prentiss**.
- Air France check-in: **COMPLETE** for both outbound segments.
- DL8491 RBA→CDG: boarding **10:05**, departure **10:35**, seat **22D**.
- DL8719 CDG→DTW: boarding **15:10**, departure **16:05**, seat **38H**.
- Air France could not issue a boarding pass online. Passenger must obtain it from an **Air France agent at RBA**.
- Original Delta baggage entitlement: carry-on free + **two checked bags free, 23 kg / 50 lb each**.
- Leave Marina Rabat Suites / Salé about **06:30–06:45**; target RBA **07:00–07:15**.
- Return AF1258 / DL8271 schedule changed. The original receipt time is stale and must not be shown as current until reverified.
- PennDOT temporary internet credential is valid only through **Sep 17, 2026**. The underlying PA license record is separately current through **Jan 12, 2028**.

## New functionality already added to the branch
- Current checked-in Travel HUD.
- Current airport-ready Dashboard.
- **Airport Docs** tab.
- Counter Mode for the RBA desk.
- Private Travel Vault server routes.
- One-tap offline saving of documents to owner-device IndexedDB.
- Current Plane Checklist with persistent night-before checkboxes.
- Service worker explicitly excludes `/api/vault/*` from cache.
- Public source contains no passport/license images or exact Detroit contact card.

## Build status already verified
GitHub Actions **Grok Airport Build Gate** completed successfully on Sep 13:
- `npm ci`: PASS
- `npm run build`: PASS
- sensitive-file Git guard: PASS

Do not remove that guard.

## SECURITY — NON-NEGOTIABLE
The repository is public.

1. **Never commit `private_docs/`.** `.gitignore` blocks it intentionally.
2. Never move passport, driver-license, PennDOT credential or exact Detroit contact material into `/public`.
3. Never paste private document contents into source, GitHub issues, logs, screenshots or client bundles.
4. Configure server-only:
   - `TRAVEL_VAULT_PIN` — owner-entered PIN.
   - `TRAVEL_VAULT_SECRET` — separate random secret, minimum 32 high-entropy characters.
   - `OPENAI_API_KEY` — only if concierge is enabled.
5. Never prefix these secrets with `NEXT_PUBLIC_`.
6. Use HTTPS production hosting.

## Private deployment payload
A separate secure ZIP is supplied outside public GitHub. It contains `private_docs/` with the airport/travel materials. Merge that directory into the build context **without committing it**.

Expected private files:
- `AirFrance_CheckIn_Confirmation.pdf`
- `Benjamin_Prentiss_Passport.jpeg`
- `Delta_Receipt_Baggage_Reference.txt`
- `PennDOT_Temporary_License_Camera_Card.pdf`
- `PA_Driver_License_Front.jpeg`
- `PA_Driver_License_Back.jpeg`
- `PennDOT_Record_Verification.txt`
- `PennDOT_Duplicate_Receipt.pdf`
- `Talk_Today_Employment_Verification_Benjamin_Prentiss.pdf`
- `Travel_Vault_Metadata.json`

If the host can only deploy from public GitHub and cannot safely inject these private files, **STOP**. Do not upload the identity documents to GitHub as a workaround. Use a secure private build context or private object storage/server storage.

## Remaining production gate
Before publishing the owner URL:
1. Deploy the successful branch build with the private payload in a secure server build context.
2. Test ~390px mobile width and desktop.
3. Dashboard says **CHECK-IN COMPLETE** and **BOARDING PASS — RBA DESK**.
4. Airport Docs shows seats 22D / 38H and current boarding/departure times.
5. Without unlock, `/api/vault/file?name=passport` returns **401**.
6. Wrong PIN returns **401**.
7. Correct PIN unlocks and sets an HttpOnly session cookie.
8. After unlock, every private document opens.
9. Confirm no private file appears in Git, `/public`, page source, client JS, service-worker cache, or logs.
10. Test **Save ALL docs offline** on the owner's device/browser; turn network off and verify saved documents still open from IndexedDB.
11. Confirm the Air France PDF remains labeled as **not a boarding pass**.
12. Confirm printing language: **nothing self-printed is required for the flight; original passport is mandatory; boarding pass comes from Air France at RBA**.
13. Confirm the separate PennDOT temporary paper print/sign reminder.
14. Confirm Flights tab does not resurrect the stale AF1258 return time.
15. Verify concierge server key is not client-visible.

## Finish line
Return the production URL, vault test results, mobile/offline test results, and confirmation that private docs never entered public Git history.
