#!/usr/bin/env python3
"""Record the case-study film from work/<slug>/_film/film.html.

    python record_film.py <site-root> <slug> [--fmt wide|social|both] [--poster-at 10]

wide   -> work/<slug>/assets/film.mp4, film-poster.jpg, og-cover.jpg (1200x630)   (deployed)
social -> work/<slug>/_film/social.mp4 + social-poster.jpg                        (for LinkedIn/IG; not deployed)

How: Chrome's screencast (CDP) streams JPEG frames with timestamps while the page plays in real
time; frames are resampled to a steady 30 fps and encoded as H.264 (crf 20, +faststart).
Playwright's built-in recorder is avoided on purpose: it produces soft, blocky text.
Needs: pip install playwright imageio-ffmpeg pillow && python -m playwright install chromium
"""
import argparse, asyncio, base64, bisect, functools, http.server, pathlib, subprocess, threading

class _Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass

def serve(root):
    h = functools.partial(_Quiet, directory=str(root))
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), h)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, srv.server_address[1]

async def record(port, slug, fmt, out_mp4, poster_at):
    import imageio_ffmpeg
    from playwright.async_api import async_playwright
    W, H = (1920, 1080) if fmt == "wide" else (1080, 1350)
    frames = []
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--force-color-profile=srgb", "--hide-scrollbars"])
        pg = await b.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
        errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto(f"http://127.0.0.1:{port}/work/{slug}/_film/film.html?fmt={fmt}&rec=1", wait_until="networkidle")
        await pg.wait_for_timeout(1500)
        if errs: raise SystemExit("film page errors: " + "; ".join(errs))
        cdp = await pg.context.new_cdp_session(pg)
        async def on_frame(e):
            frames.append((e["metadata"]["timestamp"], base64.b64decode(e["data"])))
            try: await cdp.send("Page.screencastFrameAck", {"sessionId": e["sessionId"]})
            except Exception: pass
        cdp.on("Page.screencastFrame", lambda e: asyncio.ensure_future(on_frame(e)))
        await cdp.send("Page.startScreencast", {"format": "jpeg", "quality": 95, "maxWidth": W, "maxHeight": H, "everyNthFrame": 1})
        await pg.wait_for_timeout(300)
        await pg.evaluate("startFilm()")
        await pg.wait_for_function("window.FILM_DONE === true", timeout=300000, polling=500)
        await pg.wait_for_timeout(300)
        await cdp.send("Page.stopScreencast")
        await b.close()
    frames.sort(key=lambda f: f[0])
    t0 = frames[0][0]; ts = [f[0] - t0 for f in frames]; dur = ts[-1]
    print(f"{fmt}: {len(frames)} source frames over {dur:.1f}s (~{len(frames)/dur:.0f} fps)")
    cmd = [imageio_ffmpeg.get_ffmpeg_exe(), "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", "30", "-vcodec", "mjpeg", "-i", "-",
           "-vf", f"scale={W}:{H}:flags=lanczos,format=yuv420p", "-c:v", "libx264", "-preset", "slow", "-crf", "20",
           "-profile:v", "high", "-movflags", "+faststart", "-an", str(out_mp4)]
    pr = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for k in range(int(dur * 30)):
        pr.stdin.write(frames[max(0, bisect.bisect_right(ts, k / 30) - 1)][1])
    pr.stdin.close(); pr.wait()
    # poster: first scene with its results on screen (default 10 s in; adjust with --poster-at)
    return frames[max(0, bisect.bisect_right(ts, poster_at) - 1)][1], dur

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("site"); ap.add_argument("slug")
    ap.add_argument("--fmt", default="both", choices=["wide", "social", "both"]); ap.add_argument("--poster-at", type=float, default=10.0)
    o = ap.parse_args()
    from PIL import Image
    import io
    root = pathlib.Path(o.site); base = root / "work" / o.slug
    if not (base / "_film" / "film.html").exists():
        raise SystemExit("run build_case.py first (it writes _film/film.html)")
    srv, port = serve(root)
    try:
        if o.fmt in ("wide", "both"):
            jpg, dur = asyncio.run(record(port, o.slug, "wide", base / "assets" / "film.mp4", o.poster_at))
            im = Image.open(io.BytesIO(jpg)).convert("RGB")
            im.save(base / "assets" / "film-poster.jpg", quality=82, optimize=True)
            im.crop((0, 36, 1920, 1044)).resize((1200, 630), Image.LANCZOS).save(base / "assets" / "og-cover.jpg", quality=86)
            print(f"wide film {dur:.0f}s -> assets/film.mp4, film-poster.jpg, og-cover.jpg (check the poster isn't mid-fade)")
        if o.fmt in ("social", "both"):
            jpg, dur = asyncio.run(record(port, o.slug, "social", base / "_film" / "social.mp4", o.poster_at))
            Image.open(io.BytesIO(jpg)).convert("RGB").save(base / "_film" / "social-poster.jpg", quality=85)
            print(f"social cut {dur:.0f}s -> _film/social.mp4")
    finally:
        srv.shutdown()

if __name__ == "__main__":
    import sys as _s; _s.stdout.reconfigure(encoding="utf-8", errors="replace")
    main()
