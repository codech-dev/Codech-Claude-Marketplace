---
name: codech-mockup-design
description: |
  Codech Mockup Design Skill — structured design ideation and visual prototyping workflow. Creates design system documents (tokens, principles, accessibility rules) and self-contained HTML showcases that render live in any browser — no build step needed. Use this skill PROACTIVELY when the user asks to design UI, create a design system, prototype screens, explore visual directions, build a landing page mockup, design a dashboard, or compare design alternatives. Also trigger when the user says things like "show me what it would look like", "design the UI", "create a mockup", "explore different styles", "what should the homepage look like", or "build a visual prototype". Works for any project: landing pages, dashboards, mobile apps, SaaS products, marketplaces, portfolios.
---

# Codech Mockup Design Skill

A structured workflow for design ideation that produces two artifacts per design direction:
1. **Design system document** (`design-system.md`) — tokens, principles, component patterns, accessibility rules
2. **Visual showcase** (`design-showcase.html`) — self-contained HTML that renders every token, screen, and component live in any browser

The showcase is the primary deliverable — it's what the user judges the design against. The markdown document supports it with rationale and implementation guidance.

## Prerequisites (required)

Before using this skill, ensure the following are installed and available:

1. **`ui-ux-pro-max` skill** — REQUIRED for design intelligence queries. The skill will NOT proceed to Phase 2 (design system creation) without first running ui-ux-pro-max queries in Phase 1. If the skill is not available, stop and tell the user:
   > "The `ui-ux-pro-max` skill is required for design intelligence. Please install it first, then re-run this skill."

2. **Python 3** — Required by ui-ux-pro-max's search.py script. Verify with `python3 --version` or `python --version`.

3. **Internet connection** — Required at showcase render time for Tailwind CDN and Google Fonts. The showcase HTML files will not render correctly offline.

**Implementation stack (for the actual project, not the showcase):**
- **shadcn/ui** — the component library all designs target. The design system document must reference specific shadcn components for each UI pattern.
- **Framer Motion** — the animation library all motion patterns target. The design system document must include Framer Motion code examples for each animation.
- **Tailwind CSS v4** — the styling system. All design tokens map to Tailwind's theme.extend.
- **Lucide React** — the icon library. All icons in the showcase use inline SVGs matching Lucide's style.

If the project doesn't use shadcn/ui, Framer Motion, or Tailwind, adapt the component patterns and animation examples to the project's actual stack — but default to these unless told otherwise.

## Recommended tech stack

The skill is designed around a modern frontend stack. Use these tools by default unless the user specifies otherwise:

- **UI/UX Intelligence:** `ui-ux-pro-max` skill — run design system queries (`--design-system`, `--domain color`, `--domain ux`, `--domain landing`) before making design decisions. Provides color palettes, font pairings, UX patterns, and product-type recommendations.
- **Component Library:** **shadcn/ui** — use shadcn components (Button, Card, Badge, Separator, Input, Tabs, Sheet, Dialog, Command, ScrollArea, Avatar, Tooltip, Accordion) as the building blocks for all UI. Reference shadcn component patterns in the design system document so the implementation team knows exactly which primitives to use.
- **Animation:** **Framer Motion** — all entrance animations, hover states, page transitions, and scroll-triggered reveals should be designed with Framer Motion patterns in mind. Specify easing curves as `cubic-bezier()` values, durations in ms, and stagger delays. The showcase HTML simulates these with CSS transitions (since Framer Motion requires React), but the design system doc should note the Framer Motion equivalent for each animation.
- **Styling:** **Tailwind CSS** — all designs use Tailwind utility classes. The showcase HTML loads Tailwind via CDN. The design system document defines all tokens as CSS custom properties that map to Tailwind's `theme.extend`.
- **Icons:** **Lucide React** — use Lucide icons (consistent stroke width, tree-shakeable). Never use emojis as structural UI icons. In showcase HTML, use inline SVGs matching Lucide's style (1.5–2px stroke width, round line caps).

When writing the design system document, include a "Implementation notes" section that specifies:
```
### Implementation notes
- Component library: shadcn/ui (install via `pnpm dlx shadcn@latest add <component>`)
- Animation: Framer Motion (`initial`, `animate`, `whileInView`, `variants` patterns)
- Icons: Lucide React (`lucide-react` package)
- Fonts: Load via `next/font/google` for automatic optimization
```

## When to use this skill

- User asks to design or prototype any UI (landing page, dashboard, app screen, component library)
- User wants to explore visual directions before building
- User asks "what should this look like?" or "show me a mockup"
- User wants to compare multiple design alternatives
- User needs a design system established before implementation
- User says "create a design" or "design the interface" or "prototype the screens"

## The workflow

### Phase 1 — Gather intelligence (before designing)

Run the `ui-ux-pro-max` skill to get informed design recommendations BEFORE making any visual decisions. This is mandatory — do not skip to Phase 2 without running at least the `--design-system` query.

```bash
# REQUIRED: Get overall design system recommendation
python3 <ui-ux-pro-max-path>/scripts/search.py "<product_type> <industry> <keywords>" --design-system -p "<Project>"

# REQUIRED: Get color palette options for the product type
python3 <ui-ux-pro-max-path>/scripts/search.py "<industry> <mood>" --domain color -n 3

# RECOMMENDED: Get UX patterns for key interactions
python3 <ui-ux-pro-max-path>/scripts/search.py "<interaction_pattern>" --domain ux -n 5

# RECOMMENDED: Get page structure patterns
python3 <ui-ux-pro-max-path>/scripts/search.py "<page_type>" --domain landing -n 3
```

If `ui-ux-pro-max` is not installed, stop and inform the user that it's a required dependency. Do not proceed with design work based solely on general knowledge — the intelligence queries are what make this skill produce informed, defensible design decisions rather than guesswork.

**Key intelligence to gather before designing:**
- Product type (SaaS, marketplace, portfolio, dashboard, mobile app)
- Target audience (technical vs non-technical, age range, context of use)
- Competitor references (what should this look like vs NOT look like)
- Emotional register (premium, playful, corporate, editorial, warm, technical)
- Any locked decisions (brand colors, fonts, existing design tokens)

### Phase 2 — Write the design system document

Create `docs/design/design-system.md` (or version-suffixed like `design-system-v2.md` for alternatives).

**Required sections:**

1. **Design philosophy** — 2–3 principles that guide every decision. Not generic ("be accessible") — specific to THIS project ("the work is the hero, the frame recedes").

2. **Color system** — Every color as a named token with hex value, contrast ratio against the base, and usage guidance.
   ```
   | Token | Hex | Use |
   |---|---|---|
   | --color-bg | #FAFAFA | Page background |
   | --color-fg | #0A0A0B | Primary text |
   | --color-accent | #F97316 | Primary CTAs, active states |
   ```

3. **Typography** — Font pairing with rationale, full type scale (display → body → caption → mono), line heights, letter spacing, weight rules.

4. **Spacing & layout** — 4px or 8px grid, container widths, breakpoints, specific spacing values used.

5. **Border radius & shadows** — Scale with named tokens and usage guidance.

6. **Motion system** — Easing curves (with cubic-bezier values), durations (fast/normal/slow), entrance patterns, reduced-motion handling. Include Framer Motion code examples for key patterns:
   ```tsx
   // Standard entrance (document in design system)
   <motion.div
     initial={{ opacity: 0, y: 24 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
   />

   // Scroll-triggered stagger (document in design system)
   <motion.div
     variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
     initial="hidden"
     whileInView="visible"
     viewport={{ once: true }}
   />

   // Hover interaction (document in design system)
   <motion.div whileHover={{ y: -4, transition: { duration: 0.15 } }} />
   ```

7. **Component patterns** — How buttons, cards, inputs, badges, and navigation look and behave across states (hover, focus, active, disabled).

8. **Accessibility baseline** — Contrast minimums, focus ring style, touch targets, keyboard navigation rules, reduced-motion commitment.

### Phase 3 — Build the visual showcase HTML

This is the core deliverable. Create a **single self-contained HTML file** that opens in any browser with zero build steps.

**Technical requirements:**

```html
<!-- Load Tailwind via CDN — no npm -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Load Google Fonts via link tags -->
<link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet">
```

**Architecture of the HTML file:**

```
design-showcase.html
├── <style> block with CSS custom properties (all design tokens)
├── Scroll-reveal animation classes (.reveal, .stagger)
├── @media (prefers-reduced-motion) fallbacks
├── Section 0: Intro / title card
├── Section 1: Design tokens rendered live
│   ├── Color swatches (rendered as colored boxes)
│   ├── Type scale (rendered at actual sizes)
│   ├── Spacing scale (rendered as bars)
│   ├── Border radius (rendered as shapes)
│   ├── Motion system (interactive demos with REAL components)
│   └── Primitives (buttons, badges, inputs — using project language/labels)
├── Section N: Full-page screen mockups
│   └── Each framed in a bordered container with shadow
│       to look like a real app screenshot
│       PLUS a "Full Screen" button that opens an overlay viewer
├── Footer with navigation links
└── <script> IntersectionObserver for entrance animations
```

**CSS custom properties pattern (always use this):**

```css
:root {
  /* Base */
  --color-bg: #FAFAFA;
  --color-surface: #FFFFFF;
  --color-border: #E7E5E4;
  --color-fg: #0A0A0B;
  --color-fg-muted: #57534E;
  --color-fg-subtle: #A8A29E;

  /* Accent */
  --color-accent: #F97316;
  --color-accent-hover: #EA580C;

  /* Motion */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 12px -2px rgba(0,0,0,0.06);
  --shadow-lg: 0 12px 24px -6px rgba(0,0,0,0.10);
}
```

**Scroll-reveal animation pattern (always include):**

```css
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out);
}
.reveal.visible { opacity: 1; transform: translateY(0); }

/* Staggered children */
.stagger > * {
  opacity: 0; transform: translateY(16px);
  transition: opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out);
}
.stagger.visible > * { opacity: 1; transform: translateY(0); }
.stagger.visible > *:nth-child(1) { transition-delay: 0.05s; }
.stagger.visible > *:nth-child(2) { transition-delay: 0.13s; }
/* ... continue for expected child count */

@media (prefers-reduced-motion: reduce) {
  .reveal, .stagger > * {
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```

**IntersectionObserver script (always include at end of body):**

```html
<script>
(function() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveal = (el) => el.classList.add('visible');
  if (prefersReduced) {
    document.querySelectorAll('.reveal, .stagger').forEach(reveal);
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          reveal(entry.target);
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal, .stagger').forEach((el) => io.observe(el));
})();
</script>
```


**Motion system showcase pattern (always include as a dedicated section):**

The motion system section must demonstrate animations using **REAL components from the mockup**, not abstract shapes or generic placeholder elements. Abstract balls, bars, and geometric shapes do not communicate the design's actual motion behavior.

**Required demos (3 rows):**

Row 1 — Reference + Hero entrance:
- **Motion tokens table** — A compact reference table mapping each token (easing curves, durations) to its actual usage in the project (e.g., "ease-out → All entrance animations", "150ms → Hover states, button feedback", "400ms → Carousel slide, menu panel")
- **Hero entrance auto-loop** — The actual hero section content (heading, subtitle, body text, CTA buttons) fading in with the real entrance animation on an infinite loop

Row 2 — Component demos:
- **Fade + Slide Up** — A real testimonial card (stars, review text, avatar) looping the entrance animation
- **Stagger Children** — Real product cards (with thumbnails, names, prices) appearing one after another with staggered delays
- **Card Hover Lift** — Real product cards that the user can actually hover to feel the lift effect and shadow increase

Row 3 — Interactive elements:
- **Button Transitions** — The actual CTA buttons from the mockup (using the project's language, not English placeholders) with real hover states
- **Nav Link Animation** — The actual category navigation links with their underline/color hover transitions
- **Image Hover Zoom** — Real product images with the 700ms scale-on-hover effect used in the product grid

**Key rules:**
- Never use abstract shapes (bouncing balls, racing bars, growing rectangles) — they waste space and don't communicate the design
- All demos must use the project's actual language/labels (e.g., Chinese for a HK bakery, not English placeholder text)
- Auto-looping demos should use CSS `@keyframes` with `infinite` iteration
- Interactive demos (hover effects) should be real elements the user can interact with
- Include `@media (prefers-reduced-motion: reduce)` fallbacks for all animation keyframes

**Component section consistency rule:**

All UI primitives in the Components section (§04) must use the project's actual content and language, not generic English labels. For example:
- Buttons: "立即選購" not "Shop Now", "加入購物車" not "Add to Cart"
- Badges: "新品 New", "季節限定 Seasonal", "人氣皇牌 Best Seller"
- Form labels: "電郵地址 Email" not "Email Address"
- Include all button variants actually used in the mockup (primary, outline, gold, add-to-cart)

**Screen mockup framing pattern:**

Each full-page screen mockup should be wrapped in a container that looks like a device/browser frame. Always include a "Full Screen" button so the user can open the mockup in a dark overlay viewer:

```html
<div class="relative rounded-2xl overflow-hidden border border-[var(--color-border)] bg-white"
     style="box-shadow: var(--shadow-xl);">
  <!-- Full Screen button -->
  <button class="fullscreen-btn absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-black/60 text-white hover:bg-black/80 transition-colors backdrop-blur-sm"
          onclick="openFullscreen(this.closest('.relative'))">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
    Full Screen
  </button>
  <!-- The actual screen content goes here -->
</div>
<p class="mt-4 text-xs text-[var(--color-fg-subtle)] text-center font-mono">
  Brief annotation explaining what this screen shows
</p>
```

**Fullscreen overlay viewer pattern:**

Add this CSS and JS to every showcase that has fullscreen buttons. The overlay works for both desktop mockups (max 1440px) and mobile phone frame mockups (390px centered):

```css
/* Fullscreen overlay */
.fullscreen-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 20px;
  overflow-y: auto;
  animation: overlayIn 0.2s ease;
}
@keyframes overlayIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.fullscreen-close-btn {
  position: fixed;
  top: 16px;
  right: 20px;
  z-index: 10000;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fullscreen-close-btn:hover { background: rgba(255,255,255,0.25); }
.fullscreen-hint {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255,255,255,0.4);
  font-size: 11px;
  font-family: monospace;
  pointer-events: none;
}
```

```js
function openFullscreen(sourceEl) {
  // Determine if this is a phone frame (390px) or desktop mockup
  const isPhone = sourceEl.querySelector('[style*="width: 390px"]') !== null
                  || sourceEl.style.width === '390px';

  const overlay = document.createElement('div');
  overlay.className = 'fullscreen-overlay';
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeFullscreen(overlay);
  });

  const closeBtn = document.createElement('button');
  closeBtn.className = 'fullscreen-close-btn';
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', () => closeFullscreen(overlay));

  const hint = document.createElement('div');
  hint.className = 'fullscreen-hint';
  hint.textContent = 'Press ESC or click backdrop to close';

  // Clone the source element and strip the fullscreen button from the clone
  const clone = sourceEl.cloneNode(true);
  clone.style.cssText = isPhone
    ? 'width: 390px; flex-shrink: 0;'
    : 'width: 100%; max-width: 1440px;';
  clone.querySelector('.fullscreen-btn')?.remove();

  // Re-initialize any interactive JS on the cloned element
  // (carousel indicators, hamburger menus, etc. must be re-bound after cloneNode)
  reinitClone(clone);

  overlay.appendChild(clone);
  document.body.appendChild(overlay);
  document.body.appendChild(closeBtn);
  document.body.appendChild(hint);
  document.body.style.overflow = 'hidden';

  // ESC to close
  overlay._escHandler = (e) => { if (e.key === 'Escape') closeFullscreen(overlay); };
  document.addEventListener('keydown', overlay._escHandler);
}

function closeFullscreen(overlay) {
  document.removeEventListener('keydown', overlay._escHandler);
  document.querySelectorAll('.fullscreen-close-btn, .fullscreen-hint').forEach(el => el.remove());
  overlay.remove();
  document.body.style.overflow = '';
}

// Called after cloneNode to re-bind interactive JS on cloned elements.
// Override this function per-showcase for carousel/menu re-initialization.
function reinitClone(clone) {
  // Default: nothing to reinit for static mockups.
  // For showcases with carousels or hamburger menus, override this function
  // below the main script block to re-attach those event listeners.
}
```

**Section header pattern:**

```html
<div class="flex items-end justify-between mb-8 reveal">
  <div>
    <p class="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--color-accent)] mb-3">
      §01 — Section Name
    </p>
    <h2 class="font-display text-4xl md:text-5xl tracking-[-0.02em] font-medium">
      Display Title
    </h2>
  </div>
  <p class="hidden md:block text-sm text-[var(--color-fg-muted)] max-w-sm text-right leading-[1.6]">
    Brief description of what this section contains
  </p>
</div>
```

### Phase 3.5 — Mobile mockup section

After completing the desktop screen mockups, build a **mobile viewport mockup** that shows the same page content adapted for a 390px mobile layout. Present it inside a phone frame with bezel and notch to give a realistic device feel.

**When to include this phase:**
- Any landing page or marketing site showcase
- Any project where mobile experience is significant
- Any time the user asks "how does it look on mobile?"

**Phone frame pattern:**

```html
<!-- Phone Frame Section -->
<section id="mobile" class="py-20 px-6 lg:px-10 border-t border-[var(--color-border)]">
  <div class="max-w-[1400px] mx-auto">
    <div class="flex items-end justify-between mb-8 reveal">
      <div>
        <p class="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--color-accent)] mb-3">§0N — Mobile</p>
        <h2 class="text-4xl md:text-5xl tracking-[-0.02em] font-medium">Mobile View</h2>
      </div>
      <p class="hidden md:block text-sm text-[var(--color-fg-muted)] max-w-sm text-right leading-[1.6]">
        390px viewport — same content adapted for mobile layout
      </p>
    </div>

    <!-- Phone Frame -->
    <div class="flex justify-center reveal">
      <div class="relative" style="width: 390px;">
        <div class="rounded-[40px] overflow-hidden border-[8px] border-[#1A1008]"
             style="box-shadow: var(--shadow-xl), 0 0 0 2px #2a2018;">
          <!-- Notch / Dynamic Island -->
          <div class="relative z-20 flex justify-center" style="background: #1A1008;">
            <div class="w-[120px] h-[28px] rounded-b-2xl" style="background: #1A1008;"></div>
          </div>
          <!-- Scrollable screen content -->
          <div style="background: var(--color-bg); max-height: 844px; overflow-y: auto; position: relative;">
            <!-- Mobile page content here — single column layout -->
            <!-- Use touch-friendly tap targets (min 44px height) -->
            <!-- Stack sections vertically -->
            <!-- Hamburger menu replaces desktop nav -->
          </div>
        </div>
        <!-- Full Screen button for phone frame -->
        <button class="fullscreen-btn mt-4 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-[var(--color-border)] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--color-surface)] transition-colors"
                onclick="openFullscreen(this.closest('.relative'))">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
          Full Screen
        </button>
      </div>
    </div>
    <p class="mt-4 text-xs text-[var(--color-fg-subtle)] text-center font-mono">
      Mobile layout — 390px viewport, single column, touch-optimized
    </p>
  </div>
</section>
```

**Mobile layout rules:**
- Single column — no multi-column grids
- Touch-friendly buttons: minimum 44px height, generous padding
- Hamburger menu replaces desktop navigation (see hamburger menu pattern below)
- Sections stack vertically with consistent padding (typically `px-5 py-10`)
- Hero text scales down (display size → 2xl/3xl, not 5xl/6xl)
- Cards show full-width or 2-column max
- Carousels use single-card-per-slide mode

**Hamburger menu pattern (for mobile nav):**

```html
<!-- Mobile nav bar -->
<div style="background: var(--color-bg);" class="flex items-center justify-between px-5 py-4 sticky top-0 z-10 border-b border-[var(--color-border)]">
  <span class="font-bold text-lg">{{BRAND}}</span>
  <button id="hamburger-btn" onclick="openMobileMenu()" class="p-2 rounded-lg hover:bg-[var(--color-border)] transition-colors">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  </button>
</div>

<!-- Slide-in menu -->
<div id="mobile-menu" class="fixed inset-0 z-50 pointer-events-none" style="display:none;">
  <!-- Dark backdrop -->
  <div id="mobile-menu-backdrop" class="absolute inset-0 bg-black/50" onclick="closeMobileMenu()"></div>
  <!-- Menu panel — slides in from left -->
  <div id="mobile-menu-panel" class="absolute left-0 top-0 h-full w-[280px] flex flex-col"
       style="background: var(--color-surface); transform: translateX(-100%); transition: transform 0.3s var(--ease-out);">
    <!-- Menu header -->
    <div class="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
      <span class="font-bold text-lg">{{BRAND}}</span>
      <button onclick="closeMobileMenu()" class="p-2 rounded-lg hover:bg-[var(--color-border)] transition-colors">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
    <!-- Nav links -->
    <nav class="flex-1 px-4 py-6 flex flex-col gap-1">
      <a href="#" class="px-4 py-3 rounded-xl text-[var(--color-fg)] hover:bg-[var(--color-border)] transition-colors font-medium">Home</a>
      <a href="#" class="px-4 py-3 rounded-xl text-[var(--color-fg-muted)] hover:bg-[var(--color-border)] transition-colors">Menu</a>
      <a href="#" class="px-4 py-3 rounded-xl text-[var(--color-fg-muted)] hover:bg-[var(--color-border)] transition-colors">About</a>
      <div class="my-2 border-t border-[var(--color-border)]"></div>
      <a href="#" class="px-4 py-3 rounded-xl text-[var(--color-fg-muted)] hover:bg-[var(--color-border)] transition-colors">Contact</a>
    </nav>
    <!-- CTA at bottom -->
    <div class="px-5 py-5 border-t border-[var(--color-border)]">
      <button class="w-full py-3 rounded-xl font-semibold text-white transition-colors"
              style="background: var(--color-accent);">Order Now</button>
    </div>
  </div>
</div>
```

```js
function openMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const panel = document.getElementById('mobile-menu-panel');
  menu.style.display = 'block';
  menu.style.pointerEvents = 'auto';
  requestAnimationFrame(() => { panel.style.transform = 'translateX(0)'; });
  document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const panel = document.getElementById('mobile-menu-panel');
  panel.style.transform = 'translateX(-100%)';
  setTimeout(() => {
    menu.style.display = 'none';
    menu.style.pointerEvents = 'none';
  }, 300);
  document.body.style.overflow = '';
}
```

**Re-initializing hamburger menu after cloneNode (for fullscreen overlay):**

When hamburger menu is used inside a phone frame that has a fullscreen viewer, override `reinitClone` to re-bind the menu functions on the cloned DOM:

```js
function reinitClone(clone) {
  const btn = clone.querySelector('#hamburger-btn');
  const menu = clone.querySelector('#mobile-menu');
  const panel = clone.querySelector('#mobile-menu-panel');
  const backdrop = clone.querySelector('#mobile-menu-backdrop');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.style.display = 'block';
    menu.style.pointerEvents = 'auto';
    requestAnimationFrame(() => { panel.style.transform = 'translateX(0)'; });
  });
  backdrop?.addEventListener('click', () => {
    panel.style.transform = 'translateX(-100%)';
    setTimeout(() => { menu.style.display = 'none'; menu.style.pointerEvents = 'none'; }, 300);
  });
  clone.querySelectorAll('[onclick="closeMobileMenu()"]').forEach(el => {
    el.removeAttribute('onclick');
    el.addEventListener('click', () => {
      panel.style.transform = 'translateX(-100%)';
      setTimeout(() => { menu.style.display = 'none'; menu.style.pointerEvents = 'none'; }, 300);
    });
  });
}
```


### Phase 3.6 — AI image generation (optional, recommended)

After building the showcase HTML, generate matching AI images using the Hugging Face Inference API to replace placeholder/stock images with brand-aligned visuals.

**When to use:** When the showcase uses placeholder images (Unsplash URLs, gray boxes, `onerror` fallbacks) and the user wants polished, brand-specific mockup imagery. Skip if the user already has real product photos.

**Prerequisites:**
- `HF_TOKEN` environment variable set (free token from https://huggingface.co/settings/tokens)
- Python 3.10+ (for the generation script)
- `uv` package runner (for PEP 723 inline dependencies)

**The generation script:** `scripts/generate_mockup_images.py`

Uses the HF Inference API with FLUX.1-schnell (default, fast ~5s) or FLUX.1-dev (higher quality ~15s) to generate images matching the design's aesthetic.

**Available image types:**

| Type | Size | Use case |
|------|------|----------|
| `hero` | 1440x640 | Full-width hero banner, suitable for text overlay |
| `product` | 800x800 | Product showcase on neutral background |
| `lifestyle` | 1200x800 | Atmosphere/environment shots |
| `texture` | 1200x1200 | Subtle background textures and patterns |
| `about` | 800x600 | Behind-the-scenes, craftsmanship shots |
| `card` | 600x600 | Card thumbnails, feature images |

**Quick start:**

```bash
# Generate all standard types for a bakery brand
uv run scripts/generate_mockup_images.py \
  --brand "Chez Choux artisan French patisserie" \
  --mood "warm premium handcrafted golden cream chocolate" \
  --output-dir docs/design/images

# Generate only hero and product, 3 variations each
uv run scripts/generate_mockup_images.py \
  --brand "TechCo SaaS dashboard" \
  --mood "modern minimal clean futuristic dark" \
  --types hero,product --count 3 \
  --output-dir docs/design/images

# Higher quality with FLUX.1-dev
uv run scripts/generate_mockup_images.py \
  --brand "Luxury fashion house" --mood "editorial high-end monochrome" \
  --model flux-dev --output-dir images

# Single custom prompt for a specific section
uv run scripts/generate_mockup_images.py \
  --custom-prompt "Aerial view of golden choux pastries arranged on a marble counter, warm natural light, food photography" \
  --custom-width 1440 --custom-height 640 \
  --custom-filename hero-banner.png \
  --output-dir docs/design/images
```

**Workflow integration:**

1. **Analyze the design tokens** — Extract the color palette mood (warm/cool/neutral), brand personality, and product type from the Phase 2 design system document.

2. **Build the prompt keywords** — Map design tokens to generation prompts:
   - Warm colors (#FF3C00, #FFDC4A) → "warm, golden, amber, inviting"
   - Serif fonts (Fraunces) → "artisan, handcrafted, premium, editorial"
   - Food/bakery → "patisserie, pastry, fresh, appetizing"

3. **Generate images** — Run the script with `--brand` and `--mood` derived from the design tokens. The script generates a `generated-images.json` manifest listing all outputs.

4. **Insert into showcase HTML** — Replace placeholder `<img>` tags with the generated images:
   ```html
   <!-- Before: placeholder -->
   <img src="https://images.unsplash.com/photo-..." alt="Hero">

   <!-- After: AI-generated -->
   <img src="images/hero.png" alt="Hero">
   ```

5. **Iterate** — If an image doesn't match the brand, re-run with adjusted `--mood` keywords or use `--custom-prompt` for specific shots.

**Prompt engineering tips:**
- Include the **product type** in `--brand` (e.g., "artisan bakery", "SaaS dashboard", "fashion e-commerce")
- Include **color temperature** in `--mood` (e.g., "warm golden", "cool blue", "monochrome")
- Include **style keywords** in `--mood` (e.g., "editorial", "minimal", "organic", "futuristic")
- Use `--extra` for scene-specific details (e.g., "with fresh strawberries and chocolate")
- Use `--custom-prompt` when templates don't fit (e.g., specific interior shots, team photos)

**Models:**

| Model | Speed | Quality | Best for |
|-------|-------|---------|----------|
| `flux-schnell` | ~5s | Good | Quick iteration, batch generation |
| `flux-dev` | ~15s | Best | Hero banners, key visuals |
| `sdxl` | ~10s | Good | Alternative style, more stylized |

Start with `flux-schnell` for rapid iteration, then re-generate key images with `flux-dev` for final quality.
### Phase 4 — Present and iterate

After building the showcase:

1. Tell the user which file to open and how (e.g., "Open design-showcase.html in a browser")
2. List what each section shows
3. Call out specific things to evaluate ("look at the card hover states", "compare the type scale", "try the Full Screen button on the desktop mockup", "scroll inside the phone frame")
4. Ask for explicit approval or change requests
5. If changes requested, edit the existing file or create a new version

### Phase 5 — Multiple directions (when requested)

When the user wants to compare alternatives, every version MUST be **identically different** — not a reskin with swapped colors. This is the single most important rule in the skill. Users will reject versions that feel like cousins of each other.

**The identically-different rule:** Each version must differ from every other version on **at least 5 of these 7 axes**. Before building any v2/v3/v4, explicitly audit the previous versions against this checklist and verify 5+ axes are genuinely changing. If fewer than 5 change, the new version is a reskin — go back and make it more different.

| Axis | What must change | Bad (reskin) | Good (identically different) |
|---|---|---|---|
| **Layout primitive** | The fundamental page structure | v1 card grid → v2 card grid | v1 card grid → v2 horizontal rows → v3 bento → v4 sidebar+rows |
| **Font family** | The actual typefaces used | v1 Inter → v2 Inter | v1 Playfair+Inter → v2 Fraunces+DM Sans → v3 Geist only → v4 General Sans+Instrument Serif |
| **Color system** | Base palette + accent + temperature | v1 dark+pink → v2 dark+blue | v1 dark near-black+magenta → v2 warm cream+terracotta → v3 aurora+violet → v4 near-white+coral |
| **Component architecture** | How cards, nav, detail pages are built | Same card layout with different border radius | v1 rounded cards → v2 hairline-border cards → v3 glass panels → v4 cinematic wide cards in scroll rows |
| **Motion character** | Speed, easing, entrance style | Same ease-out at different durations | v1 snappy 250ms → v2 gentle 400ms → v3 spring-physics 500ms + blur-in → v4 crisp app 150ms |
| **Information density** | How much per viewport | Similar whitespace | v1 spacious editorial → v2 magazine rhythm → v3 floating spatial → v4 compact app |
| **Emotional register** | The personality the design communicates | "Premium" with different colors | v1 "Vercel at night" → v2 "Aesop in the morning" → v3 "Apple Vision Pro" → v4 "Spotify app" |

**Before building a new version, write a 7-row audit table** comparing the new direction against all previous versions. Show it to yourself and verify 5+ rows are genuinely different. If you can't fill 5 rows with real differences, you don't have a new direction — you have a reskin. Go back to `references/differentiation-axes.md` and pick a different archetype.

Name each direction with a memorable codename (e.g., "Vitrine," "Atelier," "Oracle") and include cross-navigation links in each showcase file so the user can switch between tabs easily.

See `references/differentiation-axes.md` for the full axis reference with 8 ready-to-use archetype combinations.

### Phase 6 — Lock and reference

Once the user approves a direction:
1. Note which version was approved in the design system doc
2. Add a reference link from implementation plans/specs to the approved design files
3. Replace any `{{BRAND_NAME}}` or other placeholders with real values
4. Commit the design files to git if the project has a repo

### Phase 7 — Interactive prototype (optional, on request)

After the static showcase is approved, the user may ask for a **real interactive prototype** with working animations, hover states, scroll effects, and component interactivity. This goes beyond what static HTML can do — it requires React.

**When to offer this:** When the user says "make it interactive", "add animations", "use shadcn and Framer Motion", "build a working prototype", or "I want to click through it."

**What to build:** A standalone **Vite + React + TypeScript** app in a `prototype/` folder within the project. This is NOT the production app — it's a lightweight interactive proof-of-concept that renders the approved design with real interactivity.

**Setup steps:**

```bash
# 1. Scaffold the prototype app
cd <project-root>
pnpm create vite prototype --template react-ts
cd prototype
pnpm install

# 2. Install the design stack
pnpm add framer-motion lucide-react
pnpm add tailwindcss @tailwindcss/vite -D

# 3. Install shadcn/ui
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button card badge separator input tabs \
  sheet dialog command scroll-area avatar tooltip accordion
```

**Project structure:**

```
prototype/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn components (auto-generated)
│   │   ├── landing/         # Landing page sections
│   │   │   ├── Hero.tsx
│   │   │   ├── ProblemSection.tsx
│   │   │   ├── ValueProps.tsx
│   │   │   ├── AISpotlight.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── SandboxDemo.tsx
│   │   │   ├── GalleryGrid.tsx
│   │   │   ├── SocialProof.tsx
│   │   │   └── FinalCTA.tsx
│   │   ├── marketplace/     # App screen components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── CategoryRow.tsx
│   │   │   ├── SiteCard.tsx
│   │   │   └── FloatingChat.tsx
│   │   ├── dashboard/       # Dashboard components
│   │   │   ├── Onboarding.tsx
│   │   │   ├── SiteEditor.tsx
│   │   │   ├── AIChat.tsx
│   │   │   └── VersionHistory.tsx
│   │   └── shared/          # Shared components
│   │       ├── Navigation.tsx
│   │       ├── AIAvatar.tsx
│   │       └── DeviceSwitcher.tsx
│   ├── lib/
│   │   ├── tokens.ts        # Design tokens as JS constants
│   │   └── animations.ts    # Framer Motion variants & transitions
│   ├── styles/
│   │   └── globals.css      # CSS custom properties + Tailwind
│   ├── pages/
│   │   ├── Landing.tsx
│   │   ├── Marketplace.tsx
│   │   ├── Detail.tsx
│   │   └── Dashboard.tsx
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── package.json
```

**Design tokens file** (`src/lib/tokens.ts`):

Translate the CSS custom properties from the design system into TypeScript constants so they're usable in both Tailwind config and Framer Motion:

```ts
export const tokens = {
  colors: {
    bg: '#FAFAFA',
    surface: '#FFFFFF',
    border: '#E7E5E4',
    fg: '#0A0A0B',
    fgMuted: '#57534E',
    fgSubtle: '#A8A29E',
    accent: '#F97316',
    accentHover: '#EA580C',
    accentSubtle: '#FFEDD5',
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
  },
  gradients: {
    ai: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 33%, #F97316 66%, #FBBF24 100%)',
  },
} as const;
```

**Animation variants file** (`src/lib/animations.ts`):

Define reusable Framer Motion variants that match the design system's motion spec:

```ts
import type { Variants, Transition } from 'framer-motion';

export const ease = [0.22, 1, 0.36, 1] as const;

export const duration = {
  fast: 0.15,
  normal: 0.25,
  slow: 0.4,
  slower: 0.6,
} as const;

// Standard entrance — fade + slide up
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.slower, ease } },
};

// Stagger children
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

// Card hover
export const cardHover = {
  y: -4,
  transition: { duration: duration.fast, ease } as Transition,
};

// Scale on tap
export const tapScale = { scale: 0.98 };
```

**Component pattern** — every section component follows this structure:

```tsx
'use client';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, staggerChild } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function HowItWorks() {
  return (
    <section className="px-8 md:px-12 py-16 bg-white">
      <motion.div
        className="max-w-4xl mx-auto text-center mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={fadeInUp}
      >
        <h2 className="text-3xl md:text-4xl font-medium">
          Three steps. <em>That's it.</em>
        </h2>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        {steps.map((step) => (
          <motion.div key={step.num} variants={staggerChild}>
            <Card className="text-center p-6">
              {/* ... */}
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
```

**What the prototype delivers that the static showcase cannot:**
- Real Framer Motion animations (spring physics, whileInView, stagger, layout animations)
- Working shadcn components (Dialog opens, Tabs switch, Accordion expands, Command palette opens with ⌘K)
- Interactive hover states with motion (cards lift with spring, buttons scale on press)
- Working device switcher (preview iframe resizes)
- Simulated AI chat (typing indicator, streaming text response, action buttons that work)
- Page routing (landing → marketplace → detail → dashboard)
- Responsive layout (sidebar collapses on mobile, horizontal rows scroll with touch)

**What the prototype does NOT need:**
- Real backend/API
- Real data (use hardcoded mock data matching the showcase)
- Authentication
- Database
- Deployment (runs locally via `pnpm dev`)

**How to run:**

```bash
cd prototype
pnpm dev
# Opens at http://localhost:5173
```

**When to suggest this to the user:**
After the static showcase is approved AND the user wants to feel the interactions before committing to the full production build. Frame it as: "The static showcase shows the design. The interactive prototype lets you *feel* it — real animations, real component interactions, working navigation. It takes ~1 session to build and can serve as a reference implementation for the production app."

## Interactive patterns reference

### Carousel / testimonial slider pattern

Use for testimonials, product galleries, or any repeating content where paginated browsing improves readability. Always implement touch/mouse drag support for mobile usability.

**HTML structure:**

```html
<div class="carousel-container relative overflow-hidden" id="carousel-{{ID}}">
  <!-- Track — slides horizontally via transform -->
  <div class="carousel-track flex transition-transform duration-500"
       style="--ease-out: cubic-bezier(0.22, 1, 0.36, 1); transition-timing-function: var(--ease-out);"
       id="track-{{ID}}">
    <!-- Each slide -->
    <div class="carousel-slide flex-shrink-0 w-full md:w-1/3 px-3">
      <!-- Card content -->
    </div>
    <!-- More slides... -->
  </div>

  <!-- Prev / Next arrows (optional, desktop) -->
  <button class="carousel-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-white border border-[var(--color-border)] shadow flex items-center justify-center hover:bg-[var(--color-surface)] transition-colors z-10"
          onclick="carouselPrev('{{ID}}')">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
  </button>
  <button class="carousel-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-white border border-[var(--color-border)] shadow flex items-center justify-center hover:bg-[var(--color-surface)] transition-colors z-10"
          onclick="carouselNext('{{ID}}')">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
  </button>
</div>

<!-- Dot navigation -->
<div class="flex justify-center gap-2 mt-6" id="dots-{{ID}}">
  <!-- Dots injected by JS -->
</div>
```

**JavaScript (self-contained, add once per showcase):**

```js
(function() {
  // Configuration per carousel ID
  const carouselConfig = {
    '{{ID}}': {
      totalSlides: 6,       // total number of slide elements
      desktopPerPage: 3,    // slides visible at once on desktop
      mobilePerPage: 1,     // slides visible at once on mobile
      autoAdvanceMs: 4000,  // 0 to disable auto-advance
    }
  };

  const state = {}; // tracks current page per carousel

  function getConfig(id) { return carouselConfig[id] || { totalSlides: 3, desktopPerPage: 1, mobilePerPage: 1, autoAdvanceMs: 0 }; }
  function isMobile() { return window.innerWidth < 768; }

  function perPage(id) {
    const cfg = getConfig(id);
    return isMobile() ? cfg.mobilePerPage : cfg.desktopPerPage;
  }

  function totalPages(id) {
    return Math.ceil(getConfig(id).totalSlides / perPage(id));
  }

  function goToPage(id, page) {
    const cfg = getConfig(id);
    const pages = totalPages(id);
    page = ((page % pages) + pages) % pages; // wrap around
    state[id] = page;

    const track = document.getElementById('track-' + id);
    if (!track) return;
    const pp = perPage(id);
    const pct = (100 / pp) * page;
    track.style.transform = `translateX(-${pct}%)`;

    // Update dots
    const dotsEl = document.getElementById('dots-' + id);
    if (dotsEl) {
      dotsEl.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.style.background = i === page ? 'var(--color-accent)' : 'var(--color-border)';
        d.style.transform = i === page ? 'scale(1.25)' : 'scale(1)';
      });
    }
  }

  window.carouselNext = function(id) {
    resetAutoAdvance(id);
    goToPage(id, (state[id] || 0) + 1);
  };
  window.carouselPrev = function(id) {
    resetAutoAdvance(id);
    goToPage(id, (state[id] || 0) - 1);
  };
  window.carouselGoTo = function(id, page) {
    resetAutoAdvance(id);
    goToPage(id, page);
  };

  // Auto-advance timers
  const timers = {};
  function startAutoAdvance(id) {
    const ms = getConfig(id).autoAdvanceMs;
    if (!ms) return;
    timers[id] = setInterval(() => goToPage(id, (state[id] || 0) + 1), ms);
  }
  function resetAutoAdvance(id) {
    if (timers[id]) { clearInterval(timers[id]); timers[id] = null; }
    startAutoAdvance(id);
  }

  // Touch / mouse drag support
  function addDragSupport(id) {
    const container = document.getElementById('carousel-' + id);
    if (!container) return;
    let startX = 0, dragging = false;

    container.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; dragging = true; }, { passive: true });
    container.addEventListener('touchend', (e) => {
      if (!dragging) return;
      dragging = false;
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) diff > 0 ? carouselNext(id) : carouselPrev(id);
    });

    container.addEventListener('mousedown', (e) => { startX = e.clientX; dragging = true; });
    container.addEventListener('mouseup', (e) => {
      if (!dragging) return;
      dragging = false;
      const diff = startX - e.clientX;
      if (Math.abs(diff) > 40) diff > 0 ? carouselNext(id) : carouselPrev(id);
    });
    container.addEventListener('mouseleave', () => { dragging = false; });
  }

  // Init dots and start all carousels
  function initCarousel(id) {
    state[id] = 0;
    const pages = totalPages(id);
    const dotsEl = document.getElementById('dots-' + id);
    if (dotsEl) {
      dotsEl.innerHTML = '';
      for (let i = 0; i < pages; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot w-2 h-2 rounded-full transition-all duration-300';
        dot.style.background = i === 0 ? 'var(--color-accent)' : 'var(--color-border)';
        dot.style.transform = i === 0 ? 'scale(1.25)' : 'scale(1)';
        dot.addEventListener('click', () => carouselGoTo(id, i));
        dotsEl.appendChild(dot);
      }
    }
    addDragSupport(id);
    goToPage(id, 0);
    startAutoAdvance(id);
  }

  document.addEventListener('DOMContentLoaded', () => {
    Object.keys(carouselConfig).forEach(initCarousel);
  });
})();
```

**Re-initializing carousels after cloneNode (for fullscreen viewer):**

When a carousel lives inside a fullscreen-capable mockup, override `reinitClone` to re-run carousel initialization on the cloned DOM:

```js
function reinitClone(clone) {
  // Re-init carousels: update IDs to avoid collision with originals
  clone.querySelectorAll('[id^="carousel-"]').forEach(el => {
    const oldId = el.id.replace('carousel-', '');
    const newId = oldId + '-clone';
    el.id = 'carousel-' + newId;
    const track = clone.querySelector('#track-' + oldId);
    if (track) track.id = 'track-' + newId;
    const dots = clone.querySelector('#dots-' + oldId);
    if (dots) dots.id = 'dots-' + newId;
    // Re-assign onclick attributes
    clone.querySelectorAll(`[onclick*="${oldId}"]`).forEach(btn => {
      btn.setAttribute('onclick', btn.getAttribute('onclick').replaceAll(oldId, newId));
    });
    initCarousel(newId); // call the carousel init function
  });
}
```



## Desktop & Mobile Mockup Guidelines

These rules are derived from real production issues encountered during mockup development. Follow them to avoid the same mistakes.

### Desktop mockup frame

1. **Always wrap in a browser frame** — Use a Safari/Chrome-style window (traffic light dots + URL bar with site domain) instead of a plain bordered container. Rounded corners (12px), light gray tab bar (#F0F0F0), white URL bar with green shield icon.

2. **Render at 1440px, scale to fit** — Set the mockup content to `width: 1440px` and use `transform: scale()` with `transform-origin: top left` to shrink it into the container. Calculate: `scale = containerWidth / 1440`. Do NOT use CSS `zoom` — it is not supported on Safari iOS. After scaling, set the wrapper height to `scrollHeight * scale` so the parent container knows the correct size.

3. **Override all Tailwind responsive classes** — CSS media queries use viewport width, not element width. Add CSS overrides inside a `#desktop-mockup-frame` scope that force all `md:` classes to their desktop values:
   ```css
   #desktop-mockup-frame .hidden.md\:flex { display: flex !important; }
   #desktop-mockup-frame .md\:hidden { display: none !important; }
   #desktop-mockup-frame .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
   /* Cover every md: class used in the mockup */
   ```

4. **Force-hide the hamburger, force-show desktop nav** — Use inline `style="display: none !important"` on the mobile hamburger and `style="display: flex !important"` on desktop nav elements. The CSS overrides alone may not catch all cases.

5. **Set screen height to 900px** — The scrollable area inside the browser frame should be at least 900px to show meaningful content before the user scrolls.

6. **Use `isolation: isolate`** — Add this to the screen outer container to create a new stacking context. Prevents any `position: fixed` or high `z-index` elements (like sticky navs) from escaping the frame.

### Mobile mockup frame

7. **Use a phone frame with bezel and notch** — 390px width, `border: 8px solid #1A1008`, `border-radius: 40px`, notch bar (120px wide, 28px tall). Max-height: 844px with `overflow-y: auto` for scrolling.

8. **Slide-in hamburger menu from left** — Full height, 75% width (max 280px), dark backdrop overlay, logo in header, nav links with dividers, login/contact in footer. Lock background scroll when open.

9. **Single-card carousel for testimonials** — Use `width: 300%` track with `width: 33.333%` cards and slide by 33.333% per step. Support touch swipe (touchstart/touchend, threshold 30px), mouse drag, clickable dots, and auto-advance (4s).

### Consistent styling

10. **Match border-radius across desktop and mobile** — Define the radius in design tokens (e.g., `--radius-md: 8px`) and use the same value in both desktop CSS classes and mobile inline styles. Final check: search for `border-radius: [0-4]px` to catch inconsistencies.

11. **Bilingual section titles** — If the project content is bilingual, ALL showcase section titles must follow the same pattern: Chinese as primary heading, English as italic subtitle. Never mix English-only titles with bilingual ones.

12. **Use the project's actual language in components** — All buttons, badges, form labels, and nav links in the Components section must use the project's real labels (e.g., "立即選購" not "Shop Now"). Bilingual format (Chinese + English) is acceptable.

### Fullscreen viewer

13. **Force all reveal elements visible on clone** — After cloning a mockup for fullscreen, immediately add `.visible` to every `.reveal`, `.reveal-scale`, `.reveal-left`, `.reveal-right`, and `.stagger` element. Without this, sections below the fold remain invisible (opacity: 0) because the IntersectionObserver hasn't triggered them.

14. **Re-add the mockup ID on the desktop clone** — The CSS overrides target `#desktop-mockup-frame`. Since `cloneNode` copies the ID but it gets removed to avoid duplicates, re-add it: `clone.setAttribute('id', 'desktop-mockup-frame')`.

15. **Never use CSS `zoom` — use `transform: scale()` everywhere** — CSS `zoom` is not supported on Safari iOS (the #1 mobile browser). Always use `transform: scale()` with `transform-origin: top left`. After scaling, wrap the element in a div sized to `width * scale` and `height * scale` so the parent scrolls correctly. Use `requestAnimationFrame` to measure `scrollHeight` after the clone renders.

16. **Re-initialize interactive JS on clones** — Event listeners don't survive `cloneNode`. After cloning, re-bind: carousel swipe/dots, hamburger menu open/close, and any other interactive elements.

### Motion system section

17. **Use real components, not abstract shapes** — Motion demos must use actual UI elements from the mockup (product cards, testimonial cards, nav links, CTA buttons). Abstract bouncing balls and racing bars waste space and don't communicate the design's actual motion.

18. **Three-row layout** — Row 1: motion tokens reference table + hero entrance auto-loop. Row 2: real testimonial card fade-in, real product cards stagger, real product cards with live hover. Row 3: actual CTA buttons with hover transitions, actual nav links with underline animation, real product images with zoom-on-hover.

19. **Auto-loop with CSS keyframes** — Use `animation: name duration ease infinite` for entrance demos. Interactive demos (hover effects) should be real elements the user can interact with, not auto-playing.

20. **Responsive scroll height for desktop frame** — The browser frame scroll height should be responsive: use a taller value on mobile (e.g., 1800px) so the scaled-down desktop view shows more content, and a shorter value on desktop (e.g., 900px) where the frame is already large. Example: `var maxHeight = window.innerWidth < 768 ? 1800 : 900;`

21. **Center the fullscreen overlay content** — Add `display: flex; justify-content: center; width: 100%` on the fullscreen content container so the scaled desktop mockup is centered horizontally on all viewport sizes.

## Quality checklist

**For multi-version designs (v2, v3, v4...) — verify FIRST:**
- [ ] Audit table written comparing new version against all previous versions on all 7 axes
- [ ] At least 5 of 7 axes are genuinely different (not just tweaked)
- [ ] Different font families used (not the same fonts with different weights)
- [ ] Different layout primitive (not the same grid with different card shapes)
- [ ] Different color temperature (not the same hue at different lightness)
- [ ] Different component architecture (not the same cards with different borders)
- [ ] A unique codename assigned to the new direction

**For every showcase — verify before presenting:**

- [ ] HTML opens correctly in a browser with no console errors
- [ ] All fonts load (Google Fonts link tags present and correct)
- [ ] Tailwind CDN script tag present
- [ ] All CSS custom properties defined in `:root`
- [ ] Scroll-reveal animations work (IntersectionObserver script at end of body)
- [ ] `prefers-reduced-motion` media query present and functional
- [ ] Color contrast meets WCAG AA (4.5:1 body text, 3:1 large text)
- [ ] Focus-visible styles defined for interactive elements
- [ ] No emojis used as structural icons (use SVGs)
- [ ] Every section has a numbered header (§01, §02, etc.)
- [ ] Annotation text below each framed mockup
- [ ] Navigation in the top bar links to all sections
- [ ] Fullscreen viewer implemented on desktop and mobile mockups
- [ ] Mobile phone frame section included (Phase 3.5)
- [ ] Mobile hamburger menu implemented (not desktop nav) inside phone frame
- [ ] Touch/drag support on any carousels
- [ ] Motion system section uses REAL components (product cards, testimonial cards, buttons, nav links) — no abstract shapes
- [ ] All component labels match the project language (Chinese/bilingual for HK projects, not English placeholders)
- [ ] Interactive hover demos included (card lift, image zoom, button transitions, nav underlines)
- [ ] reinitClone() override written if cloned elements contain interactive JS
- [ ] AI-generated images considered (Phase 3.6) — run generate_mockup_images.py if showcase uses placeholder images
- [ ] Desktop mockup wrapped in browser frame (traffic lights + URL bar)
- [ ] Desktop mockup renders at 1440px with CSS zoom/scale to fit container
- [ ] Tailwind md: responsive classes overridden to force desktop layout inside mockup frame
- [ ] Hamburger hidden and desktop nav forced visible via inline styles in desktop mockup
- [ ] Screen container uses isolation: isolate to contain fixed/z-index elements
- [ ] Fullscreen clone forces .visible on all reveal/stagger elements
- [ ] Fullscreen desktop clone re-adds mockup ID for CSS overrides
- [ ] Fullscreen desktop uses CSS zoom to fit mobile viewport
- [ ] Border-radius consistent across desktop and mobile (check for 0-4px values)
- [ ] All section titles bilingual if project content is bilingual

## File naming convention

```
docs/design/
├── design-system.md           # v1 (or only version)
├── design-system-v2.md        # alternative direction
├── design-system-v3.md        # another alternative
├── design-showcase.html       # v1 showcase
├── design-showcase-v2.html    # v2 showcase
├── design-showcase-v3.html    # v3 showcase
├── design-showcase-dashboard.html  # screen-specific showcase
└── design-system-v4.md        # approved version (noted in doc)
├── images/                    # AI-generated mockup images
│   ├── hero.png
│   ├── product.png
│   ├── lifestyle.png
│   └── generated-images.json  # manifest with prompts used
```

## Common pitfalls to avoid

1. **Reskinning instead of redesigning — the #1 failure mode.** When asked for "a different version," you MUST change the layout primitive, the font families, the color temperature, the component architecture, AND the motion character — at minimum 5 of 7 axes. Changing colors from magenta to terracotta on the same card grid with the same serif+sans type model is NOT a new version. The user WILL notice and WILL ask you to redo it. Write the 7-axis audit table BEFORE building to catch this early.

2. **Designing in a vacuum.** Always gather intelligence first (product type, audience, competitors, emotional register). A wellness-coach marketplace and a developer-tool dashboard need fundamentally different designs even if both are "modern and minimal."

3. **Making the showcase too simple.** The showcase needs real content — real headlines, real card data, real interaction states. Placeholder-heavy showcases don't help the user judge the design.

4. **Forgetting mobile.** Every showcase must include a Phase 3.5 mobile section — a 390px phone frame with the content adapted to mobile layout, a hamburger menu, and single-column stacking. Use Tailwind responsive prefixes (`md:`, `lg:`) throughout for the desktop mockup.

5. **Skipping accessibility.** Every showcase must have: contrast-passing colors, focus-visible rings, reduced-motion fallbacks, semantic HTML, no emoji icons.

6. **Not annotating.** Every framed mockup needs a brief annotation below it explaining what the screen shows. The user shouldn't have to guess.

7. **Forgetting the fullscreen button.** Every framed desktop mockup and phone frame mockup should have a Full Screen button. Users want to see the design at real viewport size without scrolling the showcase document.

8. **Forgetting interactive re-initialization after cloneNode.** When a mockup that contains carousel, hamburger menu, or other JS-driven interactivity is cloned for the fullscreen overlay, the event listeners do NOT clone with it. Always write a `reinitClone()` override to re-bind those handlers on the cloned DOM.

9. **Abstract motion demos.** The motion system section must demonstrate animations using REAL components from the mockup (product cards, testimonial cards, nav links, CTA buttons), not abstract shapes like bouncing balls, racing bars, or colored rectangles. Abstract demos waste space and don't communicate how the design actually moves. Use auto-looping CSS keyframe animations on real UI elements, and include interactive hover demos the user can actually try.

10. **English placeholder labels in non-English projects.** When the project targets a non-English audience (e.g., a Hong Kong bakery), all UI primitive demos in the Components section must use the project's actual language — "立即選購" not "Shop Now", "加入購物車" not "Add to Cart". Bilingual labels (Chinese + English) are acceptable. Generic English labels make the showcase feel disconnected from the real product.

22. **Components section must only show elements from the mockup.** Audit the actual homepage mockup and only include UI primitives that appear in it. Common mistakes: adding badge/tag components that don't exist in the design, adding form/newsletter inputs that aren't in any mockup section, adding navigation links as "components" when they're just styled text. Before building the Components section, list every distinct UI element from the mockup: buttons (each variant), icons (each one used), cards (product, testimonial), bars (announcement), and quantity selectors. If it's not in the mockup, don't showcase it.

23. **Icons deserve their own subsection.** List every icon used in the mockup in a card grid with the icon rendered at consistent size (22px) plus a Chinese label underneath. Group by function: social (Facebook, Instagram, WhatsApp), navigation utility (phone, home, user, cart with badge, hamburger, close), section (map pin, arrow, email, globe), and decorative (star rating). Only include icons that actually appear in the mockup — don't add showcase-only icons (like fullscreen toggle).
