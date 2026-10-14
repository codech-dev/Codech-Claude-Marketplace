import React from 'react';
import {AbsoluteFill, Easing, Sequence} from 'remotion';
import {C, MONO, clamp01, lerp, useT} from './lib';
import {Opening} from './Opening';
import {EndCard} from './EndCard';
import {ColorFlip, ExplodedUI, KineticProblem, OrbReveal, PhoneHero} from './Scenes';
import TL from './timeline.json';
import TL_SHORT from './timeline-short.json';

/* A timeline JSON is the film's edit decision list: [{id, dur, overlap?, tag?}], each scene in LOCAL time.
   start[i] = start[i-1] + dur[i-1] - overlap[i]; overlap = how long it plays over the previous scene's exit (the transition).
   To insert, cut or retime a scene, edit the JSON only: later scenes shift, and the SFX cue sheet (mf_mix.py
   --timeline) reads the same file, so its at('<id>', t) cues follow. Later entries render on top.
   One FilmCut renders every cut: Film = 16:9 full (timeline.json), FilmShort = 16:9 30–45 s (timeline-short.json);
   the 9:16 Reels (FilmV / FilmVShort) pass the same two timelines with vertical scenes (references/social-reels.md). */
export const SCENES: Record<string, React.ReactNode> = {
  opener: <Opening />,
  problem: <KineticProblem />,
  orb: <OrbReveal />,
  phone: <PhoneHero />,
  flip: <ColorFlip />,
  ui: <ExplodedUI />,
  end: <EndCard />,
};

/* Optional entrance per scene, played during its overlap with the previous one (Kiddy123 film: zoom / push / rise / wipe,
   no two neighbours alike, 0.4 s overlaps). Unlisted scenes cut straight in, so the starter renders as before. */
type Kind = 'zoom' | 'push' | 'wipe' | 'rise' | 'none';
export const TRANS: Record<string, Kind> = {};
const Enter: React.FC<{kind?: Kind; ov: number; children: React.ReactNode}> = ({kind = 'none', ov, children}) => {
  const {t} = useT();
  if (kind === 'none' || ov <= 0) return <>{children}</>;
  const p = Easing.out(Easing.cubic)(clamp01(t / ov));
  if (p >= 1) return <>{children}</>;
  const st: React.CSSProperties =
    kind === 'zoom' ? {transform: `scale(${lerp(1.18, 1, p)})`, opacity: p, filter: `blur(${(1 - p) * 14}px)`} :
    kind === 'push' ? {transform: `translateX(${(1 - p) * 640}px)`, opacity: clamp01(p * 1.6), filter: `blur(${(1 - p) * 10}px)`} :
    kind === 'rise' ? {transform: `translateY(${(1 - p) * 420}px)`, opacity: clamp01(p * 1.6), filter: `blur(${(1 - p) * 8}px)`} :
    {clipPath: `circle(${p * 120}% at 50% 50%)`};
  return <AbsoluteFill style={st}>{children}</AbsoluteFill>;
};

export type Entry = {id: string; dur: number; overlap?: number; tag?: string};
type Placed = Entry & {start: number};
export const place = (tl: Entry[]): Placed[] => tl.reduce<Placed[]>((acc, e, i) => {
  const prev = acc[i - 1];
  acc.push({...e, start: prev ? prev.start + prev.dur - (e.overlap ?? 0) : 0});
  return acc;
}, []);
export const lengthOf = (tl: Entry[]) => Math.max(...place(tl).map((e) => e.start + e.dur));
export const TLF = TL as Entry[];
export const TLS = TL_SHORT as Entry[];
export const PLACED = place(TLF);
export const FILM_LEN = lengthOf(TLF);
export const SHORT_LEN = lengthOf(TLS);

export const FilmCut: React.FC<{tl: Entry[]; scenes: Record<string, React.ReactNode>; vertical?: boolean}> = ({tl, scenes, vertical}) => {
  const {io} = useT();
  const placed = place(tl);
  return (
    <AbsoluteFill style={{background: C.paper}}>
      {placed.map((e) => {
        if (!scenes[e.id]) throw new Error(`timeline scene "${e.id}" is not registered`);
        return <Sequence key={e.id} from={Math.round(e.start * 30)} durationInFrames={Math.round(e.dur * 30)}><Enter kind={TRANS[e.id]} ov={e.overlap ?? 0}>{scenes[e.id]}</Enter></Sequence>;
      })}
      <ChapterTag placed={placed} vertical={vertical} />
      <AbsoluteFill style={{pointerEvents: 'none', opacity: io(0, 0.3, 1, 0), background: C.paper}} />
    </AbsoluteFill>
  );
};
export const Film: React.FC = () => <FilmCut tl={TLF} scenes={SCENES} />;
export const FilmShort: React.FC = () => <FilmCut tl={TLS} scenes={SCENES} />;

/** Case-study chapter label (THE CHALLENGE / OUR SOLUTION · STORE / HOW WE DELIVERED / THE RESULTS), from each timeline
    entry's "tag". Fades in when the tag changes, holds across scenes that share it; no tag = hidden. 16:9: top-right;
    9:16: top-left at y 250, below the Reels / Stories header. Restyle per film. */
const ChapterTag: React.FC<{placed: Placed[]; vertical?: boolean}> = ({placed, vertical}) => {
  const {t} = useT();
  const cur = [...placed].reverse().find((e) => t >= e.start + 0.15);
  if (!cur || !cur.tag) return null;
  const i = placed.indexOf(cur);
  const fresh = placed[i - 1]?.tag !== cur.tag;
  const a = fresh ? Math.min(1, Math.max(0, (t - cur.start - 0.15) / 0.35)) : 1;
  const out = Math.min(1, Math.max(0, (cur.start + cur.dur - t) / 0.3));
  const o = placed[i + 1]?.tag === cur.tag ? a : a * out;
  const pos: React.CSSProperties = vertical ? {left: 70, top: 250, font: `600 20px ${MONO}`, padding: '12px 22px'} : {right: 64, top: 52, font: `600 15px ${MONO}`, padding: '10px 18px'};
  return (
    <div style={{position: 'absolute', ...pos, opacity: o, transform: `translateY(${(1 - a) * -12}px)`, display: 'flex', alignItems: 'center', gap: 12, borderRadius: 99,
      background: 'rgba(255,255,255,.85)', border: '1px solid rgba(0,0,0,.08)', letterSpacing: '.22em', color: C.ink}}>
      <span style={{width: 8, height: 8, borderRadius: 4, background: C.gold}} />{cur.tag}
    </div>
  );
};
