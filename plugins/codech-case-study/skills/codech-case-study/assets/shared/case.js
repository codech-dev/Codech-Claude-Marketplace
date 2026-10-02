/* Codech case-study page — shared behaviour for work/<slug>/index.html.
   Reads window.CASE (written by build_case.py): { reel:[{ov, tab, sub, cap, est, group}], deckHints:[...] }.
   Needs work/_shared/ov.js and the project's scenes.js loaded first. */
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const C = window.CASE || { reel:[], deckHints:[] };

  // sticky nav shadow
  const nav = $('#nav.cnav');
  if (nav) { const onScroll = () => nav.classList.toggle('stuck', scrollY > 10); addEventListener('scroll', onScroll, { passive:true }); onScroll(); }

  // reveal on scroll; anything already on screen shows at once (no blank hero)
  if ('IntersectionObserver' in window && !RM) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold:.12, rootMargin:'0px 0px -40px' });
    $$('.rv').forEach(el => el.getBoundingClientRect().top < innerHeight ? requestAnimationFrame(() => el.classList.add('in')) : io.observe(el));
  } else $$('.rv').forEach(el => el.classList.add('in'));

  // cursor-following glow on .glow cards
  if (!RM && matchMedia('(hover:hover)').matches) {
    document.addEventListener('pointermove', e => {
      const c = e.target.closest && e.target.closest('.glow'); if (!c) return;
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive:true });
  }

  // stats: count numbers up once when they scroll into view (text stays correct without JS)
  (() => {
    const els = $$('[data-count]'); if (!els.length || RM || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return; io.unobserve(e.target);
      const el = e.target, m = el.textContent.match(/^(\D*)([\d,.]+)(.*)$/); if (!m) return;
      const [, pre, num, suf] = m, end = parseFloat(num.replace(/,/g, '')), dec = (num.split('.')[1] || '').length, comma = num.includes(',');
      const fmt = v => { let s = v.toFixed(dec); if (comma) s = Number(s).toLocaleString('en-US', { minimumFractionDigits:dec, maximumFractionDigits:dec }); return pre + s + suf; };
      const t0 = performance.now(), dur = 1100;
      const tick = now => { const p = Math.min(1, (now - t0) / dur), k = 1 - Math.pow(1 - p, 3); el.textContent = fmt(end * k); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }), { threshold:.6 });
    els.forEach(el => io.observe(el));
  })();

  // delivery decks: embed the proposal / prototypes, rendered at desktop width and scaled to fit.
  // A page may have several decks (staged layout); every lookup is scoped to its own .deck.
  // Phones get the embedded page's own mobile layout (native width) unless a pane sets data-minw.
  const shade = document.createElement('div'); shade.className = 'deck-shade';
  let closeFull = null;
  $$('.deck').forEach(deck => {
    const view = $('.deck-view', deck); if (!view) return;
    if (!shade.isConnected) { document.body.append(shade); shade.addEventListener('click', () => closeFull && closeFull()); }
    const panes = $$('.pane', view), tabs = $$('.dtab', deck), hint = $('.deck-hint', deck);
    const urlEl = $('.deck-url', deck) || $('#deckUrl', deck);
    let cur = 0, seen = false, ht;
    const fit = f => {
      const w = view.clientWidth, h = view.clientHeight, W = w >= 900 ? 1440 : Math.max(w, +(f.parentElement.dataset.minw || 0)), k = w / W;
      f.style.width = W + 'px'; f.style.height = (h / k) + 'px'; f.style.transform = `scale(${k})`;
    };
    const load = p => {
      if (!p.dataset.src || p.querySelector('iframe')) return;   // slider panes have no embed
      const f = document.createElement('iframe');
      f.src = p.dataset.src; f.title = p.dataset.url; f.referrerPolicy = 'no-referrer';
      f.addEventListener('load', () => { const l = p.querySelector('.ld'); if (l) l.remove(); });
      p.append(f); fit(f);
    };
    function show(k) {
      cur = k;
      tabs.forEach((t, n) => t.setAttribute('aria-selected', n === k));
      panes.forEach((p, n) => p.classList.toggle('on', n === k));
      if (urlEl) urlEl.textContent = panes[k].dataset.url;
      if (seen) load(panes[k]);
      if (hint) {
        hint.querySelector('span').textContent = panes[k].dataset.hint || (C.deckHints || [])[k] || 'Scroll inside to explore';
        hint.classList.remove('off'); clearTimeout(ht); ht = setTimeout(() => hint.classList.add('off'), 4500);
      }
    }
    tabs.forEach(t => t.addEventListener('click', () => show(+t.dataset.k)));
    // full screen pins the same window as a fixed overlay; it is never moved in the DOM, so frames don't reload
    const win = view.closest('.deck-win'), btn = $('.deck-full', deck);
    let full = false;
    const refit = () => requestAnimationFrame(() => $$('iframe', view).forEach(fit));
    function setFull(on) {
      if (on === full) return; full = on;
      win.classList.toggle('full', on); shade.classList.toggle('on', on); document.body.classList.toggle('deck-lock', on);
      if (btn) { btn.setAttribute('aria-pressed', on); btn.querySelector('span').textContent = on ? 'Close' : 'Full screen'; }
      closeFull = on ? () => setFull(false) : null;
      refit();
    }
    if (btn) btn.addEventListener('click', () => setFull(!full));
    addEventListener('keydown', e => { if (e.key === 'Escape') setFull(false); });
    if (hint) view.addEventListener('pointerenter', () => hint.classList.add('off'));
    addEventListener('resize', () => $$('iframe', view).forEach(fit));
    show(0);
    const start = () => { if (seen) return; seen = true; show(cur); };
    if ('IntersectionObserver' in window) new IntersectionObserver(([e], o) => { if (e.isIntersecting) { start(); o.disconnect(); } }, { rootMargin:'400px 0px' }).observe(view);
    else start();
  });

  // slide lightbox: tap/click a slide (or Enlarge) to see it full screen; tap the image to zoom 2x and pan
  const LB = (() => {
    let el = null, figs = [], i = 0, onClose = null;
    const build = () => {
      el = document.createElement('div'); el.className = 'dsl-lb'; el.hidden = true;
      el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Slide viewer');
      const ar = d => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d < 0 ? 'm15 6-6 6 6 6' : 'm9 6 6 6-6 6'}"/></svg>`;
      el.innerHTML = `<div class="dsl-lb-sc"><img alt=""></div>
        <button class="dsl-lb-x" type="button" aria-label="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
        <button class="dsl-lb-nav dsl-lb-prev" type="button" aria-label="Previous slide">${ar(-1)}</button>
        <button class="dsl-lb-nav dsl-lb-next" type="button" aria-label="Next slide">${ar(1)}</button>
        <div class="dsl-lb-bar"><span class="dsl-lb-cap"></span><span class="dsl-lb-n"></span><small>Tap the image to zoom</small></div>`;
      document.body.append(el);
      const sc = $('.dsl-lb-sc', el), img = $('img', sc);
      const zoom = (on, cx, cy) => {
        if (on === el.classList.contains('zoomed')) return;
        const fx = cx != null ? (cx - img.getBoundingClientRect().left) / img.getBoundingClientRect().width : .5;
        const fy = cy != null ? (cy - img.getBoundingClientRect().top) / img.getBoundingClientRect().height : .3;
        el.classList.toggle('zoomed', on);
        if (on) requestAnimationFrame(() => { sc.scrollLeft = img.offsetWidth * fx - sc.clientWidth / 2; sc.scrollTop = img.offsetHeight * fy - sc.clientHeight / 2; });
      };
      img.addEventListener('click', e => { e.stopPropagation(); if (!moved) zoom(!el.classList.contains('zoomed'), e.clientX, e.clientY); });
      sc.addEventListener('click', e => { if (e.target === sc && !el.classList.contains('zoomed')) close(); });
      $('.dsl-lb-x', el).addEventListener('click', close);
      $('.dsl-lb-prev', el).addEventListener('click', () => show(i - 1));
      $('.dsl-lb-next', el).addEventListener('click', () => show(i + 1));
      addEventListener('keydown', e => {
        if (el.hidden) return;
        if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') show(i - 1); if (e.key === 'ArrowRight') show(i + 1);
      });
      // swipe between slides when not zoomed (when zoomed, touch pans the image instead)
      let x0 = null, y0 = 0, moved = false;
      sc.addEventListener('touchstart', e => { moved = false; if (!el.classList.contains('zoomed') && e.touches.length === 1) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; } }, { passive:true });
      sc.addEventListener('touchend', e => {
        if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) { moved = true; show(i + (dx < 0 ? 1 : -1)); setTimeout(() => moved = false, 350); }
      });
    };
    function show(k) {
      i = (k + figs.length) % figs.length; el.classList.remove('zoomed');
      const im = figs[i].querySelector('img'), img = $('.dsl-lb-sc img', el);
      img.src = im.currentSrc || im.src; img.alt = im.alt;
      $('.dsl-lb-cap', el).textContent = figs[i].dataset.cap || ''; $('.dsl-lb-n', el).textContent = `${i + 1} / ${figs.length}`;
      const nx = figs[(i + 1) % figs.length].querySelector('img'); if (nx) nx.loading = 'eager';
    }
    function close() {
      if (!el || el.hidden) return; el.hidden = true; el.classList.remove('zoomed'); document.body.classList.remove('deck-lock');
      if (onClose) onClose(i);
    }
    return { open(f, k, cb) { if (!el) build(); figs = f; onClose = cb; show(k); el.hidden = false; document.body.classList.add('deck-lock'); $('.dsl-lb-x', el).focus({ preventScroll:true }); } };
  })();

  // image slider panes (delivery tabs with "slides"): arrows, dots, keys, swipe, gentle autoplay until touched
  $$('.dsl').forEach(sl => {
    const track = $('.dsl-track', sl), figs = $$('.dsl-s', sl), dots = $$('.dsl-dots button', sl);
    const cap = $('.dsl-cap', sl), num = $('.dsl-n', sl), N = figs.length;
    if (!N) return;
    let i = 0, touched = false, hover = false, visible = false;
    const go = k => {
      i = (k + N) % N; track.style.transform = `translateX(${-i * 100}%)`;
      dots.forEach((d, n) => d.setAttribute('aria-current', n === i));
      cap.textContent = figs[i].dataset.cap || ''; num.textContent = `${i + 1} / ${N}`;
      const nx = figs[(i + 1) % N].querySelector('img'); if (nx) nx.loading = 'eager';   // warm the next slide
    };
    const user = k => { touched = true; go(k); };
    $('.dsl-prev', sl).addEventListener('click', () => user(i - 1));
    $('.dsl-next', sl).addEventListener('click', () => user(i + 1));
    dots.forEach((d, n) => d.addEventListener('click', () => user(n)));
    sl.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') user(i - 1); if (e.key === 'ArrowRight') user(i + 1); });
    // swipe: touch events on phones (reliable with touch-action:pan-y), mouse drag on desktop
    let x0 = null, y0 = null, swiped = false;
    const start = (x, y, t) => { if (!t.closest('button')) { x0 = x; y0 = y; } };
    const end = (x, y) => { if (x0 === null) return; const dx = x - x0, dy = y - y0; x0 = null; if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { swiped = true; setTimeout(() => swiped = false, 350); user(i + (dx < 0 ? 1 : -1)); } };
    // tap/click a slide, or the Enlarge button, opens the lightbox (a swipe never counts as a tap)
    const enlarge = () => { touched = true; LB.open(figs, i, k => { go(k); sl.focus({ preventScroll:true }); }); };
    $('.dsl-track', sl).addEventListener('click', () => { if (!swiped) enlarge(); });
    const zb = $('.dsl-zoom', sl); if (zb) zb.addEventListener('click', enlarge);
    sl.addEventListener('touchstart', e => start(e.touches[0].clientX, e.touches[0].clientY, e.target), { passive:true });
    sl.addEventListener('touchend', e => end(e.changedTouches[0].clientX, e.changedTouches[0].clientY));
    sl.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') start(e.clientX, e.clientY, e.target); });
    sl.addEventListener('pointerup', e => { if (e.pointerType === 'mouse') end(e.clientX, e.clientY); });
    sl.addEventListener('pointerenter', () => hover = true); sl.addEventListener('pointerleave', () => hover = false);
    if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => visible = e.isIntersecting, { threshold:.4 }).observe(sl);
    if (!RM) setInterval(() => { if (visible && !hover && !touched && !document.hidden) go(i + 1); }, 5000);
    go(0);
  });

  // product film
  // Cloudflare Pages ignores HTTP Range requests, so a streamed MP4 can't be scrubbed. Play it streamed
  // straight away, fetch the whole file in the background, then swap to the local copy at the same
  // position; from then on the timeline can be dragged anywhere.
  const fd = $('#filmDlg'), fv = $('#filmVid');
  let seekable = false;
  function makeSeekable() {
    if (seekable) return; seekable = true;
    const src = (fv.querySelector('source') || fv).src;
    fetch(src).then(r => r.ok ? r.blob() : Promise.reject()).then(blob => {
      const t = fv.currentTime, playing = !fv.paused;
      fv.addEventListener('loadedmetadata', () => { fv.currentTime = t; if (playing) fv.play().catch(() => {}); }, { once:true });
      fv.src = URL.createObjectURL(blob);
    }).catch(() => { seekable = false; });
  }
  if (fd) {
    $('#filmBtn').addEventListener('click', () => { fd.showModal(); fv.play().catch(() => {}); makeSeekable(); });
    $('#filmX').addEventListener('click', () => fd.close());
    fd.addEventListener('click', e => { if (e.target === fd) fd.close(); });
    fd.addEventListener('close', () => fv.pause());
  }

  // feature cards: autoplay vignettes while visible
  if (window.OV) OV.mountAll($('main'));

  // showreel: plays each vignette once, then moves to the next tab
  const reel = $('#reel'); if (!reel || !window.OV || !C.reel.length) return;
  const view = $('#reelView'), tabs = $('#reelTabs'), cap = $('#reelCap'), slots = $$('.rg-t', tabs);
  C.reel.forEach((r, k) => {
    view.insertAdjacentHTML('beforeend', `<div data-ov="${r.ov}" aria-hidden="true"></div>`);
    const b = document.createElement('button');
    b.className = 'rtab'; b.type = 'button'; b.setAttribute('role', 'tab'); b.dataset.k = k;
    b.innerHTML = `<i>${String(k + 1).padStart(2, '0')}</i><b>${r.tab}</b>`; b.title = r.sub.replace(/<[^>]+>/g, '');
    (slots[r.group] || slots[0]).append(b);
  });
  const panes = $$('[data-ov]', view).map(el => (OV.mount(el), el));
  const tabEls = $$('.rtab', tabs);
  let cur = -1, token = 0, inView = false, prog;
  function show(k) {
    const my = ++token;
    panes.forEach((p, n) => { p.classList.toggle('on', n === k); if (n !== k && p._ov) p._ov.stop(); });
    tabEls.forEach((t, n) => { t.setAttribute('aria-selected', n === k); t.style.setProperty('--pf', n < k ? 1 : 0); });
    cap.innerHTML = ''; cap.append(C.reel[k].cap); const sm = document.createElement('small'); sm.innerHTML = C.reel[k].sub; cap.append(sm); cur = k;
    if (tabs.scrollWidth > tabs.clientWidth) { const t = tabEls[k]; tabs.scrollTo({ left: t.offsetLeft - (tabs.clientWidth - t.offsetWidth) / 2, behavior: RM ? 'auto' : 'smooth' }); }
    if (!inView || RM || !panes[k]._ov) { tabEls[k].style.setProperty('--pf', 1); return; }
    const t0 = performance.now(), est = C.reel[k].est || 12000;
    cancelAnimationFrame(prog);
    const tick = now => { if (my !== token) return; tabEls[k].style.setProperty('--pf', Math.min(.96, (now - t0) / est)); prog = requestAnimationFrame(tick); };
    prog = requestAnimationFrame(tick);
    panes[k]._ov.once().then(() => { if (my !== token) return; tabEls[k].style.setProperty('--pf', 1); show((k + 1) % C.reel.length); });
  }
  tabs.addEventListener('click', e => { const b = e.target.closest('.rtab'); if (b) show(+b.dataset.k); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => {
      inView = en.isIntersecting;
      if (inView) show(cur < 0 ? 0 : cur); else { token++; panes.forEach(p => p._ov && p._ov.stop()); }
    }, { threshold:.25 }).observe(reel);
  } else { inView = true; show(0); }
})();
