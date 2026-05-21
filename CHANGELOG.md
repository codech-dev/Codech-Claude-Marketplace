# Changelog

All notable changes to plugins in this marketplace are documented here.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## codech-project-superpower

### [1.0.0] — 2026-05-21

Initial release. Extracted from the CGG Agricultural ERP engagement (2026).

**Added:**
- 4-phase workflow: Ingest → Proposal → Pre-dev Docs → PoC Prototype
- `SKILL.md` orchestrator with phase decision tree and approval gates
- `gotchas.md` with 20+ battle-tested fixes from real engagement
- `templates/proposal-structure.md` — 19-section proposal template with bilingual conventions
- `templates/pre-dev-docs-structure.md` — FSD/SAD/TDD/SRS templates with ID schemes
- `templates/poc-prototype-html.md` — Single-file React + Tailwind + Framer Motion scaffold
- `recipes/pdf-export.md` — Chrome headless PDF export with all flags documented
- `recipes/architecture-diagram.md` — Inline SVG architecture diagram conventions
- Industry adaptations: agriculture, finance, healthcare, e-commerce, SaaS
- Locale adaptations: Trad Chinese, Simp Chinese, Japanese, English

**Integration:**
- Orchestrates `docx`, `superpowers:brainstorming`, `ui-ux-pro-max:ui-ux-pro-max`

**Tested on:**
- CGG Agricultural ERP (Hong Kong, Trad Chinese, AI-enabled, ~6-month engagement)

---

## Versioning policy

| Version bump | Trigger | Example |
|---|---|---|
| **Patch (1.0.x)** | Bug fixes, typos, gotcha additions, minor template polish | Add a new entry to `gotchas.md` |
| **Minor (1.x.0)** | New templates, recipes, optional features; backward-compatible | Add a `templates/test-plan-structure.md` |
| **Major (x.0.0)** | Breaking changes to workflow phases, file conventions, or skill name | Restructure phases or rename outputs |

## Update workflow

When updating a plugin:

1. Edit the relevant files
2. Bump the version in **both** manifests:
   - `.claude-plugin/marketplace.json` → `plugins[N].version`
   - `plugins/<plugin>/.claude-plugin/plugin.json` → `version`
3. Add a CHANGELOG entry above
4. Commit with conventional commit message (`feat:`, `fix:`, `docs:`, etc.)
5. Push to `main`
6. Notify team to run `/plugin marketplace update codech-marketplace`
