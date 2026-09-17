# Generating the clips: still image → seamless looping video

How to get from "we need a background for this section" to two clips that drop
into the page with no visible seam. [04-video-backgrounds.md](04-video-backgrounds.md)
covers playing them; this covers producing them.

Written against Higgsfield (MiniMax H3 2K), but the structure applies to any
image-to-video model **that accepts both a start and an end frame**. If the
model you have cannot take an end frame, pick a different one — everything
below depends on it.

## The two-clip structure

One clip cannot be both an entrance and a seamless loop: a loop needs its first
and last frames identical, and an entrance by definition starts somewhere else.
So each section gets two.

| Clip | Start frame | End frame | Plays |
|---|---|---|---|
| **intro** — the object arrives | the empty plate | **the rest pose** | once, when the section comes on stage |
| **loop** — the object at rest | **the rest pose** | **the rest pose** | forever after |

Both clips end and start on the *same image*, so the hand-off is invisible.
That shared image is the single most important artefact in this pipeline.

## Step 1: build the plate and the rest pose

MP4 has no transparency. Flatten the artwork onto a flat fill, and make the
empty plate from **that same fill**:

```bash
# rest pose  = end frame of intro, start AND end frame of loop
magick art-01.png -background "#0A3566" -flatten rest-01.png

# empty plate = start frame of intro; same size, same fill, nothing on it
magick -size 1000x1000 xc:"#0A3566" plate-01.png
```

Pick a fill per section that matches the section's own wash, dark:

| section | fill |
|---|---|
| 1 | `#0A3566` deep navy |
| 2 | `#5A1A0C` deep burnt orange |
| 3 | `#1B1F52` deep indigo |
| 4 | `#083A36` deep teal |

**Better still: skip compositing entirely.** The approach that finally shipped
was to make the *whole background* the video — the gradient wash and the object
in one clip — so there is nothing to composite and nothing to match. Capture
the inputs from the page itself:

- the section's CSS wash at full opacity, everything else hidden
  (1920×1080 desktop; 432×768 upscaled ×2.5 for phone)
- the same frame with the transparent artwork composited in
  (desktop: 560px box at 58–88% width, centred vertically;
  phone: 640px box at 20–80% width, top at 12.5%)

That pair *is* your plate and rest pose, already in the page's own colours.

## Step 2: settings

| Setting | Value |
|---|---|
| Mode | image-to-video with **both** start and end frame |
| Duration | 5 s each |
| Aspect | 16:9 desktop, 9:16 phone (or 1:1 for an in-card figure) |
| Camera | locked — no zoom, pan, orbit, dolly |
| Motion strength | intro: medium · loop: low |

## Step 3: prompts

**Shared negative prompt, every clip:**

```
fade in, dissolve, cross-fade, blur in, objects popping into existence,
objects appearing from nothing, camera movement, zoom, pan, orbit, dolly,
new objects, morphing, deformation, text, logo, background change, flicker,
fast motion, particles, people, hands
```

"Fade in" and "appearing from nothing" are there on purpose. Given a blank
start plate, the model's laziest answer is a dissolve. **The cure is in the
positive prompt: say where the object comes from**, so it has no need to
invent an arrival.

**Intro prompt** — describe physical arrival, and state that everything comes
to rest in the final composition:

> Start on an empty dark surface. The bottom cube drops in from above and lands
> with a soft, weighty settle. The second cube drops onto it and settles. The
> third cube descends toward the top of the stack but stops just short and
> hovers, tilting slightly, as a cyan light ignites in the gap beneath it. The
> ringed disc rolls in from the right and leans to rest against the base.
> Specular highlights catch each cube as it lands. **Everything comes to rest
> exactly in the final composition. Locked camera, no zoom, no pan.** Studio 3D
> render, glossy navy blue, cyan rim light, subtle ground glow.

**Loop prompt** — name what moves, and explicitly name what does *not*:

> The top cube hovers in place, drifting up and down very slightly and slowly
> rotating a few degrees on its vertical axis, suspended by the cyan light
> beneath it. The cyan glow pulses gently. Specular highlights slide slowly
> across the glossy surfaces. **The lower two cubes and the ringed disc stay
> perfectly still.** Locked camera. Slow, calm, seamless loop returning to its
> starting pose.

Be concrete about loop motion. "Drifts almost imperceptibly" was read loosely
and produced a visible light sweep across the gradient on two clips — they
wrapped cleanly but the motion was wrong for the brief.

## Step 4: accept or regenerate

Check before post-processing. Regenerate a bad clip; do not try to rescue it in
the page.

1. **Intro's last frame vs loop's first frame** must be indistinguishable.
2. **Intro's first half-second** — if it dissolved in despite the prompt, trim:
   `ffmpeg -ss 0.3 -i intro.mp4 -c copy intro-trim.mp4`
3. **The intro must end still.** If it is still settling on the last frame, the
   loop's first motion doubles it.

Batching note: the backend allows ~7 concurrent jobs. A batch of 12 returns
429s on the remainder, which are safe to resubmit as slots free. Budget ~10
credits per 5 s clip; 16 clips ≈ 160 credits.

## Step 5: post — the seam is made here, not by the model

Two operations, and one of them cannot be done with ffmpeg filters.

**Loop: crossfade its own wrap.**

```bash
D=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 loop-raw.mp4)
CUT=$(python3 -c "print(round(float('$D')-0.6,3))")
ffmpeg -y -i loop-raw.mp4 -filter_complex \
 "[0:v]split[a][b];[a]trim=0:${CUT},setpts=PTS-STARTPTS[a];\
  [b]trim=${CUT}:${D},setpts=PTS-STARTPTS[b];\
  [b][a]xfade=transition=fade:duration=0.6:offset=0,\
  scale=${W}:${H}:flags=lanczos,format=yuv420p[v]" \
 -map "[v]" -an -c:v libx264 -preset slow -crf 20 -movflags +faststart loop.mp4
```

**Intro: blend its tail into the loop's exact first frame — in raw YUV.**

This is the part that matters. `xfade`, `blend` against a short still, and any
RGB round trip all fail here: ffmpeg's filters revert mid-fade, and converting
to RGB and back introduces a uniform ~1.3-level darkening that reads as a flash
at the join. Do the blend in numpy on raw YUV:

```bash
ffmpeg -y -i loop.mp4 -frames:v 1 -f rawvideo -pix_fmt yuv420p l0.yuv
NF=$(ffprobe -v error -count_frames -select_streams v:0 \
      -show_entries stream=nb_read_frames -of csv=p=0 intro-raw.mp4)
HEAD=$((NF-10))
ffmpeg -y -i intro-raw.mp4 -vf "select='gte(n,${HEAD})',scale=${W}:${H}" \
  -vsync 0 -f rawvideo -pix_fmt yuv420p tail.yuv
```
```python
import numpy as np
F = W * H * 3 // 2                      # yuv420p frame size
l0   = np.frombuffer(open('l0.yuv','rb').read(), np.uint8).astype(np.float32)
tail = np.frombuffer(open('tail.yuv','rb').read(), np.uint8)
n = len(tail) // F
out = bytearray()
for k in range(n):                      # ramp the tail into the loop's frame 0
    A = tail[k*F:(k+1)*F].astype(np.float32)
    w = (k + 1) / n
    out += np.clip(np.rint(A*(1-w) + l0*w), 0, 255).astype(np.uint8).tobytes()
open('blend.yuv','wb').write(out)
```

Then concatenate head + blended tail and encode at crf 16.

`scripts/make_clip_pair.sh` does all of this and prints the measurements.

## Step 6: prove the seams, do not eyeball them

Three numbers, all from frame differences:

- **loop wrap** — `|first - last|` vs the clip's own adjacent-frame motion.
  Invisible if the wrap is at or below the clip's p95 adjacent difference.
- **intro → loop join** at full resolution — measured 0.38–0.77 with ~0 signed
  offset on the clips that shipped. A **signed** offset near zero is what proves
  there is no brightness step; an unsigned mean alone can hide one.
- **intro ends still** — the last few adjacent differences should approach zero.

## Step 7: fit it to the section

- Encode **per breakpoint**, not one clip scaled: 16:9 with the object in the
  right third for desktop, 9:16 with the object in the upper ~40% for phone.
- Crop phone clips **top-anchored** (`object-position: center top`). Centred,
  a 9:16 frame on a taller viewport crops the object under the header.
- Make sure **every** viewport selects a pair — the 901–1099px band and
  landscape phones are easy to leave uncovered. See
  [04-video-backgrounds.md](04-video-backgrounds.md).
- Optimise before shipping: 720×1280, crf 28, `-maxrate 1400k`, `+faststart`
  took 16MB → 1.8MB at 43–44 dB PSNR.
- **Drop any CSS entrance animation** on the element once the intro carries the
  entrance, or the object moves twice.
- Poster is the **rest pose**, never the plate — see
  [04-video-backgrounds.md](04-video-backgrounds.md) on why the first frame is
  the wrong choice for a poster while a slot is parked.

## Approaches that did not work

Recorded so they are not retried:

- **Alpha keying the plate colour.** Produced a dark halo around every object.
  Abandoned in favour of baking the wash into the clip.
- **A feathered mask.** The objects fill ~85% of the frame, so any feather wide
  enough to hide the plate clips the object.
- **GIF.** 256 colours bands every glow, and files run to several MB.
- **Cutting the artwork to a computed height.** Using *mean* row alpha found the
  wrong cut line and sliced through sparse objects; *max* alpha > 180 finds the
  last near-opaque row. Best avoided entirely — do not cut.
