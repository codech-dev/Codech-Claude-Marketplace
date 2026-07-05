# Showcase HTML Template Reference

This is the structural template for building design showcase HTML files. Every showcase follows this skeleton. Customize the tokens, sections, and content per project.

## Minimal working template

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{PROJECT}} — Design Showcase</title>

<!-- Google Fonts (customize per design direction) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<!-- Tailwind CDN — no npm needed -->
<script src="https://cdn.tailwindcss.com"></script>

<style>
  :root {
    /* === DESIGN TOKENS === */
    /* Base palette */
    --color-bg: #FAFAFA;
    --color-surface: #FFFFFF;
    --color-border: #E5E5E5;
    --color-border-strong: #D4D4D4;
    --color-fg: #0A0A0A;
    --color-fg-muted: #525252;
    --color-fg-subtle: #A3A3A3;

    /* Accent */
    --color-accent: #2563EB;
    --color-accent-hover: #1D4ED8;
    --color-accent-subtle: #DBEAFE;

    /* Functional */
    --color-success: #22C55E;
    --color-warning: #F59E0B;
    --color-danger: #EF4444;

    /* Motion */
    --ease-out: cubic-bezier(0.22, 1, 0.36, 1);

    /* Shadows */
    --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
    --shadow-md: 0 4px 12px -2px rgba(0,0,0,0.08);
    --shadow-lg: 0 12px 24px -6px rgba(0,0,0,0.12);
    --shadow-xl: 0 24px 48px -12px rgba(0,0,0,0.16);
  }

  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }

  body {
    font-family: 'Inter', system-ui, sans-serif;
    background: var(--color-bg);
    color: var(--color-fg);
    -webkit-font-smoothing: antialiased;
    margin: 0;
  }

  ::selection {
    background: var(--color-accent);
    color: #FFFFFF;
  }

  /* === SCROLL REVEAL === */
  .reveal {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out);
  }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  .stagger > * {
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out);
  }
  .stagger.visible > * { opacity: 1; transform: translateY(0); }
  .stagger.visible > *:nth-child(1) { transition-delay: 0.05s; }
  .stagger.visible > *:nth-child(2) { transition-delay: 0.13s; }
  .stagger.visible > *:nth-child(3) { transition-delay: 0.21s; }
  .stagger.visible > *:nth-child(4) { transition-delay: 0.29s; }
  .stagger.visible > *:nth-child(5) { transition-delay: 0.37s; }
  .stagger.visible > *:nth-child(6) { transition-delay: 0.45s; }

  @media (prefers-reduced-motion: reduce) {
    .reveal, .stagger > * {
      transition: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
  }

  /* === FOCUS === */
  :focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--color-bg), 0 0 0 4px var(--color-accent);
    border-radius: inherit;
  }

  section[id] { scroll-margin-top: 80px; }

  /* === FULLSCREEN OVERLAY === */
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
</style>
</head>
<body>

<!-- TOP NAV -->
<nav class="fixed top-0 inset-x-0 z-50 h-14 bg-white/80 backdrop-blur-xl border-b border-[var(--color-border)]">
  <div class="max-w-[1400px] mx-auto h-full px-6 lg:px-10 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <span class="text-lg font-semibold tracking-tight">{{PROJECT}}</span>
      <span class="text-[10px] font-mono uppercase tracking-[0.14em] text-[var(--color-accent)] border border-[var(--color-accent-subtle)] rounded-full px-2 py-0.5">design showcase</span>
    </div>
    <div class="hidden md:flex items-center gap-1 text-sm">
      <a href="#tokens" class="px-3 py-1.5 rounded-lg text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:bg-gray-100 transition-colors">Tokens</a>
      <a href="#screen-1" class="px-3 py-1.5 rounded-lg text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:bg-gray-100 transition-colors">Desktop</a>
      <a href="#mobile" class="px-3 py-1.5 rounded-lg text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:bg-gray-100 transition-colors">Mobile</a>
      <!-- Add section links here -->
    </div>
  </div>
</nav>

<!-- INTRO -->
<section class="relative pt-32 pb-20 px-6 lg:px-10">
  <div class="max-w-4xl mx-auto text-center">
    <h1 class="reveal text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.02em] font-medium mb-8">
      {{PROJECT}} Design
    </h1>
    <p class="reveal text-lg text-[var(--color-fg-muted)] max-w-2xl mx-auto leading-[1.65] mb-10">
      {{DESCRIPTION}}
    </p>
  </div>
</section>

<!-- DESIGN TOKENS -->
<section id="tokens" class="py-20 px-6 lg:px-10 border-t border-[var(--color-border)]">
  <div class="max-w-[1400px] mx-auto">
    <div class="flex items-end justify-between mb-12 reveal">
      <div>
        <p class="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--color-accent)] mb-3">§01 — Foundation</p>
        <h2 class="text-4xl md:text-5xl tracking-[-0.02em] font-medium">Design Tokens</h2>
      </div>
    </div>

    <!-- Color swatches -->
    <div class="mb-16">
      <h3 class="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--color-fg-subtle)] mb-5">Palette</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 stagger">
        <!-- Repeat for each color token -->
        <div class="rounded-xl border border-[var(--color-border)] overflow-hidden bg-white">
          <div class="h-20" style="background: var(--color-bg);"></div>
          <div class="p-4">
            <div class="text-xs font-semibold mb-1">bg</div>
            <div class="text-[11px] font-mono text-[var(--color-fg-muted)]">#FAFAFA</div>
          </div>
        </div>
        <!-- ... more swatches -->
      </div>
    </div>

    <!-- Typography -->
    <div class="mb-16 reveal">
      <h3 class="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--color-fg-subtle)] mb-5">Typography</h3>
      <div class="border border-[var(--color-border)] rounded-2xl overflow-hidden bg-white p-8 md:p-12">
        <!-- Show each type scale level at actual size -->
      </div>
    </div>

    <!-- Primitives (buttons, inputs, badges) -->
    <div class="reveal border border-[var(--color-border)] rounded-2xl p-8 md:p-12 bg-white">
      <h3 class="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--color-fg-subtle)] mb-5">Primitives</h3>
      <!-- Interactive buttons, badges, inputs -->
    </div>
  </div>
</section>

<!-- DESKTOP SCREEN MOCKUP -->
<section id="screen-1" class="py-20 px-6 lg:px-10 border-t border-[var(--color-border)]">
  <div class="max-w-[1400px] mx-auto">
    <div class="flex items-end justify-between mb-8 reveal">
      <div>
        <p class="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--color-accent)] mb-3">§02 — Desktop</p>
        <h2 class="text-4xl md:text-5xl tracking-[-0.02em] font-medium">Screen Title</h2>
      </div>
      <p class="hidden md:block text-sm text-[var(--color-fg-muted)] max-w-sm text-right leading-[1.6]">Brief description</p>
    </div>
  </div>

  <div class="max-w-[1400px] mx-auto px-6 lg:px-10">
    <!-- Framed mockup with fullscreen button -->
    <div class="relative rounded-2xl overflow-hidden border border-[var(--color-border)] bg-white" style="box-shadow: var(--shadow-xl);">
      <!-- Full Screen button -->
      <button class="fullscreen-btn absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-black/60 text-white hover:bg-black/80 transition-colors backdrop-blur-sm"
              onclick="openFullscreen(this.closest('.relative'))">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
        Full Screen
      </button>
      <!-- Screen content here -->
    </div>
    <p class="mt-4 text-xs text-[var(--color-fg-subtle)] text-center font-mono">Annotation describing what this screen shows</p>
  </div>
</section>

<!-- MOBILE PHONE FRAME MOCKUP -->
<section id="mobile" class="py-20 px-6 lg:px-10 border-t border-[var(--color-border)]">
  <div class="max-w-[1400px] mx-auto">
    <div class="flex items-end justify-between mb-8 reveal">
      <div>
        <p class="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--color-accent)] mb-3">§03 — Mobile</p>
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
          <!-- Scrollable screen content — 844px max height (iPhone-proportioned) -->
          <div style="background: var(--color-bg); max-height: 844px; overflow-y: auto; position: relative;">

            <!-- Mobile nav bar with hamburger -->
            <div style="background: var(--color-bg);" class="flex items-center justify-between px-5 py-4 sticky top-0 z-10 border-b border-[var(--color-border)]">
              <span class="font-bold text-lg">{{PROJECT}}</span>
              <button id="hamburger-btn" onclick="openMobileMenu()" class="p-2 rounded-lg hover:bg-[var(--color-border)] transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
            </div>

            <!-- Slide-in hamburger menu -->
            <div id="mobile-menu" class="fixed inset-0 z-50 pointer-events-none" style="display:none;">
              <div id="mobile-menu-backdrop" class="absolute inset-0 bg-black/50" onclick="closeMobileMenu()"></div>
              <div id="mobile-menu-panel" class="absolute left-0 top-0 h-full w-[280px] flex flex-col"
                   style="background: var(--color-surface); transform: translateX(-100%); transition: transform 0.3s var(--ease-out);">
                <div class="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
                  <span class="font-bold text-lg">{{PROJECT}}</span>
                  <button onclick="closeMobileMenu()" class="p-2 rounded-lg hover:bg-[var(--color-border)] transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
                <nav class="flex-1 px-4 py-6 flex flex-col gap-1">
                  <a href="#" class="px-4 py-3 rounded-xl text-[var(--color-fg)] hover:bg-[var(--color-border)] transition-colors font-medium">Home</a>
                  <a href="#" class="px-4 py-3 rounded-xl text-[var(--color-fg-muted)] hover:bg-[var(--color-border)] transition-colors">Menu</a>
                  <a href="#" class="px-4 py-3 rounded-xl text-[var(--color-fg-muted)] hover:bg-[var(--color-border)] transition-colors">About</a>
                  <div class="my-2 border-t border-[var(--color-border)]"></div>
                  <a href="#" class="px-4 py-3 rounded-xl text-[var(--color-fg-muted)] hover:bg-[var(--color-border)] transition-colors">Contact</a>
                </nav>
                <div class="px-5 py-5 border-t border-[var(--color-border)]">
                  <button class="w-full py-3 rounded-xl font-semibold text-white transition-colors"
                          style="background: var(--color-accent);">Order Now</button>
                </div>
              </div>
            </div>

            <!-- Mobile page content goes here -->
            <!-- Rules:
              - Single column layout
              - Touch-friendly buttons (min 44px height)
              - px-5 py-10 section spacing
              - Hero text 2xl/3xl max
              - Cards full-width or 2-col max
            -->

          </div><!-- end scrollable screen -->
        </div>

        <!-- Full Screen button (below phone) -->
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

<!-- FOOTER -->
<footer class="py-14 px-6 lg:px-10 border-t border-[var(--color-border)]">
  <div class="max-w-[1400px] mx-auto text-center">
    <p class="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
      {{PROJECT}} Design Showcase · {{DATE}}
    </p>
  </div>
</footer>

<!-- INTERSECTION OBSERVER -->
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
        if (entry.isIntersecting) { reveal(entry.target); io.unobserve(entry.target); }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal, .stagger').forEach((el) => io.observe(el));
})();
</script>

<!-- FULLSCREEN VIEWER -->
<script>
function openFullscreen(sourceEl) {
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

  const clone = sourceEl.cloneNode(true);
  clone.style.cssText = isPhone
    ? 'width: 390px; flex-shrink: 0;'
    : 'width: 100%; max-width: 1440px;';
  clone.querySelector('.fullscreen-btn')?.remove();

  reinitClone(clone);

  overlay.appendChild(clone);
  document.body.appendChild(overlay);
  document.body.appendChild(closeBtn);
  document.body.appendChild(hint);
  document.body.style.overflow = 'hidden';

  overlay._escHandler = (e) => { if (e.key === 'Escape') closeFullscreen(overlay); };
  document.addEventListener('keydown', overlay._escHandler);
}

function closeFullscreen(overlay) {
  document.removeEventListener('keydown', overlay._escHandler);
  document.querySelectorAll('.fullscreen-close-btn, .fullscreen-hint').forEach(el => el.remove());
  overlay.remove();
  document.body.style.overflow = '';
}

// Override this function below to re-initialize carousels, hamburger menus,
// or other interactive JS on cloned elements. Default is a no-op.
function reinitClone(clone) {
  // Re-bind hamburger menu on clone
  const btn = clone.querySelector('#hamburger-btn');
  const menu = clone.querySelector('#mobile-menu');
  const panel = clone.querySelector('#mobile-menu-panel');
  const backdrop = clone.querySelector('#mobile-menu-backdrop');
  if (!btn || !menu) return;

  btn.removeAttribute('onclick');
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
</script>

<!-- HAMBURGER MENU -->
<script>
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
</script>

</body>
</html>
```

## Placeholder variables

Replace these in the template:
- `{{PROJECT}}` — project/brand name
- `{{DESCRIPTION}}` — one-line description of the design showcase
- `{{DATE}}` — creation date

## Adding more sections

Copy the "DESKTOP SCREEN MOCKUP" section block for each additional screen. Increment the section number (§02, §03, etc.) and update the `id`, title, and content. The "MOBILE PHONE FRAME MOCKUP" section (Phase 3.5) should always come after all desktop screen sections.

## Multi-version navigation

When building multiple versions (v1, v2, v3...), add cross-links in the top nav:

```html
<div class="flex items-center gap-1 text-xs">
  <span class="px-3 py-1.5 rounded-lg text-[var(--color-accent)] font-semibold bg-[var(--color-accent-subtle)]">v1</span>
  <a href="./design-showcase-v2.html" class="px-3 py-1.5 rounded-lg text-[var(--color-fg-subtle)] hover:text-[var(--color-fg)]">v2</a>
  <a href="./design-showcase-v3.html" class="px-3 py-1.5 rounded-lg text-[var(--color-fg-subtle)] hover:text-[var(--color-fg)]">v3</a>
</div>
```

## Carousel / testimonial slider template

Use for testimonials, product galleries, or repeating content. Supports touch swipe, mouse drag, dot navigation, and auto-advance.

```html
<!-- Carousel wrapper — add to a section -->
<div class="relative overflow-hidden" id="carousel-testimonials">
  <!-- Slide track -->
  <div class="flex transition-transform duration-500" id="track-testimonials"
       style="transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);">
    <!-- Slide (desktop: w-1/3, mobile: w-full via JS perPage config) -->
    <div class="flex-shrink-0 w-full md:w-1/3 px-3">
      <div class="border border-[var(--color-border)] rounded-2xl p-6 bg-white h-full">
        <!-- Card content -->
        <p class="text-[var(--color-fg-muted)] leading-[1.7] mb-4">"Review text here."</p>
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full" style="background: var(--color-accent-subtle);"></div>
          <div>
            <div class="text-sm font-semibold">Customer Name</div>
            <div class="text-xs text-[var(--color-fg-subtle)]">Role / Location</div>
          </div>
        </div>
      </div>
    </div>
    <!-- Repeat slides... -->
  </div>

  <!-- Prev / Next arrows -->
  <button class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-white border border-[var(--color-border)] shadow flex items-center justify-center hover:bg-[var(--color-surface)] transition-colors z-10"
          onclick="carouselPrev('testimonials')">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
  </button>
  <button class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-white border border-[var(--color-border)] shadow flex items-center justify-center hover:bg-[var(--color-surface)] transition-colors z-10"
          onclick="carouselNext('testimonials')">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
  </button>
</div>

<!-- Dot navigation -->
<div class="flex justify-center gap-2 mt-6" id="dots-testimonials"></div>
```

```html
<!-- Carousel JS — add once per showcase, before closing </body> -->
<script>
(function() {
  const carouselConfig = {
    'testimonials': {
      totalSlides: 6,
      desktopPerPage: 3,
      mobilePerPage: 1,
      autoAdvanceMs: 4000,
    }
    // Add more carousels here as needed
  };

  const state = {};
  const timers = {};

  function getConfig(id) { return carouselConfig[id] || { totalSlides: 3, desktopPerPage: 1, mobilePerPage: 1, autoAdvanceMs: 0 }; }
  function isMobile() { return window.innerWidth < 768; }
  function perPage(id) { const c = getConfig(id); return isMobile() ? c.mobilePerPage : c.desktopPerPage; }
  function totalPages(id) { return Math.ceil(getConfig(id).totalSlides / perPage(id)); }

  function goToPage(id, page) {
    const pages = totalPages(id);
    page = ((page % pages) + pages) % pages;
    state[id] = page;
    const track = document.getElementById('track-' + id);
    if (!track) return;
    track.style.transform = `translateX(-${(100 / perPage(id)) * page}%)`;
    const dotsEl = document.getElementById('dots-' + id);
    if (dotsEl) {
      dotsEl.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.style.background = i === page ? 'var(--color-accent)' : 'var(--color-border)';
        d.style.transform = i === page ? 'scale(1.25)' : 'scale(1)';
      });
    }
  }

  window.carouselNext = function(id) { resetAutoAdvance(id); goToPage(id, (state[id] || 0) + 1); };
  window.carouselPrev = function(id) { resetAutoAdvance(id); goToPage(id, (state[id] || 0) - 1); };
  window.carouselGoTo = function(id, page) { resetAutoAdvance(id); goToPage(id, page); };

  function startAutoAdvance(id) {
    const ms = getConfig(id).autoAdvanceMs;
    if (!ms) return;
    timers[id] = setInterval(() => goToPage(id, (state[id] || 0) + 1), ms);
  }
  function resetAutoAdvance(id) {
    if (timers[id]) { clearInterval(timers[id]); timers[id] = null; }
    startAutoAdvance(id);
  }

  function addDragSupport(id) {
    const container = document.getElementById('carousel-' + id);
    if (!container) return;
    let startX = 0, dragging = false;
    container.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; dragging = true; }, { passive: true });
    container.addEventListener('touchend', (e) => {
      if (!dragging) return; dragging = false;
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) diff > 0 ? carouselNext(id) : carouselPrev(id);
    });
    container.addEventListener('mousedown', (e) => { startX = e.clientX; dragging = true; });
    container.addEventListener('mouseup', (e) => {
      if (!dragging) return; dragging = false;
      const diff = startX - e.clientX;
      if (Math.abs(diff) > 40) diff > 0 ? carouselNext(id) : carouselPrev(id);
    });
    container.addEventListener('mouseleave', () => { dragging = false; });
  }

  window.initCarousel = function(id) {
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
  };

  document.addEventListener('DOMContentLoaded', () => {
    Object.keys(carouselConfig).forEach(initCarousel);
  });
})();
</script>
```

**Re-initializing carousels in the fullscreen clone** — override `reinitClone` after the carousel JS block:

```js
// Place this AFTER the carousel script block, overriding the default reinitClone
function reinitClone(clone) {
  clone.querySelectorAll('[id^="carousel-"]').forEach(el => {
    const oldId = el.id.replace('carousel-', '');
    const newId = oldId + '-clone';
    el.id = 'carousel-' + newId;
    const track = clone.querySelector('#track-' + oldId);
    if (track) track.id = 'track-' + newId;
    const dots = clone.querySelector('#dots-' + oldId);
    if (dots) dots.id = 'dots-' + newId;
    clone.querySelectorAll(`[onclick*="${oldId}"]`).forEach(btn => {
      btn.setAttribute('onclick', btn.getAttribute('onclick').replaceAll(oldId, newId));
    });
    initCarousel(newId);
  });
}
```

## AI-generated images (Phase 3.6)

After building the showcase HTML, run the image generation script to replace placeholder images:

```bash
# Generate images matching the design tokens
uv run scripts/generate_mockup_images.py \
  --brand "{{PROJECT}} — brief description" \
  --mood "keywords from design tokens (warm, premium, minimal, etc.)" \
  --output-dir docs/design/images

# Then update img src attributes in the showcase HTML:
# <img src="images/hero.png" alt="...">
# <img src="images/product.png" alt="...">
# <img src="images/lifestyle.png" alt="...">
```

The script generates a `generated-images.json` manifest that records the prompts used, so images can be regenerated with adjustments.

### Mapping design tokens to image prompts

| Design token | Prompt keyword mapping |
|---|---|
| Warm palette (#FF3C00, cream, gold) | "warm, golden, amber, inviting, natural light" |
| Cool palette (#2563EB, slate, white) | "cool, blue, clean, modern, crisp lighting" |
| Serif display font | "artisan, editorial, premium, handcrafted" |
| Sans-serif geometric | "modern, minimal, technical, futuristic" |
| Food/bakery domain | "patisserie, pastry, fresh ingredients, appetizing" |
| SaaS/tech domain | "dashboard, interface, abstract, geometric" |
| Fashion/luxury | "editorial, high-end, studio, dramatic lighting" |
