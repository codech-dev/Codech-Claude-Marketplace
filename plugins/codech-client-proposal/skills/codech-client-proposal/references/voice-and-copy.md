# Voice & Copy

The default voice preset for a Codech proposal is **professional-services / regulated-services**, distilled from the JY Global engagement. Switch presets only when a client's brand clearly signals otherwise.

---

## §principles Core principles

1. **Short clauses with full stops.** "Four modules. One secure workspace. Built around how compliance work actually happens." Three sentences each carrying one idea beats one sentence carrying three.
2. **Honest scope language.** If a feature is deferred, say so plainly in a "Not in this milestone" panel. Don't bury exclusions in fine print.
3. **Cyan period accent rhythm.** End the headline with `<span class="text-cyan-deep">.</span>`. Use it for emphasis, not decoration — 1–2 per headline, not on every word.
4. **No marketing puffery.** Banned words: *leading, world-class, best-in-class, innovative, leveraging, synergies, empowering, robust, cutting-edge, transformative, disruptive, seamless*. If you reach for one, find what you actually mean.
5. **British spelling by default.** Organisation (not organization), licence as noun / license as verb, behaviour, colour, prioritise, recognised. Toggle to American only if the client is US-domiciled.
6. **Numbered structure where possible.** `Module 01 · Chat Workspace`, `Phase 03 · Development`, `Tier 01 · User Memory`. Numbering signals systematic process.
7. **Concrete over abstract.** "RM 7,500" beats "competitive pricing". "9 weeks from kickoff to go-live" beats "rapid delivery".

---

## §headlines Headline patterns

| Pattern | Example | Use when |
|---|---|---|
| Two clauses, one period each | `Pick your modules. Pay only for what you ship.` | Pricing, value-prop sections |
| Single clause, single period | `Modular pricing.` | Eyebrow-style mini-headers |
| Three-beat declarative | `Every meeting. A status. An action.` | Module feature headings |
| Identity statement | `A pragmatic, modern stack. No moonshots.` | Tech stack section |
| Outcome statement | `Five phases. One fixed fee.` | Timeline/pricing summary |

Never:
- Headlines ending in question marks (unless rhetorical and immediately answered)
- Headlines with em-dashes mid-clause (use periods instead)
- Headlines longer than 8 words
- Headlines that start with "Introducing" or "The future of"

---

## §body Body copy patterns

**Lead paragraph (under hero/section H2):** 1–2 sentences, max 720px width. State what the section is *about*, not what it *contains*.

```
Pilot Milestone 1 ships the simplest viable version of each of the four
modules. Seven functional pillars below — what the platform actually does,
independent of which module delivers it. Enterprise integrations (SSO,
Outlook plugin, Telegram, proactive reminders) are deliberately deferred
to Milestone 2 once the foundation is proven.
```

**Card description (under card title):** 1 sentence, 12px. State the scope.

```
Project-scoped chat with document uploads, citations, custom instructions,
and exports.
```

**Disclaimer (italic, muted, under mockups):** 1 sentence stating reality.

```
Illustrative prototype — shown for reference only. Final UI will be
confirmed during Phase 02.
```

---

## §scope-language Scope honesty

The "Not in this milestone" panel is load-bearing. Group deferred items by reason:

| Group label | What goes here |
|---|---|
| `Milestone 2 · Enterprise integrations` | SSO, role-based access, Outlook plugin, Telegram bot |
| `Milestone 2 · Proactive assistant features` | To-do list, reminders, daily digest, defence-in-depth delivery |
| `Milestone 2/3 · Other deferrals` | Multilingual, voice, Slack/WhatsApp bots, DocuSign |
| `Out of scope · Never autonomous` | Outbound autonomous client comms, multi-tenant mode |

Two icons distinguish "deferred" from "out of scope":
- `ph ph-arrow-bend-up-right` — Phase 2/3 deferral (will eventually exist)
- `ph ph-x` — Out of scope permanently or `Never autonomous`

---

## §pricing-language Pricing language

When presenting prices:

- **State a number, not a range.** `RM 7,500` not `RM 7,000–8,500`. If the work isn't ranged, the price shouldn't be either.
- **Mark mandatory vs optional explicitly.** `Foundation · Required` vs `Module 01 · Optional`.
- **Show share of total** under each line: `12.5% of total` — gives the reader a sense of weight.
- **Group bundle options** as common configurations: `Minimum viable`, `Compliance focus`, `Productivity focus`, `Full pilot · Recommended` (mark recommended as featured dark).
- **Payment terms in plain language**: `50% deposit on Foundation sign-off, 50% on go-live. Quote valid for 60 days.`

---

## §presets Voice presets

Codech maintains presets for distinct client contexts. Add one when a real client engagement justifies it.

### Default: Professional-services / Regulated-services
British spelling, short clauses with periods, no contractions, honest scope language. Use for: compliance firms, advisory firms, legal-tech, fintech-regulated, governance/risk.

### (Future) SaaS-modern
American spelling permitted, contractions OK, slightly more direct ("We'll" instead of "We will"), still no puffery. Use for: B2B SaaS clients, dev tools, infrastructure products.

### (Future) Creative-services
More personality permitted; period accent still used; contractions and casual phrasing OK. Use for: design agencies, creative tooling, consumer products.

**Until a real engagement validates the SaaS-modern and Creative-services presets, both are placeholders. Default to professional-services.**

---

## §forbidden Forbidden phrasings (always rewrite)

| Bad | Better |
|---|---|
| "Our world-class team" | "The Codech team" or just "We" |
| "Leveraging cutting-edge AI" | "Using Claude Opus 4.x" |
| "Empowering your team" | "What [Client] gets" |
| "Seamless integration" | "Integration via [specific API]" |
| "Robust security" | "Audit log, encrypted at rest, SSO" |
| "Best-in-class compliance" | "Aligned with Cayman DPA + GDPR" |
| "Transformative impact" | "Replaces 6 hours of manual minute-taking per week" |

When you catch yourself reaching for an adjective, substitute a fact.
