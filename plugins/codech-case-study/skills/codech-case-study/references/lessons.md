# Lessons (bugs already hit; check these during QA)

| Symptom | Cause | Fix (already in the shared assets unless noted) |
|---|---|---|
| Card demo tag rendered in mono uppercase green | reused landing class `.live` | status classes are `st-live`/`st-build`; prefix all new classes |
| Vignette layouts broke on the landing page | generic scene classes (`.sec`, `.tag`, `.row`, `.who`) collided with landing CSS | scope scenes.css to `.ovp-<slug>`; name classes `ov-*` |
| Scene text indented / panel overflowing only in a test page | the test page's own `.c p` label style hit the scene's paragraphs | test harnesses need scoped class names too (preview_scenes.py uses `.c > .lbl`) |
| Mobile content touching screen edges | `.hero{padding:56px 0 0}` shorthand wiped `.wrap`'s side padding | use `padding-top` on elements that also have `.wrap` |
| Phone page scrolled sideways 522px | build wrote inline `grid-template-columns` (pipeline, deck tabs) that beat the mobile media query | pass counts as CSS variables (`style="--n:5"`); never inline layout that mobile CSS must override |
| Hero blank for 1–2 s | reveal-on-scroll waited for IntersectionObserver | items already in the viewport get `.in` immediately (case.js) |
| QA full-page shots with blank sections | harness scrolled before first paint, so reveal-on-scroll never saw the middle | qa_shots.py waits for networkidle + 1.5 s and scrolls at 350 ms steps; cross-origin iframes still render blank in full-page shots (check them with a viewport shot) |
| First paint ~2.7 s in tests | Google Fonts download in the sandbox | not a page bug; landing has the same; verify by blocking fonts |
| Screenshot frames unreadable in cards | full screens scaled to ~400 px | vignettes instead of screenshots |
| Callout pill covering the channel's "Private" badge | note placed inside the window | put notes over window margins (`top:-4px` etc.) |
| Dialog content clipped; cursor clicked empty space | vignette height over budget | remove a row; re-check with preview_scenes.py |
| Progress bars not filling in the film | inline width overrode the `.done` class | set `bar.style.width='100%'` on completion |
| Poster caught mid-fade | poster timestamp during a caption swap | pick `--poster-at` inside a scene; check the still |
| Embedded proposal wouldn't scroll | "Loading…" placeholder overlaid the iframe until `load` | placeholder behind, `pointer-events:none` |
| Full screen reloaded the embed | moving the iframe in the DOM reloads it | toggle a class on the same element (`position:fixed`) |
| Prototype squeezed on phones | desktop-only prototype | mobile shell in our hosted copy (embeds.md) |
| Live site showed an empty demo panel | another session deployed index.html without our work/ files | stage_deploy.py mirrors work/ every time; verify content types |
| `.js` "200 OK" but broken | Pages serves index.html for missing paths | check Content-Type, not status |
| User's screenshot showed old version | phone cache | tell them to refresh; verify with `?v=` |
| Claims drifted ("under 6 weeks" vs 37 days) | rounded numbers | compute from dates, state exactly |
| Presenting in-build feature as shipped | brief said "designed, not built" | In build pills + section note, everywhere |
