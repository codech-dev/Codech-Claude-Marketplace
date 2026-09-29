#!/usr/bin/env python3
"""Capture a consistent set of screenshots of a prototype or running app for the portfolio pack.

    python capture_screens.py <plan.json> <out-dir>

plan.json (write it after clicking through the app yourself):
{
  "base": "http://localhost:3000",                 running app (paths below are appended to it)
  "serve": "C:/path/to/prototype-folder",          OR: serve a static folder locally (base is then ignored; paths like "/prototype.html")
  "viewport": [1440, 900], "scale": 2,               desktop default (2880x1800 files)
  "login": [{"fill": "#email", "text": "demo@x.com"}, {"fill": "#password", "text": "…"}, {"click": "button[type=submit]"}],
  "shots": [
    {"name": "02-home", "path": "/home"},
    {"name": "09-search", "path": "/search?q=KYC", "wait": 1500},
    {"name": "19-assistant", "path": "/home", "steps": [{"click": "text=Ask Assistant"}, {"wait": 800}]},
    {"name": "03-drive", "path": "/prototype.html", "steps": [{"eval": "showView('drive')"}]},     single-file prototypes: switch views with eval
    {"name": "mobile-drive", "path": "/drive", "viewport": [390, 844], "dir": "mobile"},
    {"name": "share-dialog", "path": "/doc/1", "steps": [{"click": "text=Share"}], "element": "[role=dialog]", "dir": "ui-screens"}
  ]
}
Step types: click, fill+text, press, hover, wait (ms), eval (JS), scroll (px). "element" crops to one element (PNG).
Full screens are saved as high-quality JPG in <out>/app-walkthrough/ unless "dir" says otherwise.
Use demo data only; never capture real client documents.
"""
import asyncio, functools, http.server, json, pathlib, sys, threading

class _Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass

async def run(plan, out, base):
    from playwright.async_api import async_playwright
    from PIL import Image
    async with async_playwright() as p:
        b = await p.chromium.launch()
        vw = plan.get("viewport", [1440, 900]); sc = plan.get("scale", 2)
        ctx = await b.new_context(viewport={"width": vw[0], "height": vw[1]}, device_scale_factor=sc)
        pg = await ctx.new_page(); errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        async def steps(page, ss):
            for st in ss or []:
                if "click" in st: await page.click(st["click"])
                elif "fill" in st: await page.fill(st["fill"], st.get("text", ""))
                elif "press" in st: await page.keyboard.press(st["press"])
                elif "hover" in st: await page.hover(st["hover"])
                elif "eval" in st: await page.evaluate(st["eval"])
                elif "scroll" in st: await page.mouse.wheel(0, st["scroll"])
                await page.wait_for_timeout(st.get("wait", 350))
        if plan.get("login"):
            await pg.goto(base + plan.get("login_path", "/login"), wait_until="networkidle"); await steps(pg, plan["login"])
        for s in plan["shots"]:
            page = pg
            if s.get("viewport"):
                c2 = await b.new_context(viewport={"width": s["viewport"][0], "height": s["viewport"][1]}, device_scale_factor=sc,
                                         storage_state=await ctx.storage_state())
                page = await c2.new_page()
            await page.goto(base + s.get("path", ""), wait_until="networkidle")
            await page.wait_for_timeout(s.get("wait", 800))
            await steps(page, s.get("steps"))
            d = out / s.get("dir", "app-walkthrough"); d.mkdir(parents=True, exist_ok=True)
            if s.get("element"):
                await page.locator(s["element"]).first.screenshot(path=str(d / f"{s['name']}.png"))
                print("element", d / f"{s['name']}.png")
            else:
                tmp = d / f"{s['name']}.png"; await page.screenshot(path=str(tmp), full_page=s.get("full", False))
                Image.open(tmp).convert("RGB").save(d / f"{s['name']}.jpg", quality=88, optimize=True); tmp.unlink()
                print("screen ", d / f"{s['name']}.jpg")
            if page is not pg: await page.context.close()
        await b.close()
    if errs: print("page errors:", *errs[:5], sep="\n  ")

def main():
    if len(sys.argv) != 3: sys.exit(__doc__)
    plan = json.loads(pathlib.Path(sys.argv[1]).read_text(encoding="utf-8")); out = pathlib.Path(sys.argv[2])
    srv = None; base = plan.get("base", "")
    if plan.get("serve"):
        h = functools.partial(_Quiet, directory=plan["serve"]); srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), h)
        threading.Thread(target=srv.serve_forever, daemon=True).start(); base = f"http://127.0.0.1:{srv.server_address[1]}"
    try: asyncio.run(run(plan, out, base.rstrip("/")))
    finally:
        if srv: srv.shutdown()

if __name__ == "__main__":
    import sys as _s; _s.stdout.reconfigure(encoding="utf-8", errors="replace")
    main()
