# {{Product name}} — project brief

Source material for a portfolio case study. Everything here is taken from the codebase, its specs and its delivery log. Wording is factual rather than marketing copy, so you can pick what to use and set the tone yourself.

---

## One-liner

{{One or two sentences: what it is, for whom, the one thing that makes it different.}}

## Client and context

- **Client:** {{name}}, {{what the business does}} ({{where}}).
- **Built by:** Codech. Scope covered {{requirements, design, prototype, build, deployment, operations}}.
- **Phase:** {{which phase this pack covers; what's proposed next and where to find it}}.
- **Timeline:** first commit {{date}}. Staging went live {{date}} and **production went live {{date}}**{{ at <domain> — only if public}}. {{Still ongoing?}}
- **Users:** {{accounts, imported from where}}.

## The problem

{{2–4 sentences on the situation before.}} The client needed:

1. {{need}}
2. {{need}}
3. {{need}}

## What was built (feature highlights)

| Area | What it does |
|---|---|
| **{{Area}}** | {{one line, concrete}} |

Mark anything not live: "(designed, not yet built)" or "(in progress)".

## Tech stack

- **Frontend:** {{…}}
- **Backend:** {{…}}
- **Data:** {{…}}
- **AI:** {{models and how they're used; say "via API" when they're not self-hosted}}
- **Auth:** {{…}}
- **Infra:** {{…}}
- **Testing:** {{…}}

## By the numbers (as of {{date}})

| | |
|---|---|
| Commits on `{{main}}` | {{n}} |
| Application source | {{files}} files, ~{{lines}} lines |
| Test code | {{files}} files, ~{{lines}} lines, ~{{cases}} test cases |
| {{E2E specs / visual-regression screens / API routes / DB models / languages / ADRs}} | {{n}} |

## Design

- Design language: {{colours, typeface, tone}}. See `brand/` {{and docs/<design-system>.md}}.
- Process: {{requirements → prototype → approval → build; how the design was enforced}}.

## Engineering stories (good case-study material)

1. **"{{Short title}}"** {{What happened, why it mattered, what we did, the measurable result.}}
2. …

Pick 3–7 real stories from the delivery log, commit messages, ADRs and incident notes: bugs caught in production, performance wins with numbers, security/compliance decisions, design decisions with a rejected alternative.

## Architecture in one paragraph

{{How the pieces fit: app, workers, queues, storage, AI, permissions, audit.}}

## Things to check before publishing

- **Client permission / NDA.** Confirm {{client}} is happy to be named, and whether production URLs, user counts and incident stories can be public. If not, anonymize (e.g. "{{a regional …}}").
- **Screenshots use demo/test data**, not client documents. Glance at each one anyway.
- The `docs/` copies are internal engineering documents. Use them for reference and quotes, not as public downloads. {{What was redacted.}}

## {{Next phase (designed, not yet built): …}}

{{Optional: status, where the designs are, the problem, the idea, designed features, key design decision, delivery plan.}}
