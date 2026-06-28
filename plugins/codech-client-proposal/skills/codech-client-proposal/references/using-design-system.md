# Using a Design System

How to apply a per-client `design-system.md` to the canonical proposal anatomy. The design system tells you the **what** (colours, fonts, radii, shadows). The proposal anatomy tells you **how** to arrange those into a proposal. This document is the bridge.

---

## §discovery Discovery flow

When you start a proposal, run this discovery loop:

1. **Look for `design-system.md`** in the project root (typical Codech convention) or in a `docs/` subfolder
2. **If found:** read it end-to-end; identify the colour family / typography / radii / shadows / voice
3. **If not found:** offer the user one of:
   - "Use Codech default (navy + cyan + Manrope, professional services tone) — works for any client"
   - "Spawn `/codech-mockup-design` to derive a system from the client's brand"
   - "Paste the client's brand specs and I'll capture them inline"

Don't proceed to build without a chosen design system. The proposal anatomy is template; the design system is what makes it look like the client's, not a stock template.

---

## §tailwind-config Tailwind config block

The proposal's `<head>` must include the design system's tokens as a Tailwind config block. Map every named colour, font, and special tracking value:

```html
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          // Brand family — primary
          'navy':       '#0B1F35',
          'navy-deep':  '#061525',
          'navy-soft':  '#15324F',
          'navy-wash':  '#F0F4F8',
          // Accent
          'cyan':       '#15B5C7',
          'cyan-soft':  '#2DC4D5',
          'cyan-deep':  '#0E9DAE',
          // Ink & text
          'ink':         '#0F172A',
          'ink-soft':    '#1E293B',
          'muted':       '#475569',
          'muted-light': '#64748B',
          // Rules
          'line':      '#E2E8F0',
          'line-soft': '#EDF1F5',
        },
        fontFamily: {
          sans: ['Manrope', 'system-ui', 'sans-serif'],
          mono: ['JetBrains Mono', 'monospace'],
        },
        letterSpacing: {
          eyebrow: '0.18em',
        },
        maxWidth: {
          container: '1280px',
        },
      },
    },
  };
</script>
```

**Per-client substitutions:**
- Swap the `navy*` and `cyan*` hex values for the client's brand family
- If client uses a different display font, swap `Manrope` (also update the Google Fonts link)
- Keep `letterSpacing.eyebrow: '0.18em'` — this is a Codech idiom, not a per-client value
- Keep `maxWidth.container: '1280px'` — Codech standard

---

## §token-mapping Token mapping rules

When applying the design system, follow these mappings:

| Design system role | Where it goes in the proposal |
|---|---|
| Primary brand (dark) | Hero text accents, featured dark cards, sticky nav active, eyebrow dot on light |
| Primary brand (washed) | `bg-navy-wash` section backgrounds (Tech Stack, Modular Pricing) |
| Accent (cyan/etc.) | Cyan period accents on display headlines, eyebrow text on dark, CTA backgrounds, link hovers |
| Accent deep | Link rest states, eyebrow text on light, hover states |
| Ink | Body text on light surfaces |
| Muted | Body paragraphs |
| Muted-light | Captions, eyebrow labels under stats, disclaimers |
| Line | Card borders, dividers |

**Example for a non-compliance client** (say, a fintech SaaS with brand colours emerald + violet):

```javascript
'brand':       '#10B981',   // was navy
'brand-deep':  '#047857',
'brand-soft':  '#065F46',
'brand-wash':  '#ECFDF5',
'accent':      '#8B5CF6',   // was cyan
'accent-deep': '#6D28D9',
'accent-soft': '#A78BFA',
```

You'd then find/replace `text-cyan-deep` → `text-accent-deep`, `bg-navy` → `bg-brand`, etc. across the proposal HTML. The structure stays identical.

---

## §locked-elements What stays Codech-themed

Regardless of client design system, these elements use Codech's brand:

1. **Closing section** — the "Prepared by Codech Solutions" card. Uses `bg-navy text-white` with cyan glow even if the client's accent isn't cyan. This is the seller's identity.
2. **Codech logo PNG** — always `assets/codech-logo.png`, white version on dark background
3. **WhatsApp CTA** — the green `#25D366` colour is locked to the WhatsApp brand
4. **Confidentiality pill** in utility bar — uses `text-cyan` accent on the shield icon (matches Codech accent default)
5. **"End of proposal" sign-off marker** — Codech idiom, not client-themed

If the client's accent is also a cyan-ish colour and your `text-cyan` lookup resolves to it, great. If the client uses violet, the closing section is the ONE place where the page intentionally pivots back to Codech's identity. This is fine — it's the brand stamp.

---

## §voice-pairing Voice tokens that follow the design system

Some voice/typographic decisions should match the design system's overall tone:

| Design system signals | Voice should be |
|---|---|
| Sharp serif headings, conservative palette | More formal, British spelling, no contractions |
| Geometric sans-serif, monochrome | Direct, short clauses, periods rather than commas |
| Playful colour, rounded radii | More casual permitted; still no marketing puffery |

Default to the **professional-services preset** (see `references/voice-and-copy.md`) for any first-time client. Only deviate when the design system clearly signals a different tone (e.g., client is a consumer brand, not regulated services).

---

## §checklist Pre-build checklist

Before generating the proposal HTML:

- [ ] Design system identified (existing file, fresh from codech-mockup-design, or Codech default)
- [ ] Tailwind config block prepared with client's tokens
- [ ] Google Fonts link prepared if non-Manrope display font
- [ ] Voice preset chosen (default: professional-services)
- [ ] Locked Codech elements (closing, logo, WhatsApp) noted as untouched

When all five are ✓, you're ready to start with `assets/proposal-skeleton.html`.
