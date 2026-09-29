/* Codech case-study page — shared behaviour for work/<slug>/index.html.
   Reads window.CASE (written by build_case.py): { reel:[{ov, tab, sub, cap, est, group}], deckHints:[...] }.
   Needs work/_shared/ov.js and the project's scenes.js loaded first. */
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const C = window.CASE || { reel:[], deckHints:[] };

  // sticky nav shadow
  const nav = $('#nav'); const onScroll = () => nav.classList.toggle('stuck', scrollY > 10);
  addEventListener('scroll', onScroll, { passive:true }); onScroll();

  // reveal on scroll; anything already on screen shows at once (no blank hero)
  if ('IntersectionObserver' in window && !RM) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold:.12, rootMargin:'0px 0px -40px' });
    $$('.rv').forEach(el => el.getBoundingClientRect().top < innerHeight ? requestAnimationFrame(() => el.classList.add('in')) : io.observe(el));
  } else $$('.rv').forEach(el => el.classList.add('in'));

  // delivery deck: embeds the proposal / prototype, rendered at desktop width and scaled to fit.
  // Phones get the embedded page's own mobile layout (native width) unless a pane sets data-minw.
  (() => {
    const view = $('#deckView'); if (!view) return;
    const panes = $$('.pane', view), tabs = $$('.dtab'), hint = $('#deckHint');
    let cur = 0, seen = false, ht;
    const fit = f => {
      const w = view.clientWidth, h = view.clientHeight, W = w >= 900 ? 1440 : Math.max(w, +(f.parentElement.dataset.minw || 0)), k = w / W;
      f.style.width = W + 'px'; f.style.height = (h / k) + 'px'; f.style.transform = `scale(${k})`;
    };
    const load = p => {
      if (p.querySelector('iframe')) return;
      const f = document.createElement('iframe');
      f.src = p.dataset.src; f.title = p.dataset.url; f.referrerPolicy = 'no-referrer';
      f.addEventListener('load', () => { const l = p.querySelector('.ld'); if (l) l.remove(); });
      p.append(f); fit(f);
    };
    function show(k) {
      cur = k;
      tabs.forEach((t, n) => t.setAttribute('aria-selected', n === k));
      panes.forEach((p, n) => p.classList.toggle('on', n === k));
      $('#deckUrl').textContent = panes[k].dataset.url;
      if (seen) load(panes[k]);
      hint.querySelector('span').textContent = (C.deckHints || [])[k] || 'Scroll inside to explore';
      hint.classList.remove('off'); clearTimeout(ht); ht = setTimeout(() => hint.classList.add('off'), 4500);
    }
    tabs.forEach(t => t.addEventListener('click', () => show(+t.dataset.k)));
    // full screen pins the same window as a fixed overlay; it is never moved in the DOM, so frames don't reload
    const win = view.closest('.deck-win'), btn = $('#deckFull'), shade = document.createElement('div');
    shade.className = 'deck-shade'; document.body.append(shade);
    let full = false;
    const refit = () => requestAnimationFrame(() => $$('iframe', view).forEach(fit));
    function setFull(on) {
      if (on === full) return; full = on;
      win.classList.toggle('full', on); shade.classList.toggle('on', on); document.body.classList.toggle('deck-lock', on);
      btn.setAttribute('aria-pressed', on); btn.querySelector('span').textContent = on ? 'Close' : 'Full screen';
      refit();
    }
    btn.addEventListener('click', () => setFull(!full));
    shade.addEventListener('click', () => setFull(false));
    addEventListener('keydown', e => { if (e.key === 'Escape') setFull(false); });
    view.addEventListener('pointerenter', () => hint.classList.add('off'));
    addEventListener('resize', () => $$('iframe', view).forEach(fit));
    show(0);
    const start = () => { if (seen) return; seen = true; show(cur); };
    if ('IntersectionObserver' in window) new IntersectionObserver(([e], o) => { if (e.isIntersecting) { start(); o.disconnect(); } }, { rootMargin:'400px 0px' }).observe(view);
    else start();
  })();

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
