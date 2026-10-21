/* Codech site chrome on case-study pages: the landing page's header + footer (copied in by build_case.py)
   need the landing's behaviour. Audit and chat live on the landing page, so their buttons deep-link there. */
(() => {
  const $ = s => document.querySelector(s);
  const hdr = $('#hdr'); if (!hdr) return;
  const ann = $('#ann'), pad = $('.chrome-pad'), home = hdr.dataset.home || '../../';
  let annH = ann ? ann.offsetHeight : 0;
  const place = () => { hdr.style.top = Math.max(0, annH - scrollY) + 'px'; hdr.classList.toggle('float', scrollY > 24); };
  addEventListener('scroll', place, { passive:true }); place();
  const x = $('#annX');
  if (x) x.addEventListener('click', () => { ann.remove(); annH = 0; if (pad) pad.classList.add('no-ann'); place(); });
  const mb = $('#menuBtn'), mm = $('#mmenu');
  if (mb && mm) {
    mb.addEventListener('click', () => { const o = mb.getAttribute('aria-expanded') !== 'true'; mb.setAttribute('aria-expanded', o); mm.hidden = !o; });
    mm.addEventListener('click', e => { if (e.target.closest('a,button')) { mb.setAttribute('aria-expanded', 'false'); mm.hidden = true; } });
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-audit]'), c = e.target.closest('[data-chat]');
    if (c && document.getElementById('cw')) return;  // chat widget is on this page (chrome-chat.js handles it)
    if (a || c) { e.preventDefault(); location.href = home + (a ? '#audit' : '#chat'); }
  });
  const cp = $('#copyEmail'), em = $('#email');
  if (cp && em) cp.addEventListener('click', () => {
    const done = l => { cp.textContent = l; setTimeout(() => cp.textContent = 'Copy', 1800); };
    const fb = () => { const r = document.createRange(); r.selectNodeContents(em); const s = getSelection(); s.removeAllRanges(); s.addRange(r); done('Selected'); };
    try { navigator.clipboard.writeText(em.textContent).then(() => done('Copied'), fb); } catch (err) { fb(); }
  });
  const yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();
})();
/* Nav dropdowns + active section (the landing's behaviour). Here, not in chrome-chat.js: prod drops that file when the chat is hidden. */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const dds = $$('.nav .dd');
  const set = (dd, o) => { dd.classList.toggle('open', o); $('.dd-t', dd).setAttribute('aria-expanded', o); };
  const hover = matchMedia('(hover: hover)').matches;
  dds.forEach(dd => {
    let tm, opened = 0;
    $('.dd-t', dd).addEventListener('click', () => { if (Date.now() - opened < 400) return; set(dd, !dd.classList.contains('open')); });
    if (hover) {
      dd.addEventListener('mouseenter', () => { clearTimeout(tm); if (!dd.classList.contains('open')) opened = Date.now(); dds.forEach(x => set(x, x === dd)); });
      dd.addEventListener('mouseleave', () => { tm = setTimeout(() => set(dd, false), 180); });
    }
    dd.addEventListener('focusout', e => { if (!dd.contains(e.relatedTarget)) set(dd, false); });
  });
  document.addEventListener('click', e => dds.forEach(dd => { if (!dd.contains(e.target)) set(dd, false); }));
  document.addEventListener('keydown', e => { if (e.key !== 'Escape') return; dds.forEach(dd => { if (dd.classList.contains('open')) { set(dd, false); $('.dd-t', dd).focus(); } }); });
  // Mark where we are: gold underline on the section, aria-current on the exact link.
  const p = location.pathname.replace(/index\.html$/, '');
  const key = /^\/(solutions|industries|services)\//.test(p) ? 'solutions' : /^\/(work|case-studies|projects)\//.test(p) ? 'work' : /^\/how-we-work\//.test(p) ? 'how'
    : /^\/(roi-calculator|integrations|faq)\//.test(p) ? 'resources' : /^\/about\//.test(p) ? 'about' : /^\/contact\//.test(p) ? 'contact' : '';
  if (key) $$('[data-nav="' + key + '"]').forEach(el => el.classList.add('cur'));
  $$('.hdr a[href^="/"]').forEach(a => { if (a.getAttribute('href') === p) a.setAttribute('aria-current', 'page'); });
})();
