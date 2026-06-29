# Adapter: WordPress (coway-starter)

Maps the portable artifact onto the `coway-starter` pipeline: the `coway-base`
parent theme + a NEW per-site skin, provisioned and deployed with the starter's
own scripts. Consumes `artifact/` (see 04-conversion-contract.md).

## Scope note (read first)

`coway-starter` is a catalog-oriented WordPress system (WooCommerce in catalog
mode, a product grid, category/promo/legal pages, a contact section on every
page). It is the right target for **agent / catalog-style** sites that resemble
the starter's structure. For a brand whose site is NOT catalog-shaped, this
adapter is a poor fit; use the static adapter, or treat a generic WordPress
theme target as future work. Do not force a non-catalog design into the starter.

## Prerequisite

A local checkout of `coway-starter`. This adapter references it by path; it is
NOT bundled in the plugin. Ask the user for the path to their `coway-starter`
checkout (e.g. the Coway-new repo's `coway-starter/`). Read its `README.md`
sections "Create a new skin" and "Build a new agent site" before proceeding;
follow them exactly rather than reinventing.

## Convert: artifact -> a new skin

The brand (tokens + logo) is what changes per site, and in coway-starter the
skin carries the per-site look. So map the artifact into a NEW skin:

1. Copy an existing skin as the base: `cp -r skins/skin-layout-a skins/<new-skin>`
   and set `Theme Name` / `Text Domain` in its `style.css` (keep
   `Template: coway-base`).
2. **Tokens -> skin CSS.** Write `artifact/brand-tokens.md`'s `:root` block into
   the skin's `assets/css/skin.css` so the skin overrides base brand colors. The
   token names are fixed (see 01-palette-from-logo.md), so this maps directly.
3. **Prototype sections -> skin templates.** Port the approved structure from
   `artifact/prototype/` into only the skin templates whose layout differs
   (`front-page.php`, `single-product.php`, etc.). Leave everything else
   inheriting from base (components, catalog machinery, the shared
   product-detail partials). Do not duplicate base machinery into the skin.
4. **Restyle the shared product card, grid, and footer** in the skin (CSS-only
   override of the base classes), per the starter README's requirement; otherwise
   every site's card/grid/footer look identical, which undermines per-install
   isolation and per-agent branding.
5. **Assets -> theme.** Place `artifact/assets/` images into the theme
   `assets/img/` (or sideload into the WP media library), local only, no hotlinks.
6. **Content map -> page copy.** Lay `artifact/content-map.md` copy into the
   relevant templates / config.

## Per-site config + SEO

7. Create `sites/<domain>/site.config.json` (copy `sites/coway-new.com/...` as the
   template) and set `domain`, `ssh`, `wp_path`, `active_skin: <new-skin>`,
   `whatsapp_number`, `business_name`, `legal_name`, `registration_no`,
   `email_contact`, `lead_mailbox`, and the NAP address. Add
   `sites/<domain>/secrets.local` with `SMTP_PASS=<mailbox password>`.
8. **Unique SEO, NO prices.** Give the site UNIQUE titles + meta descriptions
   with a DISTINCT title suffix, via a reworded per-skin `inc/seo-offer.php` map
   (`home`, `pages`[slug], `products`[slug]). Preserve every fact (model codes,
   specs); just reword. **Never put prices in meta descriptions** - they go stale
   in cached snippets; the live price belongs in Product schema. (This matches the
   starter's per-skin SEO mechanism.)

## Deploy (GATE 2 first)

Do not provision or deploy until GATE 2 has passed (see 05-gates-and-qa.md):
confirm the domain, the host, and that the user wants to publish.

Reuse the starter's scripts - do not reinvent:

```
# full provision of a fresh site (base+skin, plugins, pages, catalog, SMTP, verifier)
.\scripts\provision-site.ps1 .\sites\<domain>\site.config.json

# or, to push just the skin to an existing site:
.\scripts\deploy.ps1 -Skin <new-skin> -Ssh <user@host> -WpPath <wp_path>
```

For hosts without SSH, use the starter README's no-SSH (Novamira MCP / FTP) path.

## Post-deploy

Run the post-deploy QA screenshots (1440 + 390) from 05-gates-and-qa.md and the
starter's catalog verifier, then report the live URL and remind the user to
hard-refresh.
