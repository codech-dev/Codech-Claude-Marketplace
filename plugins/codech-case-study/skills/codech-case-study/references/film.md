# Product film

A captioned tour recorded from the vignettes, so it always matches the page. Captions only (no voiceover) unless the user asks otherwise.

## Structure (film-template.html, generated into work/<slug>/_film/film.html)
1. Intro, ~3.6 s: client logo chip, product name (first word plain, rest highlighted), tagline, "Designed & built by Codech".
2. One chapter per feature with a `film` entry: left column = product-area pill with Live/In build, `01 / 06`, big caption, sub caption; right = the vignette at 1140px; bottom = labelled progress bar per chapter.
3. Outro, ~5 s: three stats, a line, a CTA ("Book a free AI audit with Codech"). No URL unless the user gives a confirmed public domain.
Social cut (1080×1350): only `film.social_scenes`, stacked layout, speed 1.3.

## Record
```
python scripts/record_film.py <site> <slug> [--fmt wide|social|both] [--poster-at 10]
```
Chrome's screencast streams timestamped JPEG frames while the page plays in real time (~55 fps); they're resampled to 30 fps and encoded H.264 (crf 20, faststart). About 6 MB per minute at 1080p. Playwright's own video recorder is deliberately not used: text comes out soft and blocky.
Outputs: `assets/film.mp4`, `assets/film-poster.jpg`, `assets/og-cover.jpg` (1200×630 crop), `_film/social.mp4`, `_film/social-poster.jpg`.

## Check before shipping
Extract stills and look at them:
```
ffmpeg -ss 10 -i work/<slug>/assets/film.mp4 -frames:v 1 check.jpg      # imageio_ffmpeg.get_ffmpeg_exe() gives the binary
```
- The poster/OG frame must show a finished scene with captions fully visible (OTSO's first poster caught a caption mid-fade; re-run with a different `--poster-at`).
- Progress bars fill as chapters complete; labels fit on one line (use short `film.label`s).
- Callout pills don't cover key UI.
Then set `film.duration_label` to the real length and re-run `build_case.py` (it adds the "Watch the film" button when `assets/film.mp4` exists).
