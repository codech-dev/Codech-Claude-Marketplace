#!/usr/bin/env python3
"""Add or update a case study's card in the landing page's Results carousel.

    python upsert_story.py <site-root> <slug> [--remove]

Edits <site>/index.html in three marked places (creates the markers on first run):
  <!-- @case:styles -->  ... <!-- /@case:styles -->    shared engine CSS + every case's scenes.css
  <!-- @case:scripts --> ... <!-- /@case:scripts -->   shared engine JS  + every case's scenes.js
  // @case:<slug> ... // /@case:<slug>                  this case's entry at the top of STORIES
Everything else in index.html is left untouched, so it is safe to run repeatedly.
The landing page is shared with other sessions: tell them before running this (see references/deploy.md).
"""
import json, pathlib, re, sys

def js(v):
    return json.dumps(v, ensure_ascii=False)

def entry(c):
    slug = c["slug"]; cl = c["client"]; card = c["card"]; th = c.get("theme", {})
    by_scene = {f["scene"]: g for g in c["groups"] for f in g["features"]}
    demos = []
    for s in card["demos"]:
        g = by_scene[s]
        demos.append([f"{slug}:{s}", re.sub(r"<[^>]+>", "", g["name"]), g.get("status", "live")])
    named = cl.get("named_publicly", True)
    fields = {
        "real": True,
        "ind": c["industry"],
        "colors": [th.get("mid", "#0b1f35"), th.get("accent", "#2d7ff9"), th.get("soft", "#6FA8FF")],
        "headline": card.get("headline", c["hero"]["headline"]),
        "kpis": card["kpis"],
        "logo": f"work/{slug}/{cl['logo']}" if named and cl.get("logo") else "",
        "who": cl["name"] if named else cl.get("anonymous_name", "Client"),
        "client": cl.get("descriptor", ""),
        "page": f"work/{slug}/",
        "demos": demos,
    }
    body = ", ".join(f"{k}:{js(v)}" for k, v in fields.items())
    return f"  // @case:{slug} (generated from work/{slug}/case.json by upsert_story.py; edit case.json, not this line)\n  {{ {body} }},\n  // /@case:{slug}\n"

def block(text, name, content, anchor_before):
    start, end = f"<!-- @case:{name} -->", f"<!-- /@case:{name} -->"
    new = f"{start}\n{content}{end}\n"
    if start in text:
        return re.sub(re.escape(start) + r".*?" + re.escape(end) + r"\n?", lambda m: new, text, count=1, flags=re.S)
    i = text.index(anchor_before)
    return text[:i] + new + text[i:]

def main():
    if len(sys.argv) < 3: sys.exit(__doc__)
    root = pathlib.Path(sys.argv[1]); slug = sys.argv[2]; remove = "--remove" in sys.argv
    idx = root / "index.html"; s = idx.read_text(encoding="utf-8")

    # 1. STORIES entry
    mk = re.compile(r"  // @case:" + re.escape(slug) + r"\b.*?// /@case:" + re.escape(slug) + r"\n", re.S)
    if remove:
        s = mk.sub("", s)
    else:
        c = json.loads((root / "work" / slug / "case.json").read_text(encoding="utf-8"))
        new = entry(c)
        if mk.search(s):
            s = mk.sub(lambda m: new, s, count=1)
        else:
            legacy = re.search(r"  \{ real:true,[^\n]*\n(?:(?!  \{ )[^\n]*\n)*?[^\n]*page:'work/" + re.escape(slug) + r"/'.*?\},\n", s, re.S)
            if legacy:
                s = s[:legacy.start()] + new + s[legacy.end():]
            else:
                anchor = "const STORIES = [\n"
                if anchor not in s: sys.exit("could not find 'const STORIES = [' in index.html")
                i = s.index(anchor) + len(anchor); s = s[:i] + new + s[i:]

    # 2. includes for every case that has a card entry
    slugs = re.findall(r"// @case:([a-z0-9-]+) \(generated", s)
    css = '<link rel="stylesheet" href="work/_shared/ov.css">\n' + "".join(f'<link rel="stylesheet" href="work/{x}/assets/scenes.css">\n' for x in slugs)
    jsb = '<script src="work/_shared/ov.js"></script>\n' + "".join(f'<script src="work/{x}/assets/scenes.js"></script>\n' for x in slugs)
    s = block(s, "styles", css, "</head>")
    m = re.search(r"<script>\s*\n/\* =+ EDITABLE CONTENT", s)
    anchor = m.group(0) if m else "<script>"
    s = block(s, "scripts", jsb, anchor)
    idx.write_text(s, encoding="utf-8")
    print(("removed " if remove else "upserted ") + slug + "; cases on landing: " + ", ".join(slugs))

if __name__ == "__main__":
    import sys as _s; _s.stdout.reconfigure(encoding="utf-8", errors="replace")
    main()
