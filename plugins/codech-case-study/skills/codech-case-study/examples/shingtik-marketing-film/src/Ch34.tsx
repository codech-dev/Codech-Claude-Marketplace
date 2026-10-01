import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile} from 'remotion';
import {getLength, getPointAtLength} from '@remotion/paths';
import {Backdrop, Bubble, C, Headline, INTER, MANROPE, MONO, NOTO, Orb, Phone, PhotoTile, Play, SendBtn, StatusBar, UI, Vignette, Wave, clamp01, lerp, useT} from './lib';

const W = 1920, H = 1080;
/** whip pan: returns style for a layer leaving (dir -1 = to left) or entering. */
const whip = (t: number, a: number, b: number, mode: 'in' | 'out', dir = -1) => {
  const p = clamp01((t - a) / (b - a));
  const e = mode === 'out' ? p * p * p : 1 - Math.pow(1 - p, 3);
  const x = mode === 'out' ? dir * e * W * 1.1 : -dir * (1 - e) * W * 1.1;
  const blur = Math.sin(Math.PI * p) * 26;
  return {transform: `translateX(${x}px)`, filter: blur > 0.5 ? `blur(${blur}px)` : undefined} as React.CSSProperties;
};
const WaHeader: React.FC = () => (
  <div style={{background: C.wa, color: '#fff', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px 14px', flex: 'none'}}>
    <span style={{fontSize: 22}}>‹</span><div style={{width: 42, height: 42, borderRadius: '50%', background: '#1d7a5f', display: 'grid', placeItems: 'center', font: `700 19px ${NOTO}`}}>盛</div>
    <div><b style={{font: `600 18px ${INTER}`, display: 'block'}}>ShingTik 盛德</b><small style={{font: `400 13px ${INTER}`, opacity: 0.85}}>Business account</small></div>
  </div>
);
const Msg: React.FC<{out?: boolean; at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({out, at, children, style}) => {
  const {t, sp} = useT();
  if (t < at) return null;
  const p = sp(at, {damping: 13, stiffness: 180});
  return <div style={{alignSelf: out ? 'flex-end' : 'flex-start', maxWidth: '84%', background: out ? C.waOut : '#fff', borderRadius: 14, padding: '9px 12px 7px', font: `400 17px/1.4 ${UI}`, boxShadow: '0 1px 1px rgba(0,0,0,.08)', transform: `scale(${p}) translateY(${(1 - p) * 20}px)`, transformOrigin: out ? 'bottom right' : 'bottom left', ...style}}>{children}</div>;
};
const Typing: React.FC<{a: number; b: number}> = ({a, b}) => {
  const {t} = useT();
  if (t < a || t > b) return null;
  return <div style={{alignSelf: 'flex-start', background: '#fff', borderRadius: 14, padding: '12px 14px', display: 'flex', gap: 5}}>{[0, 1, 2].map(i => <i key={i} style={{width: 8, height: 8, borderRadius: 4, background: '#9aa', transform: `translateY(${Math.sin(t * 12 - i) * 3}px)`}} />)}</div>;
};
const Tile: React.FC<{ch: string; tint?: number; size?: number}> = ({ch, tint = 0, size = 64}) => {
  const T = [['#F7EBD6', '#EAD5B2', '#8A6A3A'], ['#F9E9D9', '#F0CFAE', '#9A5A2A'], ['#ECE6F7', '#D8CDEF', '#5B4C8A'], ['#EEF3E2', '#D9E6C2', '#5E7340'], ['#E3EEF5', '#C9DDEB', '#3A6283']][tint];
  return <div style={{width: size, height: size, borderRadius: size * 0.22, background: `linear-gradient(145deg,${T[0]},${T[1]})`, color: T[2], display: 'grid', placeItems: 'center', font: `700 ${size * 0.48}px ${NOTO}`, flex: 'none'}}>{ch}</div>;
};
const Check: React.FC<{s?: number; p?: number}> = ({s = 26, p = 1}) => <span style={{width: s, height: s, borderRadius: '50%', background: C.green, color: '#fff', display: 'inline-grid', placeItems: 'center', font: `800 ${s * 0.55}px ${INTER}`, transform: `scale(${p})`, flex: 'none'}}>✓</span>;

/* ---------------- 3.1 TYPE ---------------- */
const LANG = [
  {msg: `早安 老板
香菇头大 5包
素叉烧 3包
斋鹅 2条`, ok: '好的，已为您下单 ✅', items: ['香菇头（大）× 5 PKT', '素叉烧 × 3 PKT', '斋鹅 × 2 PKT'], said: ['“香菇头大 5包”', '“素叉烧 3包”', '“斋鹅 2条”']},
  {msg: `Morning boss
Big mushroom x5
Veg char siew x3
Veg goose x2`, ok: 'Done, order placed ✅', items: ['Mushroom (L) × 5 PKT', 'Veg char siew × 3 PKT', 'Veg goose × 2 PKT'], said: ['“Big mushroom x5”', '“Veg char siew x3”', '“Veg goose x2”']},
  {msg: `Selamat pagi bos
Cendawan besar 5 pek
Char siew sayur 3 pek
Angsa sayur 2 ekor`, ok: 'Baik, pesanan dibuat ✅', items: ['Cendawan (besar) × 5 PKT', 'Char siew sayur × 3 PKT', 'Angsa sayur × 2 PKT'], said: ['“Cendawan besar 5 pek”', '“Char siew sayur 3 pek”', '“Angsa sayur 2 ekor”']},
];
const LSW = [14.3, 14.95, 15.6]; // times the language switches to 中文 / English / Bahasa

export const TypeScene: React.FC = () => {
  const {t, sp, io, out} = useT();
  const p = sp(11.05, {damping: 15, stiffness: 95});
  const msg = '早安 老板\n香菇头大 5包\n素叉烧 3包\n斋鹅 2条';
  const typed = msg.slice(0, Math.round(msg.length * io(11.45, 12.0, 0, 1, Easing.linear)));
  const sent = t > 12.05;
  const cart = sp(13.1, {damping: 14, stiffness: 110});
  const leave = whip(t, 16.35, 16.8, 'out');
  const langs = ['中文', 'English', 'Bahasa'];
  const hi = t < LSW[0] ? -1 : t < LSW[1] ? 0 : t < LSW[2] ? 1 : 2;
  const L = LANG[Math.max(0, hi)];
  const flip = Math.max(0, ...LSW.slice(1).map(s0 => 1 - Math.abs(t - s0) / 0.14));
  const stamp = sp(14.9, {damping: 9, stiffness: 200});
  return (
    <AbsoluteFill style={{...leave}}>
      <Backdrop glowX={30} glowY={45} />
      <div style={{position: 'absolute', left: 300, top: 120, perspective: 2000}}>
        <div style={{transform: `translateX(${(1 - p) * 900}px) rotateY(${lerp(55, -22, p) + (t - 12) * 1.2}deg) rotateX(4deg) scale(${1 + out(12, 16.3) * 0.04})`}}>
          <Phone scale={1.1}>
            <StatusBar /><WaHeader />
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: 14, gap: 9, overflow: 'hidden'}}>
              <div style={{alignSelf: 'center', background: '#fff', borderRadius: 8, padding: '4px 12px', font: `500 13px ${INTER}`, color: '#54656F', boxShadow: '0 1px 1px rgba(0,0,0,.06)', marginBottom: 4}}>Today</div>
              <Msg out at={12.05} style={{transform: `scaleY(${1 - flip * 0.9})`}}><span style={{whiteSpace: 'pre'}}>{t < 12.05 ? msg : L.msg}</span></Msg>
              <Typing a={12.35} b={12.85} />
              <Msg at={12.85} style={{transform: `scaleY(${1 - flip * 0.9})`}}>{L.ok}<br /><b style={{color: C.wa}}>SO-01234</b>{L.items.map((x, i) => <React.Fragment key={i}><br />• {x}</React.Fragment>)}</Msg>
            </div>
            <div style={{height: 62, background: '#F4F1EC', display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px 6px', flex: 'none'}}>
              <div style={{flex: 1, height: 42, borderRadius: 21, background: '#fff', font: `400 15px ${UI}`, display: 'flex', alignItems: 'center', padding: '0 16px', color: sent || !typed ? '#999' : C.ink, whiteSpace: 'nowrap', overflow: 'hidden'}}>{sent || !typed ? 'Message' : typed.replace(/\n/g, ' ')}<span style={{opacity: !sent && Math.floor(t * 4) % 2 ? 1 : 0}}>|</span></div>
              <SendBtn typing={!sent && !!typed} pulse={Math.max(0, 1 - Math.abs(t - 12.0) / 0.12)} />
            </div>
          </Phone>
        </div>
      </div>
      {/* cart card bursts out of the phone */}
      <div style={{position: 'absolute', left: lerp(520, 930, cart), top: lerp(560, 330, cart), transform: `scale(${lerp(0.25, 1, cart)}) rotate(${(1 - cart) * -14}deg)`, transformOrigin: 'left top', opacity: clamp01(cart * 3),
        width: 620, padding: '30px 32px', borderRadius: 30, background: '#fff', boxShadow: '0 2px 0 rgba(0,0,0,.03),0 70px 110px -36px rgba(40,30,10,.42),0 0 0 1px rgba(0,0,0,.05)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
          <span style={{font: `600 15px ${MONO}`, letterSpacing: '.12em', color: C.mute}}>CART · AUTO-MATCHED</span>
          <span style={{display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 99, background: '#E3F6EA', color: '#13703F', font: `700 19px ${INTER}`, transform: `scale(${stamp}) rotate(${(1 - stamp) * 25}deg)`}}><Check s={24} />SO-01234</span>
        </div>
        {[['香', '香菇头（大）', '1,800 SKUs → exact match', '× 5', 0], ['叉', '素叉烧', 'customer alias', '× 3', 1], ['鹅', '斋鹅', 'brand resolved', '× 2', 2]].map((r, i) => {
          const q = sp(13.45 + i * 0.18, {damping: 14, stiffness: 170});
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', borderTop: '1px solid #F0EDE6', transform: `translateX(${(1 - q) * 60}px)`, opacity: q}}>
              <Tile ch={r[0] as string} tint={r[4] as number} />
              <div style={{flex: 1}}><div style={{font: `700 24px ${UI}`}}>{r[1]}</div><div style={{font: `400 16px ${UI}`, color: C.mute, marginTop: 2, transform: `scaleY(${1 - flip * 0.9})`}}>{hi < 0 ? r[2] : <>from <b style={{color: C.goldText}}>{L.said[i]}</b></>}</div></div>
              <div style={{font: `800 22px ${INTER}`, background: '#F4F1EA', borderRadius: 12, padding: '7px 14px'}}>{r[3]}</div>
              <Check s={30} p={sp(13.75 + i * 0.18, {damping: 8})} />
            </div>
          );
        })}
      </div>
      {/* language chips cycle */}
      <div style={{position: 'absolute', left: 960, top: 230, display: 'flex', gap: 14}}>
        {langs.map((l, i) => {
          const q = sp(14.1 + i * 0.1, {damping: 10, stiffness: 180});
          const on = i === hi;
          return <span key={i} style={{padding: '10px 22px', borderRadius: 99, font: `700 24px ${UI}`, background: on ? C.wa : C.goldTint, color: on ? '#fff' : C.goldText, transform: `scale(${q * (on ? 1.12 : 1)})`, boxShadow: '0 14px 30px -14px rgba(0,0,0,.3)'}}>{l}</span>;
        })}
      </div>
      <div style={{position: 'absolute', right: 118, top: 104}}><Headline lines={[['Just'], [{gold: 'type'}, 'it.']]} start={11.3} size={98} align="right" /></div>
      <Vignette />
    </AbsoluteFill>
  );
};

/* ---------------- 3.2 PHOTO ---------------- */
export const PhotoScene: React.FC = () => {
  const {t, sp, io, out} = useT();
  const enter = whip(t, 16.4, 16.85, 'in');
  const flash = Math.max(0, 1 - Math.abs(t - 17.05) / 0.12);
  const lift = sp(17.35, {damping: 15, stiffness: 100});
  const close = out(17.8, 18.2);
  const scanY = io(18.0, 19.0, 0, 1, Easing.inOut(Easing.sin));
  const cands = ['豆', '包', '饺'];
  const shuffle = t > 18.3 && t < 19.2 ? cands[Math.floor(t * 9) % 3] : '豆';
  const match = sp(19.25, {damping: 13, stiffness: 150});
  const ring = out(19.4, 20.1);
  const leaveLine = io(21.55, 21.95);
  return (
    <AbsoluteFill style={{...enter}}>
      <Backdrop glowX={60} glowY={35} />
      <div style={{position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(122,95,55,.10) 1.6px,transparent 1.6px)', backgroundSize: '34px 34px'}} />
      {/* overhead phone */}
      <div style={{position: 'absolute', left: 560, top: 150, transform: `rotate(${-9 + (t - 17) * 0.6}deg) scale(${0.92 + out(16.8, 21.5) * 0.04})`, filter: 'drop-shadow(30px 40px 40px rgba(40,30,10,.35))'}}>
        <Phone scale={0.98}>
          <StatusBar /><WaHeader />
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: 14, gap: 9, overflow: 'hidden'}}>
              <div style={{alignSelf: 'center', background: '#fff', borderRadius: 8, padding: '4px 12px', font: `500 13px ${INTER}`, color: '#54656F', boxShadow: '0 1px 1px rgba(0,0,0,.06)', marginBottom: 4}}>Today</div>
            <Msg out at={17.1} style={{padding: 6}}><PhotoTile ch="豆" w={230} /><div style={{padding: '6px 6px 0'}}>这个要 4 包</div></Msg>
            <Msg at={19.6}>您要的是这个吗?<br /><b>AA 豆包 500g</b></Msg>
            <Msg out at={20.2}>是</Msg>
            <Msg at={20.6}>已加入订单 ✅ <b style={{color: C.wa}}>SO-01241</b></Msg>
          </div>
        </Phone>
      </div>
      {/* lifted photo with scan */}
      {t > 17.3 && (
        <div style={{position: 'absolute', left: lerp(640, 1080, lift), top: lerp(560, 190, lift), transform: `scale(${lerp(0.5, 1, lift)}) rotate(${lerp(-9, 6, lift)}deg)`, transformOrigin: 'left top', padding: 18, borderRadius: 26, background: '#fff', boxShadow: '0 70px 110px -36px rgba(40,30,10,.45),0 0 0 1px rgba(0,0,0,.05)'}}>
          <div style={{width: 420, height: 400, borderRadius: 16, background: 'linear-gradient(150deg,#EAD7B4,#C9A26B)', position: 'relative', overflow: 'hidden', display: 'grid', placeItems: 'center', font: `700 200px ${NOTO}`, color: '#8A6436'}}>
            {shuffle}
            {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([r, b], i) => (
              <i key={i} style={{position: 'absolute', [r ? 'right' : 'left']: lerp(-40, 22, close), [b ? 'bottom' : 'top']: lerp(-40, 22, close), width: 66, height: 66, borderRadius: 8,
                [b ? 'borderBottom' : 'borderTop']: '6px solid #fff', [r ? 'borderRight' : 'borderLeft']: '6px solid #fff', opacity: close} as React.CSSProperties} />
            ))}
            {t > 18 && t < 19.05 && <div style={{position: 'absolute', left: 14, right: 14, top: `${8 + scanY * 84}%`, height: 6, background: '#fff', borderRadius: 3, boxShadow: '0 0 26px 8px rgba(255,236,190,.95)'}} />}
            {t > 18 && t < 19.05 && <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: `${8 + scanY * 84}%`, background: 'linear-gradient(to bottom,rgba(255,255,255,0),rgba(255,255,255,.25))'}} />}
          </div>
        </div>
      )}
      {/* match card */}
      <div style={{position: 'absolute', left: 1120, top: 690, transform: `translateY(${(1 - match) * 80}px) scale(${lerp(0.8, 1, match)})`, opacity: clamp01(match * 2), display: 'flex', alignItems: 'center', gap: 18, padding: '20px 26px', borderRadius: 26, background: '#fff', boxShadow: '0 60px 100px -34px rgba(40,30,10,.42),0 0 0 1px rgba(0,0,0,.05)'}}>
        <Tile ch="豆" size={70} />
        <div><div style={{font: `700 28px ${UI}`}}>AA 豆包 500g</div><div style={{font: `400 17px ${INTER}`, color: C.mute}}>vision + image match</div></div>
        <svg width="86" height="86" viewBox="0 0 62 62"><circle cx="31" cy="31" r="26" fill="none" stroke="#EEE" strokeWidth="6" /><circle cx="31" cy="31" r="26" fill="none" stroke={C.green} strokeWidth="6" strokeDasharray="163" strokeDashoffset={lerp(163, 4, ring)} transform="rotate(-90 31 31)" strokeLinecap="round" /><text x="31" y="36" textAnchor="middle" fontFamily={INTER} fontWeight="800" fontSize="15" fill="#13703F">{Math.round(98 * ring)}%</text></svg>
      </div>
      <div style={{position: 'absolute', left: 118, top: 104}}><Headline lines={[['Snap', 'a'], [{gold: 'photo.'}]]} start={16.9} size={98} /></div>
      {flash > 0 && <AbsoluteFill style={{background: '#fff', opacity: flash}} />}
      {/* the scan line becomes the gold line that wipes into the voice scene */}
      {leaveLine > 0 && <div style={{position: 'absolute', left: 0, top: H / 2 - 4, height: 8, width: `${leaveLine * 100}%`, background: 'linear-gradient(90deg,#EBD9B7,#C9A46A)', boxShadow: '0 0 30px rgba(212,184,149,.9)'}} />}
      <Vignette />
    </AbsoluteFill>
  );
};

/* ---------------- 3.3 VOICE ---------------- */
export const VoiceScene: React.FC = () => {
  const {t, sp, io, out} = useT();
  const grow = out(21.95, 22.7);
  const ph = sp(22.4, {damping: 15, stiffness: 100});
  const prog = io(22.7, 25.2, 0, 1, Easing.linear);
  const tx = '“明天送 Kepong，素肉丝三包，猴头菇两包”';
  const shown = tx.slice(0, Math.round(tx.length * io(24.0, 25.3, 0, 1, Easing.linear)));
  const card = sp(23.8, {damping: 14, stiffness: 140});
  const N = 46;
  return (
    <AbsoluteFill>
      <Backdrop glowX={55} glowY={45} />
      <div style={{position: 'absolute', left: 820, top: 110, width: 1000, height: 640, borderRadius: '50%', background: 'rgba(212,184,149,.30)', filter: 'blur(70px)', opacity: grow}} />
      {/* phone, side profile */}
      <div style={{position: 'absolute', left: 470, top: 175, perspective: 1600}}>
        <div style={{transform: `translateX(${(1 - ph) * -700}px) rotateY(${lerp(-60, -16, ph) + (t - 22.4) * 0.8}deg) rotateX(4deg)`}}>
          <Phone scale={0.95}>
            <StatusBar /><WaHeader />
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: 14, gap: 9, overflow: 'hidden'}}>
              <div style={{alignSelf: 'center', background: '#fff', borderRadius: 8, padding: '4px 12px', font: `500 13px ${INTER}`, color: '#54656F', boxShadow: '0 1px 1px rgba(0,0,0,.06)', marginBottom: 4}}>Today</div>
              <Msg out at={22.6}><div style={{display: 'flex', alignItems: 'center', gap: 10}}><Play /><Wave n={20} on={Math.round(prog * 20)} t={t < 25.2 ? t : 0} /><span style={{font: `500 13px ${INTER}`, color: '#667'}}>0:09</span></div></Msg>
              <Msg at={25.6}>好的，已为您下单 ✅<br /><b style={{color: C.wa}}>SO-01258</b><br />• 素肉丝 × 3 PKT<br />• 猴头菇 × 2 PKT</Msg>
            </div>
          </Phone>
        </div>
      </div>
      {/* giant waveform grows out of the gold line */}
      <div style={{position: 'absolute', left: 990, top: 290, width: 860, height: 300, display: 'flex', alignItems: 'center', gap: 7}}>
        {Array.from({length: N}, (_, i) => {
          const base = Math.abs(Math.sin(i * 0.55 + 1) * Math.cos(i * 0.21)) * 0.85 + 0.12;
          const live = 0.35 + 0.65 * Math.abs(Math.sin(t * 6 + i * 0.45));
          const on = i / N < prog;
          const h = 8 + (base * 280 - 8) * grow * (on ? live : 0.5);
          return <i key={i} style={{display: 'block', width: 11, borderRadius: 6, height: h, background: on ? 'linear-gradient(#EBD9B7,#B8935A)' : 'linear-gradient(#d9dedb,#b9c0bd)', boxShadow: on ? '0 0 18px rgba(212,184,149,.6)' : 'none'}} />;
        })}
      </div>
      {/* transcript card */}
      <div style={{position: 'absolute', left: 1080, top: 690, width: 700, padding: '24px 30px', borderRadius: 26, background: '#fff', transform: `translateY(${(1 - card) * 90}px)`, opacity: clamp01(card * 2), boxShadow: '0 60px 100px -34px rgba(40,30,10,.42),0 0 0 1px rgba(0,0,0,.05)'}}>
        <div style={{font: `600 14px ${MONO}`, letterSpacing: '.12em', color: C.mute, marginBottom: 10}}>TRANSCRIPT · CONFIDENCE OK</div>
        <div style={{font: `500 30px/1.45 ${NOTO}`, minHeight: 44}}>{shown}</div>
        <div style={{marginTop: 14, display: 'flex', gap: 10, opacity: io(25.3, 25.6)}}><span style={{display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 99, background: '#E3F6EA', color: '#13703F', font: `700 18px ${INTER}`, transform: `scale(${sp(25.3, {damping: 9})})`}}><Check s={22} />SO-01258</span></div>
      </div>
      <div style={{position: 'absolute', left: 118, top: 104}}><Headline lines={[['Or', 'just'], [{gold: 'say'}, 'it.']]} start={22.2} size={98} /></div>
      <Vignette />
    </AbsoluteFill>
  );
};

/* ---------------- colour-flip interstitial ---------------- */
export const Interstitial: React.FC = () => {
  const {t, sp, io} = useT();
  const open = io(26.95, 27.4, 0, 1, Easing.out(Easing.exp));
  const close = io(28.55, 28.95, 0, 1, Easing.in(Easing.exp));
  const words = ['Matched.', 'Priced.', 'Booked.'];
  return (
    <AbsoluteFill style={{clipPath: `circle(${open * 150 * (1 - close)}% at 70% 45%)`, background: C.wa}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(80% 80% at 50% 45%,#16765C,#0B4A3A)'}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 0, flexDirection: 'row'}}>
        {words.map((w, i) => {
          const p = sp(27.3 + i * 0.32, {damping: 11, stiffness: 220});
          return <span key={i} style={{font: `800 150px ${MANROPE}`, letterSpacing: '-0.045em', color: i === 2 ? C.gold : '#fff', margin: '0 26px', transform: `scale(${lerp(2.2, 1, p)})`, opacity: clamp01(p * 3), filter: p < 0.6 ? `blur(${(0.6 - p) * 18}px)` : undefined}}>{w}</span>;
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------- 4.1 BOOKED ---------------- */
const SO = [['SO-01262', 'Klang 店', 4, 'AI · text', '23:58'], ['SO-01261', 'Ipoh 店', 2, 'AI · voice', '23:12'], ['SO-01260', 'Bangsar 店', 3, 'AI · photo', '22:41'], ['SO-01259', 'Melaka 店', 6, 'AI · text', '21:05'], ['SO-01258', 'Kepong 店', 2, 'AI · voice', '16:40'], ['SO-01241', 'Puchong 店', 1, 'AI · photo', '10:16'], ['SO-01234', 'Cheras 店', 3, 'AI · text', '08:02']];
export const BookedScene: React.FC = () => {
  const {t, sp, io, out} = useT();
  const shrink = io(31.9, 32.5, 0, 1, Easing.inOut(Easing.cubic));
  const win = sp(28.6, {damping: 16, stiffness: 110});
  const count = Math.round(lerp(121, 128, out(29.2, 31.0)));
  return (
    <AbsoluteFill>
      <Backdrop glowX={60} glowY={40} />
      <AbsoluteFill style={{transform: `scale(${lerp(1, 0.2, shrink)})`, transformOrigin: '1015px 600px', opacity: 1 - io(32.3, 32.5)}}>
        <AbsoluteFill style={{perspective: 2600}}>
          <div style={{position: 'absolute', left: 480, top: 300, transform: `rotateX(${lerp(48, 30, out(28.6, 32))}deg) rotateZ(${lerp(-22, -14, out(28.6, 32))}deg) translateY(${(1 - win) * 500}px)`, transformStyle: 'preserve-3d'}}>
            <div style={{width: 1080, borderRadius: 26, background: '#fff', overflow: 'hidden', boxShadow: '0 90px 140px -40px rgba(40,30,10,.42),0 0 0 1px rgba(0,0,0,.06)'}}>
              <div style={{height: 64, display: 'flex', alignItems: 'center', gap: 12, padding: '0 26px', borderBottom: '1px solid #EEEBE4', font: `600 22px ${INTER}`}}>
                <Img src={staticFile('logos/sql-account.png')} style={{height: 26}} /><span>SQL Account · Sales Orders</span>
                <span style={{marginLeft: 'auto', font: `700 18px ${INTER}`, color: '#13703F', background: '#E3F6EA', padding: '6px 14px', borderRadius: 99}}>● Live · {count} today</span>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1.1fr 1.1fr .6fr 1fr .7fr', padding: '14px 26px', font: `600 14px ${INTER}`, letterSpacing: '.06em', color: C.mute, borderBottom: '1px solid #EEEBE4'}}><span>SO NO.</span><span>CUSTOMER</span><span>LINES</span><span>SOURCE</span><span>TIME</span></div>
              <div style={{height: 7 * 62, position: 'relative', overflow: 'hidden'}}>
                {(() => {
                  const arr = [3, 2, 1, 0].filter((k, j) => t > 29.4 + j * 0.38);
                  const rows = [...arr.slice().reverse().map(k => SO[k]), ...SO.slice(4)];
                  const lastT = 29.4 + (arr.length - 1) * 0.38;
                  const q = arr.length ? sp(lastT, {damping: 16, stiffness: 200}) : 1;
                  return rows.map((r, j) => {
                    const isNew = j === 0 && arr.length > 0;
                    return (
                      <div key={r[0] as string} style={{position: 'absolute', left: 0, right: 0, top: (j - (1 - q)) * 62, height: 62, display: 'grid', gridTemplateColumns: '1.1fr 1.1fr .6fr 1fr .7fr', alignItems: 'center', padding: '0 26px', borderBottom: '1px solid #F3F0EA',
                        background: isNew ? `rgba(246,236,220,${1 - out(lastT + 0.2, lastT + 0.6)})` : '#fff', font: `500 20px ${UI}`, opacity: isNew ? q : 1}}>
                        <span style={{font: `500 18px ${MONO}`}}>{r[0]}</span><span>{r[1]}</span><span>{r[2]}</span>
                        <span><span style={{font: `600 15px ${INTER}`, color: '#13703F', background: '#E3F6EA', padding: '5px 12px', borderRadius: 99}}>{r[3]}</span></span><span style={{font: `500 18px ${MONO}`}}>{r[4]}</span>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </AbsoluteFill>
        {/* pipeline */}
        <div style={{position: 'absolute', left: 980, top: 200, display: 'flex', gap: 14, alignItems: 'center'}}>
          {[['logos/whatsapp.svg', 'WhatsApp'], ['', 'Codech AI'], ['logos/sql-account.png', 'SQL Account']].map((p, i) => {
            const q = sp(29.0 + i * 0.18, {damping: 11, stiffness: 180});
            const lit = t > 29.4 + i * 0.25;
            return (
              <React.Fragment key={i}>
                {i > 0 && <span style={{font: `800 30px ${INTER}`, color: C.gold, opacity: q}}>→</span>}
                <span style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 99, background: '#fff', font: `700 22px ${INTER}`, transform: `scale(${q})`, boxShadow: lit ? '0 0 0 3px #D4B895,0 14px 30px -12px rgba(0,0,0,.3)' : '0 14px 30px -12px rgba(0,0,0,.25)'}}>
                  {p[0] ? <Img src={staticFile(p[0])} style={{height: 28}} /> : <Orb size={28} glow={0.3} />}{p[1]}
                </span>
              </React.Fragment>
            );
          })}
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 118, top: 104, opacity: 1 - shrink}}><Headline lines={[['Booked', 'in'], [{gold: 'seconds.'}]]} start={28.7} size={98} /></div>
      <Vignette />
    </AbsoluteFill>
  );
};

/* ---------------- 4.2 INTEGRATION ---------------- */
const HX = 1015, HY = 600, HS = 300, TS = 170;
const SYS: [string, string, string, number, number][] = [
  ['whatsapp.svg', 'WhatsApp', 'Orders in', 300, 330], ['respond-io.svg', 'respond.io', 'CS takeover', 300, 760],
  ['n8n.svg', 'n8n', '54 workflows', 640, 120], ['openai.svg', 'OpenAI', 'Agents · vision', 930, 60], ['groq.svg', 'Groq Whisper', 'Voice → text', 1220, 120],
  ['sql-account.png', 'SQL Account', 'SO booked', 1560, 260], ['postgresql.svg', 'PostgreSQL', 'Catalogue search', 1600, 560], ['google-sheets.svg', 'Google Sheets', 'Aliases & zones', 1560, 850]];
const sysPath = (i: number) => {
  const [, , , x, y] = SYS[i];
  const cx = x + TS / 2, cy = y + TS / 2;
  const tx = HX + (cx - HX) * 0.18, ty = HY + (cy - HY) * 0.18;
  const mx = (cx + tx) / 2, my = (cy + ty) / 2;
  return `M${cx} ${cy} Q${mx + (cy - HY) * 0.15} ${my - (cx - HX) * 0.15} ${tx} ${ty}`;
};
export const IntegrationScene: React.FC = () => {
  const {t, sp, io, out} = useT();
  const hub = sp(32.3, {damping: 13, stiffness: 120});
  const dive = io(37.45, 37.95, 0, 1, Easing.in(Easing.exp));
  const rot = (t - 32.3) * 1.2;
  return (
    <AbsoluteFill style={{transform: `scale(${lerp(1, 5, dive)})`, transformOrigin: `${300 + TS / 2}px ${760 + TS / 2}px`, filter: dive > 0.02 ? `blur(${dive * 14}px)` : undefined}}>
      <Backdrop dots glowX={53} glowY={55} />
      <div style={{position: 'absolute', left: HX - 330, top: HY - 300, width: 660, height: 600, borderRadius: '50%', background: 'rgba(212,184,149,.40)', filter: 'blur(60px)', opacity: hub}} />
      <AbsoluteFill style={{perspective: 2600}}>
        <AbsoluteFill style={{transform: `translate(40px,40px) scale(0.88) rotateY(${lerp(-10, -4, out(32.3, 37.5))}deg) rotateX(${lerp(8, 4, out(32.3, 37.5))}deg)`}}>
          <svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
            <defs><filter id="ib" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8" /></filter></defs>
            {[230, 330, 450].map((r, k) => <circle key={k} cx={HX} cy={HY} r={r * hub} fill="none" stroke={`rgba(201,164,106,${0.45 - k * 0.12})`} strokeWidth={3 - k * 0.6} strokeDasharray={k ? '6 14' : undefined} transform={`rotate(${rot * (k % 2 ? -1 : 1) * 6} ${HX} ${HY})`} />)}
            {SYS.map((s, i) => {
              const d = sysPath(i), L = getLength(d), st = 33.0 + i * 0.16, p = io(st, st + 0.5);
              const u = ((Math.max(0, t - st - 0.4) * 0.5 + i * 0.13) % 1);
              const pt = getPointAtLength(d, L * u);
              return (
                <g key={i}>
                  <path d={d} stroke="#C9A46A" strokeWidth={16} opacity={0.22 * p} fill="none" filter="url(#ib)" />
                  <path d={d} stroke="#D4B895" strokeWidth={5} fill="none" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} />
                  {t > st + 0.4 && <><circle cx={pt.x} cy={pt.y} r={18} fill="rgba(212,184,149,.4)" filter="url(#ib)" /><circle cx={pt.x} cy={pt.y} r={9} fill="#fff" stroke="#C9A46A" strokeWidth={5} /></>}
                </g>
              );
            })}
          </svg>
          {/* labels on links */}
          {SYS.map((s, i) => {
            const d = sysPath(i), m = getPointAtLength(d, getLength(d) * 0.5), q = sp(33.4 + i * 0.16, {damping: 12});
            return <div key={'l' + i} style={{position: 'absolute', left: m.x, top: m.y, transform: `translate(-50%,-50%) scale(${q})`, padding: '7px 15px', borderRadius: 99, background: '#fff', border: '1px solid #ECE6DA', font: `600 17px ${INTER}`, color: '#3A3F4B', whiteSpace: 'nowrap', boxShadow: '0 12px 26px -12px rgba(60,45,20,.35)'}}>{s[2]}</div>;
          })}
          {/* tiles fly in from the edges */}
          {SYS.map((s, i) => {
            const q = sp(32.55 + i * 0.12, {damping: 13, stiffness: 120});
            const fx = s[3] < HX ? -600 : s[3] > HX + 200 ? 600 : 0, fy = s[4] < 200 ? -500 : 0;
            return (
              <div key={'t' + i} style={{position: 'absolute', left: s[3] + fx * (1 - q), top: s[4] + fy * (1 - q), width: TS, textAlign: 'center', opacity: clamp01(q * 2), transform: `rotate(${(1 - q) * (i % 2 ? 20 : -20)}deg)`}}>
                <div style={{width: TS, height: TS, borderRadius: 44, background: '#fff', display: 'grid', placeItems: 'center', boxShadow: '0 2px 0 rgba(0,0,0,.03),0 36px 60px -24px rgba(60,45,20,.38),0 0 0 1px rgba(0,0,0,.05)'}}><Img src={staticFile('logos/' + s[0])} style={{width: 92, height: 92, objectFit: 'contain'}} /></div>
                <div style={{font: `700 22px ${INTER}`, marginTop: 14, whiteSpace: 'nowrap'}}>{s[1]}</div>
              </div>
            );
          })}
          {/* hub */}
          <div style={{position: 'absolute', left: HX - HS / 2, top: HY - HS / 2, width: HS, height: HS, borderRadius: 70, background: 'linear-gradient(160deg,#FFFFFF,#FBF5EA)', transform: `scale(${hub})`,
            boxShadow: '0 0 0 12px rgba(212,184,149,.22),0 0 0 26px rgba(212,184,149,.10),0 60px 100px -30px rgba(120,85,30,.45),inset 0 0 0 2px rgba(212,184,149,.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14}}>
            <Orb size={110} /><div style={{font: `800 36px ${MANROPE}`, letterSpacing: '-0.025em'}}>AI System</div><div style={{font: `600 13px ${MONO}`, letterSpacing: '.16em', color: C.goldText}}>AGENTS · SEARCH · SYNC</div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 118, top: 104}}><Headline lines={[['Plugs', 'into'], ['your', {gold: 'systems.'}]]} start={32.4} size={98} /></div>
      <Vignette />
    </AbsoluteFill>
  );
};

/* ---------------- 4.3 CS TAKEOVER ---------------- */
export const CSScene: React.FC = () => {
  const {t, sp, io} = useT();
  const zin = io(37.85, 38.4, 0, 1, Easing.out(Easing.exp));
  const sw = io(40.05, 40.4);
  const esc = sp(39.2, {damping: 11, stiffness: 160});
  const tog = sp(39.7, {damping: 11, stiffness: 160});
  return (
    <AbsoluteFill style={{transform: `scale(${lerp(0.35, 1, zin)})`, opacity: zin, filter: zin < 0.98 ? `blur(${(1 - zin) * 12}px)` : undefined}}>
      <Backdrop glowX={60} glowY={40} />
      <AbsoluteFill style={{perspective: 2400}}>
        <div style={{position: 'absolute', left: 520, top: 270, transform: `rotateY(${lerp(-22, -14, io(37.9, 42))}deg)`, width: 1180, height: 680, borderRadius: 28, background: '#fff', overflow: 'hidden', display: 'flex', boxShadow: '0 80px 120px -40px rgba(40,30,10,.42),0 0 0 1px rgba(0,0,0,.06)'}}>
          <div style={{width: 330, borderRight: '1px solid #EEEBE4', padding: 20}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 10, margin: '4px 6px 16px'}}><Img src={staticFile('logos/respond-io.svg')} style={{height: 26}} /><span style={{font: `600 15px ${MONO}`, letterSpacing: '.12em', color: C.mute}}>INBOX</span></div>
            {[['C', 'Cheras 店', '上次的货有一包坏了…', '#8A6A3A'], ['K', 'Kepong 店', 'SO-01258 booked', '#5E7340'], ['P', 'Puchong 店', 'SO-01241 booked', '#3A6283'], ['I', 'Ipoh 店', '谢谢 👍', '#5B4C8A'], ['L', 'Klang 店', 'SO-01262 booked', '#9A5A2A']].map((c, i) => (
              <div key={i} style={{display: 'flex', gap: 12, alignItems: 'center', padding: 12, borderRadius: 14, background: i === 0 ? C.goldTint : undefined}}>
                <div style={{width: 42, height: 42, borderRadius: '50%', background: c[3], color: '#fff', display: 'grid', placeItems: 'center', font: `700 18px ${NOTO}`}}>{c[0]}</div>
                <div><b style={{font: `600 17px ${UI}`}}>{c[1]}</b><div style={{font: `400 14px ${UI}`, color: C.mute}}>{c[2]}</div></div>
              </div>
            ))}
          </div>
          <div style={{flex: 1, background: C.waBg, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 12, padding: 26}}>
            <div style={{alignSelf: 'center', background: '#fff', borderRadius: 8, padding: '4px 12px', font: `500 13px ${INTER}`, color: '#54656F', boxShadow: '0 1px 1px rgba(0,0,0,.06)', marginBottom: 4}}>Today</div>
            <Msg out at={38.4} style={{fontSize: 20}}><PhotoTile ch="叉" w={210} /><div style={{marginTop: 6}}>上次的货有一包坏了，可以换吗?</div></Msg>
            <Msg at={38.9} style={{fontSize: 20}}>不好意思 🙏 我已通知客服同事。</Msg>
            <Msg at={40.5} style={{fontSize: 20, boxShadow: '0 0 0 2px #D4B895'}}><b style={{color: C.goldText}}>Mei · CS</b><br />您好，请拍一张照片给我，下次送货时帮您换。</Msg>
          </div>
        </div>
        <div style={{position: 'absolute', left: 1540, top: 170, transform: `scale(${tog})`, display: 'flex', alignItems: 'center', gap: 18, padding: '18px 24px', borderRadius: 24, background: '#fff', boxShadow: '0 50px 90px -30px rgba(40,30,10,.42),0 0 0 1px rgba(0,0,0,.05)'}}>
          <div style={{width: 70, height: 40, borderRadius: 20, background: sw < 0.5 ? C.green : '#E5E2DA', position: 'relative'}}><div style={{position: 'absolute', left: lerp(35, 5, sw), top: 5, width: 30, height: 30, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,.2)'}} /></div>
          <div><b style={{font: `700 24px ${INTER}`}}>{sw < 0.5 ? 'AI handling' : 'AI paused'}</b><div style={{font: `400 16px ${INTER}`, color: C.mute}}>resumes when chat closes</div></div>
        </div>
        <div style={{position: 'absolute', left: 430, top: 860, transform: `scale(${esc})`, display: 'flex', gap: 14, alignItems: 'center', padding: '16px 22px', borderRadius: 22, background: '#fff', boxShadow: '0 50px 90px -30px rgba(40,30,10,.42),0 0 0 1px rgba(0,0,0,.05)'}}>
          <div style={{width: 46, height: 46, borderRadius: 13, background: '#F59E0B', color: '#fff', display: 'grid', placeItems: 'center', font: `800 22px ${INTER}`}}>!</div>
          <div><b style={{font: `700 21px ${INTER}`}}>Escalated → on-duty CS</b><div style={{font: `400 15px ${INTER}`, color: C.mute}}>@Mei assigned · AI paused for this chat</div></div>
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 118, top: 104}}><Headline lines={[['Your', 'team'], ['steps', {gold: 'in.'}]]} start={38.2} size={98} /></div>
      <Vignette />
    </AbsoluteFill>
  );
};
