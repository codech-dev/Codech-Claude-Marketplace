#!/usr/bin/env python3
"""Publish a built case study to codech-site STAGING (staging.codech.co). Never to codech.co: that needs the owner's go.

    python publish_case.py <site-root> <slug> --codech-site <codech-site clone> [options]

<site-root> is the build workspace (site/codech-ai-landing, where build_case.py wrote work/<slug>/).
Steps, in order (each one prints what it did):
  1. Guard: codech-site is on branch `staging` with no uncommitted changes under public/work/<slug>/. If codech-site has
     commits to public/work/<slug>/ after its last bundle sync (fixes made in codech-site, not in the case), stop and list
     them; --overwrite re-syncs anyway (the known fixes in step 3 are re-applied automatically, anything else is lost).
  2. Copy work/<slug>/ into public/work/<slug>/ with codech-site's own `npm run sync -- --bundle <slug>` (no videos,
     no _film/_qa; it replaces the folder).
  3. Re-apply codech-site's fixes to the copy: prototype import maps load React & co. from /work/_shared/vendor instead
     of esm.sh (esm.sh timed out on 2026-10-21 and blanked prototypes); https://codech-ai-landing.pages.dev -> https://codech.co;
     codech.co@gmail.com -> contact@codech.co. An esm.sh package with no vendored copy stops the run.
  4. Upload the case's videos (work/<slug>/**/*.mp4|webm, not _film/_qa) to the media store /srv/site/media on the VPS.
  5. Directus card (collection case_studies), built from case.json, sent over SSH so the owner token never leaves the VPS:
     - no card yet: create it as a DRAFT (staging shows drafts, codech.co does not) and add the slug to
       site_settings.hide_cases, so codech.co leaves the whole case out (its page is reachable by URL otherwise);
     - card exists: print the fields that differ from case.json; --update-card writes them (never status, sort, nav_label).
     --approve (ONLY after the owner said publish): status published + slug removed from hide_cases. The next production
     build (codech-site main / "Publish site") then shows it on codech.co.
  6. --push: commit public/work/<slug>/ ("sync(work/<slug>): bundle from codech-case-study") and push `staging`.
     Without it, the git commands are printed.

Options: --dry-run (report only, change nothing), --no-media, --video <path in the bundle> --video-title <text>
(the card's video, e.g. assets/marketing-film-v1.mp4; default: assets/film.mp4 when present), --solutions a,b
(solution tags: agents, docs, automation, insights; default: case.json "solutions"), --vps root@host, --ssh-key <file>.
"""
import argparse, json, os, pathlib, re, subprocess, sys, tarfile, tempfile

MEDIA = re.compile(r"\.(mp4|webm|mov|mp3|wav|m4a)$", re.I)
SKIP = re.compile(r"(^|/)(_film|_qa)(/|$)")
SLUG = re.compile(r"^[a-z0-9][a-z0-9-]*$")
SOLUTIONS = {"agents", "docs", "automation", "insights"}
# Self-hosted builds in codech-site public/work/_shared/vendor (tools/vendor/build-vendor.mjs). Key = import-map specifier.
VENDOR = {"react": "react.js", "react-dom": "react-dom.js", "react-dom/client": "react-dom-client.js",
          "react/jsx-runtime": "react-jsx-runtime.js", "framer-motion": "framer-motion.js",
          "lucide-react": "lucide-react.js", "recharts": "recharts.js"}
TEXT_FIXES = [("https://codech-ai-landing.pages.dev/", "https://codech.co/"), ("codech.co@gmail.com", "contact@codech.co")]
SYNC_MARK = re.compile(r"^(feat\(sync\)|sync\(work/)")
TEXT = re.compile(r"\.(html?|css|js|json|svg|txt|md)$", re.I)


def run(cmd, cwd=None, check=True, **kw):
    r = subprocess.run(cmd, cwd=cwd, text=True, capture_output=True, **kw)
    if check and r.returncode:
        sys.exit(f"failed: {' '.join(cmd)}\n{r.stdout}{r.stderr}")
    return r


def die(msg, code=1):
    print(msg, file=sys.stderr); sys.exit(code)


# ---------- 1. guard ----------
def guard(cs, slug, overwrite):
    git = lambda *a: run(["git", *a], cwd=cs).stdout.strip()
    if git("rev-parse", "--abbrev-ref", "HEAD") != "staging":
        die(f"{cs} is not on branch staging (work there; main is codech.co)")
    if git("status", "--porcelain", "--", f"public/work/{slug}"):
        die(f"uncommitted changes under public/work/{slug}/ in codech-site: commit or discard them first")
    log = [l for l in git("log", "--format=%h %s", "--", f"public/work/{slug}").splitlines() if l]
    later = []
    for line in log:                                   # newest first; stop at the last sync
        if SYNC_MARK.match(line.split(" ", 1)[1]): break
        later.append(line)
    if later and not overwrite:
        print(f"codech-site changed public/work/{slug}/ after its last bundle sync:")
        for l in later:
            files = git("show", "--name-only", "--format=", l.split()[0], "--", f"public/work/{slug}").splitlines()
            print(f"  {l}\n    " + "\n    ".join(files))
        print("Known fixes (vendored prototype libraries, codech.co URLs, contact@codech.co) are re-applied after the sync.\n"
              "If those commits are only such fixes (or footer/header edits, which the build injects anyway), rerun with --overwrite.\n"
              "Otherwise redo them in the case (case.json / scenes) first, or they are lost.")
        sys.exit(3)
    return bool(log)


# ---------- 3. codech-site fixes ----------
def fix_import_map(html, path, problems):
    def repl(m):
        try: data = json.loads(m.group(2))
        except ValueError: return m.group(0)
        imps = data.get("imports", {}); changed = False
        for k, v in list(imps.items()):
            if isinstance(v, str) and "esm.sh/" in v:
                if k in VENDOR: imps[k] = "/work/_shared/vendor/" + VENDOR[k]; changed = True
                else: problems.append(f"{path}: import map entry {k!r} -> {v} has no vendored copy")
        if changed and "react-dom/client" in imps and "react-dom" not in imps:
            imps["react-dom"] = "/work/_shared/vendor/react-dom.js"   # the vendored libraries import bare "react-dom"
        return m.group(1) + json.dumps(data, indent=2) + m.group(3) if changed else m.group(0)
    out = re.sub(r'(<script type="importmap">\s*)(\{.*?\})(\s*</script>)', repl, html, flags=re.S)
    for m in re.finditer(r"https://esm\.sh/[^\s\"'<>)]+", out):
        problems.append(f"{path}: still loads {m.group(0)} (not via the import map)")
    return out


def apply_fixes(bundle, vendor_dir, dry):
    problems, changed = [], []
    for p in sorted(bundle.rglob("*")):
        if not p.is_file() or not TEXT.search(p.name) or SKIP.search(p.relative_to(bundle).as_posix()): continue
        s = p.read_text(encoding="utf-8", errors="surrogateescape")
        t = s
        for a, b in TEXT_FIXES: t = t.replace(a, b)
        if p.suffix.lower() in (".html", ".htm"): t = fix_import_map(t, p.relative_to(bundle).as_posix(), problems)
        if t != s:
            changed.append(p.relative_to(bundle).as_posix())
            if not dry: p.write_text(t, encoding="utf-8", errors="surrogateescape")
    missing = [f for f in VENDOR.values() if not (vendor_dir / f).is_file()]
    if missing: problems.append(f"codech-site has no {', '.join(missing)} in public/work/_shared/vendor (run tools/vendor/build-vendor.mjs)")
    return changed, problems


# ---------- 4. media ----------
def media_files(case_dir):
    return [p for p in sorted(case_dir.rglob("*")) if p.is_file() and MEDIA.search(p.name)
            and not SKIP.search(p.relative_to(case_dir).as_posix())]


def upload_media(site, slug, files, ssh, dry):
    if not files: print("media: none"); return
    rel = [p.relative_to(site).as_posix() for p in files]
    print("media: " + ", ".join(rel) + (" (dry run)" if dry else ""))
    if dry: return
    with tempfile.TemporaryFile() as tf:
        with tarfile.open(fileobj=tf, mode="w") as t:
            for r in rel: t.add(site / r, arcname=r)
        tf.seek(0)
        r = subprocess.run(ssh + [f"mkdir -p /srv/site/media && tar -xf - -C /srv/site/media && chmod -R a+rX /srv/site/media/work/{slug} && ls -l /srv/site/media/work/{slug}/assets"],
                           stdin=tf, capture_output=True)
    if r.returncode: die("media upload failed:\n" + r.stderr.decode(errors="replace"))
    print(r.stdout.decode(errors="replace").strip())


# ---------- 5. Directus card ----------
def card_item(c, case_dir, slug, video, video_title, solutions):
    cl, card = c.get("client") or {}, c.get("card") or {}
    group_of = {f["scene"]: g for g in c.get("groups") or [] for f in g.get("features") or []}
    v = video or ("assets/film.mp4" if (case_dir / "assets" / "film.mp4").is_file() else None)
    if v and not (case_dir / v).is_file(): die(f"--video {v}: no such file in work/{slug}/")
    poster = None
    if v:
        stem = re.sub(r"\.(mp4|webm)$", "", v)
        poster = next((f"{stem}{s}" for s in ("-poster.jpg", "-poster.png") if (case_dir / f"{stem}{s}").is_file()), None) \
            or ("assets/film-poster.jpg" if (case_dir / "assets" / "film-poster.jpg").is_file() else None)
    title = c.get("product") or cl.get("name") or slug
    return {
        "slug": slug, "title": title, "nav_label": title, "client_name": cl.get("name", ""),
        "client_descriptor": cl.get("descriptor", ""), "client_anonymous": cl.get("anonymous_name"),
        "named_publicly": cl.get("named_publicly") is not False, "logo": cl.get("logo"),
        "cover": f"/work/{slug}/assets/og-cover.jpg" if (case_dir / "assets" / "og-cover.jpg").is_file() else None,
        "industry": c.get("industry", ""), "delivery_status": "live" if c.get("status") == "live" else "build",
        "headline": card.get("headline") or (c.get("hero") or {}).get("headline", ""), "kpis": card.get("kpis") or [],
        "theme": c.get("theme") or {},
        "video": f"/work/{slug}/{v}" if v else None, "video_poster": f"/work/{slug}/{poster}" if poster else None,
        "video_title": (video_title or f"Codech × {cl.get('name') or title}: {title}") if v else None,
        "solution_tags": solutions,
        "demos": [[f"{slug}:{s}", re.sub(r"<[^>]+>", "", (group_of.get(s) or {}).get("name", "")), (group_of.get(s) or {}).get("status", "live")]
                  for s in card.get("demos") or []],
        "delivery_tabs": [t for t in (c.get("delivery") or {}).get("tabs") or [] if t.get("stage") in ("proposal", "prototype")],
    }


# Runs ON THE VPS (python3 there), reads the owner token from its file; prints one JSON line.
REMOTE = r'''
import json, sys, urllib.request, urllib.parse
req = json.load(sys.stdin); D = "http://127.0.0.1:8055"; T = open("/root/.directus-owner-token").read().strip()
def api(m, p, b=None):
    r = urllib.request.Request(D + p, method=m, data=None if b is None else json.dumps(b).encode(),
                               headers={"Authorization": "Bearer " + T, "content-type": "application/json"})
    with urllib.request.urlopen(r) as x: t = x.read(); return json.loads(t) if t else {}
slug, item = req["slug"], req["item"]
have = api("GET", "/items/case_studies?" + urllib.parse.urlencode({"filter[slug][_eq]": slug, "fields": "*", "limit": 1}))["data"]
out = {"exists": bool(have)}
hidden = api("GET", "/items/site_settings?fields=hide_cases")["data"].get("hide_cases") or []
if have:
    cur = have[0]; skip = {"status", "sort", "nav_label", "slug"}
    out["diff"] = {k: {"directus": cur.get(k), "case_json": v} for k, v in item.items() if k not in skip and cur.get(k) != v}
    if req["update"] and out["diff"] and not req["dry"]:
        api("PATCH", "/items/case_studies/%s" % cur["id"], {k: item[k] for k in out["diff"]}); out["updated"] = sorted(out["diff"])
    if req["approve"] and not req["dry"] and cur.get("status") != "published":
        api("PATCH", "/items/case_studies/%s" % cur["id"], {"status": "published"}); out["published"] = True
elif not req["dry"]:
    top = api("GET", "/items/case_studies?fields=sort&sort=-sort&limit=1")["data"]
    item = dict(item, status="published" if req["approve"] else "draft", sort=((top[0]["sort"] or 0) + 1) if top else 1)
    out["created"] = api("POST", "/items/case_studies", item)["data"]["id"]; out["status"] = item["status"]
if not req["dry"]:
    want = [s for s in hidden if s != slug] if req["approve"] else (hidden + [slug] if not have and slug not in hidden else hidden)
    if want != hidden: api("PATCH", "/items/site_settings", {"hide_cases": want}); hidden = want
out["hidden_on_codech_co"] = slug in hidden
print(json.dumps(out, ensure_ascii=False, default=str))
'''


def directus(ssh, payload):
    r = subprocess.run(ssh + ["python3 -c " + _sh(REMOTE)], input=json.dumps(payload).encode(), capture_output=True)
    if r.returncode: die("Directus step failed:\n" + r.stderr.decode(errors="replace")[-1500:])
    return json.loads(r.stdout.decode().strip().splitlines()[-1])


def _sh(s):
    return "'" + s.replace("'", "'\"'\"'") + "'"


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("site"); ap.add_argument("slug")
    ap.add_argument("--codech-site", required=True)
    for f in ("--dry-run", "--overwrite", "--no-media", "--update-card", "--approve", "--push"): ap.add_argument(f, action="store_true")
    ap.add_argument("--video"); ap.add_argument("--video-title"); ap.add_argument("--solutions")
    ap.add_argument("--vps", default=os.environ.get("CODECH_VPS", "root@31.97.71.28"))
    ap.add_argument("--ssh-key", default=os.environ.get("SSH_KEY", str(pathlib.Path.home() / ".ssh" / "codech_outreach_ed25519")))
    o = ap.parse_args()
    site, cs, slug, dry = pathlib.Path(o.site).resolve(), pathlib.Path(o.codech_site).resolve(), o.slug, o.dry_run
    if not SLUG.match(slug): die(f"bad slug {slug!r}")
    case_dir = site / "work" / slug
    if not (case_dir / "case.json").is_file(): die(f"no {case_dir / 'case.json'}: build the case first (build_case.py)")
    if not (cs / "tools" / "sync-legacy" / "bundle.js").is_file(): die(f"{cs} is not a codech-site clone")
    c = json.loads((case_dir / "case.json").read_text(encoding="utf-8"))
    solutions = [s.strip() for s in (o.solutions.split(",") if o.solutions else c.get("solutions") or []) if s.strip()]
    if set(solutions) - SOLUTIONS: die(f"--solutions: unknown {sorted(set(solutions) - SOLUTIONS)} (use {sorted(SOLUTIONS)})")
    if not solutions: print("warning: no solution tags (--solutions agents,docs,automation,insights); the /case-studies/ filter won't list it")
    ssh = ["ssh", "-i", o.ssh_key, "-o", "BatchMode=yes", o.vps]

    existed = guard(cs, slug, o.overwrite)
    print(f"1. codech-site OK ({'updating' if existed else 'new'} bundle public/work/{slug}/)")

    bundle = cs / "public" / "work" / slug
    if dry:
        print(f"2. would run: npm run sync -- --bundle {slug}  (LEGACY_DIR={site})")
    else:
        npm = "npm.cmd" if os.name == "nt" else "npm"
        run([npm, "run", "sync", "--", "--bundle", slug], cwd=cs, env=dict(os.environ, LEGACY_DIR=str(site)))
        print(f"2. synced work/{slug}/ -> public/work/{slug}/")

    changed, problems = apply_fixes(bundle if bundle.is_dir() and not dry else case_dir, cs / "public" / "work" / "_shared" / "vendor", dry)
    print("3. codech-site fixes " + ("would change " if dry else "changed ") + (", ".join(changed) or "nothing"))
    if problems:
        die("stop: fix these, then rerun (codech-site keeps the synced copy; nothing else was done):\n  " + "\n  ".join(problems), 4)

    if o.no_media: print("4. media skipped (--no-media)")
    else: upload_media(site, slug, media_files(case_dir), ssh, dry)

    item = card_item(c, case_dir, slug, o.video, o.video_title, solutions)
    res = directus(ssh, {"slug": slug, "item": item, "update": o.update_card, "approve": o.approve, "dry": dry})
    if res.get("created"): print(f"5. Directus card created (id {res['created']}, {res['status']})")
    elif res["exists"]:
        d = res.get("diff") or {}
        print("5. Directus card exists; " + ("matches case.json" if not d else
              ("updated " + ", ".join(res["updated"]) if res.get("updated") else "differs from case.json in: " + ", ".join(sorted(d)) + "  (--update-card writes them)")))
        for k, v in d.items(): print(f"     {k}: Directus {json.dumps(v['directus'], ensure_ascii=False)[:140]}\n     {' ' * len(k)}  case.json {json.dumps(v['case_json'], ensure_ascii=False)[:140]}")
        if res.get("published"): print("   card status -> published")
    else: print("5. Directus card would be created as a draft (dry run)")
    print(f"   codech.co: {'HIDDEN (site_settings.hide_cases) until --approve' if res['hidden_on_codech_co'] else 'not hidden: the next production build shows it'}")

    msg = f"sync(work/{slug}): bundle from codech-case-study"
    if o.push and not dry:
        run(["git", "add", "-A", "--", f"public/work/{slug}"], cwd=cs)
        if run(["git", "diff", "--cached", "--quiet"], cwd=cs, check=False).returncode:
            run(["git", "commit", "-m", msg], cwd=cs); run(["git", "push", "origin", "staging"], cwd=cs)
            print("6. committed and pushed staging: the builder publishes https://staging.codech.co in a few minutes")
        else: print("6. nothing to commit")
    else:
        print(f'6. next: cd "{cs}" && git add -A -- public/work/{slug} && git commit -m "{msg}" && git push origin staging')
    print(f"Preview: https://staging.codech.co/work/{slug}/  and the card on https://staging.codech.co/case-studies/\n"
          "codech.co only after the owner says publish: rerun with --approve, then publish (codech-site main / Directus \"Publish site\").")


if __name__ == "__main__":
    main()
