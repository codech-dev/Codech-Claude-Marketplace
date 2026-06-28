# Multilanguage (bilingual proposals)

How to make a single-file HTML proposal switch between two languages with a top-bar toggle, no page reload, and no build step. Worked example: the OTSO AI Hub proposal (English ⇄ 简体中文).

Bilingual delivery is a Codech differentiator — see the bilingual handling rules in `codech-project-superpower`. This doc is the proposal-side implementation of that.

---

## The pattern in one line

Every translatable string is wrapped in **two sibling spans** — `<span class="t-en">…</span><span class="t-zh">…</span>` — and CSS shows exactly one of them based on the `lang` attribute on `<html>`. A toggle button flips `<html lang>` and remembers the choice in `localStorage`.

This beats per-element `data-*` + JS text-replacement because it survives **rich inline HTML** — bold, links, nested accent spans, the cyan period — inside a translated block. Each language keeps its own real markup.

---

## §default Language default + scope decisions

Confirm two things with the client before building (they map to `AskUserQuestion` defaults):

1. **Default language + memory** — usually *"English first, remembers choice"*: the page loads in English with a toggle, and a returning visitor sees their last pick (localStorage).
2. **Translation scope** — usually *"proposal copy only"*: translate everything the seller writes (hero, modules, scope, timeline, governance, closing). **Leave in English regardless of language:**
   - **Product / interface / technology names** — Next.js, PostgreSQL, Claude, Auth.js, pgvector, BullMQ, `AIProvider`, `text-embedding-3-small`, etc.
   - **App-mockup screenshots and their in-UI labels** — they're authentic captures of the (English) product. Translating the chrome around a mockup while the mockup itself is English is the right, honest split.

   An unwrapped string (no `t-en`/`t-zh`) simply shows in **both** languages — which is exactly what you want for product names and technical tokens. Wrap only the prose.

---

## §fonts Fonts

Add a CJK family alongside the client's display font in the Google Fonts link (Simplified Chinese shown):

```html
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Noto+Sans+SC:wght@400;500;700;800&display=swap" rel="stylesheet" />
```

Use `Noto Sans SC` for Simplified Chinese, `Noto Sans TC` for Traditional, `Noto Sans` / `Noto Sans JP` / etc. as needed.

---

## §css CSS

Paste into the page's `<style>` block (swap `zh` / `Noto Sans SC` for your second language):

```css
/* i18n: dual-language spans toggled by <html lang> */
.t-zh { display: none; }
html[lang="zh"] .t-en { display: none; }
html[lang="zh"] .t-zh { display: inline; }
/* CJK font fallback wherever Chinese renders */
html[lang="zh"] body, html[lang="zh"] .t-zh { font-family: 'Manrope', 'Noto Sans SC', system-ui, sans-serif; }
.t-zh { font-family: 'Manrope', 'Noto Sans SC', system-ui, sans-serif; }

/* toggle button (re-tint to the client's tokens) */
.lang-toggle { display:inline-flex; align-items:center; gap:5px; padding:6px 11px; border-radius:9999px;
  background:#F0F4F8; border:1px solid rgba(11,31,53,0.08); font-size:11.5px; font-weight:700;
  color:#0B1F35; cursor:pointer; transition:all .2s cubic-bezier(0.32,0.72,0,1); }
.lang-toggle:hover { background:#fff; border-color:rgba(29,78,216,0.4); }
```

`.t-zh` defaults to `display:none`, so **English is the no-JS / first-paint default**.

---

## §flash Flash prevention (non-obvious, do not skip)

If you only flip `<html lang>` in the bottom `<script>`, a returning Chinese visitor sees a flash of English before the script runs. Prevent it by reading localStorage in a **tiny script in `<head>`, before the body paints**:

```html
<script>
  // Apply saved language before paint (avoids flash)
  try { var _l = localStorage.getItem('clientLang'); if (_l === 'zh' || _l === 'en') document.documentElement.lang = _l; } catch (e) {}
</script>
```

Use a project-specific localStorage key (e.g. `otsoLang`). Keep the `try/catch` — localStorage throws in some privacy modes.

---

## §toggle Toggle button (top bar)

Sits in the top utility/nav bar. The visible label shows the **other** language (what you'd switch *to*):

```html
<button type="button" onclick="setLang(document.documentElement.lang==='zh'?'en':'zh')" class="lang-toggle" aria-label="Switch language">
  <i class="ph ph-translate text-[13px] text-cyan-deep"></i>
  <span class="t-en">中文</span><span class="t-zh">EN</span>
</button>
```

---

## §setlang setLang() + persistence

Paste into the page's bottom `<script>` block:

```javascript
window.setLang = function (l) {
  document.documentElement.lang = l;
  try { localStorage.setItem('clientLang', l); } catch (e) {}
};
```

That's the whole runtime — CSS does the showing/hiding; JS only sets the attribute and remembers it.

---

## §authoring Authoring the spans

Wrap the **entire content** of an element (including nested markup) in the two spans:

```html
<!-- plain text -->
<h3><span class="t-en">Saved for later phases</span><span class="t-zh">留待后续阶段</span></h3>

<!-- rich inline markup is fine — each language keeps its own -->
<p>
  <span class="t-en">Behind <strong>AIProvider</strong>, so vendors are <em>swappable</em>.</span>
  <span class="t-zh">置于 <strong>AIProvider</strong> 之后，供应商可<em>随时替换</em>。</span>
</p>

<!-- product names stay English: wrap only the prose around them -->
<span><strong>SSO / SAML</strong> <span class="t-en">· future phase</span><span class="t-zh">· 后续阶段</span></span>
```

Tips:
- For a string that repeats in both desktop and mobile nav, use the editor's `replace_all`.
- Keep the cyan-period accent inside each language's span: `…技术栈<span class="text-cyan-deep">。</span>` (use the CJK full-stop `。` in Chinese).
- Sanity check before deploy: the count of `t-en` and `t-zh` occurrences should be roughly equal (the CSS rules add a few extra `t-zh` — that's expected).

---

## §verify Verify

Render both languages in a browser before deploying:

```javascript
// in devtools / Playwright
window.setLang('zh');  // whole page flips, CJK font renders, layout holds
window.setLang('en');
```

Spot-check the longest headings and the closing/contact card in the second language — CJK strings have different widths and can reflow tight pill rows.
