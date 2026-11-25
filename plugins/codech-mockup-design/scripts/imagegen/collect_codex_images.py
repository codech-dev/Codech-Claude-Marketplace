"""Copy images made by Codex's built-in image_gen out of ~/.codex/generated_images into the project.

Codex's sandbox cannot copy files out of CODEX_HOME, so the images stay in
~/.codex/generated_images/<session-id>/exec-*.png. This script copies the newest N
images in creation order and renames them to the filenames from your prompt file.

Usage:
    py -3 -I collect_codex_images.py --out docs/design/images/raw hero-student teacher-1 teacher-2 ...
    py -3 -I collect_codex_images.py --out raw --since-minutes 30 --dry-run hero-student teacher-1

Names are given in the SAME order as the numbered list in the prompt. Always check the
result with contact_sheet.py: if Codex re-generated one image, the order shifts by one.
"""
import argparse
import os
import shutil
import time
from pathlib import Path

ap = argparse.ArgumentParser()
ap.add_argument("names", nargs="+", help="target names (without extension), in prompt order")
ap.add_argument("--out", required=True)
ap.add_argument("--since-minutes", type=float, default=120, help="only consider images newer than this")
ap.add_argument("--codex-home", default=os.environ.get("CODEX_HOME", str(Path.home() / ".codex")))
ap.add_argument("--dry-run", action="store_true")
a = ap.parse_args()

root = Path(a.codex_home) / "generated_images"
cutoff = time.time() - a.since_minutes * 60
found = sorted(
    (p for p in root.rglob("*.png") if p.stat().st_ctime >= cutoff),
    key=lambda p: p.stat().st_ctime,
)
if len(found) < len(a.names):
    raise SystemExit(f"Only {len(found)} images newer than {a.since_minutes} min in {root}; expected {len(a.names)}.")
picked = found[-len(a.names):]  # newest N, oldest first = prompt order
out = Path(a.out)
out.mkdir(parents=True, exist_ok=True)
for name, src in zip(a.names, picked):
    dst = out / f"{name}.png"
    print(f"{src.parent.name}/{src.name} -> {dst}")
    if not a.dry_run:
        shutil.copy2(src, dst)
