# case.json reference

One file per project at `work/<slug>/case.json`. `examples/otso-ai-hub/case.json` is a complete, real example: copy it and rewrite. All copy fields are authored HTML (inline `<b>`, `<em>`, links allowed; a bare `&` is escaped for you). Optional sections can be omitted entirely and the page skips them.

## Top level
| field | notes |
|---|---|
| `slug` | folder name, lowercase-hyphen, e.g. `otso-ai-hub`. Also the scene namespace and CSS scope (`.ovp-<slug>`). |
| `site_url` | `https://codech-ai-landing.pages.dev` (used for the absolute OG image URL). Change when the production domain changes. |
| `product` | product name as shown ("OTSO AI Hub"). Film title splits it: first word plain, rest highlighted. |
| `industry` | short sector label for pills ("Financial services"). |
| `status` | `live` or `build` for the project overall (hero pill). |
| `year` | optional, footer year (default 2026). |

## client
`name`, `logo` (path relative to the case folder, e.g. `assets/acme-logo.png`), `descriptor` ("Online brokerage (FX/CFD) · Asia"), `hero_detail` ("130 staff on the hub"), `named_publicly` (bool), `anonymous_name` (used when not named), `consent_confirmed` (bool; false makes the build warn).

## theme
Dark-stage colours for the reel, decision band and film: `deep`, `mid`, `end`, `glow`, `soft` (light accent text on dark), `accent` (buttons/progress). Take them from the client's design tokens so the product feels like theirs; the page chrome stays Codech (cream, Manrope/Inter).

## seo
`title`, `description`, `og_title`, `og_description`.

## hero
`headline` (one sentence, ~10 words), `sub` (2–3 sentences: who it's for, what it does, what's next).

## stats
List of `[value, label]` or `[value, label, icon]`, 3–5 items. Exact numbers from the brief. Rendered as an impact bento: the **first** stat is the large dark lead tile, the rest are icon tiles (icons: see the problem section list; `users`, `globe`, `download`, `test` suit most). Numbers count up on reveal; keep the value's text final-form (`1,700+`, `+58%`, `37 days`).
- `stats_eyebrow`: small label on the lead tile (default "Delivery").
- `stats_timeline`: optional `[date, label]` ×2–4 milestones under the lead stat, e.g. `[["29 Jun","First commit"],["22 Jul","Staging live"],["5 Aug","Production live"]]`; dates must come from the brief/delivery log.

## problem (optional)
`h2`, `eyebrow` (default "The problem"), `items`: `{icon, title, body}` ×3. Icons: folder, search, chat, upload, doc, graph, spark, send, shield, lock, clock, users, chart, cart, calendar, mail, bolt, database, warn, check, arrow (add more in `build_case.py` ICONS).

## groups (required, 1–3)
One per product area; each becomes a page section, a reel tab group and a film chapter.
`id` (anchor), `name`, `status` (`live`/`build`), `mesh` (optional `gold`/`teal`/`violet`/`sky`; default sky, teal, violet, gold by group order: one colour per product area; the wide lead card shows it in full, the others only as a faint wash plus on hover), `h2`, `sub`, `note` (optional; shown under the cards, use it for In build context), `features`:

| feature field | notes |
|---|---|
| `scene` | scene name in scenes.js (`OV.define('<slug>', '<scene>', …)`) |
| `k` | small label above the title ("AI search") |
| `title`, `body` | card copy |
| `bullets` | optional, 2 ticks (best on the wide card) |
| `wide` | optional; default: first feature of each group is wide |
| `mesh` | optional `gold`/`teal`/`violet`/`sky`, overrides the group's mesh for this card |
| `aria` | describes what the animation shows (screen readers) |
| `reel` | `{tab, sub, cap, est}`: showreel tab label, tab subline, caption under the stage, estimated run ms (drives the tab progress bar). Omit to leave the feature out of the reel. |
| `film` | `{label, cap, sub}`: film progress label, big caption, sub caption. Omit to leave it out of the film. |

## decision (optional; strongly recommended when there is one)
The single design decision that shows judgement. `eyebrow`, `quote` (short, punchy), `paras` (2), `flow`: 3 steps `{icon, title, body}`; the last may have `results: [["yes","…"],["no","…"]]`.

## pipeline (optional)
`h2`, `sub`, `nodes`: `{icon, title, body, ai}` (4–6; `ai:true` renders dark), `notes`: `[heading, text]` ×2.

## delivery (optional)
`h2`, `sub`, `foot`, `steps`: `[title, text]` ×3, `tabs`: `{title, sub, src, label, hint, minw}`.
`src`: `proposal/` or `prototype/` (hosted copies, preferred) or an absolute URL. `label` is what the fake address bar shows; never the real client-facing URL. `minw`: force a desktop-width render on phones (only for embeds with no phone layout).

## engineering (optional)
`h2`, `cards`: `[title, text]` or `[title, text, icon]` ×3 (dark spotlight cards; default icons shield/bolt/database), `stack`: list of tech names.

## cta
`h2`, `body`. Buttons are fixed: "Book a free AI audit" (opens the landing form via `#audit`) and "More results".

## footer_note
Demo-data and In build disclaimers.

## film
`tagline`, `duration_label` ("70-second product tour"; update after recording), `social_scenes` (2–3 scene names for the portrait cut), `outro_stats` (`[value,label]` ×3), `outro_line`, `outro_cta`.

## card (landing Results carousel)
`headline`, `kpis` (`[value,label]` ×3, short values), `demos` (exactly 2 scene names; ideally one per product area so the card shows the whole product; labels and Live/In build come from their groups).
