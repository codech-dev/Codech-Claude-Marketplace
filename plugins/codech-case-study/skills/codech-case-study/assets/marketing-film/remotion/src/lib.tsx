import React from 'react';
import {Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont as loadManrope} from '@remotion/google-fonts/Manrope';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadNoto} from '@remotion/google-fonts/NotoSansSC';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';

export const MANROPE = loadManrope('normal', {weights: ['700', '800'], subsets: ['latin']}).fontFamily;
export const INTER = loadInter('normal', {weights: ['400', '500', '600', '700', '800'], subsets: ['latin']}).fontFamily;
export const NOTO = loadNoto('normal', {weights: ['400', '700'], ignoreTooManyRequestsWarning: true} as any).fontFamily;
export const MONO = loadMono('normal', {weights: ['500'], subsets: ['latin']}).fontFamily;
export const UI = `${INTER}, ${NOTO}, sans-serif`;

export const C = {
  ink: '#0B0D12', mute: '#7B8191', paper: '#FAF8F4', gold: '#D4B895', goldSoft: '#EBD9B7', goldTint: '#F6ECDC', goldText: '#7A5F37',
  wa: '#0E5B47', waOut: '#D9FDD3', waBg: '#EDE6DD', red: '#E5484D', green: '#16A34A',
};

/** time helpers in seconds */
export const useT = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const sp = (start: number, config: object = {damping: 14, stiffness: 160}, dur?: number) =>
    spring({frame: frame - start * fps, fps, config, durationInFrames: dur ? dur * fps : undefined});
  const io = (a: number, b: number, o0 = 0, o1 = 1, ease = Easing.inOut(Easing.cubic)) =>
    interpolate(t, [a, b], [o0, o1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const out = (a: number, b: number, o0 = 0, o1 = 1) => io(a, b, o0, o1, Easing.out(Easing.cubic));
  const expo = (a: number, b: number, o0 = 0, o1 = 1) => io(a, b, o0, o1, Easing.out(Easing.exp));
  return {t, frame, fps, sp, io, out, expo};
};
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/** Kinetic headline: each line snaps up out of a mask, the gold word gets an underline wipe. */
export const Headline: React.FC<{lines: (string | {gold: string})[][]; start: number; size?: number; align?: 'left' | 'right'; color?: string; letters?: boolean; stagger?: number; goldColor?: string}> = ({lines, start, size = 100, align = 'left', color = C.ink, letters = false, stagger = 0.09, goldColor = C.goldText}) => {
  const {sp, expo} = useT();
  let k = 0;
  return (
    <div style={{fontFamily: MANROPE, fontWeight: 800, fontSize: size, lineHeight: 1.0, letterSpacing: '-0.04em', color, textAlign: align}}>
      {lines.map((line, li) => (
        <div key={li} style={{overflow: 'hidden', paddingBottom: '0.12em', marginBottom: '-0.12em'}}>
          {line.map((w, wi) => {
            const isGold = typeof w !== 'string';
            const text = isGold ? (w as {gold: string}).gold : (w as string);
            const ws = start + (k++) * stagger;
            const chars = letters && isGold ? [...text] : [text];
            return (
              <span key={wi} style={{display: 'inline-block', position: 'relative', marginRight: wi < line.length - 1 ? '0.24em' : 0, color: isGold ? goldColor : undefined}}>
                {chars.map((ch, ci) => {
                  const p = sp(ws + ci * 0.035, {damping: 13, stiffness: 190});
                  return <span key={ci} style={{display: 'inline-block', transform: `translateY(${(1 - p) * 115}%) rotate(${(1 - p) * 6}deg)`, whiteSpace: 'pre'}}>{ch}</span>;
                })}
                {isGold && <span style={{position: 'absolute', left: 0, bottom: '0.04em', height: '0.15em', width: `${expo(ws + 0.35, ws + 0.85) * 100}%`, background: C.gold, opacity: 0.6, zIndex: -1, borderRadius: 4}} />}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Photoreal phone: generated frame PNG over live screen content, with a glare. */
export const Phone: React.FC<{children: React.ReactNode; bg?: string; scale?: number}> = ({children, bg = C.waBg, scale = 1}) => (
  <div style={{width: 400 * scale, height: 810 * scale, position: 'relative'}}>
    <div style={{position: 'absolute', inset: 0, transform: `scale(${scale})`, transformOrigin: '0 0', width: 400, height: 810}}>
      <div style={{position: 'absolute', left: 18, top: 14, width: 365, height: 782, borderRadius: 52, overflow: 'hidden', background: bg, display: 'flex', flexDirection: 'column'}}>
        {children}
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(118deg,rgba(255,255,255,.28) 0%,rgba(255,255,255,.07) 26%,rgba(255,255,255,0) 40%)'}} />
      </div>
      <Img src={staticFile('phone-frame.png')} style={{position: 'absolute', left: 0, top: 0, width: 400, height: 810}} />
    </div>
  </div>
);

export const StatusBar: React.FC<{time?: string; dark?: boolean}> = ({time = '9:41', dark}) => (
  <div style={{height: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 30px 0 34px', font: `600 15px ${INTER}`, color: dark ? '#111' : '#fff', background: dark ? '#fff' : C.wa, flex: 'none'}}>
    <span>{time}</span><span>●●●</span>
  </div>
);

export const Bubble: React.FC<{out?: boolean; children: React.ReactNode; size?: number; style?: React.CSSProperties}> = ({out, children, size = 22, style}) => (
  <div style={{display: 'inline-block', padding: `${size * 0.5}px ${size * 0.75}px`, borderRadius: size * 0.65, background: out ? C.waOut : '#fff', font: `400 ${size}px/1.35 ${UI}`, color: C.ink, whiteSpace: 'nowrap', boxShadow: '0 22px 40px -16px rgba(40,30,10,.35)', ...style}}>{children}</div>
);

export const Wave: React.FC<{n?: number; h?: number; seed?: number; on?: number; t?: number; color?: string}> = ({n = 24, h = 28, seed = 3, on = 0, t = 0, color = C.wa}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 3, height: h}}>
    {Array.from({length: n}, (_, i) => {
      const v = Math.abs(Math.sin(i * 1.7 + seed) * Math.cos(i * 0.6)) * 0.85 + 0.15;
      const a = t ? 0.45 + 0.55 * Math.abs(Math.sin(t * 7 + i * 0.5)) : 1;
      return <i key={i} style={{display: 'block', width: 3, borderRadius: 2, height: v * h * a, background: i < on ? color : '#9aa3a0'}} />;
    })}
  </div>
);

export const Play: React.FC<{size?: number}> = ({size = 34}) => (
  <div style={{width: size, height: size, borderRadius: '50%', background: C.wa, display: 'grid', placeItems: 'center', flex: 'none'}}>
    <div style={{width: 0, height: 0, borderLeft: `${size * 0.32}px solid #fff`, borderTop: `${size * 0.2}px solid transparent`, borderBottom: `${size * 0.2}px solid transparent`, marginLeft: size * 0.08}} />
  </div>
);

export const PhotoTile: React.FC<{ch: string; w?: number}> = ({ch, w = 200}) => (
  <div style={{width: w, height: w * 0.72, borderRadius: 12, background: 'linear-gradient(150deg,#EAD7B4,#C9A26B)', display: 'grid', placeItems: 'center', font: `700 ${w * 0.42}px ${NOTO}`, color: '#8A6436'}}>{ch}</div>
);

/** Frosted-glass AI orb: pearl body with an orange tint, top highlight and a flowing inner ribbon (orange matches the gold theme). */
export const Orb: React.FC<{size: number; glow?: number}> = ({size, glow = 1}) => {
  const frame = useCurrentFrame();
  const ph = frame / 30;
  const lines = 13;
  const wave = (k: number) => {
    let d = '';
    for (let x = 0; x <= 100; x += 2) {
      const y = 50 + Math.sin(x / 100 * Math.PI * 2 + ph * 1.4 + k * 0.05) * (9 + k * 0.35) + (k - lines / 2) * 0.55;
      d += (x ? ' L' : 'M') + x + ' ' + y.toFixed(2);
    }
    return d;
  };
  return (
    <div style={{width: size, height: size, position: 'relative', borderRadius: '50%', overflow: 'hidden',
      background: 'radial-gradient(circle at 50% 28%,#FFFCF7 0%,#FAEEDF 34%,#F3D9BC 72%,#EBC49B 100%)',
      boxShadow: `0 ${size * 0.16}px ${size * 0.4}px rgba(200,135,70,${0.35 * glow}),inset 0 ${-size * 0.1}px ${size * 0.22}px rgba(214,140,70,.25),inset 0 ${size * 0.05}px ${size * 0.14}px rgba(255,255,255,.85)`}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 22% 72%,rgba(255,160,100,.6),rgba(255,160,100,0) 48%),radial-gradient(circle at 82% 62%,rgba(236,186,110,.62),rgba(236,186,110,0) 48%)'}} />
      <svg viewBox="0 0 100 100" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', filter: `blur(${size * 0.004}px)`}}>
        <defs><linearGradient id="og" x1="0" x2="1"><stop offset="0" stopColor="#F2672A" /><stop offset=".5" stopColor="#F59443" /><stop offset="1" stopColor="#C99A55" /></linearGradient></defs>
        {Array.from({length: lines}, (_, k) => <path key={k} d={wave(k)} fill="none" stroke="url(#og)" strokeWidth={0.55} opacity={0.45 + 0.5 * Math.sin((k / lines) * Math.PI)} />)}
      </svg>
      <div style={{position: 'absolute', left: '25%', top: '5%', width: '50%', height: '30%', borderRadius: '50%', background: 'radial-gradient(ellipse at 50% 40%,rgba(255,255,255,.95),rgba(255,255,255,0) 70%)', filter: `blur(${size * 0.02}px)`}} />
      <div style={{position: 'absolute', inset: 0, borderRadius: '50%', boxShadow: `inset 0 0 ${size * 0.06}px rgba(255,255,255,.7)`}} />
    </div>
  );
};

/** Soft backdrop shared by the light scenes. */
export const Backdrop: React.FC<{glowX?: number; glowY?: number; dots?: boolean}> = ({glowX = 60, glowY = 40, dots}) => (
  <>
    <div style={{position: 'absolute', inset: 0, background: `radial-gradient(110% 90% at ${glowX}% ${glowY}%,#FFFFFF 0%,#FBF9F5 42%,#EEEAE2 100%)`}} />
    {dots && <div style={{position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(122,95,55,.14) 1.6px,transparent 1.6px)', backgroundSize: '34px 34px', WebkitMaskImage: 'radial-gradient(60% 65% at 55% 55%,#000 15%,transparent 75%)'}} />}
  </>
);
export const Vignette: React.FC = () => <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(120% 95% at 50% 45%,rgba(0,0,0,0) 55%,rgba(60,45,20,.10) 100%)'}} />;

/** Cursor with click ripple. */
export const Cursor: React.FC<{x: number; y: number; click?: number}> = ({x, y, click = 0}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 0, height: 0}}>
    {click > 0 && click < 1 && <div style={{position: 'absolute', left: -40 * click, top: -40 * click, width: 80 * click, height: 80 * click, borderRadius: '50%', border: `3px solid rgba(212,184,149,${1 - click})`}} />}
    <svg width="44" height="54" viewBox="0 0 22 27" style={{position: 'absolute', left: -4, top: -2, filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.3))', transform: `scale(${1 - Math.sin(Math.PI * clamp01(click * 2)) * 0.15})`}}>
      <path d="M2 1 L2 21 L7 16.5 L10.5 24.5 L14 23 L10.6 15.2 L17 15.2 Z" fill="#0B0D12" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  </div>
);

/** WhatsApp input button: mic when the field is empty, paper-plane send arrow while typing. */
export const SendBtn: React.FC<{typing?: boolean; pulse?: number}> = ({typing = false, pulse = 0}) => (
  <div style={{width: 42, height: 42, borderRadius: '50%', background: C.wa, display: 'grid', placeItems: 'center', flex: 'none', transform: `scale(${1 + pulse * 0.25})`}}>
    {typing
      ? <svg width="20" height="20" viewBox="0 0 24 24" style={{marginLeft: 3}}><path d="M2.4 20.6 22 12 2.4 3.4 2.4 10.1 16 12 2.4 13.9Z" fill="#fff" /></svg>
      : <svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-2.1A7 7 0 0 0 19 12z" fill="#fff" /></svg>}
  </div>
);

/* ---------- real-screenshot helpers (desktop products) ----------
   Screens: 2x captures in public/screens/ (capture_screens.py, or the pack's 2x walkthrough). Coordinates are in the
   screenshot's 1x space (sw x sh, default 1440 x 900); k scales the whole window. */
export const Browser: React.FC<{src: string; k: number; label?: string; sw?: number; sh?: number; children?: React.ReactNode}> = ({src, k, label = '', sw = 1440, sh = 900, children}) => (
  <div style={{width: sw * k, borderRadius: 18, overflow: 'hidden', background: '#fff', position: 'relative', boxShadow: '0 2px 0 rgba(0,0,0,.03),0 90px 140px -40px rgba(40,30,10,.42),0 0 0 1px rgba(0,0,0,.07)'}}>
    <div style={{height: 40, display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', background: '#F4F2EE', borderBottom: '1px solid #E7E3DB'}}>
      {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <i key={c} style={{width: 12, height: 12, borderRadius: 6, background: c, display: 'block'}} />)}
      {label && <div style={{margin: '0 auto', background: '#fff', border: '1px solid #E7E3DB', borderRadius: 9, padding: '4px 56px', font: `500 13px ${INTER}`, color: '#5b6170'}}>🔒 {label}</div>}
    </div>
    <div style={{position: 'relative', width: sw * k, height: sh * k}}><Img src={staticFile(src)} style={{width: sw * k, height: sh * k, display: 'block'}} />{children}</div>
  </div>
);
/** A panel cut out of the same screenshot, for exploded-UI lifts. Place it over its slot inside <Browser> children
    (left: x*k, top: y*k) and lift IN PLACE: scale 1.03-1.14 + translateY(-3px) + a deep shadow. Never translateZ. */
export const Crop: React.FC<{src: string; x: number; y: number; w: number; h: number; k: number; sw?: number; sh?: number; style?: React.CSSProperties}> = ({src, x, y, w, h, k, sw = 1440, sh = 900, style}) => (
  <div style={{width: w * k, height: h * k, overflow: 'hidden', borderRadius: 14 * k, background: '#fff', position: 'relative', ...style}}>
    <Img src={staticFile(src)} style={{position: 'absolute', left: -x * k, top: -y * k, width: sw * k, height: sh * k}} />
  </div>
);
export const LIFTED = '0 50px 90px -24px rgba(40,30,10,.45),0 0 0 1px rgba(0,0,0,.06)';
