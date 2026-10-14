import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile} from 'remotion';
import {lerp, useT} from './lib';

/* Helpers for the 9:16 Reels / Stories cuts (1080 x 1920), see references/social-reels.md.
   Write the film's vertical scenes in src/V.tsx with these, keeping every scene's LOCAL timing identical to its 16:9
   twin (same sp()/io() start times), so the fitted music and audio/cues.py carry over unchanged. Then:
     export const FilmV = () => <FilmCut tl={TLF} scenes={VSCENES} vertical />;      // full length
     export const FilmVShort = () => <FilmCut tl={TLS} scenes={VSCENES} vertical />; // 30–45 s
   Worked example: examples/kiddy123-marketing-film/src/V.tsx. */
export const VW = 1080, VH = 1920;
/** Keep headlines, product UI and numbers inside these lines: the app header covers y < 230, the caption, username and
    audio row cover y > ~1530, and the like / comment / share column covers x > ~960 from y ~1000 down. */
export const SAFE = {top: 230, bottom: 1530, right: 960};

/** A 9:16 background plate with a slow camera move. Generate real 9:16 plates (public/plates/v_<name>.png);
    a 16:9 plate covered into 9:16 is upscaled ~2x and looks soft. */
export const VPlate: React.FC<{src: string; dur: number; s0?: number; s1?: number; origin?: string; blur?: number; dim?: number}> = ({src, dur, s0 = 1.04, s1 = 1.1, origin = '50% 60%', blur = 0, dim = 0}) => {
  const {io} = useT(); const p = io(0, dur, 0, 1, Easing.inOut(Easing.sin));
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Img src={staticFile(`plates/v_${src}.png`)} style={{position: 'absolute', inset: 0, width: VW, height: VH, objectFit: 'cover', transformOrigin: origin, transform: `scale(${lerp(s0, s1, p)})`, filter: blur ? `blur(${blur}px)` : undefined}} />
      {dim > 0 && <AbsoluteFill style={{background: `rgba(6,20,28,${dim})`}} />}
    </AbsoluteFill>
  );
};
/** Dark wash behind white headlines at the top, plus a soft one at the bottom so the app caption stays legible. */
export const DarkTop: React.FC<{rgb?: string; to?: number; reach?: number}> = ({rgb = '8,28,36', to = 0.85, reach = 48}) => (
  <AbsoluteFill style={{background: `linear-gradient(180deg,rgba(${rgb},${to}) 0%,rgba(${rgb},${to * 0.7}) ${reach * 0.55}%,rgba(${rgb},0) ${reach}%),linear-gradient(0deg,rgba(${rgb},.55) 0%,rgba(${rgb},0) 22%)`}} />
);
/** Light wash behind dark headlines (opener / reveal / delivery beats). */
export const LightTop: React.FC<{rgb?: string; reach?: number; o?: number}> = ({rgb = '234,244,255', reach = 56, o = 1}) => (
  <AbsoluteFill style={{opacity: o, background: `linear-gradient(180deg,rgba(${rgb},.96) 0%,rgba(${rgb},.9) ${reach * 0.6}%,rgba(${rgb},0) ${reach}%)`}} />
);
/** Headline block: under the chapter tag (y 250), 70 px side margins. Headlines of 2–3 short lines at 92–124 px. */
export const Head: React.FC<{children: React.ReactNode; top?: number}> = ({children, top = 330}) => <div style={{position: 'absolute', left: 70, right: 70, top}}>{children}</div>;
/** Product UI slot: a mini UI laid out at its own CSS px (w x h), scaled by k and centred under the headline.
    A 384 x 560 chat panel at k 1.5–1.7 ends at y ~1500; text reads at ~22 px. */
export const UiSlot: React.FC<{w: number; h: number; k: number; top?: number; children: React.ReactNode}> = ({w, h, k, top = 575, children}) => (
  <div style={{position: 'absolute', left: (VW - w * k) / 2, top, width: w * k, height: h * k}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, transform: `scale(${k})`, transformOrigin: '0 0'}}>{children}</div>
  </div>
);
/** Dev overlay for checking stills: red lines where the app UI starts. Add it to a scene while iterating, never ship it. */
export const SafeZones: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: SAFE.top, borderTop: '3px dashed red'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: SAFE.bottom, borderTop: '3px dashed red'}} />
    <div style={{position: 'absolute', top: 1000, bottom: 0, left: SAFE.right, borderLeft: '3px dashed red'}} />
  </AbsoluteFill>
);
