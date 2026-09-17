# Atmosphere and rim light

The single hardest part of a glowing hero object, and the one with the most
seductive wrong answer.

## The wrong answer: stacked fresnel shells

The obvious construction is a few spheres slightly larger than the object,
`side: THREE.BackSide`, `AdditiveBlending`, each with a fresnel term:

```glsl
float f = 1.0 - abs(dot(normalize(vN), normalize(-vP)));
gl_FragColor = vec4(colour, pow(f, k));
```

This looks plausible and is wrong in a way you cannot tune out.

**Why it cannot work:** a fresnel term on a back-facing sphere is *maximum at
that sphere's own silhouette*. The shell is brightest exactly where it ends.
So every shell terminates in a hard bright line at its own radius. Three shells
produce three concentric rings with visible edges. Changing radii moves the
rings; changing exponents changes their sharpness; nothing removes them,
because the discontinuity is where the geometry ends.

If a reviewer says "the glow renders as 2-3 visible bands with hard edges",
this is the cause. Do not tune it. Replace it.

## The right answer: one analytic screen-space pass

Render the glow as a single full-screen quad *behind* the object. In the
fragment shader you know the object's projected centre and radius in pixels, so
you can write the falloff directly as a function of distance from the rim.

```glsl
uniform vec2  uC;        // object centre, device px
uniform float uR;        // object radius, device px
uniform float uGlowW;    // glow width, CSS px * DPR  <- a CONSTANT
uniform float uInnerW;   // inner wash width, same
uniform float uGain;     // brightness compensation (see below)

float dither(vec2 p){                       // kills banding on dark ramps
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main(){
  vec2  v = gl_FragCoord.xy - uC;
  float d = length(v);

  // angular term: brightest at the crest, present but weaker down the flanks
  float up  = d > 0.0 ? clamp(v.y / d, -1.0, 1.0) : 1.0;
  float ang = 0.22 + 0.78 * pow(clamp(up * 0.5 + 0.5, 0.0, 1.0), 2.6);

  vec3 c = vec3(0.0); float a = 0.0;

  if (d >= uR) {
    // OUTSIDE: maximum exactly AT the rim, monotonic decay outward.
    // Three exponentials: a tight core, the wide bleed, the last breath.
    float t  = (d - uR) / max(uGlowW, 1.0);
    float i1 = exp(-t * 6.0);
    float i2 = exp(-t * 2.0);
    float i3 = exp(-t * 0.65);
    c = cInner * i1 * 0.85 + cOuter * i2 * 0.55 + cDeep * i3 * 0.30;
    a = clamp(i1 * 0.85 + i2 * 0.55 + i3 * 0.30, 0.0, 1.0);
  } else {
    // INSIDE: a short wash just inside the limb, fading to dark.
    // exp(0) == 1 at d == uR, so it meets the outside branch with no seam.
    float t = (uR - d) / max(uInnerW, 1.0);
    float w = exp(-t * 1.0);
    c = mix(cOuter, cInner, 0.35) * w * 0.80;
    a = w * 0.80;
  }

  a *= ang * uIn * uPulse * uGain;
  c *= ang * uGain;
  float n = (dither(gl_FragCoord.xy) - 0.5) / 255.0;   // +/- 1/255
  gl_FragColor = vec4(max(c + n, 0.0), clamp(a + n, 0.0, 1.0));
}
```

Properties that matter, and why:

- **Peak is at `d == uR`.** Nothing is brighter away from the rim than at it.
- **Both branches equal 1.0 at the limb**, so there is no seam where they meet.
- **Monotonic on both sides**, so there is no secondary peak to read as a ring.
- **Dither of ±1/255** prevents banding. A long shallow ramp on dark navy will
  band visibly on an 8-bit display without it.

Set up the quad so it covers the screen regardless of camera:

```js
vertexShader: 'void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }'
// PlaneGeometry(2, 2), depthTest:false, depthWrite:false,
// AdditiveBlending, renderOrder = -10, frustumCulled = false
```

## The rim line

Keep the crisp rim as a **front-side** highlight on the object's own surface,
*not* as another shell. A front-side mesh contributes no silhouette of its own,
so it cannot add a ring.

```glsl
float f    = 1.0 - abs(dot(normalize(vN), normalize(-vP)));
float band = pow(smoothstep(1.0 - uRimAng, 1.0, f), 1.5);
float sun  = clamp(dot(normalize(vW), normalize(uSun)), 0.0, 1.0);
float t    = band * (0.22 + 0.78 * pow(sun, 1.3));
vec3  c    = mix(vec3(0.392,0.667,0.949), vec3(0.97,0.99,1.0),
                 smoothstep(0.25, 0.85, t));
gl_FragColor = vec4(c, clamp(t * 1.25 * uGain, 0.0, 1.0) * uIn);
```

## Size independence: the trap that looks like a shader bug

**Symptom:** the rim samples ~RGB(86,132,222) on mobile but ~RGB(43,58,85) on
desktop. Same code, different brightness, desaturated at the larger size.

**Cause 1 - width derived from viewport.** If you write

```js
uGlowW = (110 / 1920) * canvasWidth * dpr;   // WRONG
```

the falloff is ~39px on a 358px phone card and ~145px on a 1328px desktop card.
The same energy spread over four times the distance samples far dimmer at the
rim, and the wide deep-blue term dominates, so it desaturates too.

```js
const GLOW_W_CSS = 105, INNER_W_CSS = 95, RIM_W_CSS = 4.5;   // RIGHT
uGlowW  = GLOW_W_CSS  * dpr;
uInnerW = INNER_W_CSS * dpr;
```

Brightness is a property of the light, not of the viewport.

**Cause 2 - a fixed fresnel exponent.** `pow(f, 52.0)` is an *angular* width,
so the line gets thinner in pixels as the object grows. Solve the angular
half-width per resize so the rim is a constant number of CSS pixels:

```js
rimMat.uniforms.uRimAng.value =
  Math.min(0.5, Math.max(0.012, (RIM_W_CSS / projectedRadiusPx) * 2.0));
```

**Cause 3 - a DPR sampling artefact.** A rim ~3 CSS px wide lands on ~3 device
pixels at DPR 1 and 6 at DPR 2; antialiasing dilutes the DPR-1 peak by ~15%.
Widening to 4.5 CSS px makes both resolve the same.

**Cause 4 - and check this FIRST - a CSS layer painting over the rim.** In the
engagement this came from, a legibility scrim
`radial-gradient(64% 46% at 50% 38%, rgba(1,5,12,.86) ...)` sat directly over a
crest at 40% of card height. The rim measured a fifth as bright on desktop and
the shader was completely innocent; mobile only looked right because its crest
was at 77%, outside the pool. **Before debugging any shader, screenshot with
every CSS overlay hidden and re-measure.**

The durable fix is to drive the scrim from the *measured* geometry rather than
a guessed percentage - publish the crest position from JS and consume it in CSS:

```js
card.style.setProperty('--crest-y', (h * CENTRE_Y - radiusPx) + 'px');
```
```css
background: linear-gradient(to bottom,
  transparent 0,
  transparent calc(var(--crest-y, 40%) + 90px),
  rgba(1,5,12,.50) calc(var(--crest-y, 40%) + 190px),
  rgba(1,5,12,.70) 100%);
```

Now the scrim and the object are solved from the same number and cannot drift.

## Residual radius compensation

After all of the above, a small brightness trend with projected radius can
remain (larger object -> the surface normal turns more slowly per screen pixel,
so a fixed CSS-pixel band samples a slightly dimmer part of the falloff).

```js
const gain = 1 + Math.max(0, (radiusPx - BASE_R) / BASE_R) * 0.19;
```

Be honest about what this is: an **empirically fitted correction**, calibrated
by measuring, not derived. Recalibrate it for your object rather than trusting
the constant. Measured result across 390/1440/1920/2560 at DPR 1 and 2, after
fitting: every size within **-3.5%..0%** of the mobile reference.

## Acceptance test

Sample a luminance profile from deep space into the rim, at the crest and at
two points down the flank. Use an **angular median over a ±12° fan**, not a
single ray, so individual points, orbit arcs and field lines average out.

Required:

- peak at `d - R ≈ 0` (at the rim, not away from it)
- monotonic rise into the peak
- no secondary peaks outside the rim
- in the glow field proper (excluding the rim spike itself), no slope sign-flip
  above ~1 luminance level

`scripts/verify_render.mjs --profile` does this and prints the table.
