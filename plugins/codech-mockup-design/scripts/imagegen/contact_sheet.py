# /// script
# requires-python = ">=3.10"
# dependencies = ["Pillow>=10.0.0"]
# ///
"""One JPEG showing every generated PNG with its filename, on a magenta backdrop so
transparent cutouts are obvious (magenta shows through = real alpha; white box = no alpha).

Usage:
    uv run contact_sheet.py docs/design/images/raw sheet.jpg
Then open sheet.jpg (Read tool) and confirm each filename matches its subject.
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw

src, out = Path(sys.argv[1]), Path(sys.argv[2])
files = sorted(src.glob("*.png"))
if not files:
    raise SystemExit(f"no PNGs in {src}")
cols, cell = 3, 340
rows = -(-len(files) // cols)
sheet = Image.new("RGB", (cell * cols, (cell + 24) * rows), (200, 200, 200))
draw = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    im = Image.open(f)
    alpha = im.mode == "RGBA" and im.getchannel("A").getextrema()[0] < 250
    print(f"{f.name:28} {im.size} {im.mode} {'transparent' if alpha else 'opaque'}")
    im = im.convert("RGBA")
    im.thumbnail((cell, cell))
    tile = Image.new("RGBA", (cell, cell), (255, 0, 255, 255))
    tile.alpha_composite(im, ((cell - im.width) // 2, (cell - im.height) // 2))
    x, y = (i % cols) * cell, (i // cols) * (cell + 24)
    sheet.paste(tile.convert("RGB"), (x, y + 24))
    draw.text((x + 6, y + 6), f.name, fill=(0, 0, 0))
sheet.save(out, quality=85)
print("wrote", out)
