# Worked Example: OTSO AI Hub — Phase 1 Proposal

The second validated reference build. Where `jy-global-reference.md` is the baseline "what good looks like", **this one is the worked example for the idioms JY Global doesn't show** — the mobile desktop-recommended banner, the bilingual EN ⇄ 简体中文 toggle, and the refined 820px lightbox. Reach for it when an engagement is bilingual, finance/markets-flavoured, or two-module rather than four.

---

## Live deployment

- **URL:** https://otso-ai-hub-proposal.pages.dev
- **Cloudflare account:** dev.codech@gmail.com
- **Project name:** `otso-ai-hub-proposal`
- **No-index protected:** `<meta name="robots" content="noindex, nofollow">` + `robots.txt` + `_headers` (`X-Robots-Tag`) — client-confidential, kept out of search engines.

## Source files (current locations)

- **Deployed proposal (source of truth):** `c:/Users/Kai Xuan/OneDrive/Claude Code Project/OTSO AI Hub/OTSO AI Hub — Phase 1 Proposal.html`
- **Deploy folder (what ships):** `c:/Users/Kai Xuan/OneDrive/Claude Code Project/OTSO AI Hub/deploy/` — `index.html` (copy + noindex meta) + `screenshots/` + `_headers` + `robots.txt` + logos
- **Prototype-app source:** `c:/Users/Kai Xuan/OneDrive/Claude Code Project/OTSO AI Hub/otso-docs-prototype.html`
- **Design system:** `c:/Users/Kai Xuan/OneDrive/Claude Code Project/OTSO AI Hub/OTSO-design-system.md`
- **Screenshots:** `c:/Users/Kai Xuan/OneDrive/Claude Code Project/OTSO AI Hub/screenshots/*.png` (7 mockups: home, drive, editor, doc-viewer details/comments, dashboard, users)

## What's new here vs JY Global (the reason this example exists)

| Idiom | Where it's documented | OTSO treatment |
|---|---|---|
| **Desktop-recommended banner** | `references/proposal-anatomy.md` §02b | Mobile-only navy strip with `ph-desktop` + cyan accent, shown at ≤820px, above the hero |
| **Bilingual EN ⇄ 简体中文** | `references/multilanguage.md` | Top-bar `ph-translate` toggle; dual `t-en`/`t-zh` spans; localStorage; head-script flash prevention; Noto Sans SC fallback |
| **820px lightbox** | `references/visual-idioms.md` §lightbox | Per-mockup `<figure class="prototype-mockup-image">` + inline `pmZoom()` + shared `#pmlb`; 820px breakpoint ties banner + image-swap together |
| **Two-module shape** | `references/proposal-anatomy.md` §04 | Only 2 deliverables (Document Inventory + AI Assistant) + a secure foundation — overview section still earns its place |
| **No-index deploy** | `references/cloudflare-deploy.md` | meta + robots.txt + `_headers` for a confidential client proposal |

## What it demonstrates (anatomy)

| Anatomy section | OTSO treatment |
|---|---|
| Utility bar | Centred "Confidential · Phase 1 Proposal for OTSO Markets" pill + **EN/中文 toggle** |
| Desktop banner (§02b) | Mobile-only "best viewed on desktop" strip |
| Sticky nav | Overview, Modules (dropdown), Architecture, Tech Stack, Scope, Timeline, Governance |
| Hero | "AI-Powered Document Inventory System" — cyan period accent, white-chip trust row |
| What we're building | 2 module cards + foundation band; Module 02 featured dark |
| Module 01 Document Inventory | Home / Drive / Editor / Sharing blocks, multiple browser-chrome mockups |
| Module 02 AI Personal Assistant | Dashboard + Ask-the-Assistant + always-asks safety band |
| Architecture | Plain-language 5-step path **and** a detailed bilingual layered diagram |
| Tech Stack | 6 layer cards in 3×2; AI Models card featured dark; "Already locked" decisions strip |
| Scope of Work | In-Phase-1 checklist + "Saved for later phases" + the "Never" assistant boundary |
| Timeline | 5 stacked stage cards + dark summary stat banner (small-team estimate, indicative) |
| Governance | Quality/security + collaboration + 3 risk cards (the JY example has no governance section) |
| Closing | Locked Codech identity verbatim (bilingual contact labels) |

## Iteration history (what got changed during the engagement)

Useful as warnings — the OTSO-specific traps:

| Initial state | Problem | Fix |
|---|---|---|
| `ph-server` icon on Platform & Storage card | Rendered blank — not a valid Phosphor name | Switched to `ph-fill ph-hard-drives`; verify icon names against the Phosphor set |
| Element screenshots baked in the sticky nav | Hid the dashboard's "Good morning, …" top row | Set `.sticky { position: static }` before capturing, then recapture |
| Mobile showed scaled-down live HTML | Unreadable | PNG screenshots in `<figure>` + 820px swap + `pmZoom()` lightbox |
| Single-language proposal | Client wanted Simplified Chinese | Added EN/中文 toggle via dual-span i18n, copy-only (mockups stay English) |
| Footer logo only appeared on image-load failure | "Codech Solutions" name went missing | Always render the wordmark `<h2>` alongside the logo `<img>` |
| Two timeline estimates (small team / larger team) | Redundant, cluttered | Kept the small-team indicative estimate only |

**Lesson:** the same convergence as JY Global — toward shorter, more honest, more rhythmic copy — plus two reusable additions (desktop banner, bilingual toggle) that are now skill defaults/options rather than one-off work.
