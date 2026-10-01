import React from 'react';
import {AbsoluteFill, Easing} from 'remotion';
import {Backdrop, Bubble, C, Cursor, Headline, INTER, MANROPE, Orb, Phone, SendBtn, StatusBar, UI, clamp01, lerp, useT} from './lib';

/* Starter scenes, one per core technique. Every scene uses LOCAL time (t = 0 when it starts); Film.tsx places it from
   timeline.json. Copy one, rename it, register it in Film.tsx. Real films use the client's real flows and screens. */

/** Problem beat: words snap up, a gold strike-through wipes across each on the beat, the tagline lands. */
export const KineticProblem: React.FC<{words?: string[]; tagline?: string}> = ({words = ['Reading.', 'Retyping.', 'Checking.'], tagline = 'Every single order. Every single day.'}) => {
  const {sp, io} = useT();
  return (
    <AbsoluteFill>
      <Backdrop glowX={50} glowY={45} dots />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        {words.map((w, i) => {
          const p = sp(0.1 + i * 0.32, {damping: 13, stiffness: 190});
          const strike = io(0.45 + i * 0.32, 0.7 + i * 0.32, 0, 1, Easing.out(Easing.cubic));
          return (
            <div key={i} style={{position: 'relative', font: `800 150px/1.02 ${MANROPE}`, letterSpacing: '-0.045em', color: C.ink, transform: `translateY(${(1 - p) * 60}px)`, opacity: clamp01(p * 2) * (1 - strike * 0.55)}}>
              {w}<div style={{position: 'absolute', left: -10, top: '54%', height: 14, width: `${strike * 104}%`, background: C.gold, borderRadius: 7}} />
            </div>
          );
        })}
        <div style={{marginTop: 34, font: `500 30px ${INTER}`, color: C.mute, opacity: io(1.6, 2.0)}}>{tagline}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Product beat: photoreal phone at a 3/4 angle, a message types and sends, the AI reply springs in, a result card bursts out. */
export const PhoneHero: React.FC = () => {
  const {t, sp, io, out} = useT();
  const enter = sp(0, {damping: 16, stiffness: 120});
  const msg = '2 ctn of the usual, deliver Friday';
  const typed = msg.slice(0, Math.floor(clamp01((t - 0.6) / 1.1) * msg.length));
  const sent = t > 1.9;
  const reply = sp(2.4, {damping: 13, stiffness: 170});
  const card = sp(3.0, {damping: 12, stiffness: 140});
  return (
    <AbsoluteFill>
      <Backdrop glowX={35} glowY={40} />
      <div style={{position: 'absolute', right: 150, top: 300}}><Headline lines={[['Just', {gold: 'type'}, 'it.']]} start={0.2} size={120} align="right" /></div>
      <div style={{position: 'absolute', left: 300, top: 120, perspective: 2200}}>
        <div style={{transform: `translateY(${(1 - enter) * 900}px) rotateY(${lerp(-40, -14, out(0, 1.4)) + t * 0.6}deg) rotateX(4deg)`, transformStyle: 'preserve-3d'}}>
          <Phone>
            <StatusBar />
            {/* chats start at the TOP under a date pill, like a real thread */}
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 12, padding: '18px 16px'}}>
              <div style={{alignSelf: 'center', font: `600 13px ${INTER}`, color: '#54656F', background: '#fff', borderRadius: 8, padding: '4px 10px'}}>Today</div>
              {sent && <Bubble out size={19} style={{alignSelf: 'flex-end', whiteSpace: 'normal', maxWidth: 260}}>{msg}</Bubble>}
              {t > 2.4 && <div style={{alignSelf: 'flex-start', transform: `scale(${reply})`, transformOrigin: '0 0'}}><Bubble size={19} style={{whiteSpace: 'normal', maxWidth: 270}}>Got it: 2 ctn, Friday delivery. Order SO-1042 booked ✅</Bubble></div>}
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px 26px', background: '#F0F2F5'}}>
              <div style={{flex: 1, background: '#fff', borderRadius: 22, padding: '10px 16px', font: `400 17px ${UI}`, color: typed && !sent ? C.ink : '#8696A0', whiteSpace: 'nowrap', overflow: 'hidden'}}>{!sent && typed ? typed : 'Message'}</div>
              <SendBtn typing={!!typed && !sent} pulse={Math.max(0, 1 - Math.abs(t - 1.9) / 0.15)} />
            </div>
          </Phone>
        </div>
      </div>
      {/* the result bursts out of the phone toward the headline */}
      <div style={{position: 'absolute', left: lerp(560, 900, card), top: lerp(560, 520, card), transform: `scale(${lerp(0.3, 1, card)}) rotate(${(1 - card) * -8}deg)`, opacity: clamp01(card * 2), background: '#fff', borderRadius: 22, padding: '22px 28px', width: 420, boxShadow: '0 50px 90px -24px rgba(40,30,10,.45),0 0 0 1px rgba(0,0,0,.06)'}}>
        <div style={{font: `500 13px ${INTER}`, letterSpacing: '.14em', color: C.mute}}>SALES ORDER · SO-1042</div>
        {[['The usual (A)', '1 ctn'], ['The usual (B)', '1 ctn']].map((r, i) => (
          <div key={i} style={{display: 'flex', justifyContent: 'space-between', font: `600 22px ${INTER}`, color: C.ink, marginTop: 12, opacity: io(3.3 + i * 0.15, 3.5 + i * 0.15)}}><span>✓ {r[0]}</span><span>{r[1]}</span></div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** Exploded UI: a product window flies in tilted, then key panels lift toward camera with a shadow, ClickUp-style.
    With real screenshots, crop the panel out of the same image (see examples/shingtik-marketing-film Ch58 Crop) and scale it
    IN PLACE (scale 1.03-1.14, translateY -3); translateZ under perspective shifts the crop off its slot. */
export const ExplodedUI: React.FC = () => {
  const {sp, io} = useT();
  const fly = sp(0, {damping: 18, stiffness: 90});
  const panels = [['Orders today', '128'], ['Booked by AI', '91%'], ['Overdue', '3'], ['New customers', '12']];
  return (
    <AbsoluteFill>
      <Backdrop glowX={60} glowY={35} />
      <div style={{position: 'absolute', left: 120, top: 90}}><Headline lines={[['Ask', 'your', {gold: 'data.'}]]} start={0.3} size={96} /></div>
      <div style={{position: 'absolute', left: 520, top: 250, perspective: 2400}}>
        <div style={{width: 1240, height: 720, borderRadius: 18, background: '#fff', overflow: 'visible', transform: `translateY(${(1 - fly) * 500}px) rotateX(${lerp(28, 14, fly)}deg) rotateZ(${lerp(-6, -3, fly)}deg)`, boxShadow: '0 90px 140px -40px rgba(40,30,10,.42),0 0 0 1px rgba(0,0,0,.07)'}}>
          <div style={{height: 40, display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', background: '#F4F2EE', borderRadius: '18px 18px 0 0'}}>
            {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <i key={c} style={{width: 12, height: 12, borderRadius: 6, background: c, display: 'block'}} />)}
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, padding: 28}}>
            {panels.map((p, i) => {
              const lift = sp(1.0 + i * 0.18, {damping: 13, stiffness: 160});
              return (
                <div key={i} style={{background: '#FBFAF7', borderRadius: 14, padding: '18px 20px', transform: `translateY(${-lift * 26}px) scale(${1 + lift * 0.06})`, boxShadow: lift > 0.05 ? `0 ${40 * lift}px ${70 * lift}px -24px rgba(40,30,10,.45),0 0 0 1px rgba(0,0,0,.06)` : '0 0 0 1px rgba(0,0,0,.06)'}}>
                  <div style={{font: `500 16px ${INTER}`, color: C.mute}}>{p[0]}</div>
                  <div style={{font: `800 46px ${MANROPE}`, color: i === 1 ? C.goldText : C.ink}}>{p[1]}</div>
                </div>
              );
            })}
          </div>
          <div style={{margin: '0 28px', height: 420, borderRadius: 14, background: '#FBFAF7', boxShadow: '0 0 0 1px rgba(0,0,0,.06)', display: 'flex', alignItems: 'flex-end', gap: 26, padding: 30}}>
            {[0.45, 0.7, 0.55, 0.9, 0.65, 1, 0.8].map((h, i) => <div key={i} style={{flex: 1, height: `${h * 100 * io(1.8 + i * 0.06, 2.4 + i * 0.06)}%`, background: i === 5 ? C.gold : '#E7E1D6', borderRadius: 8}} />)}
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, top: 0, opacity: io(2.8, 3.0)}}><Cursor x={1180} y={360} click={io(3.1, 3.5)} /></div>
    </AbsoluteFill>
  );
};

/** Colour flip: full-screen circle wipe into a brand colour, words slam in on the beat, wipe back out. */
export const ColorFlip: React.FC<{words?: string[]; bg?: [string, string]; dur?: number}> = ({words = ['Matched.', 'Priced.', 'Booked.'], bg = ['#16765C', '#0B4A3A'], dur = 2.0}) => {
  const {sp, io} = useT();
  const open = io(0, 0.45, 0, 1, Easing.out(Easing.exp));
  const close = io(dur - 0.4, dur, 0, 1, Easing.in(Easing.exp));
  return (
    <AbsoluteFill style={{clipPath: `circle(${open * 150 * (1 - close)}% at 70% 45%)`}}>
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(80% 80% at 50% 45%,${bg[0]},${bg[1]})`}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
        {words.map((w, i) => {
          const p = sp(0.35 + i * 0.32, {damping: 11, stiffness: 220});
          return <span key={i} style={{font: `800 150px ${MANROPE}`, letterSpacing: '-0.045em', color: i === words.length - 1 ? C.gold : '#fff', margin: '0 26px', transform: `scale(${lerp(2.2, 1, p)})`, opacity: clamp01(p * 3), filter: p < 0.6 ? `blur(${(0.6 - p) * 18}px)` : undefined}}>{w}</span>;
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Match cut: the previous scene's elements swirl into the AI orb, which then becomes the next scene's hero. */
export const OrbReveal: React.FC = () => {
  const {sp, io} = useT();
  const s = sp(0.1, {damping: 12, stiffness: 120});
  return (
    <AbsoluteFill>
      <Backdrop glowX={50} glowY={45} dots />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{transform: `scale(${lerp(0.2, 1, s)})`}}><Orb size={360} /></div>
        <div style={{marginTop: 50}}><Headline lines={[['Meet', 'your', {gold: 'AI agent.'}]]} start={0.6} size={110} /></div>
        <div style={{marginTop: 18, font: `500 26px ${INTER}`, color: C.mute, opacity: io(1.2, 1.6)}}>Built by Codech</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
