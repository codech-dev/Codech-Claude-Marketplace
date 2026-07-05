# Codech Mockup Design

A Claude Code plugin for structured design ideation and visual prototyping. Creates design system documents and self-contained HTML showcases that render live in any browser — no build step needed.

## What it does

This plugin provides a 7-phase design workflow that produces two artifacts per design direction:

1. **Design System Document** (`design-system.md`) — tokens, principles, component patterns, accessibility rules
2. **Visual Showcase** (`design-showcase.html`) — a single self-contained HTML file that renders every token, screen, and component live

The showcase is the primary deliverable. Open it in any browser and scroll through to judge the design.

## The workflow

| Phase | What happens |
|---|---|
| **1. Gather intelligence** | Query product type, audience, competitors, emotional register. Integrates with `ui-ux-pro-max` skill for data-driven design decisions. |
| **2. Write design system** | Create a markdown doc with 8 required sections: philosophy, colors, typography, spacing, radius/shadows, motion, component patterns, accessibility. |
| **3. Build showcase HTML** | Generate a self-contained HTML file with Tailwind CDN, Google Fonts, CSS custom properties, scroll-reveal animations, full-page screen mockups, and a fullscreen overlay viewer on every mockup. |
| **3.5. Mobile mockup** | Build a 390px phone frame section showing the same content adapted to mobile layout — single column, hamburger menu, touch-friendly buttons, stacked sections. |
| **3.6. AI image generation** | Generate brand-aligned images via HF Inference API (FLUX.1) — hero banners, product shots, lifestyle photos, textures. Replaces placeholder images with polished AI visuals. |
| **4. Present & iterate** | Show the user which file to open, call out specific things to evaluate, collect feedback. |
| **5. Multiple directions** | Create genuinely different alternatives — not just color swaps. Each version must differ on 5+ of 7 differentiation axes. |
| **6. Lock & reference** | Finalize the approved direction, link it from implementation plans, commit to git. |
| **7. Interactive prototype** *(optional)* | Spin up a Vite + React + shadcn + Framer Motion app with real animations, working components, and page routing. |

## When it triggers

The skill activates when you say things like:

- "Design the UI for..."
- "Create a mockup of the dashboard"
- "What should the landing page look like?"
- "Explore different visual directions"
- "Build a design system"
- "Show me a prototype"

Works for any project type: landing pages, dashboards, mobile apps, SaaS products, marketplaces, portfolios, admin panels, e-commerce stores.

## The "identically different" rule

When creating multiple design versions, every version must be **identically different** — not a reskin with swapped colors. This is enforced by a mandatory 7-axis audit:

| Axis | Examples |
|---|---|
| **Layout primitive** | Card grid, horizontal rows, bento, list rows, magazine spread, split-pane |
| **Typography model** | Serif + sans, single geometric sans, monospace-only, heavy display grotesk |
| **Color temperature** | Cool dark, warm light, monochrome, vibrant, pastel, iridescent |
| **Component shape** | Sharp (0-4px), medium (8-12px), generous (16-24px), fully rounded, hard borders |
| **Motion character** | Snappy (150ms), confident (250ms), gentle (400ms), spring-based, minimal |
| **Information density** | Spacious editorial, balanced app, compact dashboard, dense terminal |
| **Emotional register** | Premium editorial, warm craft, technical futurist, playful startup, indie builder |

## Key features

- **Design tokens** — every showcase renders colors, typography, spacing, and primitives live as interactive swatches and components
- **Scroll-reveal animations** — IntersectionObserver-driven fade+slide entrance animations with `prefers-reduced-motion` support
- **Full-page desktop mockups** — framed browser-style containers showing complete page designs at full fidelity
- **Fullscreen overlay viewer** — every mockup (desktop and mobile) has a "Full Screen" button that opens it in a dark overlay at max resolution; close via ESC, X, or backdrop click
- **Mobile phone frame mockup (Phase 3.5)** — 390px iPhone-proportioned frame with bezel, notch, and scrollable content area showing the mobile-adapted layout
- **Hamburger menu** — slide-in left panel with backdrop overlay for mobile nav; locks background scroll when open
- **Interactive carousels** — swipeable testimonial/gallery sliders with dot navigation, touch/mouse drag, paginated desktop groups, and auto-advance timers
- **Motion system with real components** — motion demos use actual project UI (product cards, testimonial cards, nav links, buttons) with auto-looping animations and interactive hover effects — no abstract shapes
- **Component language consistency** — all UI primitive labels match the project language (bilingual for non-English projects)
- **Interactive re-initialization** — `reinitClone()` pattern ensures carousels and menus work correctly inside fullscreen clones
- **AI image generation (Phase 3.6)** — generate hero banners, product shots, lifestyle photos, and textures via HF Inference API (FLUX.1-schnell/dev) with brand-aware prompt engineering; outputs a JSON manifest for reproducibility
- **Multi-version navigation** — cross-links between v1/v2/v3 showcases in the top nav bar
- **Zero build step** — opens in any browser with no npm, no bundler, no server

## Installation

### Claude Code (Recommended)

**Step 1:** Add the marketplace

```bash
/plugin marketplace add codech-dev/codech-mockup-design
```

**Step 2:** Install the plugin

```bash
/plugin install codech-mockup-design@codech-mockup-design
```

### Manual Installation (Local)

Clone into your project's `.claude/skills/` directory:

```bash
cd your-project/.claude/skills/
git clone https://github.com/codech-dev/codech-mockup-design.git
```

Or install globally (available across all projects):

```bash
cd ~/.claude/skills/
git clone https://github.com/codech-dev/codech-mockup-design.git
```

### Updating

```bash
/plugin update codech-mockup-design
```

## Dependencies

### Required

- **`ui-ux-pro-max` skill** — Design intelligence engine. Provides color palettes, font pairings, UX patterns, and product-type recommendations.
- **Python 3** — Required by ui-ux-pro-max's search scripts.
- **Internet connection** — For Tailwind CDN and Google Fonts in the showcase HTML.
- **HF_TOKEN** *(optional, for Phase 3.6)* — Free Hugging Face API token for AI image generation. Get one at https://huggingface.co/settings/tokens
- **uv** *(optional, for Phase 3.6)* — Python package runner for the image generation script. Install via `pip install uv`.

### Target implementation stack

The design system documents target this stack by default (adapts to your project's actual stack):

| Tool | Role |
|---|---|
| **shadcn/ui** | Component library |
| **Framer Motion** | Animation library |
| **Tailwind CSS v4** | Styling system |
| **Lucide React** | Icon library |

## Plugin structure

```
codech-mockup-design/
├── .claude-plugin/
│   ├── marketplace.json
│   └── plugin.json
├── .claude/
│   └── skills/
│       └── codech-mockup-design/
│           ├── SKILL.md
│           └── references/
│               ├── showcase-template.md
│               ├── differentiation-axes.md
│               └── interactive-prototype-scaffold.md
├── scripts/
│   └── generate_mockup_images.py   # AI image generation script
├── CLAUDE.md
├── README.md
├── LICENSE
└── package.json
```

## Example output

The skill was developed while building two real-world projects:

**Atelier AI-driven Website Marketplace** — produced:
- **4 marketplace design directions** (dark editorial, warm light, glassmorphism, app layout) — each genuinely different in layout, typography, color, and motion
- **1 dashboard design** (8 screens: onboarding, home, site editor with AI chat, prompt templates, version history, settings, commerce, custom dev requests)
- **4 design system documents** with full token specifications
- **5 visual showcase HTML files** totaling ~8,000 lines of production-quality mockups

**Chezchoux Bakery & Patisserie** — produced:
- **1 landing page design** with warm artisan aesthetic — handcrafted cream/chocolate palette, serif display + humanist sans pairing, full hero, product highlights, testimonial carousel, and gallery sections
- **1 mobile phone frame mockup** (390px) showing the full page adapted to mobile layout with hamburger menu, single-column stacking, and touch-friendly tap targets
- **Fullscreen viewer** on both desktop and mobile mockups for real-size evaluation
- **Interactive testimonial carousel** with touch/swipe support, dot navigation, and auto-advance
- **Slide-in hamburger menu** with backdrop overlay and scroll lock
- **1 design system document** covering warm bakery color tokens, typography scale, motion system, and component patterns

## License

MIT

---

Built by [Codech](https://github.com/codech-dev) with Claude Code.
