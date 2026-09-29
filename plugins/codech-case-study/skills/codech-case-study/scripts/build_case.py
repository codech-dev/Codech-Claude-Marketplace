#!/usr/bin/env python3
"""Render a Codech case study from its case.json.

    python build_case.py <site-root> <slug>            # e.g. site/codech-ai-landing otso-ai-hub

Reads   <site>/work/<slug>/case.json
Writes  <site>/work/<slug>/index.html        (the case-study page)
        <site>/work/<slug>/_film/film.html   (recording stage for record_film.py; never deployed)
Syncs   <skill>/assets/shared/* -> <site>/work/_shared/  (engine + page styles, same for every case)

Copy fields are trusted, authored HTML (inline <b>, <em>, links are fine). Bare '&' is escaped for you.
Missing optional sections (problem, decision, pipeline, delivery, engineering, film) are simply skipped.
"""
import html, json, pathlib, re, shutil, sys

SKILL = pathlib.Path(__file__).resolve().parent.parent
SHARED = SKILL / "assets" / "shared"

ICONS = {
    "folder": '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    "search": '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    "chat": '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
    "upload": '<path d="M12 16V4M6 10l6-6 6 6M4 20h16"/>',
    "doc": '<rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    "graph": '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.3 11 15.7 7M8.3 13l7.4 4"/>',
    "spark": '<path d="M12 2.5l2.1 6.4 6.4 2.1-6.4 2.1L12 19.5l-2.1-6.4L3.5 11l6.4-2.1z"/>',
    "send": '<path d="M21 3 3 10.5l7 2.5 2.5 7z"/><path d="m10 13 4.5-4.5"/>',
    "shield": '<path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6z"/><path d="m9 12 2 2 4-4"/>',
    "lock": '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    "clock": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    "users": '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6"/>',
    "chart": '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    "cart": '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.5 12h12L22 7H6.2"/>',
    "calendar": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    "mail": '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    "bolt": '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    "database": '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    "globe": '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    "download": '<path d="M12 4v11M7 10l5 5 5-5M4 20h16"/>',
    "test": '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3"/><path d="M7.5 15h9"/>',
    "warn": '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5v.3"/>',
    "check": '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    "arrow": '<path d="M5 12h14M13 6l6 6-6 6"/>',
}

def ico(name, style=""):
    if name not in ICONS:
        raise SystemExit(f"unknown icon '{name}'. Available: {', '.join(sorted(ICONS))}")
    st = f' style="{style}"' if style else ""
    return f'<svg class="i" viewBox="0 0 24 24"{st}>{ICONS[name]}</svg>'

AMP = re.compile(r"&(?!#?\w+;)")
def t(s):  # authored HTML copy; escape stray ampersands only
    return AMP.sub("&amp;", s or "")
def a(s):  # attribute value
    return html.escape(re.sub(r"<[^>]+>", "", html.unescape(s or "")), quote=True)
def pill(status):
    return '<span class="pill live">Live</span>' if status == "live" else '<span class="pill build">In build</span>'

def page(c):
    slug = c["slug"]; cl = c["client"]; th = c.get("theme", {}); seo = c["seo"]
    site = c["site_url"].rstrip("/")
    has_film = (ROOT / "work" / slug / "assets" / "film.mp4").exists()
    num = iter(f"{n:02d}" for n in range(0, 20))
    out = []
    W = out.append

    theme = ";".join(f"--th-{k}:{v}" for k, v in th.items() if k in ("deep", "mid", "end", "glow", "soft"))
    if th.get("accent"): theme += f";--blue:{th['accent']}"
    reel, deck_hints = [], []

    W(f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<!-- Built by codech-case-study/build_case.py from case.json. Edit case.json and rebuild; don't hand-edit. -->
<title>{a(seo['title'])}</title>
<meta name="description" content="{a(seo['description'])}">
<meta property="og:title" content="{a(seo.get('og_title', seo['title']))}">
<meta property="og:description" content="{a(seo.get('og_description', seo['description']))}">
<meta property="og:type" content="article">
<meta property="og:image" content="{site}/work/{slug}/assets/og-cover.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="../../codech-logo-ink.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap">
<link rel="stylesheet" href="../_shared/ov.css">
<link rel="stylesheet" href="../_shared/case.css">
<link rel="stylesheet" href="assets/scenes.css">
<style>:root{{{theme}}}</style>
</head>
<body>

<nav class="nav" id="nav">
  <div class="wrap">
    <a class="brand" href="../../" aria-label="Codech home"><img src="../../codech-logo-ink.png" alt="Codech" width="56" height="40"></a>
    <span class="crumb">Results {ico('arrow','width:14px;height:14px')} <b>{t(c['product'])}</b></span>
    <span class="sp"></span>
    <a class="back" href="../../#stories"><svg class="i" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>All results</a>
    <a class="btn btn-dark btn-sm" href="../../#audit">Book a free AI audit</a>
  </div>
</nav>

<main>
<header class="hero wrap">
  <div class="tags rv">{'<span class="pill live">Live in production</span>' if c.get('status') == 'live' else '<span class="pill build">In build</span>'}<span class="pill" style="background:#fff;border:1px solid var(--line);color:var(--muted)">{t(c['industry'])} · Case study</span></div>
  <h1 class="h-xl rv">{t(c['hero']['headline'])}</h1>
  <p class="sub rv">{t(c['hero']['sub'])}</p>""")

    who = t(cl['name']) if cl.get("named_publicly", True) else t(cl.get("anonymous_name", "Client"))
    logo = f'<img src="{a(cl["logo"])}" alt="{a(cl["name"])} logo" width="74" height="37">' if cl.get("named_publicly", True) and cl.get("logo") else ""
    detail = " · ".join(x for x in [cl.get("descriptor"), cl.get("hero_detail")] if x)
    film_btn = ""
    if has_film:
        film_btn = f"""
    <button class="film-btn" type="button" id="filmBtn"><span class="pl"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg></span><span><b>{t(c.get('film', {}).get('button_label', 'Play the showcase demo'))}</b><small>{t(c.get('film', {}).get('duration_label', 'Product tour video'))}</small></span></button>"""
    W(f"""  <div class="hero-row rv"><div class="client">{logo}<div><b>{who}</b><span>{t(detail)}</span></div></div>{film_btn}</div>
""")

    groups = c["groups"]
    for gi, g in enumerate(groups):
        for f in g["features"]:
            r = f.get("reel")
            if r is not None:
                reel.append({"ov": f"{slug}:{f['scene']}", "tab": t(r["tab"]), "sub": t(r["sub"]), "cap": re.sub(r"<[^>]+>", "", html.unescape(t(r["cap"]))), "est": r.get("est", 12000), "group": gi})
    if reel:
        rgs = "\n".join(f'      <div class="rg" style="--c:{max(1, sum(1 for f in g["features"] if f.get("reel") is not None))}"><div class="reel-grp">{t(g["name"])} {pill(g.get("status","live"))}</div><div class="rg-t"></div></div>' for g in groups)
        W(f"""  <div class="reel rv" id="reel">
    <div class="reel-stage">
      <div class="reel-view" id="reelView"><div class="sizer"></div></div>
      <p class="reel-cap" id="reelCap" aria-live="polite"></p>
    </div>
    <div class="reel-tabs" role="tablist" aria-label="Product features" id="reelTabs" style="--g:{min(len(groups), 3)}">
{rgs}
    </div>
  </div>
""")
    if c.get("stats"):
        # Impact bento: first stat is the lead tile (dark, optional milestone timeline), the rest are icon tiles.
        # A stat is [value, label] or [value, label, icon]; values count up on reveal (case.js).
        lead, rest = c["stats"][0], c["stats"][1:]
        tl = c.get("stats_timeline") or []
        steps = "".join(f'<li{" class=\"on\"" if i == len(tl) - 1 else ""}><b>{t(d)}</b><span>{t(l)}</span></li>' for i, (d, l) in enumerate(tl))
        tl_html = f'<ol class="st-tl">{steps}</ol>' if tl else ""
        tiles = "\n".join(f'    <div class="st-tile rv">{("<span class=\"ic\">" + ico(s[2]) + "</span>") if len(s) > 2 else ""}<b data-count>{t(s[0])}</b><span>{t(s[1])}</span></div>' for s in rest)
        W(f'''  <div class="stats-bento" style="--n:{len(rest)}">
    <div class="st-lead rv"><p class="k">{t(c.get("stats_eyebrow", "Delivery"))}</p><b data-count>{t(lead[0])}</b><span>{t(lead[1])}</span>{tl_html}</div>
{tiles}
  </div>
''')
    W("</header>\n")

    if c.get("problem"):
        p = c["problem"]; n = next(num)
        items = "\n".join(f'    <div class="prob rv"><span class="ic">{ico(i["icon"])}</span><h3>{t(i["title"])}</h3><p>{t(i["body"])}</p></div>' for i in p["items"])
        W(f"""
<section class="sec wrap" id="problem">
  <div class="sec-head rv"><p class="eyebrow"><span class="n">{n}</span>{t(p.get('eyebrow','The problem'))}</p><h2 class="h-lg">{t(p['h2'])}</h2></div>
  <div class="problems">
{items}
  </div>
</section>
""")
    else:
        next(num)

    chk = ico("check")
    for g in groups:
        n = next(num); tint = "t-" + g.get("tint", "blue")
        arts = []
        for fi, f in enumerate(g["features"]):
            wide = f.get("wide", fi == 0)
            art = f'<div class="art"><div data-ov="{slug}:{f["scene"]}" data-autoplay aria-label="{a(f.get("aria", f["title"]))}"></div></div>'
            bul = ""
            if f.get("bullets"):
                bul = '\n      <ul class="bul">' + "".join(f"<li>{chk}{t(b)}</li>" for b in f["bullets"]) + "</ul>"
            txt = f'<div class="txt"><p class="k">{t(f["k"])}</p><h3>{t(f["title"])}</h3><p>{t(f["body"])}</p>{bul}</div>'
            if wide:
                arts.append(f'    <article class="feat wide {tint} rv">{txt}\n      {art}</article>')
            else:
                arts.append(f'    <article class="feat {tint} rv">{art}\n      {txt}</article>')
        note = ""
        if g.get("note"):
            note = f'\n  <p class="build-note rv">{ico("warn")}{t(g["note"])}</p>'
        W(f"""
<section class="sec wrap" id="{a(g['id'])}">
  <div class="sec-head rv"><p class="eyebrow"><span class="n">{n}</span>{t(g['name'])} {pill(g.get('status','live'))}</p><h2 class="h-lg">{t(g['h2'])}</h2><p class="sub">{t(g['sub'])}</p></div>
  <div class="feats">
{chr(10).join(arts)}
  </div>{note}
</section>
""")

    if c.get("decision"):
        d = c["decision"]; steps = []
        for i, s in enumerate(d.get("flow", [])):
            if i: steps.append(f'      <div class="ar">{ico("arrow")}</div>')
            body = f'<span>{t(s["body"])}</span>' if s.get("body") else ""
            if s.get("results"):
                body += '<div class="res">' + "".join(f'<i{"" if k == "yes" else " class=\"no\""}>{t(v)}</i>' for k, v in s["results"]) + "</div>"
            steps.append(f'      <div class="st"><span class="ic">{ico(s["icon"])}</span><b>{t(s["title"])}</b>{body}</div>')
        cols = "\n".join(f"      <p>{t(p)}</p>" for p in d.get("paras", []))
        flow = f'\n    <div class="flow">\n{chr(10).join(steps)}\n    </div>' if steps else ""
        W(f"""
<div class="wrap">
  <section class="dark rv" id="decision">
    <p class="eyebrow">{t(d.get('eyebrow','The key design decision'))}</p>
    <blockquote>{t(d['quote'])}</blockquote>
    <div class="cols">
{cols}
    </div>{flow}
  </section>
</div>
""")

    if c.get("pipeline"):
        p = c["pipeline"]; n = next(num)
        nodes = "\n".join(f'    <div class="n{" ai" if x.get("ai") else ""}"><span class="ic">{ico(x["icon"])}</span><b>{t(x["title"])}</b><span>{t(x["body"])}</span></div>' for x in p["nodes"])
        notes = "\n".join(f"    <div><b>{t(h)}</b> {t(b)}</div>" for h, b in p.get("notes", []))
        W(f"""
<section class="sec wrap" id="how">
  <div class="sec-head rv"><p class="eyebrow"><span class="n">{n}</span>{t(p.get('eyebrow','How it works'))}</p><h2 class="h-lg">{t(p['h2'])}</h2><p class="sub">{t(p.get('sub',''))}</p></div>
  <div class="pipe rv" style="--n:{len(p['nodes'])}">
{nodes}
  </div>
  <div class="pipe-note rv">
{notes}
  </div>
</section>
""")

    if c.get("delivery"):
        d = c["delivery"]; n = next(num)
        tabs, panes = [], []
        for i, tb in enumerate(d.get("tabs", [])):
            tabs.append(f'      <button class="dtab" type="button" role="tab" aria-selected="{"true" if i == 0 else "false"}" data-k="{i}"><span class="n">{i+1:02d}</span><b>{t(tb["title"])}</b><small>{t(tb["sub"])}</small></button>')
            minw = f' data-minw="{tb["minw"]}"' if tb.get("minw") else ""
            panes.append(f'        <div class="pane{" on" if i == 0 else ""}"{minw} data-src="{a(tb["src"])}" data-url="{a(tb["label"])}"><span class="ld">Loading…</span></div>')
            deck_hints.append(re.sub(r"<[^>]+>", "", tb.get("hint", "Scroll inside to explore")))
        steps = "\n".join(f'    <div class="rv"><span>STEP {i+1:02d}</span><b>{t(h)}</b><p>{t(b)}</p></div>' for i, (h, b) in enumerate(d.get("steps", [])))
        deck = ""
        if tabs:
            deck = f"""
  <div class="deck rv" id="deck">
    <div class="deck-tabs" role="tablist" aria-label="Delivery artefacts" style="--n:{len(tabs)}">
{chr(10).join(tabs)}
    </div>
    <div class="deck-win">
      <div class="deck-bar"><i></i><i></i><i></i><span class="url">{ico('lock')}<span id="deckUrl"></span></span><button class="deck-full" id="deckFull" type="button" aria-pressed="false"><span>Full screen</span><svg class="i ex" viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg><svg class="i co" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>
      <div class="deck-view" id="deckView">
{chr(10).join(panes)}
        <div class="deck-hint" id="deckHint"><svg class="i" viewBox="0 0 24 24"><rect x="7" y="3" width="10" height="18" rx="5"/><path d="M12 7v3"/></svg><span></span></div>
      </div>
    </div>
    <p class="deck-foot">{t(d.get('foot',''))}</p>
  </div>"""
        W(f"""
<section class="sec wrap" id="process">
  <div class="sec-head rv"><p class="eyebrow"><span class="n">{n}</span>{t(d.get('eyebrow','How we delivered'))}</p><h2 class="h-lg">{t(d['h2'])}</h2><p class="sub">{t(d.get('sub',''))}</p></div>{deck}
  <div class="steps3">
{steps}
  </div>
</section>
""")

    if c.get("engineering"):
        e = c["engineering"]; n = next(num)
        cards = "\n".join(f'    <div class="rv"><b>{t(h)}</b><p>{t(b)}</p></div>' for h, b in e.get("cards", []))
        stack = "".join(f"<span>{t(s)}</span>" for s in e.get("stack", []))
        W(f"""
<section class="sec wrap" id="eng">
  <div class="sec-head rv"><p class="eyebrow"><span class="n">{n}</span>{t(e.get('eyebrow','Under the hood'))}</p><h2 class="h-lg">{t(e['h2'])}</h2></div>
  <div class="eng">
{cards}
  </div>
  <div class="stack rv">{stack}</div>
</section>
""")

    cta = c.get("cta", {})
    W(f"""
<div class="wrap">
  <section class="cta rv">
    <div><h2 class="h-lg">{t(cta.get('h2','Want results like these?'))}</h2><p>{t(cta.get('body',''))}</p></div>
    <div class="acts"><a class="btn btn-light" href="../../#audit">Book a free AI audit</a><a class="btn btn-line" href="../../#stories">More results</a></div>
  </section>
</div>
</main>
""")
    if has_film:
        W(f"""
<dialog class="film-dlg" id="filmDlg" aria-label="{a(c['product'])} product film">
  <button class="x" type="button" id="filmX" aria-label="Close film"><svg class="i" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
  <video id="filmVid" controls playsinline preload="none" poster="assets/film-poster.jpg" width="1920" height="1080">
    <source src="assets/film.mp4" type="video/mp4">
  </video>
</dialog>
""")
    W(f"""
<footer><div class="wrap">
  <p>{t(c.get('footer_note',''))}</p>
  <p>© {c.get('year', 2026)} Codech Solutions</p>
</div></footer>

<script>window.CASE = {json.dumps({"reel": reel, "deckHints": deck_hints}, ensure_ascii=False)};</script>
<script src="../_shared/ov.js"></script>
<script src="assets/scenes.js"></script>
<script src="../_shared/case.js"></script>
</body>
</html>
""")
    return "".join(out)

def film(c):
    """Recording stage: fills the film template with this case's scenes and copy."""
    slug = c["slug"]; f = c.get("film", {}); th = c.get("theme", {})
    scenes = []
    for g in c["groups"]:
        for x in g["features"]:
            fm = x.get("film")
            if fm is None: continue
            scenes.append({"ov": f"{slug}:{x['scene']}", "scene": x["scene"], "label": fm["label"], "group": g["name"],
                           "status": g.get("status", "live"), "cap": fm["cap"], "sub": fm["sub"]})
    data = {"product": c["product"], "tagline": f.get("tagline", c["hero"]["headline"]),
            "logo": "../" + c["client"]["logo"] if c["client"].get("named_publicly", True) else "",
            "scenes": scenes, "social": f.get("social_scenes", [s["scene"] for s in scenes[:3]]),
            "outroStats": f.get("outro_stats", []), "outroLine": f.get("outro_line", ""), "outroCta": f.get("outro_cta", "Book a free AI audit with Codech")}
    tpl = (SHARED / "film-template.html").read_text(encoding="utf-8")
    theme = ";".join(f"--th-{k}:{v}" for k, v in th.items() if k in ("deep", "mid", "end", "glow"))
    return tpl.replace("/*__FILM_DATA__*/null", json.dumps(data, ensure_ascii=False)).replace("/*__THEME__*/", theme)

if __name__ == "__main__":
    import sys as _s; _s.stdout.reconfigure(encoding="utf-8", errors="replace")
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    ROOT = pathlib.Path(sys.argv[1]); slug = sys.argv[2]
    base = ROOT / "work" / slug
    c = json.loads((base / "case.json").read_text(encoding="utf-8"))
    assert c["slug"] == slug, "case.json slug must match the folder name"
    for need in ["assets/scenes.js", "assets/scenes.css"]:
        if not (base / need).exists():
            sys.exit(f"missing {base / need}: write the project's scenes first (see references/vignettes.md)")
    shared = ROOT / "work" / "_shared"; shared.mkdir(parents=True, exist_ok=True)
    for fname in ["ov.js", "ov.css", "case.css", "case.js"]:
        shutil.copyfile(SHARED / fname, shared / fname)
    (base / "index.html").write_text(page(c), encoding="utf-8")
    (base / "_film").mkdir(exist_ok=True)
    (base / "_film" / "film.html").write_text(film(c), encoding="utf-8")
    if not c["client"].get("consent_confirmed"):
        print("WARNING: client.consent_confirmed is false. Confirm the client may be named before sharing this page.")
    print(f"built {base / 'index.html'} and _film/film.html; shared assets synced to {shared}")
