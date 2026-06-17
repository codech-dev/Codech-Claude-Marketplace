# Fintech / payment-platform design standard

The visual language for crypto / digital-asset / payment / fintech marketing sites. Goal: look like a **regulated, institutional, trustworthy** platform — not a meme-coin, not a generic SaaS template, not "AI-generated." Grounded in the BNEVA build (which shipped and passed legal review).

This pairs with the compliance rules: **the design must show capability and process, never live prices or trading.** Trust is the aesthetic.

> The user dislikes "AI-generated" feel: no placeholder gradients, no emoji cards, no predictable layouts. Favour shadcn-style restraint (subtle borders, soft shadows, refined hover states, generous padding) + Framer-Motion-style entrance motion. See `[[user_design_pref]]`.

---

## 1. Design tokens (proven values — adapt the accent per brand)

Dual light/dark theme, **dark is the hero/default** for fintech (signals "tech, institutional, serious").

```css
:root {                         /* light */
  --bg:#fff; --bg-2:#f9f9f9;
  --surface:#f4f4f5; --surface-2:#ececed; --surface-3:#e4e4e6;
  --border:rgba(0,0,0,.08); --border-2:rgba(0,0,0,.13);
  --text:#0a0a0a; --text-2:#52525b; --text-3:#a1a1aa;
  --accent:#2255ca; --accent-2:#2961e8; --accent-deep:#172f6b;  /* institutional blue */
  --success:#059669; --warning:#d97706;
  --r:12px; --r-lg:20px; --r-xl:28px; --r-2xl:40px;             /* radius scale */
  --max:1100px; --nav-h:64px;
  --sh-md:0 4px 12px rgba(0,0,0,.07),0 1px 3px rgba(0,0,0,.04);
  --sh-xl:0 20px 60px rgba(0,0,0,.11),0 4px 16px rgba(0,0,0,.05);
}
.dark {                         /* dark */
  --bg:#090909; --bg-2:#0f0f0f;
  --surface:#141414; --surface-2:#1a1a1a; --surface-3:#222;
  --border:rgba(255,255,255,.08); --border-2:rgba(255,255,255,.13);
  --text:#f2f2f2; --text-2:#a0a0a0; --text-3:#606060;
  --accent:#2961e8; --accent-2:#4f86ff;
  --success:#34d399; --warning:#fbbf24;
  --sh-xl:0 20px 60px rgba(0,0,0,.6),0 4px 16px rgba(0,0,0,.05);
}
```

**Accent rule:** one institutional accent (deep blue is the safe default — reads "bank/trust"). Avoid neon green/purple gradients (reads "crypto-gambling"). Near-monochrome greys + a single confident accent. Success-green and warning-amber are *functional only* (status), never decorative.

## 2. Typography

- **One modern sans** (Inter via `next/font`, `display:swap`, CSS variable). Don't mix faces on fintech — restraint signals seriousness. (The "serif italic accent" trick from general design pref is for lifestyle/beauty brands, NOT fintech — skip it here.)
- **Display headings:** `font-weight:900; letter-spacing:-.04em; line-height:1.03;` fluid `clamp(36px,5.5vw,72px)`. Tight, heavy, confident.
- **Eyebrow / tag:** `12px; weight 700; letter-spacing:.10em; text-transform:uppercase; color:var(--accent);` — the small accent-coloured label above each section heading.
- **Body / lead:** `16–17px; line-height:1.7; color:var(--text-2); max-width:~520px` (never full-width paragraphs).
- **Numbers/monospace** only for IDs, masked account numbers, ticker chips — `font-variant-numeric:tabular-nums`.

## 3. Layout primitives

- **Container:** `.w { width:min(1100px, calc(100% - 48px)); margin:0 auto; }` — centred, generous gutters.
- **Section rhythm:** eyebrow tag → big heading → short lead → visual/grid. Consistent vertical padding between sections.
- **Hero:** centred headline (`max-width:780px`), short sub (`max-width:520px`), two CTAs (primary filled pill + ghost), then a **framed product panel** below (big radius `--r-2xl`, 1px border, layered shadow `0 40px 120px rgba(0,0,0,.6)`, subtle inset highlight).
- **Bento grid** for services: mix of `span-2` wide cards and single cards; each card = eyebrow + heading + short copy + a **mini visual mock**.
- **Pill buttons** (`border-radius:99px`), pill nav links, pill chips/tags throughout — the rounded-pill is a signature.

## 4. The signature move: "product mock" visuals (NOT screenshots, NOT stock images)

Every section gets a **small, built-from-divs-and-SVG mock** that illustrates the mechanism: a transfer receipt, a compliance scan card, a payment-rails table, a dotted world map with sanctions pins, a node/flow diagram. These read as "real product UI" and are the antidote to AI-generated feel.

**Compliance-critical:** these mocks must show **process and capability, never live prices or trading.** Patterns that work:
- **Process/flow card:** numbered steps (Request → Compliance review → Provider terms → Settlement approval) with icon + label + status chip per row. Reusable for many sections.
- **Receipt/transfer card:** From → arrow → To, with a row of green-check steps (KYC/KYB · Screened · Approved). Label it "Illustrative."
- **Status table:** rails/coverage/availability columns with neutral "Where available" chips — NOT "Settled/T+1".
- **Dotted world map** (SVG circles on a grid) with pulsing pins for sanctions lists (UN/EU/UK/OFAC) — strong "global compliance" signal.
- **Masked identifiers:** `AU•• •••• •••• ••••`, `0x3f2a...9d4b` — looks real, commits to nothing.

Depth recipe: a faded "behind" card (`opacity:.35–.5`, slight rotate/offset) + the main card (`--surface`, `border-2`, radius 16px, layered shadow) + a floating toast popping off a corner. This 3-layer stack is what makes mocks feel like polished product UI.

## 5. Motion (Framer-Motion feel, CSS-driven)

- **Reveal on scroll:** `.rv { opacity:0; transform:translateY(28px); transition:.7s cubic-bezier(.22,1,.36,1); } .rv.up { opacity:1; transform:none; }` — staggered via `d1/d2/d3` delay classes. IntersectionObserver adds `.up`.
- **Toast pop-in:** `cubic-bezier(.22,1,.36,1)` slide+fade with a small delay.
- **Status pulse:** expanding box-shadow ring on "live/active" dots (use sparingly — and NOT on unlaunched services).
- **Flow lines:** animated SVG `stroke-dashoffset` for data-moving-through-pipeline diagrams.
- **ALWAYS** `@media (prefers-reduced-motion:reduce) { .rv { opacity:1; transform:none; transition:none; } }` and disable keyframe anims. Non-negotiable.
- Hover: subtle `transform` + shadow lift on cards/buttons, `.15–.2s` — restrained, never bouncy.

## 6. Trust signals (the fintech-specific layer)

These are both design elements and compliance assets — design them in from the start:
- **Trust chips** under the hero: ACN/registration numbers, AUSTRAC/regulator IDs, "wholesale clients only" — small pill row.
- **Compliance section** with named controls (AML/CTF, sanctions screening, KYC/KYB, wallet risk).
- **Footer company-info block:** legal entity, registration numbers (correct register names), registered address, contact.
- **Disclaimers** styled as quiet `--text-3` fine print — present and readable, not hidden.

## 7. Anti-patterns (reject these)

- ❌ Neon gradients, glow-heavy "web3" aesthetic, animated coin 3D renders → reads scammy/unregulated.
- ❌ Live price tickers, trading charts, Buy/Sell — **compliance violation AND wrong signal.**
- ❌ Stock photos of people shaking hands / city skylines → generic, AI-feel.
- ❌ Emoji in cards, full-width body text, single default system font, predictable 3-equal-column feature row.
- ❌ Mixing languages where one is expected (keep English eyebrows as *accents* only if the brand body is another language).
- ❌ Claiming services are live (Active/Available) when they're not — see `banned-terms-checklist.md`.

## 8. Stack default

Next.js (static export for Cloudflare Pages) · `next/font` Inter · CSS variables for theming (`next-themes` for light/dark) · plain CSS or Tailwind+shadcn · IntersectionObserver for reveals · deploy via Git-connected Cloudflare Pages. Keep build output static (`output:'export'`).
