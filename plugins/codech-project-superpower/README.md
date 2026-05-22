# Codech Project Superpower

> A Claude Code skill that turns raw requirement docs into a complete pre-development deliverable set: proposal → FSD/SAD/TDD/SRS → interactive prototype. The Codech client-engagement workflow, packaged.

**Version:** 1.0.0 · **License:** MIT · **Status:** Production

---

## What this skill does

A 4-phase workflow that takes you from "client just sent over their requirements docs" to "scope approved, specs ready, prototype demoable" — without leaving Claude Code.

```
Phase 1 — Ingest         (read .docx / .pdf / images / meeting notes)
   ↓
Phase 2 — Proposal       (MD → styled HTML → A4 PDF, bilingual if needed)
   ↓                      [APPROVAL GATE]
Phase 3 — Pre-dev docs   (FSD, SAD, TDD, SRS with full traceability)
   ↓
Phase 4 — PoC Prototype  (single-file React + Tailwind + Framer Motion HTML)
```

Each phase is gated. You always wait for explicit approval before advancing.

## When the skill triggers

Automatically, based on what the user says:

| You say | Skill activates |
|---|---|
| "Generate a project proposal from these docs" | Phase 1 + 2 |
| "Scope this project" | Phase 1 + 2 |
| "What documents should we prepare before development?" | Phase 3 |
| "Draft the FSD" / "create the SRS" | Phase 3 (specific doc) |
| "Build a PoC prototype" / "design the UI" | Phase 4 |
| "Convert the proposal to HTML and PDF" | Phase 2 (output stage) |
| (a `Requirements doc/` folder is detected in your project) | Phase 1 |

## What you get out of the box

| Deliverable | Format | Typical size |
|---|---|---|
| `Project_Proposal.md` (+ `_EN` if bilingual) | Markdown | 1,200–2,000 lines |
| `Project_Proposal.html` | Styled HTML with cover, ToC, SVG diagrams | 1,500–3,000 lines |
| `Project_Proposal.pdf` | A4 print-ready | 1.5–3 MB, 40–50 pages |
| `Feature_Scope_Document.md` | Feature IDs, business rules, sign-off | ~700–1,000 lines |
| `System_Architecture_Document.md` | ADRs, deployment topology, threat model | ~700–900 lines |
| `Technical_Design_Document.md` | Full DDL, API catalog, code patterns | ~1,200–1,800 lines |
| `Software_Requirements_Specification.md` | REQ IDs, state machines, traceability matrix | ~1,000–1,500 lines |
| `Prototype.html` | Single-file React + Tailwind + Framer Motion | 2,000–3,500 lines |

## What's inside the skill

```
skills/codech-project-superpower/
├── SKILL.md                              # Main orchestrator (the workflow)
├── gotchas.md                            # Battle-tested fixes (20+ pitfalls)
├── templates/
│   ├── proposal-structure.md             # 19-section proposal template
│   ├── pre-dev-docs-structure.md         # FSD/SAD/TDD/SRS templates
│   └── poc-prototype-html.md             # React prototype scaffold
└── recipes/
    ├── pdf-export.md                     # Chrome headless commands
    └── architecture-diagram.md           # Inline SVG conventions
```

Total: ~2,400 lines of battle-tested workflow knowledge.

## Industry and locale adaptive

The skill auto-detects context from your requirement docs:

| Detected | Adaptation |
|---|---|
| Trad Chinese content → HK client | Bilingual MD/HTML/PDF; PDPO compliance section; Cantonese chatbot samples |
| Finance / fintech keywords | Navy/silver palette; PCI-DSS/MAS/HKMA compliance; KYC modules |
| Healthcare keywords | Teal/coral palette; HIPAA + PDPO Health; EMR/HL7 patterns |
| E-commerce keywords | Catalog/cart/fulfillment modules; PCI-DSS payment patterns |
| SaaS B2B keywords | Multi-tenant boundary; SSO/IDP integrations; SOC 2 |
| Agriculture (default for HK co-ops) | Green/gold; PDPO; modules from CGG baseline |

Override the brand palette anytime by providing your own `brand.json` or saying "use [color] as primary."

## Required sub-skills

This skill orchestrates these — they activate automatically when needed:

| Sub-skill | Used for | Phase |
|---|---|---|
| `docx` | Reading `.docx` requirement files; producing Word output | 1, 2 |
| `superpowers:brainstorming` | Scoping the prototype options (A/B/C) | 4 |
| `ui-ux-pro-max:ui-ux-pro-max` | Design system confirmation | 4 |

Make sure these are also installed in your Claude Code setup (most are bundled or available via separate plugins).

## What's NOT in scope

- Commercial / legal documents (MSA, SOW, DPA) — separate concern
- Production code generation — skill ends at prototype
- Real backend implementation
- WhatsApp/SMS dispatch wiring (covered as a spec, not built)
- Test plan automation (derived from SRS by hand)
- Multi-tenant SaaS architecture variants (single-tenant assumed)

## Example invocation

```
You: I have new requirement docs in ./Requirements doc/. 
     Run the project blueprint workflow.

Claude: [activates codech-project-superpower skill]
        → Reads .docx + .pdf + image files
        → Produces structured summary (stakeholders, modules, pending items)
        → Drafts Project_Proposal.md
        → Generates Project_Proposal.html with cover + ToC + SVG architecture
        → Exports Project_Proposal.pdf via Chrome headless
        → "Proposal ready. Review §4 Scope, §11 Timeline, §18 Pending Items. 
           Approve to proceed to pre-dev docs."

You: Approved. Proceed.

Claude: [generates FSD → SAD → TDD → SRS in order, maintaining traceability]

You: Now build a PoC prototype, full module tour.

Claude: [invokes brainstorming for scope confirmation]
        [invokes ui-ux-pro-max for design system]
        [builds Prototype.html with all screens + chatbot widget]
```

## Update cadence

The skill improves based on real engagements. Run periodically:

```
/plugin marketplace update codech-marketplace
/plugin update codech-project-superpower
```

See [`CHANGELOG.md`](../../CHANGELOG.md) at the marketplace root for version history.

## Contributing

Found a gotcha not in `gotchas.md`? Improved a template? Open a PR — see [`CONTRIBUTING.md`](../../CONTRIBUTING.md).

## Quality bar

Every output the skill produces has its own quality checklist embedded in the corresponding template. The skill won't claim "done" until each item is verifiable.

---

**Origin:** This skill was extracted from the CGG Agricultural ERP engagement (2026), where it produced the full deliverable set in a single sustained working session. It has since been generalized for any client project.

**Maintained by:** Codech Engineering · [team@codech.dev](mailto:team@codech.dev)
