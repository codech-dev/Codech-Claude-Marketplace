import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile} from 'remotion';
import {Backdrop, C, Headline, INTER, MONO, clamp01, lerp, useT} from './lib';
import {CLIENT} from './brand';

export const OPEN = 3.6;
/** Project opener (OPEN s): Codech × client lockup, gold line, case-study title, pillars, then a zoom-through into the film. */
export const Opening: React.FC = () => {
  const {t, sp, io, expo} = useT();
  const exit = io(3.0, 3.6, 0, 1, Easing.in(Easing.exp));
  const glow = expo(0, 1.2);
  const lc = sp(0.25, {damping: 14, stiffness: 150}), lx = sp(0.45, {damping: 12}), ls = sp(0.55, {damping: 14, stiffness: 150});
  const line = io(0.85, 1.45, 0, 1, Easing.inOut(Easing.cubic));
  const pills = CLIENT.pillars;
  const [first, ...rest] = CLIENT.title;
  return (
    <AbsoluteFill style={{transform: `scale(${lerp(1, 1.7, exit)})`, opacity: 1 - exit, filter: exit > 0.02 ? `blur(${exit * 16}px)` : undefined}}>
      <Backdrop glowX={50} glowY={42} dots />
      <div style={{position: 'absolute', left: 960 - 520, top: 140, width: 1040, height: 760, borderRadius: '50%', background: 'rgba(212,184,149,.40)', filter: 'blur(80px)', opacity: glow}} />
      {/* lockup */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 210, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 46}}>
        <div style={{overflow: 'hidden', padding: 6}}><Img src={staticFile('codech-logo-crop.png')} style={{height: 118, transform: `translateY(${(1 - lc) * 140}%)`}} /></div>
        {CLIENT.logo && <span style={{font: `300 54px ${INTER}`, color: '#A99C86', transform: `scale(${lx}) rotate(${(1 - lx) * 90}deg)`, display: 'inline-block'}}>×</span>}
        {CLIENT.logo && <div style={{overflow: 'hidden', padding: 6}}><Img src={staticFile(CLIENT.logo)} style={{height: 104, transform: `translateY(${(1 - ls) * 140}%)`}} /></div>}
      </div>
      {/* gold line */}
      <div style={{position: 'absolute', left: 960 - 470 * line, top: 392, width: 940 * line, height: 4, borderRadius: 2, background: 'linear-gradient(90deg,rgba(212,184,149,0),#D4B895 18%,#C9A46A 50%,#D4B895 82%,rgba(212,184,149,0))', boxShadow: '0 0 22px rgba(212,184,149,.8)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 430, textAlign: 'center', font: `500 20px ${MONO}`, letterSpacing: '.3em', color: C.mute, opacity: io(1.05, 1.4), transform: `translateY(${(1 - io(1.05, 1.4)) * 12}px)`}}>A CODECH CASE STUDY</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 486, display: 'flex', justifyContent: 'center'}}>
        <Headline lines={[[first, ...rest.map((w) => ({gold: w}))]]} start={1.35} size={124} stagger={0.14} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 690, display: 'flex', justifyContent: 'center', gap: 18}}>
        {pills.map((p, i) => {
          const q = sp(2.0 + i * 0.18, {damping: 12, stiffness: 170});
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
