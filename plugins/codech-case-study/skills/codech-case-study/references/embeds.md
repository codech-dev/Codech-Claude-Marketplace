# Embedding the proposal and prototype

The "How we delivered" section shows the real artefacts: the proposal we pitched with, and the clickable prototype the client approved. Visitors scroll and click inside a browser-style frame; "Full screen" expands the same frame into an overlay.

## Host our own copies
```
python scripts/host_embed.py <site> <slug> proposal  <file-or-URL> [--replace old=new] [--drop-banner "Confidential"]
python scripts/host_embed.py <site> <slug> prototype <path/to/prototype.html> --replace "portal.client.com=hub.client.com"
```
Why copies, not the live proposal URL: the URL stays out of our page source (the user asked to hide it), we can strip a "Confidential" banner, and we control the phone layout. Trade-off: later edits to the original don't flow through; re-run the script to refresh. The user may choose to keep embedding the live URL for a while (OTSO did, until after production launch); then set `src` to the URL and keep `label` neutral ("Proposal · OTSO AI Hub"), never the real address.

The script adds `noindex`, copies referenced local assets, applies replacements, and prints a REVIEW list (confidential labels, prices, emails, phones, public IPs, hostnames, missing phone layout). Take each item to the user; see intake-and-accuracy.md.

## Phone layout
On phones the viewer renders embeds at native width, so each embed must have its own phone layout:
- Proposals built with `codech-client-proposal` are responsive already (they show a "best on desktop" tip).
- Prototypes are often desktop-only (fixed sidebar). Give our hosted copy a phone shell that mirrors the real app's mobile behaviour: sidebar becomes an off-canvas drawer opened from a menu button; top-bar search and assistant shrink to icons; screen padding tightens; a hidden right-hand panel must not cast a visible shadow.

OTSO shell (adapt selectors: add ids to the sidebar `<aside>`, the top `<header>` and its buttons):
```html
<style id="codech-mobile-shell">
.mnav,#navShade{display:none}
@media (max-width:767px){
  #navSide{position:fixed;top:0;bottom:0;left:0;z-index:60;width:272px;transform:translateX(-100%);transition:transform .35s cubic-bezier(.32,.72,0,1);overflow-y:auto}
  body.nav-open #navSide{transform:none;box-shadow:20px 0 60px -10px rgba(6,21,37,.5)}
  #navShade{display:block;position:fixed;inset:0;z-index:55;background:rgba(6,21,37,.45);opacity:0;pointer-events:none;transition:opacity .3s}
  body.nav-open #navShade{opacity:1;pointer-events:auto}
  .mnav{display:grid;place-items:center;width:40px;height:40px;border-radius:8px;flex:none;font-size:22px}
  #topBar{padding:0 10px;gap:4px}
  #crumb{min-width:0;flex:1;overflow:hidden;white-space:nowrap}
  #cmdBtn{width:40px!important;padding:0!important;justify-content:center;margin-left:0!important;background:transparent!important;border-color:transparent!important}
  #cmdBtn span,#cmdBtn kbd{display:none}
  #askBtn{font-size:0;padding:4px!important;gap:0}
  #main > .view.px-8{padding-left:16px;padding-right:16px;padding-top:20px}
  #assistant{width:100%!important}
  #assistant:not(.open){box-shadow:none}
}
</style>
<!-- in the header, first child: -->
<button class="mnav" type="button" onclick="toggleNav()" aria-label="Open menu"><i class="ph ph-list"></i></button>
<!-- before the sidebar: --> <div id="navShade" onclick="toggleNav(false)"></div>
<script>
function toggleNav(on){ document.body.classList.toggle('nav-open', on === undefined ? !document.body.classList.contains('nav-open') : on); }
document.getElementById('navSide').addEventListener('click', e => { if (e.target.closest('button,a') && matchMedia('(max-width:767px)').matches) toggleNav(false); });
</script>
```
Test at 360px wide: open the menu, pick a page (the drawer must close), check Home and one detail screen, and confirm no horizontal scroll. Desktop must look exactly as before. Edit only our hosted copy, never the pack's original.

## Viewer behaviour (built into case.js; know it when debugging)
- Frames load only when the section nears the viewport. Desktop renders at 1440px and scales to fit; phones use native width unless the tab sets `minw`.
- The "Loading…" placeholder sits *behind* the frame (`pointer-events:none`); on top, it swallowed scrolling until the proposal fired `load`.
- Full screen pins the same `.deck-win` with `position:fixed`. Never move the iframe in the DOM: that reloads it and loses the visitor's place.
- Headless tests of wheel-scrolling cross-origin frames can mislead; verify with the same-origin copy, or by checking the frame's `scrollY`.
