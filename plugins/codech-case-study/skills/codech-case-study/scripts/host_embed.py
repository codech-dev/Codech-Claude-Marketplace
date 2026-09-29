#!/usr/bin/env python3
"""Host a sanitised copy of a proposal or prototype for the case study's "How we delivered" viewer.

    python host_embed.py <site-root> <slug> <proposal|prototype> <source-file-or-URL> \
        [--replace "portal.client.com=hub.client.com" ...] [--drop-banner "Confidential"]

Writes <site>/work/<slug>/<kind>/index.html (+ the local images/css/js it references).
Always: adds <meta name="robots" content="noindex">, applies --replace pairs, and prints a
REVIEW report of things a human must decide on (confidential labels, prices, emails, phone
numbers, public IPs, client hostnames, missing mobile layout). It never decides for you.
Hosting our own copy (instead of iframing the client-facing URL) keeps that URL out of our page.
"""
import argparse, pathlib, re, shutil, sys, urllib.parse, urllib.request

CHECKS = [
    ("confidential label", r"(?i)\bconfidential\b|\binternal only\b|\bprivileged\b"),
    ("price / fee", r"(?i)\b(RM|MYR|USD|SGD|US\$|S\$)\s?\d[\d,.]*\s?(k|m)?\b|\$\s?\d[\d,.]{2,}|\b(quotation|price list|payment terms)\b"),
    ("email", r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"),
    ("phone", r"\+?\d{2,3}[\s-]?\d{2,4}[\s-]?\d{3,4}[\s-]?\d{3,4}"),
    ("public IP", r"\b(?!10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|127\.)\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b"),
    ("hostname", r"\b[a-z0-9-]+(\.[a-z0-9-]+)*\.(com|net|io|dev|my|sg|co|cloud|app)(\.[a-z]{2})?\b"),
]
IGNORE_HOSTS = ("googleapis.com", "gstatic.com", "unpkg.com", "jsdelivr.net", "tailwindcss.com", "cloudflare.com", "cdnjs", "w3.org", "schema.org")

def read_source(src):
    if re.match(r"https?://", src):
        with urllib.request.urlopen(urllib.request.Request(src, headers={"User-Agent": "codech-case-study"}), timeout=60) as r:
            return r.read().decode("utf-8", "replace"), src
    p = pathlib.Path(src); return p.read_text(encoding="utf-8"), p

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("site"); ap.add_argument("slug"); ap.add_argument("kind", choices=["proposal", "prototype"]); ap.add_argument("source")
    ap.add_argument("--replace", action="append", default=[]); ap.add_argument("--drop-banner", action="append", default=[])
    o = ap.parse_args()
    html, origin = read_source(o.source)
    out = pathlib.Path(o.site) / "work" / o.slug / o.kind; out.mkdir(parents=True, exist_ok=True)

    for pair in o.replace:
        old, new = pair.split("=", 1)
        n = html.count(old); html = html.replace(old, new); print(f"replaced {n}x  {old} -> {new}")
    for text in o.drop_banner:
        # remove the smallest element whose text is exactly this banner (e.g. a top "Confidential" strip)
        m = re.search(r"<(div|p|span|section)[^>]*>(?:(?!<\1).)*?" + re.escape(text) + r".*?</\1>", html, re.S)
        if m and len(m.group(0)) < 2000: html = html[:m.start()] + html[m.end():]; print(f"dropped banner containing '{text}'")
        else: print(f"banner '{text}' not found in a small element; edit by hand")
    if 'name="robots"' not in html:
        html = html.replace("<head>", '<head>\n<meta name="robots" content="noindex">', 1)

    # copy local assets referenced by src/href
    refs = set(re.findall(r'(?:src|href)=["\'](?!https?:|//|data:|#|mailto:|javascript:)([^"\'?#]+)', html))
    for ref in sorted(refs):
        if ref.endswith(".html") or ref.startswith("/"): continue
        dst = out / ref; dst.parent.mkdir(parents=True, exist_ok=True)
        try:
            if isinstance(origin, pathlib.Path): shutil.copyfile(origin.parent / ref, dst)
            else: urllib.request.urlretrieve(urllib.parse.urljoin(origin, ref), dst)
            print("asset", ref)
        except Exception as e:
            print(f"MISSING asset {ref}: {e}")
    (out / "index.html").write_text(html, encoding="utf-8")

    text = re.sub(r"<script.*?</script>|<style.*?</style>", " ", html, flags=re.S)
    text_only = re.sub(r"<[^>]+>", " ", text)
    print(f"\nREVIEW for work/{o.slug}/{o.kind}/ (decide each item; nothing below was changed):")
    for label, rx in CHECKS:
        src = html if label == "hostname" else text_only
        hits = sorted({m.group(0) for m in re.finditer(rx, src)})
        if label == "hostname": hits = [h for h in hits if not any(i in h for i in IGNORE_HOSTS)]
        if hits: print(f"  {label}: {', '.join(hits[:12])}{' …' if len(hits) > 12 else ''}")
    if not re.search(r"@media\s*\(\s*max-width|\b(sm|md):(hidden|flex|block)\b", html):
        print("  mobile: no phone layout detected; phones would see a squeezed desktop. Add a mobile shell (references/embeds.md).")
    print(f"\nwrote {out / 'index.html'}")

if __name__ == "__main__":
    import sys as _s; _s.stdout.reconfigure(encoding="utf-8", errors="replace")
    main()
