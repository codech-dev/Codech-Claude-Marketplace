# The hero object

Geometry, surface, cursor interaction and framing for a WebGL hero form. For
the glow itself see [02-atmosphere.md](02-atmosphere.md).

## Step 1: measure the reference, do not eyeball it

If the user supplied a reference video or screenshot, extract the geometry
before writing any code.

```bash
ffmpeg -i reference.mp4 -vf "select='not(mod(n,60))'" -vsync 0 frames/f_%03d.png
python3 scripts/measure_geometry.py frames/f_001.png
```

The script traces the rim outward from the crest and least-squares fits a
circle, printing centre and radius as fractions of frame size plus a residual.

**Trust the fit only if the residual is small** (single-digit px on a 1080p
frame). Two failure modes to recognise:

- *Residual ~200px+*: the trace caught headline text, not the rim. Restrict the
  search band, or isolate on blue-minus-red since rim light is blue and text is
  neutral.
- *Fit collapses onto a tiny circle with few inliers*: outlier rejection ate the
  real points. Seed from a column scan where the rim is unambiguous (in the
  worked example, columns 900/960/1040 all peaked at y=238 with luminance ~240),
  then trace outward from that seed.

Worked example result, 1920x1080 reference: **centre 49.6% width, 100% height;
radius 43.8% width; crest at 22% height; residual 2.5px over 111 points.**
Centre exactly on the bottom edge, flanks leaving through the bottom.

A cautionary note from that same engagement: an earlier pass "corrected" the
radius to 0.62 of width on the impression that the flanks exited sideways. That
put the crest 33px *above* the top of the card and cropped the rim out of frame
entirely - and the luminance profile that was supposed to catch it was
measuring the text scrim instead. The measured answer was right; the impression
was not.

## Step 2: frame it from the measurement

Solve the camera so the projected radius is what you measured, then translate
the object so its centre lands where you measured.

```js
function resize() {
  const w = card.clientWidth, h = card.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();

  let radiusPx, CENTRE_Y;
  if (w < 1024) {
    // phone: give the object a guaranteed share of the card (see below)
    const copyBottom = actions.getBoundingClientRect().bottom
                     - card.getBoundingClientRect().top;
    const crestWant  = Math.min(Math.max(copyBottom + 36, h * 0.46), h * 0.72);
    const avail      = Math.max(110, h - crestWant);
    radiusPx = Math.max(0.85 * w, Math.min(1.6 * w, avail * 1.9));
    CENTRE_Y = (crestWant + radiusPx) / h;
  } else {
    CENTRE_Y = 1.00;
    radiusPx = Math.min(0.42 * w, 0.75 * h);   // height term keeps the crest
  }                                            // clear of the headline

  const halfH = Math.tan(camera.fov * Math.PI / 360);
  const dist  = (R / (radiusPx / (h / 2))) / halfH;
  camera.position.set(0, 0, dist);
  camera.lookAt(0, 0, 0);
  const worldPerPx = (2 * halfH * dist) / h;
  group.position.y = -(CENTRE_Y - 0.5) * h * worldPerPx;

  // publish for CSS so copy and scrims track the object
  card.style.setProperty('--crest-y', (h * CENTRE_Y - radiusPx) + 'px');
}
```

**The `min(0.42*w, 0.75*h)` height term is load-bearing.** With width alone, a
wide short card wanted a 582px radius and put the crest at y=208 - behind the
first line of the headline.

**On phones, guarantee the object a share of the card.** Capping the crest at
72% of card height leaves the bottom 28% for the object at every size measured
(390x844, 390x664, 430x932, 375x812, 360x780, 414x715). Without the cap, a
short viewport (Safari with its toolbar showing) let the copy fill everything
and left the object a sliver at the very bottom - reported as "the globe is not
showing on iPhone" when in fact it was rendering perfectly, just off-screen.

Also scale the copy with viewport **height** (`clamp(30px, 5.4svh, 40px)` and
similar on gaps/padding), so a short screen compresses the text instead of
pushing the object out of frame. Use `svh`, not `vh`, so a collapsing mobile
URL bar cannot overflow the card.

**Re-solve when layout moves.** If you measure a DOM element's position, that
position changes when webfonts land:

```js
if (window.ResizeObserver) {
  const ro = new ResizeObserver(() => resize());
  ro.observe(card); ro.observe(actions);
}
if (document.fonts && document.fonts.ready) document.fonts.ready.then(resize);
```

## Step 3: the dot-matrix surface

Points on a sphere, land denser and brighter than sea, sized and lit in the
vertex shader.

```glsl
float facing = dot(n, normalize(cameraPosition - wp));
float front  = smoothstep(-0.02, 0.30, facing);
float limb   = smoothstep(0.0, 1.0, pow(1.0 - clamp(facing, 0.0, 1.0), 2.2));
float sun    = smoothstep(-0.10, 0.80, dot(n, normalize(uSun)));
float lit    = min(0.42 + 1.30 * limb * sun + 0.55 * sun, 2.05);

float hd  = distance(wp, uHit);                          // cursor, world space
float hov = uHitK * (1.0 - smoothstep(0.0, uHitR, hd)) * step(0.0, facing);

vCol = mix(color * lit, vec3(0.86, 0.92, 1.0), clamp(hov, 0.0, 1.0));
vA   = front * clamp(0.34 + lit * 0.92 + hov, 0.0, 1.0) * uIn;
gl_PointSize = aSize * uPix * (620.0 / -mv.z) * (1.0 + 2.0 * hov);
```

Calibration notes from the worked example:

- **Limb exponent controls how much surface you can see.** 4.5 pushed all light
  into the last few degrees and the body went nearly black with no visible
  texture; 2.2 with a `smoothstep` wrapper grades in with no hard inner edge.
  If a reviewer reports "a dense dot band with a visible inner edge", the
  exponent is too aggressive and unsmoothed.
- **Keep the sun near-vertical.** A sun tilted right - `(0.12, 1.0, 0.35)` -
  lit one flank harder than the other and read as asymmetry. `(0.0, 1.0, 0.28)`
  is symmetric.
- **Counts:** ~120k points desktop, ~34k touch.

**Every point must be a soft circle.** Points render as squares by default:

```glsl
float r = length(gl_PointCoord - 0.5);
if (r > 0.5) discard;
float a = (1.0 - smoothstep(0.34, 0.5, r)) * vA;
if (a < 0.004) discard;
```

This applies to *every* `Points` in the scene. `THREE.PointsMaterial` draws
hard squares - in the worked example the travelling pulses along the field
lines were still squares long after the main dot field was fixed, because they
used `PointsMaterial` rather than the custom shader. If a reviewer says "points
still render as squares in places", look for a stray `PointsMaterial`.

## Step 4: cursor interaction on the GPU

Raycast in JS, hand the hit point to the shader as **one uniform**. Never
iterate points in JS.

```js
card.addEventListener('pointermove', (ev) => {
  const b = card.getBoundingClientRect();
  ndc.x =  ((ev.clientX - b.left) / b.width)  * 2 - 1;
  ndc.y = -((ev.clientY - b.top)  / b.height) * 2 + 1;
  ray.setFromCamera(ndc, camera);
  sphere.center.copy(group.position);
  wantK = ray.ray.intersectSphere(sphere, hitTarget) ? 1 : 0;
  if (wantK) hitWorld.copy(hitTarget);
});
card.addEventListener('pointerleave', () => { wantK = 0; });

// in the frame loop: ~250ms lerp, framerate independent
const k = 1 - Math.pow(0.001, dt / 0.25);
curK += (wantK - curK) * k;
smooth.lerp(hitWorld, k);
mat.uniforms.uHitK.value = curK;
mat.uniforms.uHit.value.copy(smooth);
```

Verify by differencing two screenshots and binning brightening by distance from
the cursor. Measured in the worked example: **+12.0 levels at 0-60px, +10.4 at
60-120, +3.3 at 120-180, ~0 by 240px**, against a rotation-only baseline of
+0.05 far away. Diff the *brightening* only and keep a far-field baseline,
since the object is usually rotating between the two frames.

## Step 5: survival

```js
let contextLost = false;
canvas.addEventListener('webglcontextlost', (e) => {
  e.preventDefault();          // REQUIRED, or no restore event is ever fired
  contextLost = true;
});
canvas.addEventListener('webglcontextrestored', () => {
  contextLost = false; resize();
  if (!reduce) requestAnimationFrame(frame);
});

function frame() {
  if (contextLost) return;     // do not render into a dead context
  /* ... */
  renderer.render(scene, camera);
  if (reduce) return;          // reduced motion: one frame, then stop
  requestAnimationFrame(frame);
}

renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
```

Without the lost/restored pair the hero vanishes permanently the first time iOS
reclaims the context - no error, the canvas just stops painting.
