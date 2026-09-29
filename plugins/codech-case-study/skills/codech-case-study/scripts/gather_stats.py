#!/usr/bin/env python3
"""Measure a finished project for its portfolio brief ("By the numbers", timeline, stack).

    python gather_stats.py <project-repo> [--branch main] [--out <pack>/stats.json]

Prints a markdown table and writes JSON. Everything is measured, not estimated; if a number
can't be measured it is left out rather than guessed. Counts exclude node_modules, dist, build,
.next, vendor, coverage, generated migrations snapshots and lockfiles.
"""
import argparse, collections, datetime, json, pathlib, re, subprocess

SKIP = {"node_modules", "dist", "build", ".next", ".git", "vendor", "coverage", ".turbo", ".venv", "venv", "__pycache__", "out", ".vercel", "playwright-report", "test-results"}
SRC = {".ts", ".tsx", ".js", ".jsx", ".mjs", ".py", ".go", ".rs", ".java", ".kt", ".cs", ".php", ".rb", ".vue", ".svelte", ".dart", ".swift", ".sql"}
TEST_RX = re.compile(r"(^|[/\\])(tests?|__tests__|e2e|spec)([/\\])|\.(test|spec)\.[a-z]+$|(^|[/\\])test_[^/\\]+\.py$")
CASE_RX = re.compile(r"^\s*(?:it|test)(?:\.each\([^)]*\))?\s*\(|^\s*def test_|^\s*func Test|#\[test\]", re.M)

def git(repo, *a):
    r = subprocess.run(["git", "-C", str(repo), *a], capture_output=True, text=True, encoding="utf-8", errors="replace")
    return r.stdout.strip() if r.returncode == 0 else ""

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("repo"); ap.add_argument("--branch", default=""); ap.add_argument("--out")
    o = ap.parse_args(); repo = pathlib.Path(o.repo)
    br = o.branch or git(repo, "rev-parse", "--abbrev-ref", "HEAD") or "main"
    s = {"measured_at": datetime.date.today().isoformat(), "branch": br}

    first = git(repo, "log", br, "--reverse", "--format=%ad", "--date=short").splitlines()
    if first:
        s["first_commit"] = first[0]; s["last_commit"] = first[-1]; s["commits"] = len(first)
    tags = git(repo, "tag", "--sort=creatordate", "--format=%(creatordate:short) %(refname:short)").splitlines()
    if tags: s["tags"] = tags[-15:]
    # commits that look like go-live / deploy / release markers, for the timeline
    marks = git(repo, "log", br, "--format=%ad %s", "--date=short", "-i", "-E", "--grep=(go[- ]?live|launch|production|staging|release|deploy)")
    if marks: s["timeline_hints"] = marks.splitlines()[-12:]

    src = collections.Counter(); src_lines = 0; test_files = 0; test_lines = 0; cases = 0; e2e = 0
    for p in repo.rglob("*"):
        if not p.is_file() or any(part in SKIP for part in p.parts): continue
        if p.suffix not in SRC or p.name.endswith((".d.ts", ".min.js")): continue
        try: txt = p.read_text(encoding="utf-8", errors="ignore")
        except Exception: continue
        n = txt.count("\n") + 1; rel = str(p.relative_to(repo))
        if TEST_RX.search(rel):
            test_files += 1; test_lines += n; cases += len(CASE_RX.findall(txt))
            if re.search(r"(^|[/\\])e2e([/\\])|\.e2e\.|playwright", rel, re.I): e2e += 1
        else:
            src[p.suffix] += 1; src_lines += n
    s["source_files"] = sum(src.values()); s["source_lines"] = src_lines; s["source_by_ext"] = dict(src.most_common())
    s["test_files"] = test_files; s["test_lines"] = test_lines; s["test_cases"] = cases; s["e2e_specs"] = e2e

    def count(globs):
        return sum(1 for g in globs for p in repo.glob(g) if not any(x in SKIP for x in p.parts))
    extra = {
        "adrs": count(["**/adr/*.md", "**/ADR-*.md", "**/decisions/*.md"]),
        "db_migrations": count(["**/migrations/*/migration.sql", "**/migrations/*.sql", "**/migrations/*.py"]),
        "prisma_models": len(re.findall(r"^model \w+", "\n".join(p.read_text(encoding="utf-8", errors="ignore") for p in repo.glob("**/schema.prisma") if "node_modules" not in p.parts), re.M)),
        "api_routes": count(["**/app/api/**/route.ts", "**/app/api/**/route.js", "**/pages/api/**/*.ts"]),
        "pages": count(["**/app/**/page.tsx", "**/app/**/page.jsx", "**/pages/**/*.tsx"]),
        "visual_baselines": count(["**/*-snapshots/*.png", "**/__screenshots__/**/*.png"]),
        "locales": len({p.stem for p in repo.glob("**/locales/*.json")} | {p.parent.name for p in repo.glob("**/locales/*/*.json")}),
    }
    s.update({k: v for k, v in extra.items() if v})

    deps = {}
    for pj in [p for p in repo.glob("**/package.json") if "node_modules" not in p.parts][:6]:
        try:
            d = json.loads(pj.read_text(encoding="utf-8"))
            deps.update({**d.get("dependencies", {}), **d.get("devDependencies", {})})
        except Exception: pass
    if deps: s["npm_dependencies"] = sorted(deps)
    for f in ["requirements.txt", "pyproject.toml", "go.mod", "Cargo.toml", "docker-compose.yml", "Dockerfile"]:
        if list(repo.glob(f)) or list(repo.glob("*/" + f)): s.setdefault("stack_files", []).append(f)

    if o.out:
        pathlib.Path(o.out).parent.mkdir(parents=True, exist_ok=True)
        pathlib.Path(o.out).write_text(json.dumps(s, indent=2), encoding="utf-8")
    rows = [("Commits on `%s`" % br, s.get("commits")), ("First commit", s.get("first_commit")),
            ("Application source", f"{s['source_files']} files, ~{s['source_lines']:,} lines"),
            ("Test code", f"{s['test_files']} files, ~{s['test_lines']:,} lines, ~{s['test_cases']:,} test cases"),
            ("E2E specs", s.get("e2e_specs")), ("Visual-regression screens", s.get("visual_baselines")),
            ("API routes / pages", f"{s.get('api_routes', '?')} / {s.get('pages', '?')}"),
            ("Database models / migrations", f"{s.get('prisma_models', '?')} / {s.get('db_migrations', '?')}"),
            ("Languages (locales)", s.get("locales")), ("Architecture decision records", s.get("adrs"))]
    print(f"## By the numbers (as of {s['measured_at']})\n\n| | |\n|---|---|")
    for k, v in rows:
        if v not in (None, 0, "? / ?"): print(f"| {k} | {v} |")
    if s.get("timeline_hints"): print("\nTimeline hints (check against the delivery log):\n" + "\n".join("  " + x for x in s["timeline_hints"]))

if __name__ == "__main__":
    import sys as _s; _s.stdout.reconfigure(encoding="utf-8", errors="replace")
    main()
