---
name: fintech-compliance-copy
description: Design, build, and keep regulator-safe a crypto / digital-asset / payment / fintech marketing website. Use for TWO situations — (1) building/designing a new payment-platform landing page or fintech site, where you want the proven institutional design standard (dark-tech, trust-signal-heavy, "not AI-generated") AND compliance baked in from the start; (2) applying a lawyer/compliance review to an existing site — removing live trading/FX/price displays, marking unlaunched services (virtual accounts, IBAN, cards, settlement rails) as "not currently available", adding no-advice / no-banking / not-an-endorsement disclaimers, inserting legal-approved wording verbatim. Triggers: "design a payment platform / crypto exchange / fintech site", "build a digital-asset landing page", "make it look like a regulated platform", "apply the legal review", "AUSTRAC/ASIC/AFSL/FCA/MAS/MiCA website review", "de-risk the copy", "remove the FX rates / trading terminal", "mark virtual account/card as coming soon".
references:
  - design-standard
  - banned-terms-checklist
  - disclaimer-library
  - verification
---

# Fintech / Payment-Platform site skill

Covers the full lifecycle of a crypto / digital-asset / payment / fintech **marketing site**: the **design standard** that makes it look like a regulated, institutional platform, and the **compliance discipline** that keeps it regulator-safe. The two are inseparable — for these platforms, trust *is* the aesthetic, and the biggest design constraint (show capability & process, never live prices or trading) is a legal requirement.

Distilled from a real engagement: a digital-asset exchange + payment-facilitation landing page (BNEVA) that shipped and passed an Australian law-firm review (AFSL/ASIC/AUSTRAC). The patterns generalise to any jurisdiction (FCA, MAS, MiCA, FinCEN/SEC).

## Which mode am I in?

- **Designing / building a new site?** Start with `references/design-standard.md` for the visual language (tokens, type, layout, the signature "product mock" visuals, motion, trust signals), and bake in the compliance rules below from the first draft — it's far cheaper than retrofitting. Skip to "Design + compliance from scratch" below.
- **Applying a legal/compliance review to an existing site?** Follow the compliance workflow below. Do **not** redesign — copy, status labels, and disclaimers only.

## Design + compliance from scratch

When building new, combine `references/design-standard.md` with these guardrails so the first draft is already compliant:
- Show **capability and process**, never live prices, FX rates, spreads, or Buy/Sell. Use process/flow cards and status tables, not trading terminals (see design-standard §4).
- Mark any not-yet-launched service (virtual account, IBAN, card, settlement rail) "Coming soon / Not currently available" from day one.
- Include the trust + disclaimer layer (design-standard §6) as real sections, not afterthoughts — pull wording from `references/disclaimer-library.md`.
- Then run `references/verification.md` before shipping, same as a review pass.

## The governing principle (do not skip)

> **Do not redesign the page.** Keep the existing visual style, layout, section order, card structure. Only (a) replace high-risk copy, (b) remove live/real-time price/trading displays, and (c) add compliance disclaimers / status labels.

A redesign is scope creep, invalidates prior design sign-off, and is almost never what the legal review asked for. Resist it.

## The four failure modes regulators flag

Every payment/crypto site review collapses to these. Map each item in the client's review to one of them:

1. **Looking like a market-maker / trading venue / dealer.** Live prices, FX rates, spreads, % change, 24h change, Buy/Sell buttons, "Order filled", order books, trading terminals. → *Remove all of it.* The site must read as a *facilitator running compliance checks*, not a venue quoting prices.
2. **Implying services are live when they're not.** Virtual accounts, IBAN, virtual cards, settlement rails shown as `Active` / `Settled` / `Available now` / with guaranteed ETAs (`Instant`, `T+1`, `<2h`). → *Mark as "not currently available / coming soon"* and add "subject to approval".
3. **Implying it provides regulated services it doesn't.** Especially **banking / deposit-taking** (virtual accounts and IBANs read as bank accounts), and **financial/investment advice**. → *Explicit negative statements:* "does not provide deposit-taking or banking services", "does not provide investment, legal or tax advice".
4. **Over-claiming scope / certainty.** "Supported currencies/rails" presented as definitive operational capability. → *Re-frame as "indicative only, availability varies by jurisdiction/partner/regulation/transaction type."*

## Non-negotiable working rules

1. **READ the source document(s) first, in full.** Lawyer reviews come as `.pdf` or `.docx`. Convert with `pandoc <file> -t plain` (or `Read` the PDF directly). There are often **two** documents: the lawyer's *review letter* (examples, "for example…", "we suggest…") and an *implementation plan* / *IT brief* (finalised ready-to-paste wording). The implementation plan's wording usually supersedes — it's the lawyer's examples, finalised and often strengthened. When they differ, the finalised plan wins; flag the difference to the user.
2. **Use legal-approved wording VERBATIM. Never paraphrase compliance copy.** This is the #1 mistake. If the document gives exact English text for a block, paste it character-for-character. Paraphrasing — even when semantically equivalent — is not acceptable for legal copy and the client *will* send it back. Only the *intent* of UI labels (button text, status chips) may be adapted to fit the design; the disclaimer/legal sentences may not.
3. **Find EVERY instance.** The same claim (a title, an AUSTRAC/license number, a trust chip) often appears in multiple components — hero, footer, FAQ, meta tags, OG/Twitter cards, `<title>`. Grep the whole codebase for each term; don't fix only the first hit. (In BNEVA the AUSTRAC labels lived in Hero chips, Footer info, AND the FAQ — missing the Hero copy was a real miss.)
4. **De-risk metadata too.** The page `<title>`, meta description, and OpenGraph/Twitter `title`/`description`/image-`alt` carry the same claims into search results and social shares. The lawyer literally addressed BNEVA's review to the *old page title*. Check `layout.tsx` / `<head>` / `next/metadata`.
5. **Verify against the BUILT output, not just the source.** After editing, build the site and grep the generated HTML for (a) zero banned terms and (b) every required approved string present verbatim. Source-only checks miss build transforms and conditional rendering. See `references/verification.md`.
6. **Final human sign-off is required.** Every such review ends with "final review by compliance lead / lawyer before launch." You cannot tick that box. State it explicitly when reporting done.

## Workflow

1. **Locate & read** all review/plan documents (`pandoc … -t plain`, or `Read` PDFs). List every numbered recommendation.
2. **Map** each recommendation to one of the four failure modes and to the exact file(s)/component(s) it touches. Grep for each high-risk term across the repo to find all instances.
3. **Confirm scope** with the user only where it's genuinely ambiguous (e.g. "replace the trading-terminal visual with a process card — what does legal permit?"). Default to the implementation plan's prescribed replacement. Don't ask about things the document already specifies.
4. **Apply edits.** Verbatim legal wording for disclaimers. For removed visual elements (trading terminals, FX widgets), replace with an on-brand, non-priced equivalent (a compliance *process* card: Request → Compliance review → Provider terms → Settlement approval) reusing existing CSS classes so the design doesn't break. Update any now-orphaned CSS grid column counts.
5. **Build & verify** — see `references/verification.md`. Run the banned-terms scan AND the verbatim-approved-string scan against the built HTML. Walk the document's own pre-launch checklist if it has one.
6. **Report** with: what changed (mapped to the review's numbering), the verification results, and the outstanding **human legal sign-off** item.

## Reference files

- **`references/banned-terms-checklist.md`** — the canonical list of UI terms/displays to remove, the status labels to apply, and the pre-launch checklist. Load this when scanning or verifying.
- **`references/disclaimer-library.md`** — battle-tested disclaimer wording (no-advice, no-banking, future-services, FX-facilitation, indicative-assets, AUSTRAC-not-endorsement) you can offer when the client has *not* supplied exact text. If the client supplied text, theirs wins — use it verbatim.

## What this skill is NOT

- Not legal advice. You apply what counsel provided; you don't invent compliance positions. When unsure whether something is permitted, say so and ask.
- Not a redesign or a "make it look better" pass. Copy/labels/disclaimers only.
- Not a substitute for the final human legal review before launch.
