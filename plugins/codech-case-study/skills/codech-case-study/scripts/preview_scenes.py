#!/usr/bin/env python3
"""Preview a project's vignette scenes: timed screenshots of each scene, large.

    python preview_scenes.py <site-root> <slug> [--scene search] [--times 1500,5000,9000,13000]

Writes work/<slug>/_qa/preview.html (all scenes on the dark stage; open it in a browser to watch)
and PNGs work/<slug>/_qa/scene-<name>-<ms>.png. Look at them: clipped panels, overlapping callouts,
empty opening frames and a cursor clicking empty space only show up visually.
Reports scene errors and "OV: no scene" warnings.
"""
import argparse, asyncio, functools, http.server, pathlib, re, threading

PAGE = """<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{slug} scenes</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap">
<link rel="stylesheet" href="../../_shared/ov.css"><link rel="stylesheet" href="../assets/scenes.css">
<style>body{{margin:0;background:#f3f1ec;font-family:Manrope}}.g{{display:grid;grid-template-columns:repeat(auto-fill,minmax(560px,1fr));gap:20px;padding:20px}}
.c{{border-radius:22px;background:linear-gradient(150deg,#0b1f35,#12365f 55%,#1d4ed8);overflow:hidden}}.c > .lbl{{margin:0;padding:10px 16px;color:#fff;font:600 13px Manrope}}</style></head>
<body><div class="g" id="g"></div>
<script src="../../_shared/ov.js"></script><script src="../assets/scenes.js"></script>
<script>const one=new URLSearchParams(location.search).get('v');
const names=OV.names().filter(n=>n.startsWith('{slug}:')&&(!one||n.endsWith(':'+one)));
g.innerHTML=names.map(n=>`<div class="c"${{one?' style="width:900px"':''}}><div class="lbl">${{n}}</div><div data-ov="${{n}}"></div></div>`).join('');
OV.mountAll().forEach(a=>a.play());</script></body></html>"""

class _Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass

def serve(root):
    h = functools.partial(_Quiet, directory=str(root))
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), h); threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, srv.server_address[1]

async def run(port, slug, scenes, times, out):
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for s in scenes:
            pg = await b.new_page(viewport={"width": 940, "height": 720}); log = []
            pg.on("pageerror", lambda e: log.append(str(e)))
            pg.on("console", lambda m: m.type in ("error", "warning") and log.append(m.text))
            await pg.goto(f"http://127.0.0.1:{port}/work/{slug}/_qa/preview.html?v={s}", wait_until="networkidle")
            t = 0
            for at in times:
                await pg.wait_for_timeout(at - t); t = at
                await pg.screenshot(path=str(out / f"scene-{s}-{at}.png"))
            print(f"{s}: {len(times)} shots" + ("; problems: " + " | ".join(log) if log else ""))
            await pg.close()
        await b.close()

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("site"); ap.add_argument("slug"); ap.add_argument("--scene")
    ap.add_argument("--times", default="1500,5000,9000,13000"); o = ap.parse_args()
    root = pathlib.Path(o.site); base = root / "work" / o.slug; out = base / "_qa"; out.mkdir(parents=True, exist_ok=True)
    (out / "preview.html").write_text(PAGE.format(slug=o.slug), encoding="utf-8")
    src = (base / "assets" / "scenes.js").read_text(encoding="utf-8")
    names = [o.scene] if o.scene else re.findall(r"\bV\.(\w+)\s*=\s*\{", src) or re.findall(r"OV\.define\([^,]+,\s*'(\w+)'", src)
    if not (root / "work" / "_shared" / "ov.js").exists():
        raise SystemExit("work/_shared/ov.js missing: run build_case.py once (it syncs the shared engine)")
    srv, port = serve(root)
    try: asyncio.run(run(port, o.slug, names, [int(x) for x in o.times.split(",")], out))
    finally: srv.shutdown()
    print(f"preview page: work/{o.slug}/_qa/preview.html  shots in {out}")

if __name__ == "__main__":
    import sys as _s; _s.stdout.reconfigure(encoding="utf-8", errors="replace")
    main()
