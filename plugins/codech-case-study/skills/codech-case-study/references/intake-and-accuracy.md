# Intake and accuracy

A case study is public marketing about a real client. Getting a fact wrong, or publishing something the client considers private, costs more than any design win. This file is about reading the pack and deciding what's true and publishable.

## Reading the asset pack
Typical pack (see the OTSO one): `PROJECT_BRIEF.md` (read first: story, features, stack, numbers, engineering stories, "things to check before publishing"), `README.md`, `brand/` (logos, design tokens), `screenshots/app-walkthrough/` (full screens), `screenshots/ui-screens/` (tight crops), `early-mockups/`, `prototype/*.html` (clickable, client-approved), `docs/` (internal specs: reference only, never publish), `extras/` (proposals for later phases).

1. Read the brief end to end. Note every number with its exact wording and date ("as of 27 Sep").
2. Look at 5–8 key screenshots with the image viewer; they drive the vignette design.
3. Open the prototype HTML (read its structure) and check what's in it: which areas exist, mobile support, demo data.
4. Check the pack for a newer version: users re-upload packs with new features (OTSO added Team Chat mid-project).

## Status: live vs in build
Every product area gets a status. A feature the brief calls "designed", "proposed", "Phase N", "not yet built" or "in progress" is **In build** even if its screens look finished in the prototype. It gets the amber In build pill on the card, page sections, reel tabs and film captions, plus a short note under its section. Flip to `"live"` in case.json when it ships.

Why: showing an unbuilt feature as live is the single most damaging mistake here; the client and their staff will read the page.

## Claims to double-check
- "Self-hosted AI" / "on-premise AI": usually the *platform* is hosted in the client's cloud while the *model* is an external API (OpenAI etc.). Say "hosted in the firm's own cloud".
- Durations: compute from dates in the brief (29 Jun → 5 Aug = 37 days) and state them exactly.
- User counts, speed-ups, test counts: copy from the brief; don't round up.
- No invented testimonials, quotes, ROI or "hours saved". If there's no client quote, use KPIs instead.
- Demo content inside vignettes (names, documents, chat lines) is fine if it's clearly demo data in the style of the prototype, and the page footer says "Screens show demo data".

## Client consent
The brief usually says to confirm the client may be named. Until the user confirms, keep `client.consent_confirmed: false` (the build script warns) and raise it in every report. If consent is refused: set `named_publicly: false`, give an `anonymous_name` ("A regional online brokerage"), drop the logo, and check scenes/screens for the client's logo or name.

## Sensitive content scan (anything you will publish)
Before hosting a proposal or prototype, or quoting from docs, look for:
- "Confidential" banners or pills (the OTSO proposal had one; ask whether to strip it in our hosted copy),
- prices, fees, quotations, payment terms (the word "fee" can be inside mock documents; read the context),
- real production/staging hostnames (OTSO's prototype had `portal.otsogroup.com` in a JS constant; replace in our copy),
- real emails, phone numbers, public IPs (private 10.x/192.168.x in mock audit logs are fine),
- internal engineering docs (never publish `docs/`; quote facts only).
`host_embed.py` prints a REVIEW list; decide each item with the user, don't silently strip or silently keep.

## Framing
The user decides what the case study emphasises. Offer a recommendation (lead with it), then follow their framing. For OTSO they removed three features from the showcase and reframed the product; the skill should make that easy (just edit case.json groups/features).
