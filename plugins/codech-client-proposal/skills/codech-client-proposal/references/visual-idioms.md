# Visual Idioms

The locked, reusable mini-patterns that make a Codech proposal recognisable. These apply across all client design systems — only the token values (colour, font) change. Copy-paste markup throughout.

---

## §eyebrow Eyebrow pill

The label motif above every section heading. Three variants depending on background:

**On light surface (default):**
```html
<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-wash
            text-[11px] uppercase tracking-eyebrow font-semibold text-navy mb-6">
  <span class="w-1.5 h-1.5 rounded-full bg-cyan-deep"></span>
  Section label
</div>
```

**On dark navy surface:**
```html
<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/8
            border border-white/15 text-[11px] uppercase tracking-eyebrow font-semibold
            text-cyan mb-6">
  <span class="w-1.5 h-1.5 rounded-full bg-cyan"></span>
  Section label
</div>
```

**As a sub-label inside a featured card (no margin):**
```html
<div class="text-[10px] uppercase tracking-eyebrow font-bold text-cyan-deep mb-1">
  Tier 01
</div>
```

Token: `letter-spacing: 0.18em` (set as `tracking-eyebrow` in the Tailwind config).

---

## §display-heading Display headline with cyan period accent

The signature typographic rhythm. Every section H2 gets a cyan period at end-of-clause:

```html
<h2 class="font-extrabold text-[36px] lg:text-[52px] leading-[1.05]
           tracking-[-0.025em] text-ink text-balance">
  Pick your modules<span class="text-cyan-deep">.</span> Pay only for what you ship<span class="text-cyan-deep">.</span>
</h2>
```

Rules:
- Always `font-extrabold` (800 weight) — never 500/600
- Tight tracking: `-0.025em` for sections, `-0.028em` for the hero
- Always `text-balance` (Tailwind utility)
- The cyan period is `<span class="text-cyan-deep">.</span>` exactly (or `text-cyan` on dark)
- Use it sparingly — 1–2 periods per heading, never on every word

---

## §featured-card Featured dark card

The "this is the headline of this group" treatment. Used for: hero's primary module, mandatory Foundation in module pricing, featured AI Models in tech stack, featured Three-Tier Memory in scope.

```html
<div class="bg-navy text-white rounded-2xl p-7 relative overflow-hidden">
  <div class="absolute -top-16 -right-16 w-[300px] h-[300px] rounded-full pointer-events-none"
       style="background: radial-gradient(circle, rgba(21,181,199,0.25) 0%, transparent 70%);">
  </div>
  <div class="relative">
    <!-- content goes here, inside the relative wrapper so it sits above the glow -->
  </div>
</div>
```

The cyan radial glow in the top-right is the key visual — it's how "featured" is signalled without using a stamp/badge. The `-top-16 -right-16` positioning lets the glow bleed off the corner.

For bigger featured panels (like the closing card), scale up: `w-[500px] h-[500px]` glow.

---

## §browser-chrome Browser-chrome mockup wrapper

Every prototype mockup is presented inside a "browser window" frame so the reader knows it's an interface preview, not a finished product:

```html
<div class="bg-white rounded-2xl card-shadow-lg overflow-hidden ring-1 ring-navy/8 anim-up
            prototype-mockup">
  <div class="browser-chrome flex items-center gap-2 px-4 py-3">
    <div class="flex gap-1.5">
      <div class="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
      <div class="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
      <div class="w-3 h-3 rounded-full bg-[#28C840]"></div>
    </div>
    <div class="flex-1 mx-4 px-3 py-1.5 rounded-md bg-white border border-line
                text-[12px] text-muted-light flex items-center gap-2">
      <i class="ph ph-lock-key text-[11px]"></i>
      <span class="font-mono">portal.[client-domain].com / [section]</span>
    </div>
  </div>
  <!-- ... mockup interior ... -->
</div>
```

CSS for `.browser-chrome`:
```css
.browser-chrome { background: #F0F4F8; border-bottom: 1px solid #E2E8F0; }
```

**Critical:** the `prototype-mockup` class on the outer div is what triggers the mobile image-swap logic. Don't omit it.

Below each mockup add the illustrative-prototype disclaimer:
```html
<p class="mt-4 text-[11px] italic text-muted-light text-center">
  <i class="ph ph-info text-cyan-deep text-[11px] mr-1 align-text-bottom"></i>
  Illustrative prototype — shown for reference only. Final UI will be confirmed during Phase 02.
</p>
```

On dark sections use `text-white/50` + `text-cyan` for the icon instead.

---

## §lightbox Mobile prototype lightbox

On mobile (`max-width: 768px`), live HTML mockups are replaced with PNG screenshots; tapping the image opens a fullscreen lightbox with fit-to-screen default and tap-to-toggle native size.

**CSS** (paste into the page's `<style>` block):

```css
.prototype-mockup-image { display: none; }

@media (max-width: 768px) {
  .prototype-mockup { display: none; }
  .prototype-mockup-image {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 16px;
    box-shadow: 0 12px 32px rgba(11,31,53,0.12);
    cursor: zoom-in;
    -webkit-tap-highlight-color: rgba(21,181,199,0.18);
  }
}

#image-lightbox {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(6,21,37,0.94);
  z-index: 1000;
  overflow: auto;
  padding: 60px 12px 24px;
  cursor: zoom-out;
}
#image-lightbox.active {
  display: flex;
  align-items: center;
  justify-content: center;
}
#image-lightbox.zoomed { align-items: flex-start; }
#image-lightbox img {
  width: 100%;
  max-width: 1100px;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.4);
  cursor: zoom-in;
  transition: width 0.2s ease, max-width 0.2s ease;
}
#image-lightbox.zoomed img {
  width: auto;
  max-width: none;
  cursor: zoom-out;
  margin: 0 auto;
}
#image-lightbox-close {
  position: fixed; top: 14px; right: 14px; z-index: 1001;
  background: #FFFFFF; border: 0;
  width: 42px; height: 42px; border-radius: 999px;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(0,0,0,0.3);
  display: flex; align-items: center; justify-content: center;
  color: #0B1F35;
}
#image-lightbox-hint {
  position: fixed; top: 22px; left: 50%; transform: translateX(-50%);
  z-index: 1001;
  color: rgba(255,255,255,0.7);
  font-size: 11.5px; font-weight: 600;
  letter-spacing: 0.05em; text-transform: uppercase;
}
```

**JS** (paste at the end of the page's bottom `<script>` block):

```javascript
(function() {
  const mockupImages = [
    { src: 'screenshots/module-01-workspace.png', alt: 'Module 01 prototype' },
    // ... one entry per .prototype-mockup, in DOM order
  ];

  document.querySelectorAll('.prototype-mockup').forEach((mockup, i) => {
    if (!mockupImages[i]) return;
    const img = document.createElement('img');
    img.src = mockupImages[i].src;
    img.alt = mockupImages[i].alt;
    img.className = 'prototype-mockup-image';
    img.loading = 'lazy';
    mockup.parentNode.insertBefore(img, mockup.nextSibling);
    img.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(img.src, img.alt);
    });
  });

  function openLightbox(src, alt) {
    let lb = document.getElementById('image-lightbox');
    if (!lb) {
      lb = document.createElement('div');
      lb.id = 'image-lightbox';
      lb.innerHTML = '<div id="image-lightbox-hint">Tap image to zoom · Tap outside to close</div>'
        + '<button id="image-lightbox-close" aria-label="Close"><i class="ph-bold ph-x" style="font-size:18px;"></i></button>'
        + '<img alt="">';
      document.body.appendChild(lb);
      const lbImgEl = lb.querySelector('img');
      const lbHint = lb.querySelector('#image-lightbox-hint');
      lbImgEl.addEventListener('click', (e) => {
        e.stopPropagation();
        lb.classList.toggle('zoomed');
        lbHint.textContent = lb.classList.contains('zoomed')
          ? 'Tap image to fit · Tap outside to close'
          : 'Tap image to zoom · Tap outside to close';
        lb.scrollTop = 0; lb.scrollLeft = 0;
      });
      lb.addEventListener('click', (e) => {
        if (e.target === lb || e.target.closest('#image-lightbox-close')) closeLightbox();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
      });
    }
    const lbImg = lb.querySelector('img');
    lbImg.src = src; lbImg.alt = alt;
    lb.classList.remove('zoomed');
    lb.querySelector('#image-lightbox-hint').textContent = 'Tap image to zoom · Tap outside to close';
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
    lb.scrollTop = 0;
  }

  function closeLightbox() {
    const lb = document.getElementById('image-lightbox');
    if (lb) { lb.classList.remove('active'); lb.classList.remove('zoomed'); }
    document.body.style.overflow = '';
  }
})();
```

**Don't** try to render the HTML mockup at scale on mobile — it always squishes. The image swap is the proven pattern.

---

## §anim-up Anim-up reveal with default-visible fallback

Sections reveal on scroll, but **must be visible by default** so non-JS / slow JS / Playwright fullPage screenshots show content:

**CSS:**
```css
/* Default: visible */
/* Only invisible when html.anim-on is set */
html.anim-on .anim-up {
  opacity: 0;
  transform: translateY(28px);
  transition: 800ms cubic-bezier(0.16, 1, 0.3, 1);
}
html.anim-on .anim-up.is-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  html.anim-on .anim-up {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
```

**JS** (at the start of the page's `<script>` block):
```javascript
document.documentElement.classList.add('anim-on');

const targets = document.querySelectorAll('.anim-up');
targets.forEach((el) => {
  const r = el.getBoundingClientRect();
  if (r.top < window.innerHeight * 0.85) el.classList.add('is-visible');
});
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
);
targets.forEach((el) => { if (!el.classList.contains('is-visible')) observer.observe(el); });

// 3-second safety net: force visibility on everything
setTimeout(() => targets.forEach((el) => el.classList.add('is-visible')), 3000);
```

**The 3-second safety net is non-negotiable.** Without it, Playwright fullPage screenshots can capture invisible-state sections.

---

## §scroll-active Sticky nav active state on scroll

```javascript
const sections = ['hero', 'workspace', 'assistant', 'minutes', 'knowledge',
                  'architecture', 'stack', 'scope', 'timeline'];
const links = document.querySelectorAll('.section-nav-link');
const setActive = () => {
  const scrollY = window.scrollY + 200;
  let active = sections[0];
  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollY) active = id;
  });
  links.forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + active);
  });
};
window.addEventListener('scroll', setActive, { passive: true });
setActive();
```

The `sections` array must list every section id in DOM order. Update it when adding/removing sections.

---

## §stat-banner Stat banner (dark, 4-up)

Used at the top of pricing, scope, and tech stack sections to summarise the key numbers:

```html
<div class="bg-navy text-white rounded-2xl p-8 mb-6 relative overflow-hidden">
  <div class="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full pointer-events-none"
       style="background: radial-gradient(circle, rgba(21,181,199,0.25) 0%, transparent 70%);">
  </div>
  <div class="relative grid grid-cols-2 lg:grid-cols-4 gap-6">
    <div>
      <div class="text-[10px] uppercase tracking-eyebrow font-bold text-cyan mb-2">Total fixed fee</div>
      <div class="font-extrabold text-[40px] lg:text-[44px] tracking-tight leading-none">RM 26,000</div>
      <div class="text-[12px] text-white/65 mt-1">Foundation + all 4 modules</div>
    </div>
    <!-- 3 more cells -->
  </div>
</div>
```

Always 2-up on mobile, 4-up on desktop. The cyan label + extrabold figure + muted caption pattern is the locked structure.

---

## §responsive-grid Responsive grid rule

**Mobile-critical:** No bare `grid grid-cols-N` for N ≥ 3. Always start with `grid grid-cols-1` (or 2 for very simple items) and step up at `sm:` or `lg:`:

| Cols on desktop | Mobile pattern |
|---|---|
| 2 | `grid grid-cols-1 sm:grid-cols-2` |
| 3 | `grid grid-cols-1 sm:grid-cols-3` |
| 4 | `grid grid-cols-2 sm:grid-cols-4` |

The JY Global architecture diagram had to be retrofitted because of bare `grid-cols-4` and `grid-cols-3`. Make this a habit from the start.

---

## §banned Banned patterns

- **No new colour tints.** Use only the design system's defined alpha values (`bg-white/8`, `bg-navy/12`, etc.). Never invent `bg-white/7` or `bg-cyan/30`.
- **No new radius scale.** Stick to `rounded-md` (6) / `rounded-lg` (8) / `rounded-xl` (12) / `rounded-2xl` (16) / `rounded-full`.
- **No drop-shadow variations.** Use the design system's `card-shadow` / `card-shadow-lg` / `nav-shadow`.
- **No font weights between 400 and 800 on display copy.** Display = 800. Body = 400. Eyebrow = 700–800. Don't reach for 500/600 to "soften" a heading.
- **No icon library mixing.** Phosphor only. Don't add Heroicons or Lucide.
