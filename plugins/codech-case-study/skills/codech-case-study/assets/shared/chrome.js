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
