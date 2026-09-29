#!/usr/bin/env python3
"""Stage the landing site into _deploy/ and deploy it to Cloudflare Pages, then verify.

    python stage_deploy.py <site-root> [--project codech-ai-landing] [--with-index] [--dry-run] [--force]

Rules (they exist because several Claude sessions deploy this same site):
  * _deploy/work/ is rebuilt from <site>/work/, skipping any path segment that starts with "_"
    except "_shared" (so _film/, _qa/ never ship), plus case.json and *-test.html.
  * Root files (index.html, og-image.jpg, logos/...) in _deploy/ are NOT touched unless --with-index,
    which copies <site>/index.html only. Other root files belong to whoever added them.
  * Before deploying, the live index.html must equal _deploy/index.html. If it doesn't, someone
    deployed from elsewhere; the script stops unless --force. Pull their change first.
  * After deploying, every file under work/ is fetched from the new deployment URL and its
    Content-Type checked (Pages serves index.html with 200 for missing files, so status alone lies).
"""
import argparse, pathlib, re, shutil, subprocess, sys, urllib.request

TYPES = {".js": "javascript", ".css": "text/css", ".html": "text/html", ".mp4": "video/mp4", ".jpg": "image/jpeg",
         ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg", ".json": "json"}

def fetch(url, head=False):
    req = urllib.request.Request(url, method="HEAD" if head else "GET", headers={"User-Agent": "codech-case-study", "Cache-Control": "no-cache"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.headers.get("Content-Type", ""), (b"" if head else r.read())

def shipped(p: pathlib.Path, rel: pathlib.Path):
    parts = rel.parts
    if any(x.startswith("_") and x != "_shared" for x in parts): return False
    if p.name == "case.json" or p.name.endswith("-test.html") or p.suffix == ".py": return False
    return True

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("site"); ap.add_argument("--project", default="codech-ai-landing")
    ap.add_argument("--with-index", action="store_true"); ap.add_argument("--dry-run", action="store_true"); ap.add_argument("--force", action="store_true")
    o = ap.parse_args()
    site = pathlib.Path(o.site); dep = site / "_deploy"; live = f"https://{o.project}.pages.dev"

    # 1. guard: live must match what we last staged
    _, live_idx = fetch(f"{live}/?nc=guard")
    staged = (dep / "index.html").read_bytes() if (dep / "index.html").exists() else b""
    if live_idx != staged:
        msg = "live index.html differs from _deploy/index.html: someone deployed from elsewhere."
        if not o.force: sys.exit("STOP: " + msg + " Reconcile first (see references/deploy.md) or pass --force.")
        print("WARNING: " + msg)
    if o.with_index:
        local = (site / "index.html").read_bytes()
        if local != live_idx:
            a, b = live_idx.decode("utf-8", "replace").splitlines(), local.decode("utf-8", "replace").splitlines()
            print(f"index.html: {len(b) - len(a):+d} lines vs live; shipping local index.html")
        shutil.copyfile(site / "index.html", dep / "index.html")

    # 2. mirror work/
    if (dep / "work").exists(): shutil.rmtree(dep / "work")
    files = []
    for p in sorted((site / "work").rglob("*")):
        rel = p.relative_to(site)
        if p.is_file() and shipped(p, rel.relative_to("work")):
            (dep / rel).parent.mkdir(parents=True, exist_ok=True); shutil.copyfile(p, dep / rel); files.append(rel.as_posix())
    print(f"staged {len(files)} work/ files")
    if o.dry_run:
        print("\n".join(files)); return

    # 3. deploy
    npx = shutil.which("npx") or shutil.which("npx.cmd")
    r = subprocess.run([npx, "wrangler", "pages", "deploy", str(dep), "--project-name", o.project, "--branch", "main", "--commit-dirty=true"],
                       capture_output=True, text=True, encoding="utf-8", errors="replace")
    out = r.stdout + r.stderr
    m = re.search(r"https://[0-9a-f]+\.[\w-]+\.pages\.dev", out)
    if r.returncode or not m: sys.exit("wrangler failed:\n" + out[-2000:])
    url = m.group(0); print("deployed", url)

    # 4. verify on the immutable deployment URL
    bad = []
    for rel in files:
        ext = pathlib.Path(rel).suffix.lower(); want = TYPES.get(ext)
        path = rel[:-len("index.html")] if rel.endswith("/index.html") else rel
        try:
            ctype, _ = fetch(f"{url}/{path}", head=True)
        except Exception as e:
            bad.append(f"{rel}: {e}"); continue
        if want and want not in ctype: bad.append(f"{rel}: got {ctype}")
    print("verify:", "all good" if not bad else "PROBLEMS\n  " + "\n  ".join(bad))
    print(f"production: {live}  (the edge may serve old copies for a minute; add ?v=1 to check)")

if __name__ == "__main__":
    import sys as _s; _s.stdout.reconfigure(encoding="utf-8", errors="replace")
    main()
