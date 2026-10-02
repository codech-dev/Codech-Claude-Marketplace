# Mode C: marketing film (motion-graphic product showcase)

A 60–110 s SaaS-launch-style film (reference: ClickUp's product videos, youtu.be/feAJjhF4_-M) that sells **what Codech builds**, using one client deployment as the proof. It is built frame by frame in Remotion (React) and scored with a royalty-free track fitted to the cut, plus synced sound effects. Worked example: `examples/shingtik-marketing-film/` (ShingTik, 1:43, delivered 2026-10-01).

How it differs from the Mode B product film (`film.md`):

| | Mode B product film | Mode C marketing film |
|---|---|---|
| Purpose | Tour of the case study, shown on the case page | Ad, social or website hero film that sells Codech |
| Source | Recorded from the vignettes | Hand-built Remotion scenes |
| Story | Feature by feature | Problem → solution, once per solution |
| Motion | Vignette playback with captions | Kinetic type, exploded UI, match cuts, colour flips, varied camera |
| Audio | make_music bed | Licensed track fitted bar-exactly, plus about 200 SFX cues |

## Rules (apply to every film)

**Positioning: Codech is the builder; the client is the proof.**
- Headlines speak to the viewer about what Codech builds: "Meet your AI agent", "Meet your AI workspace", "Search by meaning".
- The client appears as a credit ("Built for ShingTik Vegetarian"), in the real screens, chats and flows, and in the results ("~90% of ShingTik's sales orders").
- A product name that contains the client's name (e.g. "OTSO AI Hub") may appear on screens and in the credit, but not as a headline subject.

**Story: problem before every solution.**
- Each solution chapter opens with the pain it removes and closes with a payoff line.
- ShingTik: CS overwhelmed → WhatsApp AI agent → "AI handles the routine". Data nobody can see, and generic AI that doesn't know the business → company AI portal.

**Visual-first.**
- Headlines of 5 words or fewer; no paragraphs.
- Motion graphics, not live action. AI-generated product photos and people (avatars, profile photos) are fine; the user asked for them from ShingTik v13 on. Never AI-generated UI: image models garble text and invent screens.
- Use the real product screens (2x) and code-built UI.

**A new look for every film.** The user picks it from three pitched concepts (workflow step 3). Never reuse an earlier film's palette, motifs or signature moves: the user rejected an OTSO draft that looked like the ShingTik film.
- The chosen concept sets the palette, the visual thread (ShingTik: orange orb; OTSO "Midnight Vault": cobalt scan beam), the camera language and the music style.
- Codech gold `#D4B895` is the brand accent: keep it at least on the end-card logo, even when the concept's own accent differs.
- Past looks, so the next pitch avoids them: ShingTik = light cream `#FAF8F4` + champagne gold, frosted orange orb, ink flip; OTSO = Midnight Vault (navy `#070B18`, cobalt `#3D7BFF`, glass document slabs).
- The client's brand colours appear only inside their product screens.

**Varied camera.** No two consecutive scenes share an angle. Options: front ¾, overhead flat lay, side profile, tilted iso window, low hero, locked-off kinetic type.

**Real-looking UI.**
- Phones use the photoreal frame (`public/phone-frame.png`), with rotateY kept between −40° and −14°. The user rejected flat mockups and a steep side angle.
- Desktop products use `Browser` / `Crop` windows.
- Chats start at the top under a "Today" pill.
- The send button shows a mic when the input is empty and a paper plane while typing.
- Language chips must actually switch the text.

**End card on the film's theme** (template `EndCard.tsx`): logo reveal, "Let's build yours.", website / email / phone pills and the WhatsApp QR. The user rejected a green end card that clashed with the film.

**Accuracy.** Defaults come from `intake-and-accuracy.md`:
- Facts and numbers come from the brief, worded exactly.
- Unbuilt features get an "In build" or "Coming next" label, or are cut.
- Showing an unbuilt feature as production is allowed only when the user explicitly decides so for this film. ShingTik's film did this for the Order Page and portal; record the decision in the plan.
- Check `client.consent_confirmed` before naming the client or publishing its numbers. If it is false, the film can be built but not posted.
- Per-client restrictions carry over (ShingTik: no pricing, no client URLs).

**Audio.**
- No voiceover unless asked; the user declined VO for ShingTik.
- Use a Mixkit track starting from its own intro.
- The user rejected synthesized beds, generic "corporate" beds and club EDM.

### Adapting to a different product
The ShingTik film is one instance; keep the principles and swap the props:

| ShingTik-specific | General rule | Example for a document/workspace product |
|---|---|---|
| "Meet your AI agent", orange orb | One hero reveal of the AI Codech built, via a match cut | "Meet your AI workspace"; the orb or a glowing search bar |
| WhatsApp phone, bubbles, `C.wa`, SendBtn | Show the channel the client's users actually use | Desktop `Browser` windows; a phone only if there is a mobile app |
| Green colour flip | Flip into one saturated colour from the product, or ink | Ink or the client's primary colour |
| "AI System" hub with 8 logo tiles | One expertise beat: what it plugs into | SSO, LLM, database and storage logos |
| `lib.tsx` WhatsApp parts | Unused components are harmless; delete them or leave them | n/a |

## Workflow

**Folder layout.** Every command below runs from the film root `video/<client-slug>-marketing/`:

```
video/<client-slug>-marketing/
  storyboard/   build.py, _head.html, frames/<id>.jpg, index.html
  remotion/     the Remotion project (src/, public/, out/)
  audio/        lib/ (tracks, shortlist), fit.json, music_fit.wav, sfx/wav/, cues.py, final_mix.wav
  renders/      cuts, masters, previews, contact sheets
```

`SK` = this skill's folder, from the newest installed copy.

Save a plan to `docs/superpowers/specs/<date>-<slug>-marketing-film.md` first. It holds the beat list plus the open decisions: consent, status of unbuilt features, product naming and which numbers to use. Then work **one chapter at a time**: build its scenes roughly, pull stills into the storyboard, show the user, and refine. The user iterates per scene.

### 1. Brief and beat list
Read the case pack (`PROJECT_BRIEF.md`, screenshots, `case.json` if the case study exists) and any earlier storyboard for this client. The beat list runs:
1. Opener
2. Problem → solution → payoff, once per solution
3. Expertise / integration beat
4. Results
5. End card

Typical size: about 10 chapters, 25 beats, 1:40.

### 2. Set up
```
cp -r $SK/assets/marketing-film/remotion remotion && (cd remotion && npm i)
cp -r $SK/assets/marketing-film/storyboard storyboard && mkdir -p storyboard/frames audio renders
```
- **`remotion/src/brand.ts`:** client name and title, the client logo (trimmed PNG in `public/`), three pillars with their dot colours, contacts.
- **Screens:** copy 2x screens into `remotion/public/screens/`. Use the pack's 2x walkthrough if present; 1x `ui-screens` crops look soft at 1080p. Otherwise capture with `scripts/capture_screens.py`.
- **Logos:** tool logos come from `$SK/assets/shared/logos/`.
- **WhatsApp QR:** `python -c "import segno; segno.make('https://wa.me/60139473347').save('remotion/public/qr-wa.png', scale=10, border=2)"`. It is already in the template.
- **OneDrive:** `npm i` inside OneDrive is slow. Junction `remotion/node_modules` to an existing install if needed (PowerShell `New-Item -ItemType Junction`), then pass `--browser-executable=<real node_modules>/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe` to render/still.

### 3. Pitch three visual concepts (before any storyboard)
For every new film, pitch **three new visual concepts** and let the user choose. Don't start the storyboard until they pick (or ask for a mix).
- **Make them genuinely different.** Vary the light (dark / white / mid-tone), the world (space, paper, canvas, studio, architecture…), what stands in for the AI (beam, ink, caret, orb…), the camera language and the music. None may resemble an earlier film's look (see the rule above).
- **Show, don't describe.** The user asks for "the visual look" when given text options. For each concept, render **two Remotion stills**: the hero reveal ("Meet your …") and one product beat on a real 2x screen. Write them as throwaway compositions in `remotion/src/Concepts.tsx`, register them in `Root.tsx`, and render with `node concept-stills.mjs ../concepts` (from `assets/marketing-film/concepts/`, copy it into `remotion/`; it bundles once). Look at the stills and fix overlaps before showing them.
- **Publish one comparison page** (`assets/marketing-film/concepts/index-template.html` → `concepts/index.html` + the six JPGs) as an Artifact. Each concept gets its frames plus World / Camera / Music / Colour swatches. Mark one **Recommended** with a one-line reason tied to the client (OTSO: a regulated brokerage → "secure and premium", next to its navy product).
- Record the pick in the plan and in memory, then build the storyboard in that look.
- Worked example: the OTSO pitch (Midnight Vault / Ink & Paper / Infinite Canvas) in `assets/marketing-film/concepts/Concepts.example.tsx`.

### 4. Storyboard + scenes, chapter by chapter
**Scenes**
- `remotion/src/Scenes.tsx` has starter scenes (KineticProblem, PhoneHero, ExplodedUI, ColorFlip, OrbReveal). `lib.tsx` provides:
  - fonts and colour tokens `C`;
  - `useT()` (`t`, `sp`, `io`, `out`, `expo`);
  - `Headline`, `Phone`, `Bubble`, `SendBtn`, `Orb`, `Backdrop`, `Cursor`;
  - `Browser` / `Crop` / `LIFTED` for real screenshots.
- More recipes are in `examples/shingtik-marketing-film/src/` (see its README).
- Write each scene in **local time** (t = 0 at its start). Register it in `Film.tsx` and list it in `src/timeline.json` (`[{id, dur, overlap}]`).
- Inserting or retiming a scene is a one-line change in `timeline.json`, and the SFX cue sheet reads the same file. The ShingTik example predates this: it used absolute body times plus a `Remapped` insert layer, so don't copy its `Film.tsx`.

**Stills and the storyboard**
- To iterate on one beat, point the `Scene` composition in `Root.tsx` at it and check stills at several frames, including mid-animation:
  `(cd remotion && npx remotion still src/index.ts Scene out/s.jpg --frame=45)`
- Storyboard frames are stills of these scenes, so the storyboard always shows the real film. Draft 1 uses rough scenes; nothing else is allowed (no AI images). Render them all in one bundle with `stills.mjs` (in the starter): `(cd remotion && node stills.mjs ../storyboard/frames <frame-id>=<local s> <frame-id>=<scene>@<local s> …)`; a bare `id=s` takes the time inside the timeline scene of the same id.
- Fill the storyboard DATA block in `storyboard/build.py`: every scene gets On screen / Camera / Action / Motion & FX / Transition / Sound. Then run `python storyboard/build.py` and publish `storyboard/index.html` + `frames/` as an Artifact.
- Bump `VERSION` and tag changed scenes in `NEW` each round. Edit the data, never the generated HTML.

### 5. Motion language (the bar)
The user rejected a static HTML-engine cut and a Higgsfield image-to-video test as "too plain". ClickUp level means:
- **2–4 s beats** on the music's bar grid, with a cut, slam or reveal on every bar.
- **Kinetic headlines** (`Headline`): lines snap up out of masks, the gold word gets an underline wipe, per-letter mode for hero words, strike-throughs on problem beats.
- **Exploded UI**: the real screen flies in tilted, then key panels (KPI cards, an alert, answer rows, the chart) lift toward camera with a deep shadow. Lift crops in place; never use `translateZ`.
- **Match cuts, not fades**: bubbles swirl into the orb, the orb becomes the card's avatar, zoom through an icon into the next scene, a scan line stretches into the gold line, whip pans with blur.
- **Colour flips**: a full-screen circle wipe with three words slamming in on the beat.
- **Springs on every entrance**, `expo` wipes, count-ups, SVG paths drawing with travelling pulses (`@remotion/paths`), a cursor with click ripple, floating cards converging on soft gradients, and one visual thread (gold line or orb) linking beats.

For a new reference video, run Higgsfield `video_analysis_create` then `video_analysis_status` to get a scene-by-scene breakdown for the beat list. Don't use Higgsfield video generation for UI: it garbles text and looked plain.

### 6. Silent cut
```
(cd remotion && npx remotion render src/index.ts Film out/seq --sequence --image-format=jpeg --jpeg-quality=90)
python $SK/scripts/mf_encode.py remotion/out/seq --out renders/cut-v1.mp4
python $SK/scripts/mf_encode.py --stills renders/cut-v1.mp4 --at 3,10,20,40,60,90 --sheet renders/check.jpg
```
- Never put `<Audio>` in a composition or let Remotion stitch: its bundled ffmpeg/ffprobe crash on this Windows PC.
- Render into a clean `out/seq` each time.
- Look at the contact sheet before showing anyone.

### 7. Soundtrack
1. **Shortlist.** Run `python $SK/scripts/mf_music.py find --out audio/lib --film renders/cut-v1.mp4 --title "<Client> soundtrack shortlist"`. It:
   - scrapes Mixkit tag pages (JSON-LD `MusicRecording`);
   - downloads about 24 candidates to `audio/lib/tracks/<id>.mp3` and ranks them by energy;
   - writes 25 s peak auditions plus **film previews scored from each track's beginning** to `audio/lib/shortlist/` with an `index.html`.

   Publish the shortlist as an Artifact (page + mp3/mp4 files) and let the user pick. ShingTik's pick was "Better Times are Coming" (Mixkit #173, synth-pop, 120 BPM).
2. **Analyse.** `python $SK/scripts/mf_music.py analyse audio/lib/tracks/<id>.mp3 --json audio/fit.json` gives the BPM (comb-refined), the bar length and `d0`, the drop downbeat with the biggest energy rise.
3. **Fit.** `python $SK/scripts/mf_music.py fit audio/lib/tracks/<id>.mp3 --params audio/fit.json --plan "0:d0+26b, d0+6b:d0+8b, d0+26b:end" --out audio/music_fit.wav --target <film s>`
   - It splices whole bars (`b`) with 20 ms equal-power crossfades.
   - Start at 0, so the track's own intro plays.
   - Lengthen by repeating main-section bars before the original ending.
   - Choose the plan so the drop lands on the hero beat (it prints where `d0` lands), then nudge `timeline.json` to the bar grid.

Licence: Mixkit Stock Music Free License (commercial use, no attribution). Pixabay audio blocks scripts, and FreePD is closed.

### 8. Sound effects and the final mix
1. **Palette.** `python $SK/scripts/mf_sfx.py fetch --out audio/sfx/wav` downloads 29 sounds (pops, notifications, clicks, typing, sweeps, whooshes, impacts, shutter, error, ticks). `search <tags>` finds swaps.
2. **Cue sheet.** Copy `$SK/assets/marketing-film/cues-template.py` to `audio/cues.py` and write `q(sound, at('<scene id>', local_t), gain_db, ln=, pre=)`.
   - Read times off the scene code: every `sp()`/`io()` start that lands something is a hit.
   - Pre-roll whooshes (`pre=W`) so they peak on the cut.
   - Trim typing with `ln=`.
   - Gains run from −8 dB (hero hits) to −20 dB (tick runs). ShingTik used 231 cues.
3. **Mix.** `python $SK/scripts/mf_mix.py audio/cues.py --timeline remotion/src/timeline.json --music audio/music_fit.wav --sfx audio/sfx/wav --len <film s> --out audio/final_mix.wav`
4. **Encode the master.** `python $SK/scripts/mf_encode.py remotion/out/seq --audio audio/final_mix.wav --len <film s> --out renders/<client>-showcase-v1.mp4` (crf 20, ~25 MB for 1:43). Bump vN each round.

### 9. Deliver
- Make a preview with `mf_encode.py ... --preview` (1280 wide, crf 25) for SendUserFile, which has a 30 MB limit.
- Refresh the storyboard frames from the final render and republish.
- Offer other cuts rather than assuming them:
  - **9:16 / 1:1:** add a `Composition` at 1080×1920 or 1080×1080 and re-lay each scene for the narrow frame.
  - **30–60 s:** a shorter `timeline.json`.
  - Captions aren't needed, because the headlines are the text and the film is music-led, so it reads on muted autoplay.
  - Not built yet; budget a pass per format.
- Record the music pick, the positioning and status decisions, and open items in memory.

## Gotchas already hit

| Symptom | Cause / fix |
|---|---|
| Remotion crashes at "stitching" or on audio | Bundled ffmpeg/ffprobe crash: render a JPEG sequence, encode with `mf_encode.py`, no `<Audio>` |
| Checked frames don't match the edit | `--frames=` partial renders use 3-digit names when the max frame is under 1000: render into a clean folder (`mf_encode.py` refuses mixed widths) |
| Render: "Failed to launch the browser process" | `node_modules` is a junction: pass `--browser-executable` (see Set up) |
| ffmpeg xfade "timebase mismatch" | Add `fps=30,settb=1/30` to both inputs |
| Chips/cards overlap in a radial layout | Angles that alias (−150° = 210°): space them explicitly and check a still |
| Lifted panel sits beside its slot | `translateZ` + perspective: scale in place instead |
| End-card logo looks off-centre | Guides, rings and logo must share one centre (`GY`) |
| Phone visible during the cold-open type | Hide it until its entrance (`opacity: t < 1.3 ? 0 : 1`) |
| "Unterminated string literal" after a Python patch | A `\n` was written into a TS single-quoted string: use template literals |
| Storyboard spec on the wrong card | The HTML was patched by hand: edit `build.py` data and rebuild |
| Music sounds chopped | Splice points aren't whole bars from `d0`: use `b` units in `--plan` |
| Track too short for the film | Repeat main-section bars before the ending; never loop the intro |
