#!/usr/bin/env python3
"""Screenshot QA for a case study: case page (desktop + phone), landing card, film stage.

    python qa_shots.py <site-root> <slug> [--out <dir>]      # default out: work/<slug>/_qa/

Scrolls the page first so scroll-reveal content is visible, captures full-page shots split into
viewport-height parts, and prints: page errors, OV warnings (missing scenes), horizontal overflow,
and whether the embedded frames loaded. Read the PNGs afterwards; the numbers alone don't prove it looks right.
"""
import argparse, asyncio, functools, http.server, pathlib, threading

class _Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass

def serve(root):
    h = functools.partial(_Quiet, directory=str(root))
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), h); threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, srv.server_address[1]

async def run(port, slug, out):
    from playwright.async_api import async_playwright
    from PIL import Image
    base = f"http://127.0.0.1:{port}"
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for w, h, tag in [(1440, 900, "desktop"), (390, 844, "phone")]:
            pg = await b.new_page(viewport={"width": w, "height": h}); log = []
            pg.on("pageerror", lambda e: log.append("error: " + str(e)))
            pg.on("console", lambda m: m.type in ("error", "warning") and "cdn.tailwindcss.com should not be used" not in m.text and log.append(f"{m.type}: {m.text}"))
            # wait for first paint before scrolling: reveal-on-scroll only registers positions it has rendered
            await pg.goto(f"{base}/work/{slug}/", wait_until="networkidle"); await pg.wait_for_timeout(1500)
            await pg.evaluate("document.documentElement.style.scrollBehavior='auto'")
            H = await pg.evaluate("document.body.scrollHeight"); y = 0
            while y < H:
                await pg.evaluate(f"scrollTo(0,{y})"); await pg.wait_for_timeout(350); y += h // 2
            await pg.evaluate("scrollTo(0,0)")  # back to the top so the hero reel is playing in the shot
            await pg.wait_for_timeout(4000)
            full = out / f"case-{tag}.png"; await pg.screenshot(path=str(full), full_page=True)
            im = Image.open(full); W_, HH = im.size; step = 2400 if tag == "desktop" else 3000
            for k in range((HH + step - 1) // step):
                im.crop((0, k * step, W_, min(HH, (k + 1) * step))).save(out / f"case-{tag}-{k}.png")
            over = await pg.evaluate("document.documentElement.scrollWidth - innerWidth")
            frames = [f.url for f in pg.frames][1:]
            print(f"[{tag}] height {HH}px, horizontal overflow {over}px, frames loaded: {frames or 'none'}")
            for l in log: print("   ", l)
            # landing card
            await pg.goto(f"{base}/index.html#stories", wait_until="domcontentloaded"); await pg.wait_for_timeout(600)
            await pg.evaluate("document.querySelector('#stories').scrollIntoView()"); await pg.wait_for_timeout(5500)
            await pg.screenshot(path=str(out / f"landing-{tag}.png"))
        await b.close()

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("site"); ap.add_argument("slug"); ap.add_argument("--out")
    o = ap.parse_args(); root = pathlib.Path(o.site)
    out = pathlib.Path(o.out) if o.out else root / "work" / o.slug / "_qa"; out.mkdir(parents=True, exist_ok=True)
    srv, port = serve(root)
    try: asyncio.run(run(port, o.slug, out))
    finally: srv.shutdown()
    print(f"shots in {out}")

if __name__ == "__main__":
    import sys as _s; _s.stdout.reconfigure(encoding="utf-8", errors="replace")
    main()
