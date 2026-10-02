import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile} from 'remotion';
import {Backdrop, C, Headline, INTER, MONO, clamp01, lerp, useT} from './lib';
import {CLIENT} from './brand';

export const OPEN = 4.2;
/** Case-study opener (OPEN s): the Codech logo alone, "A CODECH CASE STUDY", the SOLUTION as the title, then
    "Proposed for [client logo] <client>" below it, then the pillars, then a zoom-through into the film.
    The client logo sits under the solution, never beside the Codech logo: a side-by-side lockup reads as a partnership. */
export const Opening: React.FC = () => {
  const {sp, io, expo} = useT();
  const exit = io(3.6, 4.2, 0, 1, Easing.in(Easing.exp));
  const glow = expo(0, 1.2);
  const lc = sp(0.25, {damping: 14, stiffness: 150});
  const line = io(0.85, 1.45, 0, 1, Easing.inOut(Easing.cubic));
  const sub = io(2.25, 2.65);
  return (
    <AbsoluteFill style={{transform: `scale(${lerp(1, 1.6, exit)})`, opacity: 1 - exit, filter: exit > 0.02 ? `blur(${exit * 16}px)` : undefined}}>
      <Backdrop glowX={50} glowY={42} dots />
      <div style={{position: 'absolute', left: 960 - 520, top: 140, width: 1040, height: 760, borderRadius: '50%', background: 'rgba(212,184,149,.40)', filter: 'blur(80px)', opacity: glow}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 140, display: 'flex', justifyContent: 'center'}}>
        <div style={{overflow: 'hidden', padding: 6}}><Img src={staticFile('codech-logo-crop.png')} style={{height: 118, transform: `translateY(${(1 - lc) * 140}%)`}} /></div>
      </div>
      <div style={{position: 'absolute', left: 960 - 300 * line, top: 300, width: 600 * line, height: 3, borderRadius: 2, background: 'linear-gradient(90deg,rgba(212,184,149,0),#D4B895 18%,#C9A46A 50%,#D4B895 82%,rgba(212,184,149,0))'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 335, textAlign: 'center', font: `500 20px ${MONO}`, letterSpacing: '.3em', color: C.mute, opacity: io(1.05, 1.4)}}>A CODECH CASE STUDY</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 390, display: 'flex', justifyContent: 'center', textAlign: 'center'}}>
        <Headline lines={CLIENT.solution} start={1.4} size={108} stagger={0.1} align={'center' as 'left'} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, font: `500 30px ${INTER}`, color: C.mute, opacity: sub, transform: `translateY(${(1 - sub) * 12}px)`}}>
        Proposed for
        {CLIENT.logo && <span style={{padding: '8px 14px', borderRadius: 12, background: '#fff', boxShadow: '0 12px 30px -14px rgba(60,45,20,.35),0 0 0 1px rgba(0,0,0,.05)'}}><Img src={staticFile(CLIENT.logo)} style={{height: 46, display: 'block'}} /></span>}
        <b style={{color: C.ink, fontWeight: 700}}>{CLIENT.name}</b>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 760, display: 'flex', justifyContent: 'center', gap: 18}}>
        {CLIENT.pillars.map((p, i) => {
          const q = sp(2.55 + i * 0.16, {damping: 12, stiffness: 170});
          return (
            <span key={i} style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 24px', borderRadius: 99, background: '#fff', font: `600 24px ${INTER}`, color: '#3A3F4B', transform: `translateY(${(1 - q) * 40}px) scale(${lerp(0.8, 1, q)})`, opacity: clamp01(q * 2), boxShadow: '0 16px 34px -16px rgba(60,45,20,.35),0 0 0 1px rgba(0,0,0,.05)'}}>
              <span style={{width: 10, height: 10, borderRadius: 5, background: CLIENT.pillarDots[i % CLIENT.pillarDots.length]}} />{p}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
