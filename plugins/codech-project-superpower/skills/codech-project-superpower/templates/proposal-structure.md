# Proposal Structure Template

> The 19-section proposal structure used in the Codech approach. Do NOT improvise structure — the order, numbering, and content type for each section is battle-tested across multiple engagements.

## Filename conventions

| Primary language | Files |
|---|---|
| Traditional Chinese | `Project_Proposal.md` / `.html` / `.pdf` |
| English | Same names (single-language) |
| Bilingual | Add `_EN` suffix: `Project_Proposal_EN.md` / `.html` / `.pdf` |

The HTML and MD versions must stay in sync after every edit. The PDF is regenerated from HTML.

## Cover page

A full-bleed branded page with no body content visible — only:

```
+--------------------------------+
|                                |  ← gradient brand background
|  [BADGE: PROJECT PROPOSAL]     |
|  [GOLD DIVIDER]                |
|                                |
|  <PROJECT TITLE>               |
|  <SUBTITLE / LOCAL NAME>       |
|                                |
|                                |
|  CLIENT      PROJECT CODE       |
|  ...          ...               |
|  PROPOSAL    ESTIMATED          |
|  DATE         DURATION          |
|                                |
+--------------------------------+
```

### CSS skeleton

```css
.cover {
  background: linear-gradient(160deg, <dark> 0%, <primary> 45%, <light> 100%);
  color: #fff;
  min-height: 297mm;
  padding: 28mm 22mm;
  margin: 20px auto;
  max-width: 210mm;
  position: relative;
  overflow: hidden;
  page-break-after: always;
  display: flex;                        /* CRITICAL */
  flex-direction: column;               /* CRITICAL */
}
.cover-meta {
  margin-top: auto;                     /* CRITICAL — pushes to bottom */
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 28px;
  font-size: 10pt;
}
@media print {
  .cover {
    margin: 0 !important;
    box-shadow: none !important;
    height: 297mm;
    min-height: 297mm;
    max-height: 297mm;
    page-break-after: always;
  }
}
```

Decorative radial gradients via `::before` and `::after` pseudo-elements with `position: absolute` are safe — they don't affect pagination because they don't carry content.

## Table of Contents

Section 0. Numbered list of all 19 sections + appendices. In HTML, render with counter:

```css
.toc ol { list-style: none; counter-reset: toc; }
.toc ol li {
  counter-increment: toc;
  display: flex;
  border-bottom: 1px dashed #d4dadf;
}
.toc ol li::before {
  content: counter(toc, decimal-leading-zero);
  font-weight: 600;
  color: <primary>;
}
```

## The 19 Sections

| # | Section | Required content |
|---|---|---|
| **1** | **Executive Summary** | • 3 short paragraphs framing the project<br>• "Value Proposition" — 6 stat-card grid (DIGITAL / FIELD-TO-REPORT / AUTOMATION / VISIBILITY / FUTURE-READY / COMPLIANCE — or industry equivalents)<br>• Target KPIs callout |
| **2** | **Project Background & Objectives** | • Client profile (1 paragraph)<br>• Business pain points (table, ≥5 rows)<br>• Project objectives table with measurable KPIs (O1–O6) |
| **3** | **Current State Analysis** | • As-Is flow (ASCII diagram acceptable for proposal MD; SVG for HTML)<br>• To-Be flow (same) |
| **4** | **Scope of Work** | • Phase pills (P1–P6 or relevant count)<br>• Phase table (name + deliverables + effort)<br>• In-Scope bulleted list<br>• Out-of-Scope callout (with "warn" style) |
| **5** | **System Architecture** | • Tech stack table<br>• **Inline SVG logical architecture** (see `recipes/architecture-diagram.md`)<br>• Deployment options (≥3) with recommended marked<br>• Permission model |
| **6** | **Functional Module Specifications** | • One subsection per module (typically 4–7 modules)<br>• Feature tables per module with feature IDs (F1.1, F1.2, etc.)<br>• Code-block hierarchy diagrams (category trees, state machines)<br>• Field table for one critical entity (e.g., POS report fields) |
| **7** | **Integration Services** | • External service table (WhatsApp, SMS, SMTP, etc.)<br>• Internal API patterns (REST, WebSocket)<br>• AI Chatbot (if applicable) — full subsection with tech stack, capabilities, tools, guardrails |
| **8** | **Hardware Procurement** | • Item list with specs, qty, use<br>• Critical-path callout if a single item is on the critical path |
| **9** | **Data Migration Plan** | • Migration scope table<br>• Process flow (ASCII or SVG)<br>• Cleansing priorities bullet list |
| **10** | **Security & Compliance** | • Security area table (auth, encryption, audit, retention, etc.)<br>• Locale-specific compliance row (PDPO / GDPR / HIPAA / etc.)<br>• AI-specific rows if applicable (prompt injection, output validation) |
| **11** | **Timeline & Milestones** | • Phase timeline table<br>• **Gantt view** (ASCII or HTML table with cells)<br>• Milestones M1–M7+ table |
| **12** | **Deliverables** | • Numbered table D1–D15+ with phase + format |
| **13** | **Training Plan** | • Audience + content + hours<br>• Delivery modes<br>• Knowledge transfer policy |
| **14** | **Maintenance & Support** | • Scope table<br>• **SLA table** (P1/P2/P3/P4)<br>• Availability target |
| **15** | **Risk Management** | • R1–R8+ table: risk / likelihood / impact / mitigation<br>• Bold the highest-impact rows |
| **16** | **Acceptance Criteria** | • Functional / Performance / Security / Data subsections<br>• Each with measurable criteria |
| **17** | **Assumptions, Exclusions & RACI** | • Assumptions bullet list<br>• Exclusions reference §4.2<br>• RACI matrix excerpt (≥7 activities) |
| **18** | **Pending Items** | • Info callout introducing them<br>• Table P1–P8 of items client must clarify<br>• Each row: item + which REQ it affects + suggested delivery week |
| **19** | **Appendices** | • A: Glossary<br>• B: Reference documents (file paths)<br>• C: High-level data entities (tree diagram)<br>• D: Sample API endpoints<br>• E: Brand palette (with swatches) |

## Bilingual handling

When generating both Trad Chinese AND English:

1. Write the primary-language version FIRST (typically 繁中 for HK clients)
2. Translate section-by-section, preserving structure exactly
3. Keep proper nouns in original script in BOTH versions:
   - Client name: 新界蔬菜產銷合作社 stays in 繁中 even in English doc
   - Place names: 大埔, 元朗 etc.
   - Person names: 紀強小農, 翠園農場
4. Technical terms stay in English in BOTH versions:
   - "Qwen 2.5-32B-Instruct", "PostgreSQL", "WhatsApp Business API"
5. System prompts (for AI assistants) stay in English in BOTH versions (industry standard)

## Visual conventions

### Color tokens (sourced from brand)

```css
--brand-primary:   #2E7D32   /* swap per industry */
--brand-dark:      #1B5E20
--brand-accent:    #FFB300
--success:         #16A34A
--warning:         #EAB308
--danger:          #DC2626
--surface:         #FAFAFA
--card:            #FFFFFF
--border:          #E5E7EB
--muted-fg:        #6B7280
--fg:              #0F172A
```

### Callout styles

```html
<div class="callout">       <!-- info, default amber border -->
<div class="callout info">  <!-- blue -->
<div class="callout warn">  <!-- red, for out-of-scope or critical -->
```

```css
.callout {
  margin: 5mm 0;
  padding: 10px 14px 10px 16px;
  border-left: 4px solid var(--brand-accent);
  background: #fff8e1;
  border-radius: 0 4px 4px 0;
  font-size: 10pt;
  page-break-inside: avoid;        /* CRITICAL */
  break-inside: avoid;             /* CRITICAL */
}
```

### Stat cards (Executive Summary value proposition)

6 cards in a 3-column grid (3×2). Each:

```html
<div class="stat-card">
  <div class="k">DIGITAL</div>
  <div class="v">數位轉型</div>
  <div class="desc">Replace paper and Excel with a single source of truth.</div>
</div>
```

CSS includes the page-break-inside fix.

### Phase pills (Section 4)

```html
<div class="phase-pills">
  <span class="pill">Phase 1 · Planning</span>
  <span class="pill">Phase 2 · Core Dev</span>
  <span class="pill amber">Phase 5 · Hardware (parallel)</span>
  <span class="pill blue">Phase 6 · Maintenance</span>
</div>
```

### Gantt (Section 11.2)

A bordered table inside `.gantt` wrapper. Each cell is a swimlane week:

```html
<div class="gantt">
  <table>
    <thead><tr><th>Phase / Week</th><th>W1</th><th>W2</th>...</tr></thead>
    <tbody>
      <tr>
        <td>P1 Planning</td>
        <td class="bar"></td><td class="bar"></td>...
      </tr>
    </tbody>
  </table>
</div>
```

CSS:

```css
.gantt td.bar { background: var(--brand-primary); }
.gantt td.bar.amber { background: var(--brand-accent); }
.gantt td.bar.blue { background: #1976d2; }
```

## Appendix conventions

Each appendix gets an H2 header `## 附錄 A：...` / `## Appendix A: ...`.

### Glossary
Three-column table: Acronym / Full Form / Local-language equivalent.

### Reference documents
Numbered list with monospace filenames. Cite the source docs by their actual filenames.

### Data entities
Tree-style code block showing entity → fields → has_many relationships.

### API endpoints
Code block grouped by resource (auth / customers / orders / etc.) with HTTP verb + path.

### Brand palette
Table with HEX values and inline color swatches.

## When to add extra appendices

For AI-heavy projects, add:
- **Appendix F: AI Chatbot Architecture Decision Record** (ADR-001 style)
- **Appendix G: Phase 3 AI Workstream Detail** (week-by-week sub-Gantt)
- **Appendix H: Sample System Prompt** (the actual production-grade prompt)

For data-migration-heavy projects, add:
- **Appendix F: Data Migration Strategy** (per-table mapping)

For compliance-heavy projects, add:
- **Appendix F: Compliance Checklist** (per-regulation mapping)

## Quality bar

Before considering the proposal "done":

- [ ] Every section above is present (or explicitly marked N/A with reason)
- [ ] Pending Items section has ≥3 items (if there are zero, you didn't probe enough)
- [ ] At least one inline SVG diagram (architecture in §5 minimum)
- [ ] Acceptance criteria are MEASURABLE (numbers, not adjectives)
- [ ] Bilingual: both versions render identically structurally
- [ ] PDF exports without empty pages or split cards
- [ ] File size: PDF 1.5–3MB, HTML 1500–3000 lines, MD 1200–2000 lines
