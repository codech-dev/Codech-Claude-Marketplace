# ShingTik marketing film (worked Mode C example)

"Codech × ShingTik Vegetarian", 1:43, 1920×1080 at 30 fps, delivered 2026-10-01 as `video/shingtik-marketing/renders/codech-shingtik-showcase-v12.mp4` in the Codech Marketing project.

**Story:** opener → problem 1 (CS overwhelmed, orders retyped by hand) → Meet your AI agent → type / photo / voice orders → colour flip → booked in SQL Account → system integration → human takeover → routine vs exceptions → Order Page → ink flip → problem 2 (data nobody can see; generic AI doesn't know you) → an AI that knows your business → company AI portal (dashboard, AI chat, knowledge base, modules) → results → end card.

**Files** (scenes import `./lib` = the template's `assets/marketing-film/remotion/src/lib.tsx`; assets lived in `public/`: `phone-frame.png`, `logos/`, `portal/*.png` screenshots, client logo, `qr-wa.png`):

| File | What to borrow |
|---|---|
| `src/Proof.tsx` | cold-open type morph, phone fly-in, badge punches, bubble burst swirling into the orb; Meet: card growing out of the orb, typewriter, count-up, `@remotion/paths` links with pulses |
| `src/Ch34.tsx` | WhatsApp text order with language switch (`LANG`), photo scan + match ring, ¾ voice-note phone with waveform, green colour flip, ledger rows, integration hub with 8 logo tiles, CS takeover toggle |
| `src/Ch58.tsx` | Order Page flip, ink flip, real-screenshot `Crop` + `Browser` helpers, exploded dashboard / AI chat (rows + chart lifted in place) / knowledge base, module fan → grid → converge, dark results counter |
| `src/Problem.tsx` | inbox overflow, retyping with a wrong-item flash, strike-through summary, routine-vs-exceptions bar, dark data scroll, generic-AI fail, radial "knows your business" sources |
| `src/CaseStudy.tsx` | v17 case-study rework: `Proposal` (6 s): live challenge mini-scenes pulled along bezier paths into the AI orb; solution cards burst out along gold paths and land with a check; struck-through outlines; converge + match cut |
| `src/Opening.tsx`, `src/EndCard.tsx` | originals of the template's opener and end card |
| `src/Film.tsx` | the older absolute-time body + `Remapped` insert layer. New films use `timeline.json` instead |
| `cues.py` | 231-cue SFX sheet with body→film mapping functions (run with `mf_mix.py`, no `--timeline`) |
| `storyboard-build.py` | full storyboard data: 10 chapters, 25 beats, with idea, look, production and review sections |

**Soundtrack:** "Better Times are Coming", Alejandro Magaña, Mixkit #173. 120 BPM, `d0` = 38.583 s, bar = 2.0 s. Fit: `--plan "0:d0+26b, d0+6b:d0+8b, d0+26b:end"` (104.04 s). Mix: music ×0.82, SFX ×0.9.
