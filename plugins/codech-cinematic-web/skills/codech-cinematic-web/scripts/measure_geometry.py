#!/usr/bin/env python3
"""measure_geometry.py <frame.png> [--band TOP BOTTOM] [--seed X Y]

Fit the silhouette of a glowing hero object in a reference frame and print its
centre and radius as fractions of the frame, ready to paste into a resize()
solve.

Why this exists: framing a hero object by eye from a still is the single most
reliable way to get it wrong. In the engagement this came from, an eyeballed
radius put the object's crest 33px above the top of the card, cropping the rim
out of frame entirely.

Method
------
The rim is the brightest thing in a column, but headline text is brighter
still, so a naive "brightest pixel per column" fit locks onto the copy and
returns a garbage circle (residual ~200px+). Instead:

  1. Find a seed on the crest: scan a few central columns for a bright, blue
     peak in the upper part of the frame (rim light is blue; text is neutral,
     so blue-minus-red separates them).
  2. Trace outward from the seed column by column, searching only near the
     previous column's answer. Text cannot capture a trace that is already
     locked onto the rim.
  3. Least-squares fit a circle to the traced points.

Trust the result only if the residual is small (single-digit px at 1080p).

Usage
-----
  python3 measure_geometry.py frame.png
  python3 measure_geometry.py frame.png --band 80 640     # limit crest search
  python3 measure_geometry.py frame.png --seed 960 238    # force the seed

Extract frames from a reference video first:
  ffmpeg -i ref.mp4 -vf "select='not(mod(n,60))'" -vsync 0 frames/f_%03d.png
"""
import sys, math, argparse

try:
    import numpy as np
    from PIL import Image
except ImportError:
    sys.exit("needs numpy and Pillow:  pip install numpy Pillow")


def luminance(im):
    return 0.2126 * im[:, :, 0] + 0.7152 * im[:, :, 1] + 0.0722 * im[:, :, 2]


def find_seed(L, B, W, H, band):
    """Brightest blue peak among central columns, inside the search band."""
    top, bot = band
    best = None
    for x in range(int(W * 0.40), int(W * 0.60), 8):
        col_b = B[top:bot, x]
        y = int(np.argmax(col_b))
        score = col_b[y]
        if score > 14 and (best is None or score > best[2]):
            best = (x, y + top, float(score))
    if best is None:                      # fall back to plain luminance
        for x in range(int(W * 0.40), int(W * 0.60), 8):
            col = L[top:bot, x]
            y = int(np.argmax(col))
            if best is None or col[y] > best[2]:
                best = (x, y + top, float(col[y]))
    return best


def trace(L, seed_x, seed_y, W, H, step, window=26):
    """Follow the rim outward, staying near the previous column's answer."""
    pts = [(seed_x, seed_y)]
    x, y = seed_x, seed_y
    while 40 < x + step < W - 40:
        x += step
        lo, hi = max(0, y - window), min(H, y + window)
        seg = L[lo:hi, x]
        if seg.size == 0 or seg.max() < 12:
            break
        y = int(np.argmax(seg)) + lo
        pts.append((x, y))
    return pts


def fit_circle(xs, ys):
    A = np.c_[2 * xs, 2 * ys, np.ones(len(xs))]
    sol, *_ = np.linalg.lstsq(A, xs ** 2 + ys ** 2, rcond=None)
    cx, cy = sol[0], sol[1]
    r = math.sqrt(sol[2] + cx * cx + cy * cy)
    return cx, cy, r


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("image")
    ap.add_argument("--band", nargs=2, type=int, default=None,
                    help="top bottom pixel rows to search for the crest")
    ap.add_argument("--seed", nargs=2, type=int, default=None,
                    help="force the crest seed at X Y")
    a = ap.parse_args()

    im = np.asarray(Image.open(a.image).convert("RGB"), dtype=np.float32)
    H, W, _ = im.shape
    L = luminance(im)
    B = im[:, :, 2] - im[:, :, 0]          # blue-minus-red isolates rim light
    band = tuple(a.band) if a.band else (int(H * 0.06), int(H * 0.60))

    if a.seed:
        sx, sy = a.seed
        print(f"seed (forced): x={sx} y={sy}")
    else:
        seed = find_seed(L, B, W, H, band)
        if seed is None:
            sys.exit("no crest found - pass --seed X Y or widen --band")
        sx, sy, score = seed
        print(f"seed: x={sx} y={sy}  (blueness {score:.1f})")

    pts = trace(L, sx, sy, W, H, -14)[::-1] + trace(L, sx, sy, W, H, 14)[1:]
    if len(pts) < 12:
        sys.exit(f"only {len(pts)} rim points traced - check --seed/--band")

    xs = np.array([p[0] for p in pts], float)
    ys = np.array([p[1] for p in pts], float)
    cx, cy, r = fit_circle(xs, ys)
    res = np.abs(np.hypot(xs - cx, ys - cy) - r)

    print(f"\ntraced {len(pts)} rim points, x {xs.min():.0f}..{xs.max():.0f}")
    print(f"FIT  centre ({cx:.0f},{cy:.0f})  radius {r:.0f}")
    print(f"     residual median {np.median(res):.1f}px  max {res.max():.1f}px")

    verdict = ("GOOD - use these numbers" if np.median(res) < 10 else
               "SUSPECT - the trace probably caught text, not the rim;\n"
               "     narrow --band to exclude headlines, or pass --seed")
    print(f"     {verdict}\n")

    print(f"  centre x = {cx / W * 100:.1f}% of width")
    print(f"  centre y = {cy / H * 100:.1f}% of height")
    print(f"  radius   = {r / W * 100:.1f}% of width  ({r / H * 100:.1f}% of height)")
    print(f"  crest    = y {cy - r:.0f}px = {(cy - r) / H * 100:.1f}% of height")
    for ex, nm in ((0, "left"), (W, "right")):
        d = abs(cx - ex)
        if r > d:
            yy = cy - math.sqrt(r * r - d * d)
            print(f"  {nm} edge: silhouette crosses at {yy / H * 100:.0f}% height")
        else:
            print(f"  {nm} edge: no crossing (flanks leave through the bottom)")

    print("\nsuggested resize() values:")
    print(f"  CENTRE_Y    = {cy / H:.3f}")
    print(f"  RADIUS_FRAC = {r / W:.3f}   // of card WIDTH")
    print("  // cap against height too, or a wide short card hides the crest:")
    print(f"  radiusPx = Math.min({r / W:.3f} * w, 0.75 * h);")


if __name__ == "__main__":
    main()
