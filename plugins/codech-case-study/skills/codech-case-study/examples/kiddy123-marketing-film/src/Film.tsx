import React from 'react';
import {AbsoluteFill, Easing, Sequence} from 'remotion';
import {C, MONO, clamp01, lerp, useT} from './lib';
import {TDemand, TEnd, TForm, TOpener, TReveal, TSprawl, TT} from './Town';
import {CHow, CDelivered} from './Engine';
import {CChinese, CCompare, CContext, CEnquire, CFind, CGuess, CIntent, CLost, CResults, CSponsor} from './Chat';
import TL from './timeline.json';
import TL_SHORT from './timeline-short.json';

/* A timeline JSON is the edit decision list: [{id, dur, overlap?, tag?}], each scene in LOCAL time.
   start[i] = start[i-1] + dur[i-1] - overlap[i]; overlap = how long it plays over the previous scene's exit (the transition).
   The SFX cue sheet (mf_mix.py --timeline) reads the same file, so its at('<id>', t) cues follow.
   Cuts (14 Oct 2026): Film = 16:9 full (timeline.json), FilmShort = 16:9 30–45 s (timeline-short.json);
   FilmV / FilmVShort (V.tsx) = the same two timelines with the 9:16 scenes (scene-local timing is identical). */
export const SCENES: Record<string, React.ReactNode> = {
  opener: <TOpener />, sprawl: <TSprawl />, form: <TForm />, demand: <TDemand />, reveal: <TReveal />,
  find: <CFind />, enquire: <CEnquire />, compare: <CCompare />, context: <CContext />, chinese: <CChinese />, guess: <CGuess />,
  intent: <CIntent />, lost: <CLost />, sponsor: <CSponsor />, how: <CHow />, delivered: <CDelivered />, results: <CResults />, end: <TEnd />,
};

/* How each scene enters during its overlap with the previous one (no two neighbours share a move). */
type Kind = 'zoom' | 'push' | 'wipe' | 'rise' | 'none';
const TRANS: Record<string, Kind> = {opener: 'none', sprawl: 'zoom', form: 'push', demand: 'wipe', reveal: 'zoom', find: 'push', enquire: 'rise', compare: 'wipe',
  context: 'zoom', chinese: 'push', guess: 'rise', intent: 'wipe', lost: 'push', sponsor: 'rise', how: 'zoom', delivered: 'wipe', results: 'zoom', end: 'none'};
const Enter: React.FC<{kind: Kind; ov: number; children: React.ReactNode}> = ({kind, ov, children}) => {
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
export const PLACED = place(TL as Entry[]);
export const FILM_LEN = lengthOf(TL as Entry[]);
export const SHORT_LEN = lengthOf(TL_SHORT as Entry[]);
export const TLF = TL as Entry[];
export const TLS = TL_SHORT as Entry[];

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

/** Case-study chapter label (THE CHALLENGE / OUR SOLUTION · MATCH / HOW WE DELIVERED / THE RESULTS), from each timeline entry's
    "tag". Fades in when the tag changes, holds across scenes that share it; no tag = hidden. 16:9 top-right; 9:16 top-left,
    below the Reels / Stories header so the app UI never covers it. */
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
      background: 'rgba(255,255,255,.9)', border: '1px solid rgba(0,0,0,.08)', boxShadow: '0 10px 30px -12px rgba(0,0,0,.4)', letterSpacing: '.22em', color: C.ink}}>
      <span style={{width: 8, height: 8, borderRadius: 4, background: TT.sun}} />{cur.tag}
    </div>
  );
};
