# Phase 2b: source imagery (real images, local)

A landing page is a visual product. Empty gray placeholder boxes are not done
work. Before the design phase builds the prototype, source REAL, topically
relevant images and download them locally (the artifact rule is: all images
local, no hotlinking).

## Priority order for visual assets

1. **Image-generation tool first.** If any image-gen tool is available in the
   environment (a `generate_image` tool, an MCP image tool, etc.), use it to
   create section-specific assets at the right aspect ratio. This gives the most
   brand-coherent result.
2. **Real stock images second** (the common case). Use the bundled script
   `scripts/fetch-images.mjs`, which downloads topical photos locally:
   - With a `PEXELS_API_KEY` or `UNSPLASH_ACCESS_KEY` in the environment it uses
     that provider (higher quality). Prefer this for client work.
   - With no key it falls back to **Openverse** (CC-licensed, no key). Openverse
     is reliably topical but often amateur quality; tell the user that a Pexels
     or Unsplash key will materially improve imagery.
3. **Last resort:** if no tool and no network, leave clearly-labeled placeholder
   slots and tell the user exactly which images are needed and at what sizes. Do
   NOT ship gray boxes silently and do NOT hand-roll fake photos out of divs.

## How to run the script

Build a queries file from the content map (one entry per image slot: hero,
each product, each category tile, any lifestyle shot), then run:

```
node scripts/fetch-images.mjs queries.json artifact/assets/img
```

`queries.json` shape:

```json
[
  { "slug": "hero",     "query": "indoor plants living room interior", "orientation": "landscape" },
  { "slug": "monstera", "query": "monstera deliciosa plant",           "orientation": "portrait"  }
]
```

The script writes `artifact/assets/img/<slug>.<ext>` plus
`artifact/assets/img/credits.json` (file, source, license, attribution,
sourceUrl). Merge those entries into `artifact/assets/manifest.json` (see
04-conversion-contract.md) so attribution travels with the artifact.

## Quality + licensing checks (required)

- **Verify relevance.** Open each downloaded image and confirm it actually
  matches the slot (Openverse search can return off-topic or low-quality hits).
  Re-query with a tighter term, or swap the image, before building the prototype.
- **Respect the license.** Keep `credits.json`. For CC `by` / `by-sa` images,
  surface attribution (a credits line in the footer or a CREDITS file). CC0 and
  Pexels/Unsplash need no visible credit but keep the record anyway.
- **No hotlinking.** Every image used by the prototype must exist under
  `artifact/assets/` locally. Never reference a remote image URL in the markup.
