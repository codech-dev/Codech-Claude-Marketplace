# Phase 1: palette from logo (vision)

Read the brand logo directly and derive a complete token system. This is done by
visual judgment, not a color-extraction script. Output `artifact/brand-tokens.md`
(see 04-conversion-contract.md).

## Before you start

- You need the logo as an image file (SVG/PNG/JPG). Look at it.
- If the logo is missing, or too low-res / too small to read colors confidently,
  STOP and ask the user for a better asset. Do NOT guess brand colors.

## How to read the logo

1. Identify the dominant brand color (the mark / wordmark color) -> `--primary`.
2. Identify any secondary or accent color -> `--accent`. If the logo is
   monochrome, derive a single tasteful accent from the primary's hue.
3. Decide whether the brand reads light or dark. Default to a light theme unless
   the brand is explicitly dark; product/marketing sites usually want light.
4. Build a neutral family (background, surface, ink) that is hue-aligned to the
   primary (a faint tint of the primary hue in the neutrals reads as "designed",
   not flat gray).

## Token schema (names are FIXED so adapters can map mechanically)

Write `brand-tokens.md` with a `:root` block using exactly these names:

```css
:root {
  /* surfaces + ink */
  --bg: #;            /* page background */
  --surface: #;       /* cards, navbar, footer */
  --surface-2: #;     /* hover fills */
  --ink: #;           /* headings, primary text */
  --ink-2: #;         /* secondary text */
  --line: #;          /* borders, dividers */

  /* brand */
  --primary: #;       /* dominant brand color */
  --primary-ink: #;   /* text/icon color that sits ON --primary */
  --accent: #;        /* secondary/accent */

  /* primary ramp */
  --primary-50: #;  --primary-100: #; --primary-200: #; --primary-300: #;
  --primary-400: #; --primary-500: #; --primary-600: #; --primary-700: #;
  --primary-800: #; --primary-900: #;

  /* type scale (rem; include px in a comment) */
  --step--1: ; --step-0: ; --step-1: ; --step-2: ;
  --step-3: ;  --step-4: ; --step-5: ;

  /* spacing, radius, shadow */
  --space-1: ; --space-2: ; --space-3: ; --space-4: ; --space-6: ; --space-8: ;
  --radius: ; --radius-lg: ;
  --shadow: ; --shadow-lg: ;
}
```

Below the `:root` block, also record the **motion dials** (0-10), which the
design phase consumes:

```
DESIGN_VARIANCE: <0-10>
MOTION_INTENSITY: <0-10>
VISUAL_DENSITY: <0-10>
```

## Accessibility (required)

For every text-on-background pair you intend to use, state the contrast ratio and
whether it passes WCAG AA (4.5:1 body, 3:1 large text). At minimum check:

- `--ink` on `--bg`
- `--ink-2` on `--bg`
- `--ink` on `--surface`
- `--primary-ink` on `--primary`

If a pair fails AA, darken or lighten the ink token (or the surface) until it
passes BEFORE writing the file. Record the final ratios in `brand-tokens.md`:

```
Contrast check:
  --ink on --bg:           7.8:1  AA pass
  --primary-ink on --primary: 5.1:1  AA pass
  ...
```

## Output

Write the completed `:root` block + dials + contrast check to
`artifact/brand-tokens.md`. This file is the brand constraint for phase 3: the
taste skill styles WITHIN these tokens, it does not re-pick colors.
