# Codex image generation (preferred image source)

"Our OpenAI Codex imagegen" = the **Codex CLI's built-in `image_gen` tool** (the `imagegen` system skill under `~/.codex/skills/.system/imagegen`). It runs on the signed-in ChatGPT account, so **no API key** is needed. It produces photoreal people, transparent cutouts and full scenes that are far closer to production quality than FLUX placeholders. Use it whenever `codex` is on PATH. Fall back to the Hugging Face script (Phase 3.6, Option B) only when it isn't.

## Quick reference

| Step | Command / rule |
|---|---|
| Check Codex is there | `codex --version` |
| Write the prompt | A temp file outside the project (your scratchpad/temp dir), using the shape below. Copy it to `docs/design/images/PROMPT.md` afterwards. |
| Run (PowerShell) | `Get-Content -Raw prompt.md \| codex exec --skip-git-repo-check -s workspace-write -m gpt-6-sol -c model_reasoning_effort="medium" -` |
| Run (bash) | `codex exec --skip-git-repo-check -s workspace-write -m gpt-6-sol -c model_reasoning_effort="medium" - < prompt.md` |
| Time | About 30 s per image (9 images ≈ 6 min). Run it as a background command. |
| Collect | `py -3 -I scripts/imagegen/collect_codex_images.py --out docs/design/images/raw --since-minutes 30 hero-student teacher-1 teacher-2`. Names are bare (no `.png`), in the same order as the prompt's numbered list. Run it right after the Codex run finishes: it takes the newest N images, and `--since-minutes` stops older runs leaking in. Add `--dry-run` to preview the mapping. |
| Check | `uv run scripts/imagegen/contact_sheet.py docs/design/images/raw sheet.jpg`, then look at sheet.jpg. Each filename must match its subject. Magenta behind a cutout means real transparency. |
| Web-ready | `uv run scripts/imagegen/optimize_images.py docs/design/images/raw prototype-app/images hero-student=1100 centre-class=1280`. Each `name=px` caps that file's **longest side** in pixels (default 640 for unlisted files). Transparent PNGs have empty margins trimmed first, then everything is saved as WebP q82. |

## Known quirks (each one cost a failed run)

1. **Model flag is required.** The config default model (for example `gpt-6.1-sol` / `gpt-6.1-terra`) can fail with *"model is not supported when using Codex with a ChatGPT account"*. Pass `-m gpt-6-sol`. If that model also fails, look in the newest `~/.codex/sessions/**/rollout-*.jsonl` for a `"model":` value from a run that succeeded. Never edit the user's `~/.codex/config.toml`.
2. **Codex cannot copy the images out.** Its sandbox denies reads under `CODEX_HOME`, so even if the prompt says "copy into docs/design/images", the files stay in `~/.codex/generated_images/<session-id>/exec-*.png`. Copy them yourself with `collect_codex_images.py`. It takes the newest N images in creation order and assumes they match the prompt order, so always confirm with the contact sheet.
3. **Say "built-in mode — NOT the CLI fallback, no API key".** Otherwise Codex may try the imagegen skill's Python fallback, which needs `OPENAI_API_KEY`.
4. **Say "Do not ask questions".** `codex exec` is non-interactive, so a clarifying question ends the run with no images.
5. **Outputs are about 2 MB PNGs.** Never link them directly from a page. Run `optimize_images.py`, which converts to WebP and trims transparent margins, so files end up around 40–150 KB.

## Prompt shape

One file, three parts: the instruction line, shared rules, then a numbered list with **filename, size, transparency, subject**. Sizes are `1024x1536` (portrait), `1024x1024` (square) or `1536x1024` (landscape).

```markdown
Use your built-in image_gen tool (imagegen skill, built-in mode — NOT the CLI fallback, no API key) to generate 9 website images for a Hong Kong tuition-centre website mockup. Do not ask questions; just generate all of them, one image_gen call per image. When done, list the saved paths.

Shared rules for ALL images:
- Photorealistic, premium commercial photography for an education brand, natural and warm, not stock-cliché.
- All people are Hong Kong Chinese (East Asian), natural-looking, genuine relaxed smiles, correct hands and fingers.
- No text, no logos, no watermarks, no readable writing on screens/books/whiteboards.
- Colour mood: bright, clean, optimistic; soft daylight; touches of royal blue and warm sunny yellow welcome.

1. `hero-student.png` — portrait 1024x1536, TRANSPARENT background (true alpha cutout).
   Hong Kong primary school girl about 9, typical HK primary uniform (light blue dress, white Peter Pan collar), holding an exercise book against her chest, smiling at camera. Waist-up, soft studio lighting. Clean cutout edges for placing over a coloured circle.

3. `teacher-1.png` — square 1024x1024. Seamless warm cream backdrop (#FFF4E6), head-and-shoulders, consistent lighting across all four teacher portraits.
   Female Hong Kong Chinese teacher about 30, soft beige cardigan over white blouse, warm approachable smile.

8. `online-class.png` — landscape 1536x1024, full scene (no transparency).
   A Hong Kong boy about 10 at a compact desk in a bright, tidy HK apartment, headphones on, live online class on a laptop (blurred video call, nothing readable). Soft-focus HK high-rise towers through the window.
```

### What makes the prompt work

- **Localise people and places to the client's market.** Write the actual ethnicity, school uniform, apartment type and skyline. Reference sites in Asian markets (for example sino-bus.com) win trust with real local faces, and a generic "diverse students" prompt does not deliver that. The same slots apply to any market:
  - Hong Kong: HK Chinese, HK school uniforms, high-rise flats, Victoria Harbour.
  - Singapore: Chinese, Malay and Indian mix; HDB estates; Marina Bay skyline.
  - Malaysia: Malay, Chinese and Indian mix; terrace houses or condos; KL skyline.
- **Match each asset type to its use in the layout:**
  - Hero subject: a **transparent cutout**, placed over a brand-colour blob with floating stat chips.
  - Team or tutor portraits: a **shared seamless backdrop and lighting** so the set looks like one shoot.
  - Context shots (online class, centre, store): **full scenes**.
- **Ban text in images.** Generated text comes out garbled, and the real copy belongs in HTML.
- **Name the brand colours as "welcome, not required"**, so the photos pick up the palette without looking tinted.

## Using the images in the mockup

- Hero cutout: `absolute bottom-0 h-full md:h-[105%] object-contain object-bottom` over an `aspect-square` brand-colour blob. On phones, keep the blob ≤ 70% of the container width so its top isn't clipped.
- Record the prompt file next to the images (`docs/design/images/PROMPT.md`) so the set can be regenerated consistently.
- Real client photos always replace generated people before launch. Say so in the proposal.
