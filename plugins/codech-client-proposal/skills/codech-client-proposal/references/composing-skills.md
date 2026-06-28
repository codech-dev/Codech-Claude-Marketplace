# Composing with Other Skills

This skill is one node in Codech's skill graph. Knowing what to delegate keeps responsibilities clean.

---

## §when-to-delegate Delegation table

| If the user needs... | Use | Why |
|---|---|---|
| To create a design system from scratch for a new client | `/codech-mockup-design` | That skill owns design-system derivation — token tables, principle docs, HTML showcases |
| To produce FSD / SAD / TDD / SRS / master implementation plan | `/codech-project-superpower` | Phase 2 of that workflow covers pre-development documentation |
| To build interactive prototype-app/* HTML pages from scratch | `/codech-project-superpower` Phase 3 (PoC) | That phase produces the single-file interactive prototypes |
| To convert the proposal to PDF | Out of scope here — use a PDF skill or print-to-PDF in the browser |
| To redesign an existing proposal (not Codech's) | `/redesign-existing-projects` or `/design-taste-frontend` | Those skills audit and upgrade arbitrary existing sites |

---

## §typical-flow Typical full engagement flow

```
1. /codech-project-superpower
     → reads requirements docs, drafts proposal, FSD, SAD, TDD, SRS
     ↓
2. /codech-mockup-design
     → derives client design system, produces design-system.md
     → builds prototype-app/*.html interactive prototypes
     ↓
3. /codech-client-proposal                  ← THIS SKILL
     → applies design system to canonical proposal anatomy
     → captures prototype screenshots
     → deploys to Cloudflare Pages
     → hands client a *.pages.dev URL
     ↓
4. (Phase 5 of codech-project-superpower)
     → production code build once proposal accepted
```

This skill's job is the **delivery layer** — taking the pre-developed artefacts and packaging them into a shareable proposal URL.

---

## §inputs Expected inputs from upstream skills

When invoked after `/codech-project-superpower` and `/codech-mockup-design`:

- ✓ `design-system.md` exists in project root (from mockup-design)
- ✓ `prototype-app/*.html` files exist (from project-superpower Phase 3)
- ✓ Logo file or visual identity assets in `mockup/assets/` or project root
- ✓ Proposal copy: client name, project name, deliverable list, pricing, timeline

If any of these are missing, the discovery loop (SKILL.md §workflow Step 1) will surface the gap and offer to either delegate to the right upstream skill or proceed with defaults.

---

## §outputs Outputs this skill produces

For downstream use:

- `_deploy/index.html` — the final proposal HTML
- `_deploy/screenshots/*.png` — captured prototype mockups
- `_deploy/codech-logo.png` — Codech identity
- A live `*.pages.dev` URL ready to share
- (Optional) `_deploy/functions/_middleware.js` if password protection is enabled

---

## §dont-do What this skill should NOT do

- **Don't generate a design system from scratch.** That's `/codech-mockup-design`'s job. If the user has no design system, delegate.
- **Don't write the proposal copy.** That's the user's content. This skill provides voice rules and structure; the user (or `/codech-project-superpower`) provides the actual sentences.
- **Don't build new prototype-app HTML.** Use what exists; if it doesn't exist, delegate to `/codech-mockup-design`.
- **Don't generate FSD / SAD / TDD.** Those are pre-development docs handled by `/codech-project-superpower`. This skill is about packaging the proposal, not documenting the project.

When in doubt: this skill turns existing artefacts into a deployed URL. If the upstream artefacts don't exist, point the user at the right upstream skill.
