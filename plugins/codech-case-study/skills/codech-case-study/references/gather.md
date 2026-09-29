# Gather: build a portfolio asset pack from a finished project

Run this **inside the finished client project** (its repo, specs, prototype, running app) when the project ships or reaches a milestone. The output is one self-contained folder that Mode B (build the case study) later reads. The OTSO pack (`<marketing>/AI Portfolio Assets/OTSO AI Portal- portfolio-assets/`) is the reference for what "good" looks like.

The brief should be **factual, measured and sourced**, not marketing copy: the case study is written from it later, and anything wrong in the brief ends up public.

## Where the pack goes
Default: `<Codech Marketing project>/AI Portfolio Assets/<Product name>- portfolio-assets/` (Mode B reads packs from there). Find the Codech Marketing project on this machine (it contains `site/codech-ai-landing/`); if you can't, ask the user where it is, or write `./portfolio-assets/` in the client project and tell the user to move it. If a pack already exists, update it in place and note what changed at the top of README.md ("Updated <date>: added Team Chat").

## Folder layout (copy `assets/pack-template/` for README.md and PROJECT_BRIEF.md)
```
PROJECT_BRIEF.md  README.md  stats.json
brand/            logo(s) (PNG, transparent), favicon, login/hero art, design-tokens.css
screenshots/app-walkthrough/   15–25 full screens, 1440×900 @2x JPG, numbered in story order (01-login, 02-home…)
screenshots/ui-screens/        tight crops of dialogs/panels/tables (PNG); reuse visual-regression baselines if they exist
screenshots/mobile/            3–6 phone screens (390×844 @2x)
screenshots/early-mockups/     pre-build proposal mockups, if any
prototype/        the approved clickable prototype HTML + its local assets (+ user guide if one exists)
proposal/         the proposal HTML we pitched with, or LINKS.md with its URL
docs/             design system + FSD/SRS/SAD/TDD copies, redacted (internal reference only)
extras/           next-phase proposals, specs and their screenshots
```

## Steps
1. **Read the project** before writing anything: README, docs/ (FSD, SRS, SAD, TDD, design system, ADRs), the master plan or delivery log, CHANGELOG, recent commit messages, incident/runbook notes. Note what's live, what's staging-only, what's designed-but-not-built.
2. **Measure**: `python <skill>/scripts/gather_stats.py <repo> --out <pack>/stats.json`. Paste the table into "By the numbers" and check the timeline hints against the delivery log (first commit, staging live, production live). Add numbers the script can't see only if the repo proves them (user counts from a seed/import log, performance measurements from a report). Never estimate.
3. **Collect brand**: logo files (all variants), favicon, auth/hero images, and the design tokens (Tailwind theme/CSS variables) as `brand/design-tokens.css`.
4. **Screenshots**: click through the running app (or the prototype) yourself first, then write a `plan.json` and run `python <skill>/scripts/capture_screens.py plan.json <pack>/screenshots`. Use seeded demo data only; if the app has real client data, use the prototype instead. Cover: login, home/dashboard, each key feature in action (search results, AI panel, assistant answering, dialogs), admin/compliance screens, one non-English screen if multilingual, mobile. Look at every capture.
5. **Copy the prototype and proposal** (with their local assets), the user guide, early mockups, and the specs into docs/. Replace real production/staging hostnames, server IPs and internal URLs in the copies (`scan_pack.py --fix-ips` handles IPs).
6. **Write PROJECT_BRIEF.md** from the template: one-liner, client and context, the problem, feature table (mark not-live items), tech stack (say "via API" for hosted AI models), numbers, design, **3–7 engineering stories** (real incidents, measured wins, rejected alternatives: the best case-study material), architecture paragraph, things to check before publishing, next phase. Cite where each number came from in stats.json or a comment.
7. **Write README.md**: tree, brand quick reference (tokens table), suggested hero shots, notes (CDN dependencies, how to open the prototype), what was redacted.
8. **Scan**: `python <skill>/scripts/scan_pack.py <pack> --client-domains <client domain>`. Remove secrets, `.env`, dumps; redact real hostnames/IPs; leave demo data; list confidential labels and the naming-consent question at the end of the brief.
9. **Report** to the user: pack location, what's in it, numbers with their dates, anything uncertain (dates you inferred, features whose status was unclear), and the open publishing questions.

## Quality bar (what made the OTSO pack useful)
- The brief states status honestly ("designed, not yet built: present it as in progress").
- Numbers are exact and dated ("~1,200 commits as of 27 Sep 2026").
- Engineering stories have a before, an after and a number ("14 attempts from Beijing → resumable downloads, +58% throughput").
- Screens are numbered in the order you'd tell the story, with a "suggested hero shots" list.
- Internal docs are included for reference but clearly marked not for publication.
