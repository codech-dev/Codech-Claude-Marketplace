import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {C, MONO, useT} from './lib';

import * as O from './Vault';
import * as M from './Mini';
import TL from './timeline.json';

/* timeline.json is the film's edit decision list: [{id, dur, overlap?}], each scene in LOCAL time.
   start[i] = start[i-1] + dur[i-1] - overlap[i]; overlap = how long it plays over the previous scene's exit (the transition).
   To insert, cut or retime a scene, edit timeline.json only: later scenes shift, and the SFX cue sheet (mf_mix.py
   --timeline) reads the same file, so its at('<id>', t) cues follow. Later entries render on top. */
const SCENES: Record<string, React.ReactNode> = {
  opener: <O.VOpener />, scatter: <O.VScatter />, regulated: <M.MRegulated />, searchfail: <O.VSearchFail />, invisible: <O.VInvisible />,
  meet: <O.VMeet />, pillars: <M.MPillars />, drives: <M.MDrives />, upload: <M.MUpload />, versions: <M.MVersions />, search: <M.MSearch />,
  pipeline: <O.VPipeline />, summary: <M.MSummary />, langs: <M.MLangs />, share: <M.MShare />, copies: <O.VCopies />, send: <M.MSend />,
  chat: <M.MChat />, assist: <M.MAssist />, confirm: <M.MConfirm />, vault: <O.VVault />, audit: <M.MAudit />, own: <M.MOwn />,
  stack: <O.VStack />, grows: <M.MGrows />, process: <M.MProcess />, results: <O.VResults />, end: <O.VEnd />,
};

type Entry = {id: string; dur: number; overlap?: number; tag?: string};
export const PLACED = (TL as Entry[]).reduce<(Entry & {start: number})[]>((acc, e, i) => {
  const prev = acc[i - 1];
  acc.push({...e, start: prev ? prev.start + prev.dur - (e.overlap ?? 0) : 0});
  return acc;
}, []);
export const FILM_LEN = Math.max(...PLACED.map((e) => e.start + e.dur));

export const Film: React.FC = () => {
  const {io} = useT();
  return (
    <AbsoluteFill style={{background: '#04060D'}}>
      {PLACED.map((e) => {
        if (!SCENES[e.id]) throw new Error(`timeline.json scene "${e.id}" is not registered in Film.tsx`);
        return <Sequence key={e.id} from={Math.round(e.start * 30)} durationInFrames={Math.round(e.dur * 30)}>{SCENES[e.id]}</Sequence>;
      })}
      <ChapterTag />
      <AbsoluteFill style={{pointerEvents: 'none', opacity: io(0, 0.3, 1, 0), background: '#04060D'}} />
    </AbsoluteFill>
  );
};

/** Case-study chapter label (THE CLIENT / THE CHALLENGE / OUR SOLUTION · … / THE RESULTS), top-right, from timeline.json tags. */
const ChapterTag: React.FC = () => {
  const {t} = useT();
  const cur = [...PLACED].reverse().find((e) => t >= e.start + 0.15);
  if (!cur || !cur.tag) return null;
  const since = t - cur.start;
  const prevTag = PLACED[PLACED.indexOf(cur) - 1]?.tag;
  const fresh = prevTag !== cur.tag;
  const a = fresh ? Math.min(1, Math.max(0, (since - 0.15) / 0.35)) : 1;
  const out = Math.min(1, Math.max(0, (cur.start + cur.dur - t) / 0.3));
  const next = PLACED[PLACED.indexOf(cur) + 1];
  const o = next && next.tag === cur.tag ? a : a * out;
  return (
    <div style={{position: 'absolute', right: 64, top: 52, opacity: o, transform: `translateY(${(1 - a) * -12}px)`, display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', borderRadius: 99,
      background: 'rgba(8,14,34,.7)', border: '1px solid rgba(150,180,255,.35)', font: `600 15px ${MONO}`, letterSpacing: '.22em', color: '#CFDDFF'}}>
      <span style={{width: 8, height: 8, borderRadius: 4, background: '#3D7BFF', boxShadow: '0 0 10px #3D7BFF'}} />{cur.tag}
    </div>
  );
};
