# Recipe: Inline SVG Architecture Diagrams

> How to draw the logical architecture diagram in §5.2 of every proposal. Inline SVG is the standard — never ASCII for final HTML deliverables.

## Why inline SVG (not images, not ASCII)

| Approach | Verdict |
|---|---|
| Inline SVG | ✅ Best — vector, embeddable, no external assets, prints sharply |
| External PNG | ❌ Bitmap loss when zoomed, breaks if file moves |
| External SVG | ❌ Same dependency problem |
| ASCII art | ✅ OK for early drafts and MD source; ❌ unprofessional in final HTML/PDF |
| Mermaid | ❌ Requires JS to render; doesn't work in static PDF export |

## Canvas conventions

- **viewBox**: `0 0 800 940` (4:5-ish aspect, fits A4 portrait nicely)
- **Width**: `100%` with `max-width: 800px` so it scales fluidly
- **Center**: `display: block; margin: 5mm auto`
- **Font**: Inherit page font via `font-family: 'Noto Sans TC','Inter',sans-serif`

```svg
<svg viewBox="0 0 800 940" xmlns="http://www.w3.org/2000/svg"
     style="width:100%; max-width:800px; height:auto; display:block; margin:5mm auto; font-family:'Noto Sans TC','Inter',sans-serif;">
  ...
</svg>
```

## Reusable defs

```svg
<defs>
  <!-- Soft drop shadow for cards -->
  <filter id="softShadow" x="-10%" y="-10%" width="120%" height="130%">
    <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#000" flood-opacity="0.12"/>
  </filter>

  <!-- Brand gradient (vertical) -->
  <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#2e7d32"/>
    <stop offset="100%" stop-color="#1b5e20"/>
  </linearGradient>

  <!-- Other gradients (blue for AI, gold for accent, NVIDIA green) -->
  <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#1976d2"/>
    <stop offset="100%" stop-color="#0d47a1"/>
  </linearGradient>
  <linearGradient id="gradNvidia" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#76b900"/>
    <stop offset="100%" stop-color="#558b00"/>
  </linearGradient>

  <!-- Arrow markers (one per color) -->
  <marker id="arrGreen" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="#2e7d32"/>
  </marker>
  <marker id="arrBlue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="#1565c0"/>
  </marker>
  <marker id="arrGold" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
    <path d="M0,0 L10,5 L0,10 z" fill="#FFB300"/>
  </marker>
</defs>
```

Color palette (matching CGG proposal — adapt per industry):
- Primary green: `#2e7d32` / `#1b5e20`
- Accent gold: `#FFB300` / `#b76e00`
- AI blue: `#1565c0` / `#0d47a1`
- NVIDIA green: `#76b900` (only if NVIDIA hardware/software)
- Muted text: `#6b7280`
- Body text: `#1f2937`

## Tier layout (vertical flow)

Standard layered architecture for ERP/SaaS systems:

```
┌────────────────────────────────────┐
│  CLIENT LAYER                       │  ← top (y=10–110)
│  [MacBook] [iPad] [Browser]         │
└──────────────────┬─────────────────┘
                   │ HTTPS · TLS 1.3
┌──────────────────▼─────────────────┐
│  REVERSE PROXY (Nginx + SSL + CDN)  │  ← y=120–200
└──────────────────┬─────────────────┘
                   │
┌──────────────────▼─────────────────┐
│  APPLICATION SERVICES               │  ← y=220–320
│  [Web App] [Chatbot] [Webhook]      │
│  [QR Scan] [Reporting]              │
└──────────────────┬─────────────────┘
                   │
┌──────────────────▼─────────────────┐
│  AI SUBSYSTEM (optional)            │  ← y=350–680
│  ┌─AI Orchestrator (LangGraph)─┐    │
│  │ Input → RAG → LLM → Tools   │    │
│  │ → Output Guardrails         │    │
│  └─────────────────────────────┘    │
│           ↓                          │
│  ┌─NIM on DGX───────────────────┐   │
│  │ Qwen 2.5-32B-Instruct        │   │
│  └─────────────────────────────┘    │
└──────────────────┬─────────────────┘
                   │ RAG / Tool queries
┌──────────────────▼─────────────────┐
│  DATA LAYER                         │  ← y=750–820
│  [PG] [pgvector] [Redis] [S3]       │
└────────────────────────────────────┘

Bottom legend: y=870–900
```

## Box primitives

### Standard card (white, brand border)

```svg
<g filter="url(#softShadow)">
  <rect x="40" y="35" width="230" height="68" rx="8" fill="#ffffff" stroke="#2e7d32" stroke-width="1.5"/>
  <text x="155" y="63" text-anchor="middle" font-size="13" font-weight="600" fill="#1f2937">MacBook Pro × 3</text>
  <text x="155" y="83" text-anchor="middle" font-size="10" fill="#6b7280">Admin Workstations</text>
</g>
```

### Highlighted card (accent — use for "this is special")

```svg
<g filter="url(#softShadow)">
  <rect x="186" y="253" width="135" height="70" rx="8" fill="#fff8e1" stroke="#FFB300" stroke-width="2"/>
  <text x="253" y="278" text-anchor="middle" font-size="12" font-weight="700" fill="#b76e00">Chatbot</text>
</g>
```

### Full-width gradient bar (for proxies, gateways)

```svg
<g filter="url(#softShadow)">
  <rect x="40" y="158" width="720" height="50" rx="8" fill="url(#gradGreen)"/>
  <text x="400" y="187" text-anchor="middle" font-size="13" font-weight="600" fill="#fff">
    Reverse Proxy (Nginx) · SSL · CDN
  </text>
</g>
```

### Container with subtle tinted background (for grouping)

```svg
<!-- AI Subsystem container -->
<rect x="80" y="365" width="640" height="335" rx="14"
      fill="#f0f7ff" stroke="#1565c0" stroke-width="1.5" opacity="0.45"/>
<text x="100" y="388" font-size="11" font-weight="700" fill="#0d47a1" letter-spacing="2">
  AI SUBSYSTEM · 智能子系統
</text>
```

### Dashed zone (for "on-premise", "PDPO scope", etc.)

```svg
<rect x="195" y="595" width="410" height="92" rx="10"
      fill="#fffbe6" stroke="#FFB300" stroke-width="2" stroke-dasharray="6 4"/>
<text x="600" y="612" text-anchor="end" font-size="9" font-weight="700" fill="#b76e00" letter-spacing="1.5">
  DGX SPARK · ON-PREMISE · PDPO
</text>
```

## Connector primitives

### Straight vertical arrow (between tiers)

```svg
<line x1="400" y1="108" x2="400" y2="150" stroke="#2e7d32" stroke-width="2" marker-end="url(#arrGreen)"/>
<text x="412" y="132" font-size="10" font-weight="600" fill="#1f2937">HTTPS · TLS 1.3</text>
```

### Arrow with label

Label sits to the right of the arrow at y midpoint. Always use `font-weight="600"` so it reads against background.

### Curved Bezier connector

Use for "out and around" connections, like services bypassing the AI tier to data:

```svg
<path d="M 107,323 C 70,420 55,680 125,775"
      stroke="#94a3b8" stroke-width="1.4" fill="none"
      stroke-dasharray="4 4" marker-end="url(#arrMuted)"/>
```

CRITICAL: endpoints must land ON target boxes. Use viewBox math:
- Target box at `x=40, width=170`, so center x = `40 + 170/2 = 125`
- Target box at `y=778`, so top edge y = `778`
- Endpoint should be `(125, 775)` for snug arrival

### Highlighted flow arrow (for emphasis)

```svg
<line x1="253" y1="328" x2="253" y2="405" stroke="#FFB300" stroke-width="2.5" marker-end="url(#arrGold)"/>
```

Use gold/accent for the "primary flow" being demonstrated.

## Pipeline inside a card (5-step pattern)

For showing internal stages (e.g., RAG pipeline):

```svg
<g transform="translate(118, 460)">
  <!-- Step 1 -->
  <rect x="0" y="0" width="100" height="42" rx="6" fill="#e3f2fd" stroke="#1565c0" stroke-width="1.2"/>
  <text x="50" y="18" text-anchor="middle" font-size="10" font-weight="700" fill="#0d47a1">① Input Guard</text>
  <text x="50" y="33" text-anchor="middle" font-size="9" fill="#4b5563">Anti-Injection</text>
  <line x1="100" y1="21" x2="115" y2="21" stroke="#1565c0" stroke-width="1.5" marker-end="url(#arrBlue)"/>

  <!-- Step 2 -->
  <rect x="119" y="0" width="100" height="42" rx="6" fill="#e3f2fd" stroke="#1565c0" stroke-width="1.2"/>
  <text x="169" y="18" text-anchor="middle" font-size="10" font-weight="700" fill="#0d47a1">② RAG</text>
  <text x="169" y="33" text-anchor="middle" font-size="9" fill="#4b5563">pgvector</text>
  <line x1="219" y1="21" x2="234" y2="21" stroke="#1565c0" stroke-width="1.5" marker-end="url(#arrBlue)"/>

  <!-- Step 3 (highlighted) -->
  <rect x="238" y="0" width="106" height="42" rx="6" fill="#fff8e1" stroke="#FFB300" stroke-width="1.8"/>
  <text x="291" y="18" text-anchor="middle" font-size="10" font-weight="700" fill="#b76e00">③ LLM Reasoning</text>
  <text x="291" y="33" text-anchor="middle" font-size="9" fill="#4b5563">Qwen 2.5-32B</text>
  <!-- ... -->
</g>
```

Width per step (`100px`) + gap (`19px`) = `119px` stride. 5 steps = `595px` total.

## Legend (bottom)

Place at `y=870+`, document the symbols:

```svg
<g transform="translate(40, 882)">
  <text x="0" y="0" font-size="10" font-weight="700" fill="#1b5e20" letter-spacing="2">LEGEND · 圖例</text>

  <rect x="0" y="12" width="14" height="14" rx="2" fill="#fff8e1" stroke="#FFB300" stroke-width="1.5"/>
  <text x="20" y="23" font-size="10" fill="#1f2937">DGX Zone (local inference)</text>

  <rect x="170" y="12" width="14" height="14" rx="2" fill="url(#gradNvidia)"/>
  <text x="190" y="23" font-size="10" fill="#1f2937">NVIDIA Inference</text>

  <rect x="290" y="12" width="14" height="14" rx="2" fill="#e3f2fd" stroke="#1565c0" stroke-width="1.2"/>
  <text x="310" y="23" font-size="10" fill="#1f2937">AI Orchestration</text>

  <rect x="400" y="12" width="14" height="14" rx="2" fill="#ffffff" stroke="#2e7d32" stroke-width="1.5"/>
  <text x="420" y="23" font-size="10" fill="#1f2937">ERP Component</text>

  <line x1="510" y1="19" x2="528" y2="19" stroke="#2e7d32" stroke-width="2" marker-end="url(#arrGreen)"/>
  <text x="534" y="23" font-size="10" fill="#1f2937">Sync Request</text>
</g>
```

Every visual style in the diagram MUST appear in the legend. Orphaned colors look unprofessional.

## Captioning the diagram

Add a callout below the SVG for narrative context:

```html
<div class="callout info" style="margin-top:6mm">
  <span class="label">DGX Note</span> The dashed gold border marks the
  <strong>NVIDIA DGX Spark</strong> on-premise compute node. All AI inference
  happens at the Co-operative's office; no farmer data is ever sent to a cloud
  API — satisfying Hong Kong PDPO requirements.
</div>
```

## Common mistakes

| Mistake | Fix |
|---|---|
| Connector lines end off-canvas | Snap endpoints to target box coordinates |
| Legend shows colors not in diagram | Remove orphaned entries when removing visual elements |
| Text invisible on dark background | Use `fill="#fff"` on text over gradients |
| ASCII art left in HTML output | Replace with SVG before client delivery |
| viewBox doesn't match content | Adjust viewBox height to fit; don't crop content |
| No legend at all | Always add a legend, even if it has just 3-4 entries |
| Inconsistent stroke widths | Pick 1.2 (subtle border), 1.5 (standard), 2 (emphasis); stick to those |
| Sharp corners on cards | Use `rx="8"` on `<rect>` for rounded; `rx="10"` for cards, `rx="14"` for containers |

## Adaptation per project

| Industry | Modifications |
|---|---|
| Agriculture (CGG default) | Green + gold; AI subsystem if applicable; DGX zone if on-prem AI |
| Finance | Navy + silver; PCI-DSS zone instead of PDPO; payment gateway boxes prominent |
| Healthcare | Teal + coral; HIPAA zone; EMR/integration boxes; HL7/FHIR labels |
| SaaS/Tech | Indigo + amber; multi-tenant boundary; SSO/IDP integration |
| Manufacturing/IoT | Blue + orange; IoT gateway tier; MQTT/edge boxes |

Adjust the gradient `defs` and box colors accordingly. Structure stays the same.

## Quality bar

- [ ] Every visual style has a legend entry
- [ ] Every connector lands on a target box (no dangling)
- [ ] viewBox fits content snugly (no excess margin)
- [ ] Font is consistent (Noto Sans TC + Inter)
- [ ] Renders in Chrome AND Safari AND when exported to PDF
- [ ] Annotated below with a callout explaining the key insight
