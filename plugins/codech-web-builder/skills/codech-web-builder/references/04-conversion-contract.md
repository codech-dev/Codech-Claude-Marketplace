# Conversion contract (the portable artifact)

This is the seam between the stack-neutral core and the stack-aware adapters.
The design phases produce one `artifact/` directory; every adapter consumes it
**read-only** and maps it into a target stack. Keep this contract exact: it is
the only thing both sides agree on.

`contractVersion: 1`

## The artifact

```
artifact/
  brand-tokens.md      Color tokens + ramps + WCAG pairs, type scale, spacing,
                       radii, shadow, motion dials. Produced by phase 1
                       (see 01-palette-from-logo.md for the exact token schema).
  DESIGN-SYSTEM.md     Full design system. Produced by the taste skill in
                       phase 3 (see 03-design-handoff.md).
  prototype/           Section-structured HTML/CSS/JS prototype. The VISUAL
                       SOURCE OF TRUTH. index.html plus assets it references.
  assets/              Logo + local images used by the prototype.
  assets/manifest.json Array describing every asset, e.g.
                       [{ "file": "logo.svg", "role": "logo", "alt": "Brand" }]
  content-map.md       Per-section copy and structure derived from the
                       reference analysis (see 02-capture-references.md).
```

## Rules

1. **Versioned, never forked.** When an adapter needs data it cannot find in the
   artifact, add a new field to THIS contract (bump `contractVersion`) so every
   adapter sees the same shape. Never invent per-adapter side files.
2. **Stack-neutral.** Nothing in the artifact names a hosting target, CMS, or
   framework. Stack specifics live only in the adapter docs.
3. **Prototype is the source of truth.** `prototype/` is the approved visual
   reference. Adapters preserve it byte-for-byte wherever the target stack
   allows; where the stack must template parts (dynamic grids, CMS-driven copy),
   the adapter documents exactly which sections diverge and why.
4. **Fixed token names.** Token names in `brand-tokens.md` are fixed (see
   `01-palette-from-logo.md`) so an adapter can map them mechanically into the
   stack's theme variables.
5. **Assets are local.** Every image referenced by the prototype exists under
   `assets/` and is listed in `assets/manifest.json`. No hotlinks.

## Adapter responsibilities (summary)

An adapter takes `artifact/` and:
- maps tokens -> the stack's theme variables,
- maps `prototype/` sections -> the stack's templates (preserving markup where
  possible),
- maps `content-map.md` -> the stack's editable copy,
- maps `assets/` -> the stack's asset location,
- then runs its own deploy recipe (gated by GATE 2; see 05-gates-and-qa.md).

An adapter MUST NOT require a change to the core (`SKILL.md` or any `references/`
file other than this contract).
