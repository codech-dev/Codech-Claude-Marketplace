/* Codech product-vignette engine (shared by every case study).
   A vignette is a small animated recreation of a real product screen, drawn on a
   fixed 600x420 stage and scaled to fit its container.

   Scenes live in each project's scenes.js and register themselves:
     OV.define('<project-slug>', '<scene>', { cls, hold, html, async run(T) {...} })
   Mount with:  <div data-ov="<project-slug>:<scene>" data-autoplay></div>  then OV.mountAll()
   Each element gets el._ov = { play(), stop(), once() }; data-autoplay loops while on screen.
   window.OV_SPEED speeds everything up (the film recorder uses 1.2-1.3). */
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const W = 600, STOP = Symbol('stop');
  const SP = () => window.OV_SPEED || 1; // playback speed (the film sets 1.2)

  const P = {
    search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    file:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
    folder:'<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    folderp:'<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M12 11v5M9.5 13.5h5"/>',
    lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    spark:'<path d="M12 2.5l2.1 6.4 6.4 2.1-6.4 2.1L12 19.5l-2.1-6.4L3.5 11l6.4-2.1z"/>',
    send:'<path d="M5 12h14M13 6l6 6-6 6"/>',
    plane:'<path d="M21 3 3 10.5l7 2.5 2.5 7z"/><path d="m10 13 4.5-4.5"/>',
    check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    hash:'<path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16"/>',
    at:'<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>',
    mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    clip:'<path d="m20 11.5-8.2 8.2a5 5 0 0 1-7.1-7.1l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.4 8.4a1.7 1.7 0 0 1-2.4-2.4l7.6-7.6"/>',
    upload:'<path d="M12 16V4M6 10l6-6 6 6M4 20h16"/>',
    warn:'<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5v.3"/>',
    x:'<path d="M6 6l12 12M18 6 6 18"/>',
    ban:'<circle cx="12" cy="12" r="8.5"/><path d="m6 6 12 12"/>',
    doc:'<rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    useradd:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M19 8v6M16 11h6"/>',
    shield:'<path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6z"/><path d="m9 12 2 2 4-4"/>'
  };
  const FILLED = new Set(['spark', 'folder']);
  const icon = (n, path, filled) => { P[n] = path; if (filled) FILLED.add(n); };
  const ic = (n, c = '') => `<svg class="ovi${FILLED.has(n) ? ' fill' : ''}${c ? ' ' + c : ''}" viewBox="0 0 24 24" aria-hidden="true">${P[n]}</svg>`;
  const CUR = '<svg viewBox="0 0 24 24"><path d="M4 2.5 20.5 12.2l-7.4 1.7-3.6 7.6z" fill="#0f172a" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"/></svg><i></i>';
  const note = (t, cls = '') => `<div class="ov-note pop ${cls}">${ic('spark')}${t}</div>`;
  const pdf = (k = '') => `<span class="ov-pdf ${k}"><span>${k === 'xls' ? 'XLS' : k === 'doc' ? '' : 'PDF'}</span></span>`;

  /* ------------------------------------------------------------ engine */
  function tools(stage, alive) {
    const scene = () => stage.querySelector('.ov-scene');
    const cur = stage.querySelector('.ov-cur');
    const q = s => scene().querySelector(s);
    const qa = s => [...scene().querySelectorAll(s)];
    const k = () => stage.getBoundingClientRect().width / W || 1;
    const wait = ms => new Promise(r => setTimeout(r, RM ? 0 : ms / SP())).then(() => { if (!alive()) throw STOP; });
    const rect = s => { const a = q(s).getBoundingClientRect(), b = stage.getBoundingClientRect(), kk = k(); return { x:(a.left - b.left) / kk, y:(a.top - b.top) / kk, w:a.width / kk, h:a.height / kk }; };
    let cx = 640, cy = 460;
    const place = (x, y, dur) => { cx = x; cy = y; cur.style.transitionDuration = RM ? '0ms' : dur / SP() + 'ms, 300ms'; cur.style.transform = `translate(${x - 4}px,${y - 3}px)`; };
    const T = {
      q, qa, wait, rect,
      add:(s, c) => q(s).classList.add(c), rm:(s, c) => q(s).classList.remove(c),
      show:s => q(s).classList.remove('gone'), hide:s => q(s).classList.add('gone'),
      in:(s) => q(s).classList.add('in'),
      reveal(s) { const e = q(s); e.classList.remove('gone'); void e.offsetWidth; e.classList.add('in'); },
      async stagger(s, gap, cls = 'in') { for (const e of qa(s)) { e.classList.add(cls); await wait(gap); } },
      cur(on, x, y) { if (x != null) place(x, y, 0); cur.classList.toggle('on', on && !RM); },
      async move(s, { fx = .5, fy = .5, dur } = {}) {
        const r = rect(s), x = r.x + r.w * fx, y = r.y + r.h * fy;
        const d = dur || Math.min(900, Math.max(420, Math.hypot(x - cx, y - cy) * 2.2));
        place(x, y, d); await wait(d + 40);
      },
      async click(s, o) { await T.move(s, o); cur.classList.add('down'); await wait(170); cur.classList.remove('down'); await wait(60); },
      async type(s, text, cps = 22) {
        const e = q(s); if (RM) { e.textContent = text; return; }
        for (let i = 1; i <= text.length; i++) { e.textContent = text.slice(0, i); await wait(1000 / cps + (cps < 60 ? Math.random() * 30 : 0)); }
      }
    };
    return T;
  }

  const V = {};
  const define = (project, name, scene) => { V[project + ':' + name] = Object.assign({ project }, scene); };

  function mount(el) {
    if (el._ov) return el._ov;
    const name = el.dataset.ov, S = V[name];
    if (!S) { console.warn('OV: no scene "' + name + '" (is its scenes.js loaded?)'); return null; }
    el.classList.add('ov', 'ovp-' + S.project, S.cls); if (RM) el.classList.add('ov-rm');
    el.setAttribute('role', 'img');
    el.innerHTML = `<div class="ov-stage"><div class="ov-scene"></div><div class="ov-cur" aria-hidden="true">${CUR}</div></div>`;
    const stage = el.firstElementChild, scene = stage.firstElementChild;
    const fit = () => stage.style.setProperty('--k', el.clientWidth / W);
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(el); fit();
    let gen = 0;
    const reset = () => { scene.innerHTML = S.html; stage.querySelector('.ov-cur').classList.remove('on', 'down'); };
    reset();
    async function cycle(id) {
      const alive = () => id === gen, T = tools(stage, alive);
      reset(); await S.run.call(S, T); await T.wait(S.hold || 2400);
    }
    const api = {
      playing:false,
      play() { if (api.playing) return; api.playing = true; const id = ++gen; (async () => { try { while (id === gen) await cycle(id); } catch (e) { if (e !== STOP) console.error(e); } })(); },
      once() { api.playing = true; const id = ++gen; return cycle(id).then(() => { if (id === gen) api.playing = false; }, e => { if (e !== STOP) console.error(e); }); },
      stop() { api.playing = false; gen++; }
    };
    el._ov = api;
    if (RM) { cycle(++gen).catch(() => {}); api.play = api.once = () => Promise.resolve(); return api; }
    if (el.hasAttribute('data-autoplay') && 'IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => en.isIntersecting ? api.play() : api.stop(), { threshold:.35 }).observe(el);
    }
    return api;
  }

  window.OV = {
    define, icon, mount,
    mountAll:(root = document) => [...root.querySelectorAll('[data-ov]')].map(mount).filter(Boolean),
    names:() => Object.keys(V),
    h:{ ic, note, pdf }
  };
})();
