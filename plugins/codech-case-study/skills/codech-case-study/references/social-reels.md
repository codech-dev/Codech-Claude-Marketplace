# Social cuts: 9:16 Reels and the 30–45 s version (Mode C, after the master)

Once the 16:9 marketing film is approved, make the cuts the company posts on Facebook and Instagram, plus the posting kit. The Kiddy123 film (14 Oct 2026) is the worked example: `examples/kiddy123-marketing-film/`.

| Deliverable | Size | Length | Where it goes |
|---|---|---|---|
| `social/<slug>-reel-9x16-short.mp4` | 1080 × 1920 | 30–45 s | Instagram + Facebook Reels (the main post), Stories |
| `social/<slug>-reel-9x16-full.mp4` | 1080 × 1920 | full | Second Reel, a few days later |
| `social/<slug>-16x9-short.mp4` | 1920 × 1080 | 30–45 s | LinkedIn, YouTube, presentations |
| `social/<slug>-16x9-full.mp4` | 1920 × 1080 | full | Copy of the approved master |
| `social/cover-9x16.jpg` | 1080 × 1920 | — | Reel cover |
| `social/posting-guide.md` | — | — | Posting plan, captions, specs, pre-post checks (template: `assets/marketing-film/social/posting-guide-template.md`) |

Offer these after the master; don't build them unasked. Agree the short cut's scene list before rendering anything (the story rules still apply: the challenge → our solution → features → how we delivered → results).

## 1. The short cut (30–45 s)

- Write `remotion/src/timeline-short.json`: a subset of the full timeline's scene ids, same `tag`s, same durations. Keep the case-study arc: opener → one challenge beat → the reveal → one feature beat per pillar → how we delivered → results → a shorter end card (~6.5 s). Kiddy123: 10 scenes, 43.65 s.
- **Keep scenes at their full `dur`.** Trimming a scene cuts its animation mid-way; drop whole scenes instead.
- **Re-align the drop.** Pick the challenge beat's duration so the reveal's hit lands on a bar-aligned time (Kiddy123: the pin pulse at 8.0 s = `d0 - 3 bars`).
- `FilmShort` (16:9) and `FilmVShort` (9:16) both read this file through `FilmCut` (starter `Film.tsx`).

## 2. The 9:16 scenes

Write `remotion/src/V.tsx` with a vertical twin of every scene (helpers in the starter's `vertical.tsx`).

- **Same LOCAL timing as the 16:9 scene.** Every `sp()` / `io()` start stays identical, only positions and sizes change. Then the fitted music and `audio/cues.py` work for the 9:16 cuts unchanged.
- **Share the product UI, don't copy it.** Extract each mini UI into its own component (Kiddy123: `FindPanel`, `EnquireDialog`, `CompareTable`, `ContextPanel`, …) used by both the 16:9 and the 9:16 scene. After the refactor, re-render a few 16:9 stills and diff them against the approved storyboard frames: they must be pixel-identical.
- **Generate 9:16 plates.** A 16:9 plate covered into 9:16 is upscaled ~2× and looks soft. Re-run the plate prompts with "9:16 PORTRAIT, 1080x1920 framing" and say where the calm area for text goes ("the top 30 percent is sky"). Kiddy123: `keyframes/gen_plates_v.sh` → `public/plates/v_*.png`.
- **Layout recipe (1080 × 1920):**
  - chapter tag top-left at y 250 (`<FilmCut vertical>` does it);
  - headline at y 330, 70 px side margins, 2–3 short lines at 92–124 px;
  - product UI centred under the headline from y ~575, ending by y ~1500; a 384 × 560 chat panel at scale 1.5–1.7 reads at ~22 px;
  - wide desktop screens (admin dashboards) don't fit: rebuild them as a narrow stacked card (top bar + 2×2 KPI grid + one or two cards) at ~600 css px, scale ~1.55;
  - three side-by-side panels become a vertical stack; four step cards become a 2×2 grid.
- **Safe zones.** Nothing important above y 230 (Reels / Stories header), below y ~1530 (caption, username, audio row), or right of x ~960 from y ~1000 down (like / comment / share). Check stills with `<SafeZones />` from `vertical.tsx`, or draw the lines on a contact sheet.
- **End card:** `<EndCard v />`: logo, headline, stacked contact pills and the QR all inside the safe area.
- Register `FilmV` / `FilmVShort` in `Root.tsx` at 1080 × 1920. Stills: `COMP=FilmV node stills.mjs <out> id=t …`.

## 3. Audio

- Full 9:16 = the master's `audio/final_mix.wav` as is (same timeline).
- Short cut:
  - refit the same track, e.g. `--plan "d0-3b:d0+10b, <outro start>:end"`, starting a few bars before the drop and ending on the track's own outro;
  - trim it to the cut length with a short fade-in and fade-out;
  - mix with the full cue sheet: `mf_mix.py audio/cues.py --skip-missing --timeline remotion/src/timeline-short.json …`. Cues for scenes the short cut leaves out are dropped.
- If the user changes the music later, ask which video they mean (see the Mode C rule on video names).

## 4. Render, encode, check

- Render each cut into its own folder: `npx remotion render src/index.ts FilmVShort out/FilmVShort --sequence …`.
- Encode with `mf_encode.py <seq> --audio <mix> --len <s> --out social/<file>.mp4`.
- Make the cover with `ffmpeg -ss <opener title time> -frames:v 1`.
- Check the cover with a 3:4 centre crop: the Instagram profile grid shows 1080 × 1440 of the 1080 × 1920 cover, so the title must sit inside it.
- Pull a 10-frame contact sheet of each cut and check the safe zones, clipped panels, and the serif fallback (any card outside a font-setting parent).
- Send the short Reel (under 30 MB) and the cover with SendUserFile; the full 9:16 is usually over the limit, so say where it is.

## 5. The posting plan (what to recommend)

1. **Day 1, evening (8–9 pm MYT):** the short 9:16 Reel on Instagram and Facebook, cross-posted from Meta Business Suite, with the cover. Pin it on both profiles.
2. **Same evening:** share it to Stories with a **Link sticker** to the case study. Instagram captions don't make links tappable; Stories do.
3. **Day 3–4:** the full 9:16 as a second Reel.
4. **Any time:** the 16:9 cuts on LinkedIn / YouTube / the website.
5. **Ask the client for a Collab post** on post 1 (it then appears on both Instagram profiles), and tag their Facebook page.
6. No burned-in subtitles: the films are music-led and every scene carries its headline, which suits muted autoplay.

Captions: problem-first hook → what Codech built, for whom, in one or two sentences with the brief's exact numbers → the one trust point → "Full case study: link in bio" → the free AI proposal + interactive prototype offer → 5–8 hashtags. Write them for the company's audience (prospective clients), not for the user.

**Pre-post checks** (put them in the guide and in your reply):
- Is everything the film shows as working actually live? The posts are public and tag the client.
- `client.consent_confirmed`; the client's official handles.
- Licensed music: Mixkit / Pixabay allow commercial use. If Meta flags the audio, dispute it with the licence page. Don't replace the audio with in-app music: business accounts only get the Meta Sound Collection, and it breaks the SFX timing.
- Sample dashboard data is never quoted as real results.

## Gotchas already hit

| Symptom | Cause / fix |
|---|---|
| `mf_mix.py` stops with "at(): scene … not in timeline" on a short cut | The full cue sheet has cues for scenes the cut leaves out: pass `--skip-missing` |
| Vertical backgrounds look soft | 16:9 plates covered into 9:16 are upscaled ~2×: generate 9:16 plates |
| A refactor quietly changed the 16:9 film | Diff re-rendered stills against the approved storyboard frames (mean abs diff should be 0) |
| A regex patch truncated a JSX block | Non-greedy `visual=\{(.*?)\} />` stopped at an inner `} />`: move JSX by line ranges or rewrite the block by hand, then typecheck |
| Text in a floating card renders in a serif | It sits outside any parent that sets `fontFamily`: set the font on every floating card |
| "中文" breaks across lines in a narrow card | CJK breaks anywhere: `wordBreak: 'keep-all'` on short description lines |
