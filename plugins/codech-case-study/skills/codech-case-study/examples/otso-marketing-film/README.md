# OTSO Markets case-study film (worked Mode C example)

"AI-powered file storage platform, proposed for OTSO Markets": the first film built with the **case-study framing** (storyboard v4.2, 2026-10-03, ~1:33, 28 beats; animation, music and SFX still to come). Look: **Midnight Vault**, picked by the user from three pitched concepts.

**Story:** opener (the solution is the title; "Proposed for [OTSO logo] OTSO Markets" below; the Codech logo alone at the top) → THE CHALLENGE (documents everywhere; a regulated business, nothing can slip; filename-only search; scans are invisible) → OUR SOLUTION (scan-beam reveal "An AI-powered file storage platform"; Store · Share · Manage) → features as mini UIs grouped Store / Find / Share / AI assistant / Manage → in OTSO's own cloud, plugs into the stack, built to grow → HOW WE DELIVERED (prototype first) → THE RESULTS → end card.

| File | What to borrow |
|---|---|
| `src/Vault.tsx` | the Midnight Vault world: `Space` (navy + dust), glass `Slab`, the cobalt `Beam` thread, `VHead` (white lines with a light sweep through the key word; clip-path instead of overflow so glows aren't boxed), `GWin`, `Glass`, `Pill`, `AIBar`; case-study opener `VOpener`, challenge beats, the vault door, constellation stack, results, end card with a beam logo reveal |
| `src/Mini.tsx` | focused **mini UIs** in the client's product styling floating as lit cards (`Card`, `Badge`, `Toggle`, `Btn`): drives, staged upload with per-file AI toggles, version compare, semantic search, AI summary from a scan, four-language relabel, classification-gated share, send-with-courtesy-check, team chat with photo avatars, assistant with sources, propose → confirm, streaming audit trail; plus `MRegulated` (challenge), `MPillars`, `MOwn`, `MGrows`, `MProcess` (how we delivered) |
| `src/Film.tsx` | `timeline.json` placement + the `ChapterTag` pill |
| `src/timeline.json` | the case-study order with a `tag` per scene |
| `storyboard-build.py` | storyboard data that reads its times from `timeline.json` (`tm()`, `at()`, `span()`), so the page always matches the cut |

Assets the scenes expect in `public/`: `screens/` and `chat/` (the pack's 2x walkthrough), `avatars/*.jpg` (9 AI-generated staff faces, made with ChatGPT Image via Codex as one 3×3 grid and split), `codech-logo-white.png` (ink recoloured to white, gold kept), `otso-logo-trimmed.png`, `logos/`, `phone-frame.png`, `qr-wa.png`.

Decisions recorded for this film: Team Chat shown as production (user decision; the case page keeps "In build"); no fee/subscription claims and no competitor names; OTSO naming consent still pending, so build but don't post.
