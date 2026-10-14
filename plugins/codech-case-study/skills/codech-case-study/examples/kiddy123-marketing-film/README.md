# Kiddy123 KiddyMatch AI marketing film (13–14 Oct 2026)

A Mode C case-study film for Kiddy123, Malaysia's early-childhood school directory: an AI school-matching assistant (KiddyMatch AI). The source of the **social Reels method** (`references/social-reels.md`) and of the **prototype-faithful product UI** rule.

- 16:9 master 1:16 (18 beats), 9:16 full 1:16, 9:16 and 16:9 short cuts of 43.65 s, cover, FB/IG posting kit.
- Look "D · Tiny Town": photoreal tilt-shift Klang Valley aerials (ChatGPT Image via Codex), with KiddyMatch mini UIs and kinetic type on top. It was picked from a second round of concepts after round 1 (three flat, code-drawn worlds) was rejected.
- Music: Pixabay px590383 "Presentation – Presentation Music" (Tatamusic, 90 BPM), drop on the reveal's pin pulse. 205 SFX cues (122 in the short cut).

## Files

| File | What it shows |
|---|---|
| `src/Proto.tsx` | **Faithful rebuild of the client's approved prototype**: its exact tokens, fonts (Plus Jakarta Sans + Nunito Sans), chat header, bubbles, typing dots, school card, enquiry dialog, toast, admin frame, KPI cards, growing bars, table. Laid out at the prototype's CSS px and scaled with `Scale k`. |
| `src/Chat.tsx` | The chatbot scenes (finder, enquiry, compare, listing context, 中文, "never a guess", intent analytics, lost matches, sponsorship, results). The product blocks are shared components (`FindPanel`, `EnquireDialog`, `CompareTable`, `CompareChat`, `ContextPanel`, `ChinesePanel`, `GuessPanel`, `GapsCard`) that both orientations use. |
| `src/Engine.tsx` | "Facts from the database" (three glass panels joined by pulse paths, 15,074 → 3 counter) and "How we delivered" (four step cards from `useDeliverSteps()`). |
| `src/Town.tsx` | Plate-based scenes: opener, challenge beats, reveal (challenge chips pulled into a glowing pin, POI tags over the schools), end card on the film's plate; kinetic headline `THead` with a sun marker. |
| `src/V.tsx` | **The 9:16 twins of all 18 scenes**: same local timing, 9:16 plates, headline at y 330, UI centred from y ~575, stacked admin card, 2×2 step grid, `<EndCard v />`. Exports `FilmV` / `FilmVShort`. |
| `src/Film.tsx`, `src/Root.tsx` | `FilmCut` over `timeline.json` / `timeline-short.json`, entrance transitions (`TRANS`), the four compositions. `Root.tsx` also registers the throwaway concept-pitch compositions (`Concepts*.tsx`, not included). |
| `src/timeline.json`, `src/timeline-short.json` | Full 75.87 s edit and the 43.65 s short cut (whole scenes only; the reveal pulse at 8.0 s = the drop). |
| `audio/cues.py` | The cue sheet both cuts use (`mf_mix.py --skip-missing` for the short one). |
| `audio/pixabay/` | Pixabay search + download (`px_find.py`, firecrawl), ranking (`px_rank.py`) and the shortlist page with film previews (`px_shortlist.py`). Set `SK_SCRIPTS` or they use the newest installed skill. |
| `keyframes/gen_plates.sh`, `gen_plates_v.sh` | The 16:9 and 9:16 plate prompts (realistic Klang Valley; no text, signs or logos in the images). They run Codex `$imagegen`; the model flag is account-specific. |
| `social/posting-guide.md` | The posting kit as delivered (plan, captions, specs, pre-post checks). |

## User decisions worth knowing

- **Focus:** the AI chatbot only. The website redesign and the speed work were cut from the film, though the case study covers them.
- **Status:** the project was shown as completed (the user's decision for this case). The posting guide still asks whether it is live before posting.
- **Content:** real schools, photos and fees (the client's published listings) were OK. Dashboard figures are sample data and labelled as such.
- **"How we delivered":** Propose AI Solution → Clickable interactive prototype → AI Development → Production. No dates. The proposal card shows the chatbot proposal's cover, cropped above the fee line.
- **Video names:** "showcase demo video" meant the case-study page's product tour (Mode B), not this film. A soundtrack swap went to the wrong video and was reverted.
