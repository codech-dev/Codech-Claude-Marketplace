import React from 'react';
import {AbsoluteFill, Easing, Sequence} from 'remotion';
import {OPEN, Opening} from './Opening';
import {EndCard} from './EndCard';
import {CustomAI, ProblemCS, ProblemData, SolutionSplit} from './Problem';
import {Bubbles, Hook, Meet, OrbTransition} from './Proof';
import {BookedScene, CSScene, IntegrationScene, Interstitial, PhotoScene, TypeScene, VoiceScene} from './Ch34';
import {Backdrop, C, Cursor, lerp, useT} from './lib';
import {ChatScene, DashboardScene, InkFlip, KBScene, ModulesScene, OrderPageScene, ResultsScene} from './Ch58';

const Body: React.FC<{seg: number}> = ({seg}) => {
  const {t, io} = useT();
  const flash = Math.max(0, 1 - Math.abs(t - 11.05) / 0.18);
  const show = (a: number, b: number) => t >= a && t < b;
  return (
    <AbsoluteFill style={{background: C.paper}}>
      <Backdrop glowX={65} glowY={35} />
      {show(0, 5.6) && <Hook />}
      {show(0, 5.2) && <Bubbles />}
      {show(5.4, 11.25) && <Meet />}
      {show(10.95, 16.85) && <TypeScene />}
      {show(16.35, 22.1) && <PhotoScene />}
      {show(21.9, 27.5) && <VoiceScene />}
      {show(28.5, 32.55) && <BookedScene />}
      {show(32.2, 38.0) && <IntegrationScene />}
      {seg === 1 && show(37.85, 42.35) && <AbsoluteFill style={{transform: `translateX(${-Math.pow(io(41.85, 42.3), 3) * 2100}px)`, filter: t > 41.85 ? `blur(${Math.sin(Math.PI * io(41.85, 42.3)) * 24}px)` : undefined}}><CSScene /></AbsoluteFill>}
      {show(41.85, 49.0) && <OrderPageScene />}
      {show(49.9, 54.2) && <DashboardScene />}
      {show(53.8, 58.2) && <ChatScene />}
      {show(57.8, 62.2) && <KBScene />}
      {show(61.8, 65.85) && <ModulesScene />}
      {seg === 2 && show(48.55, 50.2) && <InkFlip />}
      {show(65.65, 72) && <ResultsScene />}
      {show(26.9, 29.0) && <Interstitial />}
      <OrbTransition />
      {t > 9.8 && t < 10.75 && <Cursor x={lerp(1720, 1190, io(9.85, 10.4))} y={lerp(1010, 650, io(9.85, 10.4))} click={io(10.45, 10.8, 0, 1, Easing.out(Easing.cubic))} />}
      {flash > 0 && <AbsoluteFill style={{background: '#FFFDF8', opacity: flash}} />}
    </AbsoluteFill>
  );
};

/* Original body segments, with new problem scenes inserted between them. */
const SEGS: [number, number][] = [[0, 4.3], [4.3, 41.85], [41.85, 49.7], [49.7, 999]];
const INS: {dur: number; el: React.ReactNode}[] = [
  {dur: 8, el: <ProblemCS />},
  {dur: 3, el: <SolutionSplit />},
  {dur: 10, el: <><Sequence durationInFrames={6 * 30}><ProblemData /></Sequence><Sequence from={6 * 30}><CustomAI /></Sequence></>},
];
export const BODY_EXTRA = INS.reduce((a, b) => a + b.dur, 0);
const Remapped: React.FC = () => {
  const {t} = useT();
  const out: React.ReactNode[] = [];
  let D = 0;
  SEGS.forEach(([a, b], i) => {
    if (t >= a + D && t < b + D) out.push(<Sequence key={'s' + i} from={Math.round(D * 30)}><Body seg={i} /></Sequence>);
    if (i < INS.length) {
      const st = b + D;
      if (t >= st && t < st + INS[i].dur) out.push(<Sequence key={'i' + i} from={Math.round(st * 30)} durationInFrames={Math.round(INS[i].dur * 30)}>{INS[i].el}</Sequence>);
      D += INS[i].dur;
    }
  });
  return <>{out}</>;
};

export const Film: React.FC = () => {
  const {t, io} = useT();
  return (
    <AbsoluteFill style={{background: C.paper}}>
      <Sequence from={Math.round((OPEN - 0.25) * 30)}><Remapped /></Sequence>
      {t < OPEN + 0.1 && <Opening />}
      <Sequence from={Math.round(95.35 * 30)}><EndCard /></Sequence>
      <AbsoluteFill style={{pointerEvents: 'none', opacity: io(0, 0.3, 1, 0), background: C.paper}} />
    </AbsoluteFill>
  );
};
