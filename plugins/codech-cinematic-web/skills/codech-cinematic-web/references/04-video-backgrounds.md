# Full-bleed video backgrounds

Each deck panel gets an intro clip that plays once and a loop that follows it.
Desktop and mobile crops are separate files.

Everything here is about one question: **what does the user see when the video
is not playing?** On desktop, almost always nothing goes wrong. On iOS, several
things go wrong at once, and they all look identical - an empty panel.

## Markup

```html
<div class="svc-bg__slot" data-slot="0">
  <div class="svc-bg__pair svc-bg__pair--desktop">
    <i class="svc-bg__plate" aria-hidden="true"
       style="background-image:url(posters/bg-01-poster.jpg)"></i>
    <video poster="posters/bg-01-poster.jpg" class="svc-bg__intro"
           muted playsinline preload="metadata">
      <source src="bg-01-intro.mp4" type="video/mp4"></video>
    <video poster="posters/bg-01-poster.jpg" class="svc-bg__loop"
           muted loop playsinline preload="metadata" hidden>
      <source src="bg-01-loop.mp4" type="video/mp4"></video>
  </div>
  <!-- ...--mobile pair, same shape, portrait files -->
</div>
```

## The poster plate is not optional

**An intro clip's first frame is usually empty** - the object animates *in*, so
frame 0 is bare background. Parked slots reset to `currentTime = 0`, so a
perfectly loaded video still shows nothing while it waits its turn. That is the
"sometimes the animation is empty" report, and it happens even on a fast
connection.

Generate posters from the **end** of the intro (the rest pose the loop starts
from), not the start:

```bash
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 bg-01-intro.mp4)
T=$(python3 -c "print(max(0,float('$D')-0.08))")
ffmpeg -y -ss "$T" -i bg-01-intro.mp4 -frames:v 1 -q:v 6 posters/bg-01-poster.jpg
```

Sanity-check they are not blank: `std > 15` on the luminance channel means real
content. Eight posters cost ~343KB against ~16MB of video.

The plate sits *under* the video and is revealed by default:

```css
.svc-bg__plate { position:absolute; inset:0; background-size:cover;
                 background-position:center; opacity:1; transition:opacity .45s; }
.svc-bg__pair.is-playing .svc-bg__plate { opacity:0; }
```

Toggle `is-playing` from **`playing`**, not `play` - `play` fires on intent and
can still stall. `playing` fires after the first frame is actually rendered,
which is the only trustworthy signal that something is on screen.

```js
[intro, loop].forEach(v => {
  v.addEventListener('playing', () => pair.classList.add('is-playing'));
  v.addEventListener('waiting', () => {
    if (intro.paused && loop.paused) pair.classList.remove('is-playing');
  });
  v.addEventListener('error', () => {
    if (intro.paused && loop.paused) pair.classList.remove('is-playing');
  });
});
```

## iOS autoplay

Three separate reasons a clip silently refuses to start:

1. **`muted` must be a property, not just an attribute.** The attribute alone is
   not reliably honoured once script has touched the element.
2. **`preload="none"` guarantees a rejected `play()`** - there is no buffered
   data, iOS rejects the promise, the `.catch(() => {})` swallows it, and the
   slot is blank forever. Desktop hides this by loading fast enough.
3. **A rejected promise needs a retry**, not a shrug.

```js
intro.muted = true; intro.playsInline = true;
const p = intro.play();
if (p && p.catch) p.catch(() => {
  intro.addEventListener('canplay', function once(){
    intro.removeEventListener('canplay', once);
    intro.play().catch(() => {});
  });
  intro.load();
});

// keep trying while this slot is on stage
let tries = 0;
const retry = setInterval(() => {
  if (!el.__live || ++tries > 10) return clearInterval(retry);
  const live = intro.hidden ? loop : intro;
  if (!live.paused && live.currentTime > 0) return clearInterval(retry);
  live.muted = true; live.playsInline = true;
  live.play().catch(() => {});
}, 900);
```

Also fall back to the loop if the intro errors outright, so a broken source
never leaves the panel empty.

## Hosts that do not serve Range requests

**Check this before blaming the player.**

```bash
curl -s -o /dev/null -w "%{http_code} %{size_download}\n" \
     -r 0-1023 https://your-site/bg-01-m-intro.mp4
```

Expected `206` and 1024 bytes. If you get **`200` and the whole file**, the host
is ignoring Range. Cloudflare Pages did exactly this in the worked engagement.

iOS Safari requires `206 Partial Content` for media and, given a `200` to a
range request, frequently refuses to play at all - the phone sits on the poster
indefinitely while desktop is fine.

Since the clips should be small anyway (below), fetch them yourself and hand the
element a blob URL. A blob is fully local, so there is no range negotiation left
to fail:

```js
fetch(url, { credentials: 'omit' })
  .then(r => { if (!r.ok) throw new Error(r.status); return r.blob(); })
  .then(b => {
    const bu = URL.createObjectURL(b);
    video.querySelector('source').setAttribute('src', bu);
    video.load();
    if (video.__wantPlay) { video.muted = true; video.play().catch(()=>{}); }
  })
  .catch(() => {/* plate stays visible */});
```

Cache by URL so each clip downloads once, and only fetch for the slot being
shown.

**Do not** add `Accept-Ranges: bytes` to work around this. Advertising range
support the host does not honour makes iOS request a range and get a 200, which
is worse than saying nothing.

## Size: the actual root cause

Source clips in the worked engagement were **1080x1920 at 3.3-4.5 Mbps, 16MB
total**, displayed at ~390 CSS px wide. On typical 4G (~2-5 Mbps) a single
2.8MB intro takes 5-10 seconds - far longer than the moment the slot appears.

```bash
ffmpeg -y -i bg-01-m-intro.mp4 \
  -vf "scale=720:1280:flags=lanczos,format=yuv420p" \
  -c:v libx264 -profile:v main -level 3.1 -preset slow \
  -crf 28 -maxrate 1400k -bufsize 2800k \
  -movflags +faststart -an out/bg-01-m-intro.mp4
```

Result: **16MB -> 1.8MB, 89% smaller, at 43-44 dB PSNR** (above ~35 dB is
visually indistinguishable). Dark gradients and sparse particles compress
extremely well; the originals were simply over-encoded. 720x1280 is still >2x a
390px CSS width at DPR 3.

`+faststart` puts the moov atom first so playback can begin before the file
finishes downloading. Always verify the saving did not cost quality - measure
PSNR, do not just celebrate the byte count.

## Breakpoint coverage

Make sure **every** viewport selects a pair. A media query like

```css
@media (max-width: 900px) and (orientation: portrait) { ... --mobile { display:block } }
@media (min-width: 1100px)                            { ... --desktop{ display:block } }
```

leaves a dead band at 901-1099px **and every phone held in landscape**, where
neither pair displays and nothing plays. Mirror the same logic in JS:

```js
const want = deskQ.matches ? '--desktop'
           : mobQ.matches  ? '--mobile'
           : (innerWidth >= 1100 ? '--desktop' : '--mobile');   // never null
```

## Verify with video disabled

The real test: block every `.mp4` and confirm the section still looks complete.

```js
await page.route('**/*.mp4', r => r.abort());
```

If a panel is blank under that test, the fallback is not wired correctly.
