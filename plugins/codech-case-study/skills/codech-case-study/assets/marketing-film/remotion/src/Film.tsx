import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {C, useT} from './lib';
import {Opening} from './Opening';
import {EndCard} from './EndCard';
import {ColorFlip, ExplodedUI, KineticProblem, OrbReveal, PhoneHero} from './Scenes';
import TL from './timeline.json';

/* timeline.json is the film's edit decision list: [{id, dur, overlap?}], each scene in LOCAL time.
   start[i] = start[i-1] + dur[i-1] - overlap[i]; overlap = how long it plays over the previous scene's exit (the transition).
   To insert, cut or retime a scene, edit timeline.json only: later scenes shift, and the SFX cue sheet (mf_mix.py
   --timeline) reads the same file, so its at('<id>', t) cues follow. Later entries render on top. */
const SCENES: Record<string, React.ReactNode> = {
  opener: <Opening />,
  problem: <KineticProblem />,
  orb: <OrbReveal />,
  phone: <PhoneHero />,
  flip: <ColorFlip />,
  ui: <ExplodedUI />,
  end: <EndCard />,
};

type Entry = {id: string; dur: number; overlap?: number};
export const PLACED = (TL as Entry[]).reduce<(Entry & {start: number})[]>((acc, e, i) => {
  const prev = acc[i - 1];
  acc.push({...e, start: prev ? prev.start + prev.dur - (e.overlap ?? 0) : 0});
  return acc;
}, []);
export const FILM_LEN = Math.max(...PLACED.map((e) => e.start + e.dur));

export const Film: React.FC = () => {
  const {io} = useT();
  return (
    <AbsoluteFill style={{background: C.paper}}>
      {PLACED.map((e) => {
        if (!SCENES[e.id]) throw new Error(`timeline.json scene "${e.id}" is not registered in Film.tsx`);
        return <Sequence key={e.id} from={Math.round(e.start * 30)} durationInFrames={Math.round(e.dur * 30)}>{SCENES[e.id]}</Sequence>;
      })}
      <AbsoluteFill style={{pointerEvents: 'none', opacity: io(0, 0.3, 1, 0), background: C.paper}} />
    </AbsoluteFill>
  );
};
