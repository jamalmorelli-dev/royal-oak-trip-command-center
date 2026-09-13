# GROK BUILD — AIRPORT DOCUMENT CENTER — 2026-09-13

Priority: the owner flies tomorrow morning.

Use branch: `grok-airport-docs-2026-09-13`.

The code already contains the updated Airport Docs UX, checked-in status, current hotel→RBA execution, protected server vault routes, offline owner-device storage and privacy-safe service-worker behavior.

## Owner outcome
From one app the owner must be able to:
- see **CHECK-IN COMPLETE**;
- see **GET BOARDING PASS AT RBA AIR FRANCE DESK**;
- open Counter Mode for an Air France agent;
- see seats 22D and 38H;
- unlock exact booking/ticket/contact metadata;
- open the Air France check-in confirmation;
- open passport and PA-license backups;
- save all needed documents offline before sleeping;
- see the printing rule: **nothing self-printed is required for the flight**;
- separately see the PennDOT temporary-paper print/sign note.

Private files are deliberately not in this public repo. Obtain them from the secure `JAM_TRAVEL_PRIVATE_AIRPORT_DOCS_2026-09-13.zip` handoff and merge `private_docs/` into the server build context without committing it.

Follow every gate in `GROK_BUILD_PUBLISH.md` before returning a production URL.
