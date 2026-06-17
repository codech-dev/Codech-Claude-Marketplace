# fintech-compliance-copy

Design, build, and keep regulator-safe a crypto / digital-asset / payment / fintech **marketing website**. For these platforms, trust *is* the aesthetic — so the design standard and the compliance discipline ship together.

Distilled from a real engagement: the BNEVA digital-asset exchange + payment-facilitation landing page, which shipped and passed an Australian law-firm review (AFSL / ASIC / AUSTRAC). The patterns generalise to any jurisdiction (FCA, MAS, MiCA, FinCEN/SEC).

## Two modes

1. **Design / build a new site** — use the institutional design standard (dark-tech, single confident accent, "product mock" visuals built from divs+SVG, scroll-reveal motion, trust-signal layer) with compliance baked in from the first draft.
2. **Apply a legal/compliance review** to an existing site — remove live trading/FX/price displays, mark unlaunched services (virtual accounts, IBAN, cards, settlement rails) "not currently available", add no-advice / no-banking / not-an-endorsement disclaimers, insert legal-approved wording **verbatim**. Do **not** redesign.

## What's inside

- `skills/fintech-compliance-copy/SKILL.md` — entry point + workflow
- `references/design-standard.md` — tokens, typography, layout, signature visuals, motion, trust signals, anti-patterns
- `references/banned-terms-checklist.md` — the 4 regulator failure modes, terms to remove, pre-launch checklist
- `references/disclaimer-library.md` — verbatim approved disclaimer wording
- `references/verification.md` — build + grep the output for zero banned terms and all approved strings

## Hard-won rules

- Never paraphrase legal copy — use client wording verbatim.
- Find **every** instance (including `<title>`, meta description, OG/Twitter tags).
- Verify against the **built** HTML, not source.
- Final human legal/compliance sign-off is always required before launch.

## Install

Via the Codech marketplace:

```
/plugin marketplace add codech-dev/Codech-Claude-Marketplace
/plugin install fintech-compliance-copy@codech-marketplace
```
