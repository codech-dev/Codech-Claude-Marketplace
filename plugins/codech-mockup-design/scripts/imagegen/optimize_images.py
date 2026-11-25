# /// script
# requires-python = ">=3.10"
# dependencies = ["Pillow>=10.0.0"]
# ///
"""Convert ~2 MB image_gen PNGs into web-ready WebP (typically 40-150 KB).

- Transparent cutouts: trims empty alpha margins first, so the subject sits flush on
  the bottom edge of a hero blob instead of floating.
- Resizes so the longest side <= the limit for that file (default 640px; pass
  NAME=PX overrides for heroes and wide scenes).

Usage:
    uv run optimize_images.py <raw-png-dir> <out-dir> [name=px ...]
    uv run optimize_images.py docs/design/images/raw prototype-app/images hero-student=1100 centre-class=1280
"""
import sys
from pathlib import Path
from PIL import Image

src, dst = Path(sys.argv[1]), Path(sys.argv[2])
limits = dict(arg.split("=") for arg in sys.argv[3:])
dst.mkdir(parents=True, exist_ok=True)
for f in sorted(src.glob("*.png")):
    im = Image.open(f)
    if im.mode == "RGBA":
        bbox = im.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox()
        if bbox:
            im = im.crop(bbox)
    limit = int(limits.get(f.stem, 640))
    im.thumbnail((limit, limit), Image.LANCZOS)
    out = dst / f"{f.stem}.webp"
    im.save(out, "WEBP", quality=82, method=6)
    print(f"{out.name:28} {im.size} {round(out.stat().st_size / 1024)} KB")
