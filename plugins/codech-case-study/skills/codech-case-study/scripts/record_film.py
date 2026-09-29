#!/usr/bin/env python3
"""Record the case-study film from work/<slug>/_film/film.html.

    python record_film.py <site-root> <slug> [--fmt wide|social|both] [--poster-at 10]

wide   -> work/<slug>/assets/film.mp4, film-poster.jpg, og-cover.jpg (1200x630)   (deployed)
social -> work/<slug>/_film/social.mp4 + social-poster.jpg                        (for LinkedIn/IG; not deployed)

--music auto (default): make_music.py composes an original bed timed to the film's real chapter
         changes (bells on each new scene, pulse stops for the outro). Royalty-free by construction.
--music <file.mp3|wav>: use a licensed track instead; it is trimmed/looped to length with fades.
--music none: silent film.

How: Chrome's screencast (CDP) streams JPEG frames with timestamps while the page plays in real
time; frames are resampled to a steady 30 fps and encoded as H.264 (crf 20, +faststart).
Playwright's built-in recorder is avoided on purpose: it produces soft, blocky text.
Needs: pip install playwright imageio-ffmpeg pillow && python -m playwright install chromium
"""
import argparse, asyncio, base64, bisect, functools, http.server, pathlib, subprocess, sys, threading

class _Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass

def serve(root):
    h = functools.partial(_Quiet, directory=str(root))
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), h)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, srv.server_address[1]

async def record(port, slug, fmt, out_mp4, poster_at, music):
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
        marks = await pg.evaluate("window.FILM_MARKS || []")
        await cdp.send("Page.stopScreencast")
        await b.close()
    frames.sort(key=lambda f: f[0])
    t0 = frames[0][0]; ts = [f[0] - t0 for f in frames]; dur = ts[-1]
    # The screencast only emits frames when pixels change, so a static outro produces no frames and
    # the last frame arrives early. The film's own 'end' marker is the true length; hold the last frame.
    end = [m["t"] - t0 for m in marks if m["k"] == "end"]
    if end: dur = max(dur, end[0])
    print(f"{fmt}: {len(frames)} source frames over {dur:.1f}s (~{len(frames)/dur:.0f} fps)")
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    silent = pathlib.Path(str(out_mp4) + ".silent.mp4")
    cmd = [ff, "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", "30", "-vcodec", "mjpeg", "-i", "-",
           "-vf", f"scale={W}:{H}:flags=lanczos,format=yuv420p", "-c:v", "libx264", "-preset", "slow", "-crf", "20",
           "-profile:v", "high", "-movflags", "+faststart", "-an", str(silent)]
    pr = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for k in range(int(dur * 30)):
        pr.stdin.write(frames[max(0, bisect.bisect_right(ts, k / 30) - 1)][1])
    pr.stdin.close(); pr.wait()
    rel = [round(m["t"] - t0, 2) for m in marks]
    kinds = [m["k"] for m in marks]
    add_audio(ff, silent, out_mp4, dur, music, rel, kinds)
    # poster: first scene with its results on screen (default 10 s in; adjust with --poster-at)
    return frames[max(0, bisect.bisect_right(ts, poster_at) - 1)][1], dur

def add_audio(ff, silent, out_mp4, dur, music, rel, kinds):
    """Mux a soundtrack onto the silent video (or just rename it when music is 'none')."""
    out_mp4 = pathlib.Path(out_mp4)
    if music == "none":
        silent.replace(out_mp4); return
    wav = pathlib.Path(str(out_mp4) + ".music.wav")
    if music == "auto":
        chapters = [t for t, k in zip(rel, kinds) if k in ("intro", "scene")]
        outro = next((t for t, k in zip(rel, kinds) if k == "outro"), dur - 6)
        subprocess.run([sys.executable, str(pathlib.Path(__file__).with_name("make_music.py")), str(wav), "--duration", f"{dur:.2f}",
                        "--marks", ",".join(f"{t:.2f}" for t in chapters), "--outro", f"{outro:.2f}"], check=True)
        audio_in = ["-i", str(wav)]; af = "anull"
    else:
        audio_in = ["-stream_loop", "-1", "-i", music]
        af = f"afade=t=in:d=2,afade=t=out:st={max(0, dur - 3.5):.2f}:d=3.5,volume=0.7"
    subprocess.run([ff, "-y", "-loglevel", "error", "-i", str(silent), *audio_in, "-map", "0:v", "-map", "1:a", "-af", af,
                    "-t", f"{dur:.2f}", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", str(out_mp4)], check=True)
    silent.unlink(missing_ok=True); wav.unlink(missing_ok=True)

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("site"); ap.add_argument("slug")
    ap.add_argument("--fmt", default="both", choices=["wide", "social", "both"]); ap.add_argument("--poster-at", type=float, default=10.0)
    ap.add_argument("--music", default="auto", help="auto | none | path to a licensed audio file")
    o = ap.parse_args()
    from PIL import Image
    import io
    root = pathlib.Path(o.site); base = root / "work" / o.slug
    if not (base / "_film" / "film.html").exists():
        raise SystemExit("run build_case.py first (it writes _film/film.html)")
    srv, port = serve(root)
    try:
        if o.fmt in ("wide", "both"):
            jpg, dur = asyncio.run(record(port, o.slug, "wide", base / "assets" / "film.mp4", o.poster_at, o.music))
            im = Image.open(io.BytesIO(jpg)).convert("RGB")
            im.save(base / "assets" / "film-poster.jpg", quality=82, optimize=True)
            im.crop((0, 36, 1920, 1044)).resize((1200, 630), Image.LANCZOS).save(base / "assets" / "og-cover.jpg", quality=86)
            print(f"wide film {dur:.0f}s -> assets/film.mp4, film-poster.jpg, og-cover.jpg (check the poster isn't mid-fade)")
        if o.fmt in ("social", "both"):
            jpg, dur = asyncio.run(record(port, o.slug, "social", base / "_film" / "social.mp4", o.poster_at, o.music))
            Image.open(io.BytesIO(jpg)).convert("RGB").save(base / "_film" / "social-poster.jpg", quality=85)
            print(f"social cut {dur:.0f}s -> _film/social.mp4")
    finally:
        srv.shutdown()

if __name__ == "__main__":
    import sys as _s; _s.stdout.reconfigure(encoding="utf-8", errors="replace")
    main()
