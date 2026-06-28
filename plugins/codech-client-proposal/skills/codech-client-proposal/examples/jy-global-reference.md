# Worked Example: JY Global AI Portal Proposal

The validated reference build that this skill is reverse-engineered from. Use it as "what good looks like" when applying the canonical anatomy to a real engagement.

---

## Live deployment

- **URL:** https://jy-global-proposal-ai-portal.pages.dev
- **Cloudflare account:** dev.codech@gmail.com
- **Project name:** `jy-global-proposal-ai-portal`

## Source files (current locations)

- **Module-pricing version (deployed):** `c:/Users/Kai Xuan/OneDrive/Claude Code Project/JYglobal AI Portal/JY Global AI Portal Milestone 1 Proposal - Module Pricing.html`
- **Phase-pricing version (archived):** `c:/Users/Kai Xuan/OneDrive/Claude Code Project/JYglobal AI Portal/JY Global AI Portal Milestone 1 Proposal.html`
- **Design system:** `c:/Users/Kai Xuan/OneDrive/Claude Code Project/JYglobal AI Portal/design-system.md`
- **Prototype-app source:** `c:/Users/Kai Xuan/OneDrive/Claude Code Project/JYglobal AI Portal/prototype-app/*.html`
- **Screenshots:** `c:/Users/Kai Xuan/OneDrive/Claude Code Project/JYglobal AI Portal/screenshots/*.png`

## What it demonstrates

| Anatomy section | JY Global treatment |
|---|---|
| Utility bar | Centred "Confidential · Pilot Milestone 1 Proposal for JY Global" pill |
| Sticky nav | 9 sections: Overview, 4 modules, Architecture, Tech Stack, Scope, Modular Pricing |
| Hero | "Internal AI Portal built for JY Global." — 2-line headline with cyan period accent |
| What we're building | 4 module cards in grid, Module 02 rendered featured dark |
| Module 01 Chat Workspace | White bg, two mockups (workspace + project page), browser chrome |
| Module 02 Personal Assistant | **Dark navy bg with cyan glow** — the featured "centerpiece" section |
| Module 03 Meeting Minutes | White bg, two mockups (meetings inbox + meeting detail), Read.ai integration shown |
| Module 04 Knowledge Hub | Navy-wash bg, single mockup with 7 KB category cards |
| Architecture | Vertical layered diagram: Entry → Auth+Coordinator → Modules → Tiers → Infrastructure |
| Tech Stack | 6 layer cards in 3×2; **AI Models card is featured dark** with primary + alternate model tiers |
| Scope of Work | Function-pillars variant (7 pillars), one rendered featured dark |
| Pricing (current) | Module-based variant: Foundation (mandatory, dark) + 4 modules + 4 suggested bundles |
| Closing | Locked Codech identity verbatim |

## What it teaches per reference doc

| Lesson | Where to look |
|---|---|
| Cyan period accents on every display H2 | hero `<h1>`, every section H2 |
| Mobile lightbox image swap | `prototype-mockup` class on 6 mockups, screenshots/ folder |
| Anim-up with 3-second safety net | bottom `<script>` block |
| Sticky nav scroll-active state | sections array in bottom `<script>` block |
| "Not in this milestone" honest panel | scope section, grouped by deferral reason |
| Featured dark cards breaking visual symmetry | one per section (module 02, AI Models layer, foundation pricing card) |
| Bundle pricing with recommended dark card | suggested-bundles grid in pricing section |
| Codech closing section with WhatsApp CTA | bottom of page, never re-themed |
| Responsive grid `grid-cols-1 sm:grid-cols-X` pattern | architecture diagram (after the mobile fix) |
| End-of-proposal sign-off marker | below closing card |

## Iteration history (what got changed during the engagement)

Useful to know as warnings:

| Initial state | Problem | Fix |
|---|---|---|
| Architecture used `grid grid-cols-4` and `grid grid-cols-3` | Squished on mobile | Switched to `grid grid-cols-1 sm:grid-cols-X` cascade |
| Mobile mockups showed scaled-down HTML | Unreadable | Captured PNG screenshots via Playwright, swap on mobile |
| Lightbox opened at native pixel size | Required scrolling to see anything | Added fit-to-screen default + tap-to-zoom toggle |
| Foundation priced at RM 7,500 | Client wanted lower entry point | Changed to RM 3,000, cascaded through bundle totals |
| Productivity bundle had M01+M02+M03 | Client preferred knowledge over meetings in that bundle | Swapped M03 for M04 |
| Phase-based pricing (RM 8,000 total) | Felt under-scoped | Restructured to module-based (RM 21,500 full bundle) |
| Footer existed (4-column) | User wanted cleaner ending | Removed entirely; closing card + end-of-proposal marker is the new ending |
| "v3" labels everywhere | Versioning leaked into client-facing copy | Removed from utility bar, hero eyebrow, brand strip (kept inside fake KB entries in mockups for realism) |

**Lesson:** when iterating with a client, the changes converge toward shorter, more honest, more visually rhythmic copy. The skill's defaults should reflect the end state, not the starting state.
