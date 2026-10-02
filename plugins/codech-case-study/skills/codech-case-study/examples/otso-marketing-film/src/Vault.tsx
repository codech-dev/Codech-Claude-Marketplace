import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile} from 'remotion';
import {Crop, Cursor, INTER, MANROPE, MONO, Phone, UI, clamp01, lerp, useT} from './lib';
import {CLIENT, CONTACTS} from './brand';

/* OTSO marketing film · "Midnight Vault" (user pick, 2026-10-03).
   A dark archive in deep space: documents are frosted-glass slabs, the AI is a cobalt scan beam (the visual thread),
   compliance is a vault door. Every scene is in LOCAL time (t = 0 at its start); Film.tsx places them from timeline.json.
   Screens: the pack's 2x walkthrough (public/screens, public/chat) in 1x 1440 x 900 coordinates. */
const W = 1920, H = 1080;
export const V = {bg0: '#0D1836', bg1: '#04060D', cobalt: '#3D7BFF', ice: '#9DBBFF', pale: '#D6E3FF', mist: 'rgba(200,215,255,.66)', red: '#FF5A6A', green: '#34D399', gold: '#D4B895', navy: '#0E1630'};

/* ---------------- the world ---------------- */
const Dust: React.FC<{n?: number; seed?: number; speed?: number}> = ({n = 70, seed = 1, speed = 1}) => {
  const {t} = useT();
  return <>{Array.from({length: n}, (_, i) => {
    const x = (Math.sin(i * 91.7 + seed) * 0.5 + 0.5) * W, y = (Math.cos(i * 53.3 + seed) * 0.5 + 0.5) * H;
    const r = 1 + (i % 4) * 0.7;
    return <i key={i} style={{position: 'absolute', left: x + Math.sin(t * 0.3 + i) * 12, top: ((y - t * (4 + (i % 5) * 3) * speed) % H + H) % H, width: r * 2, height: r * 2, borderRadius: r, background: V.ice, opacity: 0.08 + (i % 6) * 0.05, display: 'block'}} />;
  })}</>;
};
export const Space: React.FC<{gx?: number; gy?: number; seed?: number; floor?: boolean; dust?: number}> = ({gx = 55, gy = 40, seed = 1, floor, dust = 1}) => (
  <>
    <div style={{position: 'absolute', inset: 0, background: `radial-gradient(90% 80% at ${gx}% ${gy}%,${V.bg0},${V.bg1})`}} />
    {floor && <div style={{position: 'absolute', left: 380, top: 820, width: 1400, height: 320, borderRadius: '50%', background: 'rgba(61,123,255,.22)', filter: 'blur(90px)'}} />}
    <Dust seed={seed} speed={dust} />
  </>
);
export const Vig: React.FC = () => <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(120% 100% at 50% 42%,rgba(0,0,0,0) 55%,rgba(0,0,0,.62) 100%)'}} />;

/** The AI: a vertical cobalt scan beam at x (px). */
export const Beam: React.FC<{x: number; o?: number; w?: number}> = ({x, o = 1, w = 1}) => (
  <div style={{position: 'absolute', inset: 0, opacity: o, pointerEvents: 'none'}}>
    <div style={{position: 'absolute', left: x - 170 * w, top: 0, width: 340 * w, height: H, background: 'linear-gradient(90deg,rgba(61,123,255,0),rgba(61,123,255,.22),rgba(61,123,255,0))'}} />
    <div style={{position: 'absolute', left: x - 2, top: 0, width: 4, height: H, background: '#BCD2FF', boxShadow: '0 0 30px 8px rgba(61,123,255,.9),0 0 120px 30px rgba(61,123,255,.45)'}} />
  </div>
);

/** A frosted-glass document slab. lit 0..1 = how much the beam has read it; blank = no text yet (a scan). */
export const Slab: React.FC<{x: number; y: number; w?: number; h?: number; z?: number; ry?: number; rz?: number; lit?: number; label: string; blank?: boolean; tag?: string; style?: React.CSSProperties}> = ({x, y, w = 220, h = 280, z = 0, ry = 0, rz = 0, lit = 0, label, blank, tag, style}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `translateZ(${z}px) rotateY(${ry}deg) rotateX(8deg) rotateZ(${rz}deg)`, borderRadius: 18,
    background: `linear-gradient(150deg,rgba(170,200,255,${0.1 + lit * 0.12}),rgba(120,150,255,.03))`, border: `1px solid rgba(150,180,255,${0.25 + lit * 0.5})`,
    boxShadow: `0 40px 80px -30px rgba(0,0,0,.9),inset 0 1px 0 rgba(255,255,255,.15)${lit > 0.01 ? `,0 0 ${60 * lit}px rgba(61,123,255,${0.45 * lit})` : ''}`, padding: 22, overflow: 'hidden', ...style}}>
    <div style={{width: 34, height: 42, borderRadius: 6, border: `2px solid rgba(157,187,255,${0.4 + lit * 0.6})`}} />
    {[0.85, 0.7, 0.92, 0.55].map((f, i) => <div key={i} style={{height: 7, width: `${f * 100 * (blank ? lit : 1)}%`, borderRadius: 4, background: `rgba(157,187,255,${0.15 + lit * 0.4})`, marginTop: i ? 12 : 22}} />)}
    <div style={{position: 'absolute', left: 22, bottom: 16, font: `600 14px ${MONO}`, letterSpacing: '.08em', color: `rgba(190,210,255,${0.45 + lit * 0.5})`}}>{label}</div>
    {tag && <div style={{position: 'absolute', right: 14, top: 14, padding: '4px 8px', borderRadius: 6, background: 'rgba(255,90,106,.16)', border: '1px solid rgba(255,90,106,.6)', color: V.red, font: `700 11px ${MONO}`, letterSpacing: '.08em'}}>{tag}</div>}
  </div>
);

/** Headline: white lines snap up out of masks; the key word is cobalt glass with a light sweep passing through it. */
export const VHead: React.FC<{lines: (string | {key: string})[][]; start: number; size?: number; align?: 'left' | 'right' | 'center'; stagger?: number; color?: string}> = ({lines, start, size = 100, align = 'left', stagger = 0.09, color = '#fff'}) => {
  const {t, sp} = useT();
  let k = 0;
  return (
    <div style={{fontFamily: MANROPE, fontWeight: 800, fontSize: size, lineHeight: 1.02, letterSpacing: '-0.045em', color, textAlign: align, filter: 'drop-shadow(0 10px 30px rgba(0,0,0,.65))'}}>
      {lines.map((line, li) => (
        <div key={li} style={{clipPath: 'inset(-0.6em -0.6em 0 -0.6em)', paddingBottom: '0.3em', marginBottom: '-0.3em'}}>
          {line.map((w, wi) => {
            const isKey = typeof w !== 'string';
            const text = isKey ? (w as {key: string}).key : (w as string);
            const ws = start + (k++) * stagger;
            const p = sp(ws, {damping: 13, stiffness: 190});
            const sweep = clamp01((t - ws - 0.3) / 0.9);
            return (
              <span key={wi} style={{display: 'inline-block', marginRight: wi < line.length - 1 ? '0.24em' : 0, transform: `translateY(${(1 - p) * 115}%) rotate(${(1 - p) * 6}deg)`,
                ...(isKey ? {background: `linear-gradient(100deg,#7FA8FF 0%,#7FA8FF ${sweep * 100 - 18}%,#FFFFFF ${sweep * 100}%,#7FA8FF ${sweep * 100 + 18}%,#3D7BFF 100%)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 0 26px rgba(61,123,255,.55))', textShadow: 'none'} : {})}}>{text}</span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
export const Sub: React.FC<{children: React.ReactNode; at: number; style?: React.CSSProperties}> = ({children, at, style}) => {
  const {io} = useT();
  return <div style={{font: `500 26px ${INTER}`, color: V.mist, opacity: io(at, at + 0.4), transform: `translateY(${(1 - io(at, at + 0.4)) * 12}px)`, ...style}}>{children}</div>;
};
export const Mono: React.FC<{children: React.ReactNode; at: number; style?: React.CSSProperties}> = ({children, at, style}) => {
  const {io} = useT();
  return <div style={{font: `600 17px ${MONO}`, letterSpacing: '.3em', color: V.ice, opacity: io(at, at + 0.4) * 0.85, ...style}}>{children}</div>;
};

/** Product window: dark chrome, cobalt rim light. */
export const GWin: React.FC<{src: string; k: number; children?: React.ReactNode; rim?: 'left' | 'right'; dim?: number}> = ({src, k, children, rim = 'left', dim = 0}) => (
  <div style={{width: 1440 * k, borderRadius: 16, overflow: 'hidden', position: 'relative', border: '1px solid rgba(150,180,255,.35)',
    boxShadow: `0 80px 140px -40px rgba(0,0,0,.95),0 0 0 1px rgba(150,180,255,.2),${rim === 'left' ? -30 : 30}px 0 90px -20px rgba(61,123,255,.55)`}}>
    <div style={{height: 34, background: V.navy, display: 'flex', alignItems: 'center', gap: 7, padding: '0 14px'}}>
      {[0, 1, 2].map((i) => <i key={i} style={{width: 10, height: 10, borderRadius: 5, background: 'rgba(150,180,255,.35)', display: 'block'}} />)}
      <div style={{margin: '0 auto', font: `500 12px ${MONO}`, letterSpacing: '.12em', color: 'rgba(190,210,255,.55)'}}>OTSO AI HUB</div>
    </div>
    <div style={{position: 'relative', width: 1440 * k, height: 900 * k}}>
      <Img src={staticFile(src)} style={{width: 1440 * k, height: 900 * k, display: 'block'}} />
      {dim > 0 && <div style={{position: 'absolute', inset: 0, background: `rgba(5,10,30,${dim})`}} />}
      {children}
    </div>
  </div>
);
/** A crop that lifts in place over its slot inside <GWin> children, with a cobalt edge. */
export const Lift: React.FC<{src: string; at: number; x: number; y: number; w: number; h: number; k: number; s?: number; dy?: number; color?: string}> = ({src, at, x, y, w, h, k, s = 0.08, dy = -8, color = V.cobalt}) => {
  const {sp} = useT();
  const q = sp(at, {damping: 13, stiffness: 150});
  if (q < 0.01) return null;
  return (
    <div style={{position: 'absolute', left: x * k, top: y * k, transformOrigin: 'center', transform: `translateY(${q * dy}px) scale(${1 + q * s})`}}>
      <Crop src={src} x={x} y={y} w={w} h={h} k={k} style={{borderRadius: 10 * k + 2, boxShadow: `0 0 0 ${2 * q}px ${color},0 0 ${60 * q}px ${color}AA,0 40px 80px -20px rgba(0,0,0,.9)`}} />
    </div>
  );
};
export const Avatar: React.FC<{id: string; size?: number; ring?: string}> = ({id, size = 44, ring}) => (
  <Img src={staticFile(`avatars/${id}.jpg`)} style={{width: size, height: size, borderRadius: '50%', objectFit: 'cover', display: 'block', flex: 'none', boxShadow: ring ? `0 0 0 3px ${ring}` : undefined}} />
);
export const Glass: React.FC<{children: React.ReactNode; style?: React.CSSProperties; glow?: number}> = ({children, style, glow = 0}) => (
  <div style={{borderRadius: 22, background: 'linear-gradient(150deg,rgba(170,200,255,.14),rgba(120,150,255,.04))', border: `1px solid rgba(150,180,255,${0.3 + glow * 0.5})`, boxShadow: `0 40px 80px -30px rgba(0,0,0,.9),inset 0 1px 0 rgba(255,255,255,.12)${glow ? `,0 0 ${50 * glow}px rgba(61,123,255,${0.5 * glow})` : ''}`, color: '#fff', ...style}}>{children}</div>
);
export const Pill: React.FC<{children: React.ReactNode; on?: boolean; style?: React.CSSProperties}> = ({children, on, style}) => (
  <span style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 22px', borderRadius: 99, background: on ? 'rgba(61,123,255,.28)' : 'rgba(150,180,255,.08)', border: `1px solid ${on ? V.cobalt : 'rgba(150,180,255,.3)'}`, color: on ? '#fff' : V.pale, font: `600 22px ${UI}`, boxShadow: on ? '0 0 40px rgba(61,123,255,.5)' : 'none', whiteSpace: 'nowrap', ...style}}>{children}</span>
);
/** Glowing cobalt AI input: the beam's "cursor" form. */
export const AIBar: React.FC<{w: number; text: string; caret?: boolean; size?: number}> = ({w, text, caret, size = 30}) => {
  const {t} = useT();
  return (
    <Glass glow={1} style={{width: w, height: size * 2.6, borderRadius: 999, display: 'flex', alignItems: 'center', gap: size * 0.6, padding: `0 ${size * 0.9}px`}}>
      <svg width={size * 1.1} height={size * 1.1} viewBox="0 0 24 24" fill="none" stroke={V.ice} strokeWidth="2.4" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5 21 21" /></svg>
      <div style={{flex: 1, font: `600 ${size}px ${UI}`, color: text ? '#fff' : 'rgba(190,210,255,.5)', whiteSpace: 'nowrap', overflow: 'hidden'}}>{text || 'Ask anything…'}{caret && <span style={{color: V.ice, opacity: Math.floor(t * 4) % 2 ? 1 : 0}}>|</span>}</div>
      <div style={{padding: `${size * 0.2}px ${size * 0.5}px`, borderRadius: 99, background: V.cobalt, color: '#fff', font: `700 ${size * 0.5}px ${MONO}`, letterSpacing: '.12em', boxShadow: '0 0 24px rgba(61,123,255,.8)'}}>AI</div>
    </Glass>
  );
};
export const typed = (s: string, t: number, a: number, b: number) => s.slice(0, Math.round(s.length * clamp01((t - a) / (b - a))));
/** exits: whip with blur, or a push into depth */
export const useWhip = (a: number, b: number, dir = -1) => {
  const {io} = useT();
  const l = io(a, b, 0, 1, Easing.in(Easing.cubic));
  return {transform: `translateX(${dir * l * W * 0.55}px)`, opacity: 1 - l, filter: l > 0.02 ? `blur(${l * 22}px)` : undefined} as React.CSSProperties;
};
export const useIn = (a: number, b: number, dir = 1) => {
  const {io} = useT();
  const e = io(a, b, 0, 1, Easing.out(Easing.cubic));
  return {transform: `translateX(${dir * (1 - e) * W * 0.5}px)`, opacity: e, filter: e < 0.98 ? `blur(${(1 - e) * 22}px)` : undefined} as React.CSSProperties;
};
export const merge = (...s: React.CSSProperties[]) => ({...s.reduce((a, b) => ({...a, ...b}), {}), transform: s.map((x) => x.transform).filter(Boolean).join(' '), opacity: s.reduce((a, b) => a * ((b.opacity as number) ?? 1), 1)}) as React.CSSProperties;

/* ================= 0. OPENER: the beam sweeps the lockup on ================= */
export const VOpener: React.FC = () => {
  const {t, sp, io} = useT();
  const bx = lerp(-100, W + 100, io(0.2, 1.6, 0, 1, Easing.inOut(Easing.cubic)));
  const rev = (x: number) => clamp01((bx - x) / 120);
  const exit = io(3.6, 4.2, 0, 1, Easing.in(Easing.exp));
  return (
    <AbsoluteFill style={{transform: `scale(${lerp(1, 1.6, exit)})`, opacity: 1 - exit, filter: exit > 0.02 ? `blur(${exit * 16}px)` : undefined}}>
      <Space gx={50} gy={45} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 44}}>
        <Img src={staticFile('codech-logo-white.png')} style={{height: 130, opacity: rev(860), filter: `drop-shadow(0 0 ${30 * (1 - rev(920))}px rgba(61,123,255,.9))`}} />
      </div>
      <Mono at={1.4} style={{position: 'absolute', left: 0, right: 0, top: 345, textAlign: 'center'}}>A CODECH CASE STUDY</Mono>
      {/* title = the solution; the client is the subtitle */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 395, display: 'flex', justifyContent: 'center'}}>
        <VHead lines={[[{key: 'AI-powered'}], ['file', 'storage', 'platform']]} start={1.5} size={112} stagger={0.1} align="center" />
      </div>
      {/* the client sits under the solution, not beside the Codech logo (reads as our work for them, not a partnership) */}
      <Sub at={2.25} style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, font: `500 30px ${INTER}`, color: V.pale}}>
        Proposed for<span style={{padding: '8px 14px', borderRadius: 12, background: 'rgba(255,255,255,.95)', boxShadow: '0 0 30px rgba(61,123,255,.35)'}}><Img src={staticFile('otso-logo-trimmed.png')} style={{height: 46, display: 'block'}} /></span><b style={{color: '#fff', fontWeight: 700}}>{CLIENT.name}</b>
      </Sub>
      <div style={{position: 'absolute', left: 0, right: 0, top: 760, display: 'flex', justifyContent: 'center', gap: 16}}>
        {CLIENT.pillars.map((p, i) => {
          const q = sp(2.55 + i * 0.16, {damping: 12, stiffness: 170});
          return <div key={i} style={{transform: `translateY(${(1 - q) * 40}px)`, opacity: clamp01(q * 2)}}><Pill><span style={{width: 9, height: 9, borderRadius: 5, background: [V.cobalt, V.ice, V.gold][i]}} />{p}</Pill></div>;
        })}
      </div>
      {t < 1.8 && <Beam x={bx} />}
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= 1. PROBLEM: files everywhere ================= */
const SCAT: [string, string, number, number, number, number][] = [
  ['KYC_FINAL_V3(2).PDF', 'DOWNLOADS', 140, 120, -18, -14], ['AGREEMENT_SIGNED.PDF', 'EMAIL', 1460, 90, 22, 10], ['FEES.XLSX', 'LAPTOP', 1540, 640, -26, -9],
  ['PASSPORT_SCAN.JPG', 'WHATSAPP', 110, 640, 20, 12], ['AML_POLICY_OLD.DOCX', 'PERSONAL DRIVE', 800, 760, -10, -6], ['Q3_RESEARCH(COPY).PDF', 'DESKTOP', 830, 40, 14, 7]];
export const VScatter: React.FC = () => {
  const {t, sp, io} = useT();
  const leave = useWhip(3.55, 3.95);
  return (
    <AbsoluteFill style={leave}>
      <Space seed={2} />
      <AbsoluteFill style={{perspective: 1600}}><AbsoluteFill style={{transformStyle: 'preserve-3d'}}>
        {SCAT.map((f, i) => {
          const q = sp(0.05 + i * 0.12, {damping: 12, stiffness: 120});
          const tumble = Math.sin(t * 1.2 + i) * 6;
          return <Slab key={i} x={f[2] + (f[2] < 960 ? -600 : 600) * (1 - q)} y={f[3] + Math.sin(t + i) * 10} z={-200 - (i % 3) * 120} ry={f[4] + tumble} rz={f[5]} label={f[0]} tag={f[1]} w={200} h={250} style={{opacity: clamp01(q * 2)}} />;
        })}
      </AbsoluteFill></AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <VHead lines={[['Documents', {key: 'everywhere.'}]]} start={0.5} size={136} align="center" />
        {(() => {
          const p = sp(1.9, {damping: 13, stiffness: 190});
          const strike = io(2.5, 2.85, 0, 1, Easing.out(Easing.cubic));
          return <div style={{position: 'relative', marginTop: 24, font: `800 70px ${MANROPE}`, letterSpacing: '-0.04em', color: '#fff', transform: `translateY(${(1 - p) * 50}px)`, opacity: clamp01(p * 2) * (1 - strike * 0.45)}}>
            Found by nobody.<div style={{position: 'absolute', left: -8, top: '54%', height: 9, width: `${strike * 103}%`, background: V.red, borderRadius: 5, boxShadow: '0 0 20px rgba(255,90,106,.8)'}} /></div>;
        })()}
      </AbsoluteFill>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= 2. PROBLEM: filename search fails ================= */
export const VSearchFail: React.FC = () => {
  const {t, sp, io} = useT();
  const enter = useIn(0, 0.4);
  const q = 'when does the Acme passport expire';
  const shake = Math.max(0, 1 - Math.abs(t - 1.75) / 0.25) * Math.sin(t * 70) * 16;
  const none = sp(1.6, {damping: 11, stiffness: 200});
  const zoom = io(2.75, 3.2, 0, 1, Easing.in(Easing.exp));
  return (
    <AbsoluteFill style={merge(enter, {transform: `scale(${lerp(1, 0.15, zoom)})`, opacity: 1 - zoom})}>
      <Space seed={3} gx={65} />
      <div style={{position: 'absolute', left: 118, top: 160}}><VHead lines={[['Search', 'by'], [{key: 'filename?'}]]} start={0.15} size={110} /></div>
      <AbsoluteFill style={{perspective: 2000}}>
        <div style={{position: 'absolute', left: 860, top: 340, transform: `rotateY(-18deg) rotateX(6deg) translateX(${shake}px)`}}>
          <Glass style={{width: 880, overflow: 'hidden'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '26px 30px', borderBottom: '1px solid rgba(150,180,255,.2)', font: `500 30px ${INTER}`}}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={V.ice} strokeWidth="2.2"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5 21 21" /></svg>
              {typed(q, t, 0.4, 1.4)}<span style={{color: V.ice, opacity: t < 1.5 && Math.floor(t * 4) % 2 ? 1 : 0}}>|</span>
            </div>
            <div style={{padding: '50px 30px 56px', textAlign: 'center', transform: `scale(${lerp(0.7, 1, none)})`, opacity: clamp01(none * 2)}}>
              <div style={{font: `800 66px ${MANROPE}`, color: V.red, letterSpacing: '-0.03em', textShadow: '0 0 30px rgba(255,90,106,.6)'}}>0 results</div>
              <div style={{font: `500 23px ${MONO}`, color: V.mist, marginTop: 10}}>no filename matches “passport expire”</div>
            </div>
          </Glass>
        </div>
      </AbsoluteFill>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= 3. MEET: the beam ignites, the archive falls into order ================= */
export const VMeet: React.FC = () => {
  const {t, sp, io, out} = useT();
  const ign = io(0.0, 0.35, 0, 1, Easing.out(Easing.exp)); // flash from the collapsed search point
  const bx = lerp(-80, W + 80, io(0.35, 1.6, 0, 1, Easing.inOut(Easing.cubic)));
  const grid = (i: number) => ({x: 300 + (i % 6) * 230, y: 150 + Math.floor(i / 6) * 0});
  return (
    <AbsoluteFill>
      <Space seed={4} gx={50} gy={30} floor />
      <div style={{position: 'absolute', left: 960 - 500 * ign, top: 540 - 500 * ign, width: 1000 * ign, height: 1000 * ign, borderRadius: '50%', background: 'radial-gradient(circle,rgba(157,187,255,.6),rgba(61,123,255,0) 70%)', opacity: 1 - io(0.3, 0.9)}} />
      <AbsoluteFill style={{perspective: 1600}}><AbsoluteFill style={{transformStyle: 'preserve-3d'}}>
        {SCAT.map((f, i) => {
          const g = grid(i);
          const passed = clamp01((bx - (g.x + 110)) / 160);
          const snap = sp(0.4 + i * 0.12, {damping: 15, stiffness: 120});
          return <Slab key={i} x={lerp(f[2], g.x, snap)} y={lerp(f[3], g.y, snap)} z={lerp(-300, -80, snap)} ry={lerp(f[4], 0, snap)} rz={lerp(f[5], 0, snap)} w={200} h={250} lit={passed} label={f[0].replace(/_FINAL_V3\(2\)|_SIGNED|_OLD|\(COPY\)|_SCAN/g, '')} />;
        })}
      </AbsoluteFill></AbsoluteFill>
      {t > 0.35 && t < 1.7 && <Beam x={bx} />}
      <div style={{position: 'absolute', left: 0, right: 0, top: 430, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Mono at={1.0} style={{marginBottom: 26}}>OUR SOLUTION</Mono>
        <VHead lines={[['An', {key: 'AI-powered'}], ['file', 'storage', 'platform.']]} start={1.2} size={112} align="center" />
        <Mono at={2.2} style={{marginTop: 30}}>BUILT BY CODECH · FOR OTSO MARKETS</Mono>
      </div>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= 4. HOME: one place for every drive ================= */
export const VHome: React.FC = () => {
  const {sp, out} = useT();
  const k = 0.8;
  const win = sp(0, {damping: 16, stiffness: 90});
  const push = out(0.4, 3.6);
  const leave = useWhip(3.35, 3.75);
  return (
    <AbsoluteFill style={leave}>
      <Space seed={5} gx={60} floor />
      <AbsoluteFill style={{perspective: 2200}}>
        <div style={{position: 'absolute', left: 660, top: 300, transformStyle: 'preserve-3d', transformOrigin: '600px 400px',
          transform: `translateY(${(1 - win) * 800}px) rotateX(${lerp(34, 12, win) - push * 3}deg) rotateY(${lerp(-26, -14, win) + push * 5}deg) scale(${1 + push * 0.08})`}}>
          <GWin src="screens/02-home.jpg" k={k} dim={0.25}>
            {[288, 572, 856, 1140].map((x, i) => <Lift key={i} src="screens/02-home.jpg" at={0.9 + i * 0.14} x={x} y={222} w={268} h={162} k={k} s={0.1} dy={-14} />)}
            <Lift src="screens/02-home.jpg" at={1.7} x={288} y={590} w={1120} h={170} k={k} s={0.04} dy={-6} color="rgba(157,187,255,.7)" />
          </GWin>
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 118, top: 110}}><VHead lines={[['Every', 'drive.'], [{key: 'One place.'}]]} start={0.25} size={98} /></div>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= 5. SEARCH BY MEANING ================= */
export const VSearch: React.FC = () => {
  const {t, sp, out} = useT();
  const k = 0.8;
  const enter = useIn(0, 0.4);
  const leave = useWhip(4.0, 4.4, 1);
  const q = 'when does the Acme passport expire?';
  const drop = sp(1.55, {damping: 14, stiffness: 160});
  const match = sp(2.5, {damping: 11, stiffness: 180});
  return (
    <AbsoluteFill style={t > 3.9 ? leave : enter}>
      <Space seed={6} gx={62} floor />
      <AbsoluteFill style={{perspective: 2200}}>
        <div style={{position: 'absolute', left: 760, top: 230, transform: `rotateY(${lerp(-24, -18, out(0, 4))}deg) rotateX(6deg) scale(${1 + out(0, 4) * 0.04})`}}>
          <GWin src="screens/09-search.jpg" k={k} dim={0.3}>
            <div style={{position: 'absolute', left: 360 * k, top: 183 * k, width: 1000 * k, height: 34 * k, background: '#fff', font: `500 ${16 * k}px ${INTER}`, color: '#0B0D12', display: 'flex', alignItems: 'center'}}>{t > 1.55 ? q : ''}</div>
            <div style={{position: 'absolute', left: 328 * k, top: 228 * k, width: 1044 * k, height: 46 * k, background: '#F0F3F8'}} />
            {t > 1.6 && <Lift src="screens/09-search.jpg" at={1.9} x={330} y={322} w={1035} h={101} k={k} s={0.03} dy={-4} color="rgba(157,187,255,.5)" />}
            {t > 1.6 && <Lift src="screens/09-search.jpg" at={2.1} x={330} y={432} w={1035} h={99} k={k} s={0.06} dy={-10} />}
          </GWin>
          <div style={{position: 'absolute', left: 1040 * k, top: 34 + 400 * k, transform: `scale(${match})`}}><Pill on>94% match · by meaning</Pill></div>
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 640, top: 90, transform: `translateY(${drop * 160}px) scale(${lerp(1, 0.6, drop)})`, transformOrigin: 'left top', opacity: 1 - drop}}>
        <AIBar w={1000} text={typed(q, t, 0.35, 1.35)} caret={t < 1.5} />
      </div>
      <div style={{position: 'absolute', left: 110, top: 380}}><VHead lines={[['Search', 'by'], [{key: 'meaning.'}]]} start={2.2} size={104} /></div>
      <Sub at={2.7} style={{position: 'absolute', left: 114, top: 630}}>Finds what a document says, not just its name.</Sub>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= 6. LANGUAGES: chips orbit, the screen switches ================= */
const LANGS = ['English', '中文', 'Tiếng Việt', 'Bahasa Indonesia'];
export const VLangs: React.FC = () => {
  const {t, sp, io, out} = useT();
  const k = 0.62;
  const enter = useIn(0, 0.4, -1);
  const leave = useWhip(2.85, 3.25);
  const zh = io(1.2, 1.45);
  const ph = sp(0.5, {damping: 15, stiffness: 110});
  const act = t < 1.3 ? 0 : t < 2.0 ? 1 : t < 2.45 ? 2 : 3;
  return (
    <AbsoluteFill style={t > 2.8 ? leave : enter}>
      <Space seed={7} gx={45} gy={60} floor />
      {/* overhead: the desktop lies on a dark glass floor, the phone beside it */}
      <AbsoluteFill style={{perspective: 2600}}>
        <div style={{position: 'absolute', left: 300, top: 360, transformStyle: 'preserve-3d', transform: `rotateX(42deg) rotateZ(-10deg) translateZ(${out(0, 3) * 40}px)`}}>
          <div style={{position: 'relative'}}>
            <GWin src="screens/02-home.jpg" k={k} />
            <div style={{position: 'absolute', left: 0, top: 34, opacity: zh}}><Img src={staticFile('screens/16-home-zh.jpg')} style={{width: 1440 * k, height: 900 * k, display: 'block'}} /></div>
          </div>
        </div>
        <div style={{position: 'absolute', left: 1360, top: 210, transform: `translateY(${(1 - ph) * 700}px) rotateX(42deg) rotateZ(-10deg)`, filter: 'drop-shadow(0 0 40px rgba(61,123,255,.45))'}}>
          <Phone bg="#fff" scale={0.78}><Img src={staticFile('screens/18-mobile-drive.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></Phone>
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 118, top: 96}}><VHead lines={[['Four', {key: 'languages.'}]]} start={0.4} size={92} /></div>
      <div style={{position: 'absolute', left: 118, top: 220, display: 'flex', gap: 14}}>
        {LANGS.map((l, i) => {
          const q = sp(0.3 + i * 0.1, {damping: 12, stiffness: 180});
          return <div key={i} style={{transform: `translateY(${(1 - q) * 40}px) scale(${i === act ? 1.08 : 1})`, opacity: clamp01(q * 2)}}><Pill on={i === act}>{l}</Pill></div>;
        })}
      </div>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= 7. PROBLEM: scans are blank to search ================= */
const SCANS = ['SCAN_0412.PDF', 'IMG_2281.JPG', 'CONTRACT_SIGNED.PDF', 'ID_BACK.PNG', 'FAX_0093.PDF'];
export const VInvisible: React.FC = () => {
  const {t, sp, io} = useT();
  const bx = lerp(W + 200, W - 260, io(1.5, 2.0, 0, 1, Easing.out(Easing.cubic))); // the beam arrives at the edge: foreshadow
  return (
    <AbsoluteFill>
      <Space seed={8} />
      <AbsoluteFill style={{perspective: 1600}}><AbsoluteFill style={{transformStyle: 'preserve-3d'}}>
        {SCANS.map((s, i) => {
          const q = sp(0.05 + i * 0.1, {damping: 13, stiffness: 150});
          return <Slab key={i} x={180 + i * 320} y={170 + (i % 2) * 60} z={-150} ry={18 - i * 9} lit={0} label={s} blank tag="NO TEXT" w={210} h={260} style={{opacity: clamp01(q * 2)}} />;
        })}
      </AbsoluteFill></AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: 600, display: 'flex', justifyContent: 'center'}}><VHead lines={[['Scans', 'are', {key: 'invisible.'}]]} start={0.45} size={120} align="center" /></div>
      <Sub at={1.0} style={{position: 'absolute', left: 0, right: 0, top: 760, textAlign: 'center'}}>Search can't read a photo of a page.</Sub>
      {t > 1.5 && <Beam x={bx} o={0.9} />}
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= 8. UPLOAD: you choose what the AI sees ================= */
export const VUpload: React.FC = () => {
  const {t, sp, io, out} = useT();
  const win = sp(0, {damping: 15, stiffness: 100});
  const tog = io(1.75, 1.95);
  const lift = sp(1.2);
  const leave = useWhip(3.25, 3.6);
  const K = 1.5;
  return (
    <AbsoluteFill style={leave}>
      <Space seed={9} gx={65} floor />
      <AbsoluteFill style={{perspective: 2000}}>
        <div style={{position: 'absolute', left: 860, top: 140, transformOrigin: 'center bottom', transform: `translateY(${(1 - win) * 600}px) rotateX(${lerp(-24, -10, win)}deg) rotateY(${lerp(-18, -10, out(0, 3.5))}deg)`}}>
          <div style={{position: 'relative'}}>
            <Crop src="screens/04-upload-dialog.jpg" x={490} y={208} w={460} h={484} k={K} style={{borderRadius: 22, boxShadow: '0 80px 140px -40px rgba(0,0,0,.95),0 0 0 1px rgba(150,180,255,.35),30px 0 90px -20px rgba(61,123,255,.5)'}} />
            <div style={{position: 'absolute', left: (505 - 490) * K, top: (440 - 208) * K, transform: `translateY(${-lift * 12}px) scale(${1 + lift * 0.08})`}}>
              <Crop src="screens/04-upload-dialog.jpg" x={505} y={440} w={420} h={42} k={K} style={{borderRadius: 10, boxShadow: `0 0 0 ${2 * lift}px ${V.cobalt},0 0 ${60 * lift}px rgba(61,123,255,.7),0 40px 80px -20px rgba(0,0,0,.9)`}} />
              <div style={{position: 'absolute', left: 13 * K, top: 10 * K, width: 18 * K, height: 18 * K, borderRadius: 6, background: tog > 0.5 ? '#2F6BFF' : '#fff', border: `2px solid ${tog > 0.5 ? '#2F6BFF' : '#C7CDD8'}`, color: '#fff', display: 'grid', placeItems: 'center', font: `800 20px ${INTER}`, transform: `scale(${1 + Math.max(0, 1 - Math.abs(t - 1.85) / 0.15) * 0.3})`}}>{tog > 0.5 ? '✓' : ''}</div>
            </div>
          </div>
          <Cursor x={lerp(660, 38, out(0.9, 1.7))} y={lerp(820, 370, out(0.9, 1.7))} click={io(1.75, 2.1)} />
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 118, top: 290}}><VHead lines={[['You', 'choose'], ['what', 'AI'], [{key: 'sees.'}]]} start={0.3} size={104} /></div>
      <Sub at={2.1} style={{position: 'absolute', left: 122, top: 680}}>Opt any file out of AI before it uploads.</Sub>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= 9. PIPELINE: one slab through four glass gates ================= */
const GATES = [['Extract', 'PDF · Word · Excel · scans'], ['Chunk', 'split by meaning'], ['Embed', 'into a vector index'], ['Analyse', 'summary · tags · facts']];
export const VPipeline: React.FC = () => {
  const {t, sp, io} = useT();
  const enter = useIn(0, 0.35);
  const X0 = 160, GX = [520, 860, 1200, 1540], Y = 470;
  const px = lerp(X0, 1780, io(0.5, 2.6, 0, 1, Easing.inOut(Easing.sin)));
  const stage = GX.filter((g) => px > g).length; // 0..4
  const zoom = io(2.75, 3.15, 0, 1, Easing.in(Easing.exp));
  return (
    <AbsoluteFill style={merge(enter, {transform: `scale(${lerp(1, 3, zoom)})`, opacity: 1 - zoom})}>
      <Space seed={10} gy={50} />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <defs><filter id="vb"><feGaussianBlur stdDeviation="8" /></filter></defs>
        <line x1={X0} y1={Y} x2={1780} y2={Y} stroke={V.cobalt} strokeWidth={14} opacity={0.25} filter="url(#vb)" />
        <line x1={X0} y1={Y} x2={1780} y2={Y} stroke="#BCD2FF" strokeWidth={3} />
      </svg>
      {GATES.map((g, i) => {
        const q = sp(0.2 + i * 0.12, {damping: 13, stiffness: 150});
        const hot = Math.max(0, 1 - Math.abs(px - GX[i]) / 120);
        return (
          <div key={i} style={{position: 'absolute', left: GX[i] - 70, top: Y - 170, width: 140, transform: `scale(${q})`}}>
            <div style={{width: 140, height: 340, borderRadius: 30, border: `2px solid rgba(157,187,255,${0.35 + hot * 0.65})`, background: `linear-gradient(180deg,rgba(61,123,255,${0.08 + hot * 0.25}),rgba(61,123,255,.02))`, boxShadow: hot ? `0 0 ${80 * hot}px rgba(61,123,255,${0.7 * hot})` : 'none'}} />
            <div style={{position: 'absolute', left: -60, right: -60, top: 370, textAlign: 'center'}}>
              <div style={{font: `800 34px ${MANROPE}`, color: '#fff', letterSpacing: '-0.02em'}}>{g[0]}</div>
              <div style={{font: `500 18px ${INTER}`, color: V.mist, marginTop: 4}}>{g[1]}</div>
            </div>
          </div>
        );
      })}
      {/* the document changes form at every gate */}
      <div style={{position: 'absolute', left: px - 80, top: Y - 100}}>
        {stage < 2 && <Slab x={0} y={0} w={160} h={200} lit={stage ? 1 : 0.2} label="KYC.PDF" />}
        {stage === 2 && [0, 1, 2, 3].map((i) => <Slab key={i} x={(i % 2) * 86} y={Math.floor(i / 2) * 106} w={74} h={94} lit={1} label="" />)}
        {stage === 3 && Array.from({length: 18}, (_, i) => <i key={i} style={{position: 'absolute', left: 80 + Math.cos(i * 1.7) * (30 + (i % 3) * 22), top: 100 + Math.sin(i * 1.7) * (30 + (i % 3) * 22), width: 12, height: 12, borderRadius: 6, background: '#BCD2FF', boxShadow: '0 0 16px rgba(61,123,255,.9)', display: 'block'}} />)}
        {stage === 4 && <Glass glow={1} style={{width: 230, padding: '16px 18px', marginLeft: -40}}><div style={{font: `600 13px ${MONO}`, letterSpacing: '.14em', color: V.ice}}>AI SUMMARY</div><div style={{font: `500 16px ${INTER}`, marginTop: 6, color: V.pale}}>KYC pack · Acme Capital</div><div style={{display: 'flex', gap: 6, marginTop: 10}}>{['KYC', 'corporate'].map((x) => <span key={x} style={{font: `600 13px ${INTER}`, padding: '3px 8px', borderRadius: 6, background: 'rgba(61,123,255,.3)'}}>{x}</span>)}</div></Glass>}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 110, display: 'flex', justifyContent: 'center'}}><VHead lines={[['Every', 'file,', {key: 'understood.'}]]} start={0.15} size={100} align="center" /></div>
      <Mono at={2.2} style={{position: 'absolute', left: 0, right: 0, bottom: 90, textAlign: 'center'}}>IN THE BACKGROUND · UPLOADS NEVER WAIT</Mono>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= 10. VIEWER: AI summary, tags, key facts ================= */
export const VViewer: React.FC = () => {
  const {sp, out} = useT();
  const k = 0.78;
  const win = sp(0, {damping: 16, stiffness: 100});
  const leave = useWhip(3.6, 4.0);
  return (
    <AbsoluteFill style={leave}>
      <Space seed={11} gx={40} floor />
      <AbsoluteFill style={{perspective: 2400}}>
        <div style={{position: 'absolute', left: 120, top: 250, transformStyle: 'preserve-3d', transform: `scale(${lerp(1.5, 1, win)}) rotateY(${lerp(4, 14, out(0, 3.8))}deg) rotateX(4deg)`, transformOrigin: '1100px 400px'}}>
          <GWin src="screens/05-viewer-details.jpg" k={k} rim="right" dim={0.3}>
            <Lift src="screens/05-viewer-details.jpg" at={0.8} x={1105} y={335} w={330} h={145} k={k} s={0.22} dy={-20} />
            <Lift src="screens/05-viewer-details.jpg" at={1.25} x={1105} y={492} w={330} h={45} k={k} s={0.2} dy={-10} />
            <Lift src="screens/05-viewer-details.jpg" at={1.6} x={1105} y={545} w={330} h={110} k={k} s={0.2} dy={-8} />
          </GWin>
        </div>
      </AbsoluteFill>
      {[['AI summary', 0.9, 430], ['Tags', 1.35, 560], ['Key facts', 1.7, 660]].map(([l, at, y], i) => {
        const q = sp(at as number, {damping: 12, stiffness: 170});
        return <div key={i} style={{position: 'absolute', left: 1450, top: y as number, transform: `translateX(${(1 - q) * 60}px)`, opacity: clamp01(q * 2), display: 'flex', alignItems: 'center', gap: 12, font: `700 28px ${INTER}`, color: '#fff'}}><span style={{width: 34, height: 3, background: V.cobalt, boxShadow: '0 0 12px rgba(61,123,255,.9)'}} />{l}</div>;
      })}
      <div style={{position: 'absolute', left: 118, top: 96}}><VHead lines={[['AI', 'reads', 'it', {key: 'first.'}]]} start={0.2} size={96} /></div>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= 11. COLLABORATION ================= */
const PEOPLE: [string, string, string][] = [['weiliang', 'Wei Liang', 'Passport copy for the director expires in March. Requesting a new copy.'], ['siti', 'Siti Jamaludin', '@Aisha can you approve the renewal?'], ['aisha', 'Aisha M.', 'Approved ✓ Updated copy is v2.']];
export const VCollab: React.FC = () => {
  const {t, sp, out} = useT();
  const enter = useIn(0, 0.4, -1);
  const leave = useWhip(3.3, 3.7);
  return (
    <AbsoluteFill style={t > 3.25 ? leave : enter}>
      <Space seed={12} gx={70} />
      <AbsoluteFill style={{perspective: 2000}}>
        <div style={{position: 'absolute', left: 110, top: 320, transform: `rotateY(30deg) translateX(${-out(0, 3.6) * 60}px)`, transformOrigin: 'left center', opacity: 0.9}}>
          <GWin src="screens/08-editor.jpg" k={0.64} dim={0.2} />
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 1060, top: 270, display: 'flex', flexDirection: 'column', gap: 22}}>
        {PEOPLE.map(([id, n, m], i) => {
          const q = sp(0.6 + i * 0.45, {damping: 13, stiffness: 160});
          return (
            <div key={i} style={{transform: `translateX(${(1 - q) * 300}px) scale(${lerp(0.85, 1, q)})`, opacity: clamp01(q * 2), marginLeft: i * 40}}>
              <Glass glow={i === 1 ? 0.6 : 0} style={{width: 720, display: 'flex', gap: 18, padding: '20px 24px'}}>
                <Avatar id={id} size={62} ring="rgba(157,187,255,.5)" />
                <div><div style={{font: `700 22px ${INTER}`}}>{n} <span style={{font: `500 16px ${INTER}`, color: V.mist}}>· just now</span></div>
                  <div style={{font: `400 22px/1.4 ${UI}`, color: V.pale, marginTop: 4}}>{m.split(/(@\w+)/).map((s, j) => s.startsWith('@') ? <b key={j} style={{color: '#fff', background: 'rgba(61,123,255,.45)', borderRadius: 6, padding: '0 6px'}}>{s}</b> : s)}</div></div>
              </Glass>
            </div>
          );
        })}
      </div>
      {(() => {
        const q = sp(2.2, {damping: 9, stiffness: 220});
        return <div style={{position: 'absolute', left: 1720, top: 140, transform: `scale(${q}) rotate(${Math.sin(t * 30) * 12 * Math.max(0, 1 - (t - 2.2) / 0.6)}deg)`}}>
          <Glass glow={1} style={{width: 90, height: 90, borderRadius: 28, display: 'grid', placeItems: 'center', position: 'relative'}}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={V.pale} strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
            <div style={{position: 'absolute', right: -6, top: -6, width: 32, height: 32, borderRadius: 16, background: V.cobalt, color: '#fff', display: 'grid', placeItems: 'center', font: `800 17px ${INTER}`}}>3</div>
          </Glass></div>;
      })()}
      <div style={{position: 'absolute', left: 118, top: 96}}><VHead lines={[['Work', {key: 'together.'}]]} start={0.2} size={96} /></div>
      <Sub at={0.7} style={{position: 'absolute', left: 122, top: 212}}>Comments · @mentions · version history</Sub>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= 12. PROBLEM: hours digging ================= */
export const VDigging: React.FC = () => {
  const {t, io} = useT();
  return (
    <AbsoluteFill>
      <Space seed={13} />
      <AbsoluteFill style={{perspective: 1400}}>
        {Array.from({length: 14}, (_, i) => {
          const flip = (t * 2.2 + i * 0.37) % 1;
          return <Slab key={i} x={90 + (i % 7) * 262} y={120 + Math.floor(i / 7) * 560} w={170} h={210} ry={flip * 180} label={['KYC', 'AML', 'MSA', 'FEES', 'Q3', 'ID', 'NDA'][i % 7] + '.PDF'} style={{opacity: 0.55}} />;
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <VHead lines={[['Hours', 'digging'], ['for', 'one', {key: 'answer.'}]]} start={0.15} size={124} align="center" />
        <div style={{marginTop: 26, font: `700 34px ${MONO}`, color: V.red, opacity: io(1.1, 1.3), textShadow: '0 0 20px rgba(255,90,106,.6)'}}>{`0${Math.min(3, Math.floor(clamp01(t - 1.1) * 4) + 1)}:${String(Math.floor((t * 47) % 60)).padStart(2, '0')}:${String(Math.floor((t * 613) % 60)).padStart(2, '0')}`}</div>
      </AbsoluteFill>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= 13. ASSISTANT: answers with sources ================= */
export const VAssistant: React.FC = () => {
  const {t, sp, out} = useT();
  const k = 0.8;
  const enter = useIn(0, 0.4);
  const leave = useWhip(4.2, 4.6);
  const q = 'Find our AML policy and tell me what it covers.';
  const drop = sp(1.4, {damping: 14, stiffness: 160});
  return (
    <AbsoluteFill style={t > 4.1 ? leave : enter}>
      <Space seed={14} gx={65} floor />
      <AbsoluteFill style={{perspective: 2200}}>
        <div style={{position: 'absolute', left: 760, top: 240, transformStyle: 'preserve-3d', transform: `rotateY(${lerp(-20, -12, out(0, 4.5))}deg) rotateX(6deg) scale(${1 + out(0, 4.5) * 0.05})`}}>
          <GWin src="screens/19-assistant.jpg" k={k} dim={0.3}>
            {t > 1.5 && <Lift src="screens/19-assistant.jpg" at={1.6} x={1130} y={180} w={294} h={62} k={k} s={0.1} dy={-6} color="rgba(157,187,255,.6)" />}
            {t > 1.5 && <Lift src="screens/19-assistant.jpg" at={2.05} x={1094} y={297} w={313} h={367} k={k} s={0.08} dy={-14} />}
            {t > 1.5 && <Lift src="screens/19-assistant.jpg" at={2.7} x={1094} y={692} w={313} h={32} k={k} s={0.3} dy={-16} color="#9DBBFF" />}
            {t < 1.55 && <div style={{position: 'absolute', left: 1050 * k, top: 120 * k, width: 385 * k, height: 640 * k, background: '#fff'}} />}
          </GWin>
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 700, top: 100, transform: `translateY(${drop * 140}px) scale(${lerp(1, 0.55, drop)})`, transformOrigin: 'right top', opacity: 1 - drop}}>
        <AIBar w={1100} text={typed(q, t, 0.3, 1.3)} caret={t < 1.4} size={28} />
      </div>
      <div style={{position: 'absolute', left: 118, top: 330}}><VHead lines={[['Answers,'], ['with', {key: 'sources.'}]]} start={1.9} size={90} /></div>
      {(() => { const p = sp(2.9, {damping: 12, stiffness: 170}); return <div style={{position: 'absolute', left: 118, top: 580, transform: `scale(${p})`, transformOrigin: 'left center'}}><Pill on>Cites the document it used</Pill></div>; })()}
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= 14. PROPOSE -> CONFIRM ================= */
export const VConfirm: React.FC = () => {
  const {t, sp, io, out} = useT();
  const card = sp(0.15, {damping: 14, stiffness: 140});
  const click = io(1.65, 2.0);
  const done = t > 1.85;
  const leave = io(2.95, 3.3, 0, 1, Easing.in(Easing.exp));
  return (
    <AbsoluteFill style={{transform: `scale(${lerp(1, 1.6, leave)})`, opacity: 1 - leave, filter: leave > 0.02 ? `blur(${leave * 16}px)` : undefined}}>
      <Space seed={15} gx={70} />
      <div style={{position: 'absolute', left: 1040, top: 280, transform: `rotate(${lerp(8, 2, card)}deg) translateY(${(1 - card) * 400}px)`}}>
        <Glass glow={done ? 0.4 : 1} style={{width: 680, overflow: 'hidden'}}>
          <div style={{padding: '20px 28px', display: 'flex', alignItems: 'center', gap: 14, font: `700 22px ${INTER}`, borderBottom: '1px solid rgba(150,180,255,.2)'}}><span style={{width: 40, height: 40, borderRadius: 12, background: 'rgba(61,123,255,.35)', display: 'grid', placeItems: 'center', color: V.pale}}>✦</span>OTSO Assistant<span style={{marginLeft: 'auto', font: `500 14px ${MONO}`, letterSpacing: '.14em', color: V.ice}}>PROPOSED ACTION</span></div>
          <div style={{padding: '26px 28px'}}>
            <div style={{font: `500 18px ${INTER}`, color: V.mist}}>Create folder</div>
            <div style={{font: `700 30px ${INTER}`, marginTop: 4}}>Client Onboarding / KYC 2027</div>
            <div style={{display: 'flex', gap: 14, marginTop: 26}}>
              <div style={{padding: '14px 34px', borderRadius: 14, background: done ? V.green : V.cobalt, color: done ? '#04130C' : '#fff', font: `700 22px ${INTER}`, transform: `scale(${1 - Math.sin(Math.PI * click) * 0.06})`, boxShadow: `0 0 30px ${done ? 'rgba(52,211,153,.6)' : 'rgba(61,123,255,.7)'}`}}>{done ? '✓ Done' : 'Confirm'}</div>
              <div style={{padding: '14px 30px', borderRadius: 14, border: '1px solid rgba(150,180,255,.35)', color: V.pale, font: `600 22px ${INTER}`}}>Cancel</div>
            </div>
          </div>
        </Glass>
      </div>
      <Cursor x={lerp(1600, 1150, out(0.8, 1.6))} y={lerp(900, 560, out(0.8, 1.6))} click={click} />
      <div style={{position: 'absolute', left: 118, top: 340}}><VHead lines={[['Nothing', 'changes'], ['without', {key: 'you.'}]]} start={0.3} size={100} /></div>
      <Sub at={1.0} style={{position: 'absolute', left: 122, top: 600}}>The AI proposes. A person confirms.</Sub>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= 15. THE VAULT DOOR (signature beat) ================= */
export const VVault: React.FC = () => {
  const {t, sp, io} = useT();
  const CX = 960, CY = 540;
  const inn = sp(0, {damping: 16, stiffness: 90});
  const spin = io(0.3, 1.2, 0, 1, Easing.inOut(Easing.cubic)) * 120;
  const bolt = io(1.0, 1.25, 0, 1, Easing.in(Easing.exp)); // bolts slam in
  const thud = Math.max(0, 1 - Math.abs(t - 1.25) / 0.12);
  const words = ['Audited.', 'Held.', 'Locked.'];
  return (
    <AbsoluteFill style={{transform: `translate(${Math.sin(t * 90) * 8 * thud}px,${Math.cos(t * 80) * 6 * thud}px)`}}>
      <Space seed={16} gy={50} dust={0.4} />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, transform: `scale(${lerp(1.8, 1, inn)})`, transformOrigin: `${CX}px ${CY}px`}}>
        <defs><radialGradient id="door"><stop offset="0" stopColor="#1A2A55" /><stop offset=".7" stopColor="#0C1530" /><stop offset="1" stopColor="#070B18" /></radialGradient><filter id="dg"><feGaussianBlur stdDeviation="10" /></filter></defs>
        <circle cx={CX} cy={CY} r={430} fill="url(#door)" stroke="rgba(157,187,255,.5)" strokeWidth={3} />
        <circle cx={CX} cy={CY} r={430} fill="none" stroke={V.cobalt} strokeWidth={10} opacity={0.35 + thud * 0.6} filter="url(#dg)" />
        <g transform={`rotate(${spin} ${CX} ${CY})`}>
          {[360, 300, 230].map((r, k) => <circle key={k} cx={CX} cy={CY} r={r} fill="none" stroke="rgba(157,187,255,.35)" strokeWidth={k === 1 ? 3 : 1.5} strokeDasharray={k === 0 ? '4 18' : undefined} />)}
          {Array.from({length: 6}, (_, i) => { const a = i / 6 * Math.PI * 2; return <line key={i} x1={CX + Math.cos(a) * 120} y1={CY + Math.sin(a) * 120} x2={CX + Math.cos(a) * 300} y2={CY + Math.sin(a) * 300} stroke="rgba(157,187,255,.45)" strokeWidth={6} strokeLinecap="round" />; })}
          <circle cx={CX} cy={CY} r={110} fill="#0E1A3A" stroke="#BCD2FF" strokeWidth={3} />
        </g>
        {Array.from({length: 12}, (_, i) => {
          const a = i / 12 * Math.PI * 2, r0 = lerp(520, 455, bolt);
          return <rect key={i} x={-24} y={-11} width={48} height={22} rx={6} fill="#AFC6FF" opacity={0.9} transform={`translate(${CX + Math.cos(a) * r0} ${CY + Math.sin(a) * r0}) rotate(${a * 180 / Math.PI})`} />;
        })}
      </svg>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
        {words.map((w, i) => {
          const p = sp(1.3 + i * 0.22, {damping: 11, stiffness: 220});
          return <span key={i} style={{font: `800 140px ${MANROPE}`, letterSpacing: '-0.045em', color: i === 2 ? '#BCD2FF' : '#fff', margin: '0 24px', transform: `scale(${lerp(2.2, 1, p)})`, opacity: clamp01(p * 3), filter: p < 0.6 ? `blur(${(0.6 - p) * 18}px)` : `drop-shadow(0 0 ${i === 2 ? 30 : 0}px rgba(61,123,255,.8))`, textShadow: '0 10px 40px rgba(0,0,0,.8)'}}>{w}</span>;
        })}
      </AbsoluteFill>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= 16. AUDIT TRAIL ================= */
export const VAudit: React.FC = () => {
  const {sp, out} = useT();
  const k = 0.76;
  const win = sp(0, {damping: 16, stiffness: 100});
  const leave = useWhip(3.6, 4.0);
  return (
    <AbsoluteFill style={leave}>
      <Space seed={17} gx={65} floor />
      <AbsoluteFill style={{perspective: 2400}}>
        <div style={{position: 'absolute', left: 700, top: 210, transformStyle: 'preserve-3d', transform: `translateY(${(1 - win) * 600}px) rotateX(${lerp(28, 16, win)}deg) rotateZ(${lerp(-8, -4, out(0, 4))}deg) rotateY(-8deg)`}}>
          <GWin src="screens/13-audit.jpg" k={k} dim={0.3}>
            {[290, 570, 850, 1130].map((x, i) => <Lift key={i} src="screens/13-audit.jpg" at={0.7 + i * 0.12} x={x} y={213} w={276} h={82} k={k} s={0.1} dy={-16} />)}
            {[425, 482, 538, 595].map((y, i) => <Lift key={'r' + i} src="screens/13-audit.jpg" at={1.5 + i * 0.12} x={290} y={y} w={1115} h={56} k={k} s={0.03} dy={-4} color="rgba(157,187,255,.55)" />)}
          </GWin>
        </div>
      </AbsoluteFill>
      {['Append-only audit trail', 'Legal hold', 'Classification: Public → Restricted', 'Per-document AI & download controls'].map((l, i) => {
        const q = sp(1.0 + i * 0.3, {damping: 12, stiffness: 170});
        return <div key={i} style={{position: 'absolute', left: 118, top: 470 + i * 74, transform: `translateX(${(1 - q) * -80}px)`, opacity: clamp01(q * 2), display: 'flex', alignItems: 'center', gap: 14, font: `600 26px ${INTER}`, color: V.pale}}><span style={{width: 30, height: 30, borderRadius: 15, background: V.cobalt, color: '#fff', display: 'grid', placeItems: 'center', font: `800 16px ${INTER}`, boxShadow: '0 0 16px rgba(61,123,255,.8)'}}>✓</span>{l}</div>;
      })}
      <div style={{position: 'absolute', left: 118, top: 150}}><VHead lines={[['Compliance'], ['by', {key: 'default.'}]]} start={0.2} size={96} /></div>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= 17. SHARING: restricted files can't leave ================= */
const LEVELS: [string, string][] = [['Public', '#34D399'], ['Internal', '#6EA0FF'], ['Confidential', '#F5B04A'], ['Restricted', '#FF5A6A']];
export const VShare: React.FC = () => {
  const {t, sp, io, out} = useT();
  const card = sp(0.1, {damping: 14, stiffness: 130});
  const lvl = t < 1.0 ? 1 : t < 1.5 ? 2 : 3;
  const locked = lvl === 3;
  const laser = io(1.5, 1.8);
  const leave = useWhip(3.0, 3.4);
  return (
    <AbsoluteFill style={leave}>
      <Space seed={18} gx={35} />
      <AbsoluteFill style={{perspective: 2000}}>
        <div style={{position: 'absolute', left: 240, top: 250, transform: `rotateY(${lerp(30, 16, card)}deg) rotateX(4deg) translateY(${(1 - card) * 400}px)`}}>
          <Glass glow={locked ? 0 : 0.6} style={{width: 780, padding: '30px 34px', borderColor: locked ? 'rgba(255,90,106,.7)' : undefined, boxShadow: locked ? '0 0 60px rgba(255,90,106,.35),0 40px 80px -30px rgba(0,0,0,.9)' : undefined}}>
            <div style={{font: `700 28px ${INTER}`}}>Share “KYC - Acme Capital Pte Ltd.pdf”</div>
            <div style={{font: `600 14px ${MONO}`, letterSpacing: '.16em', color: V.ice, marginTop: 24}}>CLASSIFICATION</div>
            <div style={{display: 'flex', gap: 10, marginTop: 12}}>
              {LEVELS.map(([l, c], i) => <span key={i} style={{padding: '10px 18px', borderRadius: 12, font: `700 19px ${INTER}`, color: i === lvl ? '#04060D' : c, background: i === lvl ? c : 'rgba(150,180,255,.08)', border: `1px solid ${c}55`, transform: `scale(${i === lvl ? 1.06 : 1})`}}>{l}</span>)}
            </div>
            <div style={{font: `600 14px ${MONO}`, letterSpacing: '.16em', color: V.ice, marginTop: 28}}>EXTERNAL LINK</div>
            <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 16, marginTop: 12, padding: '16px 20px', borderRadius: 14, background: locked ? 'rgba(255,90,106,.12)' : 'rgba(150,180,255,.08)', border: `1px solid ${locked ? 'rgba(255,90,106,.6)' : 'rgba(150,180,255,.3)'}`, overflow: 'hidden'}}>
              <span style={{fontSize: 28}}>{locked ? '🔒' : '🔗'}</span>
              <div style={{flex: 1, font: `600 21px ${INTER}`, color: locked ? V.red : '#fff'}}>{locked ? 'Links disabled for Restricted files' : lvl === 2 ? 'Password-protected link' : 'Staff-only link'}</div>
              <div style={{width: 64, height: 36, borderRadius: 18, background: locked ? 'rgba(255,90,106,.35)' : V.cobalt, position: 'relative'}}><div style={{position: 'absolute', top: 4, left: locked ? 4 : 32, width: 28, height: 28, borderRadius: 14, background: '#fff'}} /></div>
              {/* laser lattice slams across the link */}
              {locked && [0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: `${i * 22 - 10}%`, top: -20, width: 3, height: 120, background: V.red, transform: `rotate(35deg) scaleY(${laser})`, boxShadow: '0 0 12px rgba(255,90,106,.9)', opacity: 0.7}} />)}
            </div>
          </Glass>
        </div>
      </AbsoluteFill>
      <Cursor x={lerp(1150, 900, out(0.4, 1.3))} y={lerp(720, 440, out(0.4, 1.3))} click={io(1.4, 1.75)} />
      <div style={{position: 'absolute', right: 118, top: 360}}><VHead lines={[['Nothing'], [{key: 'leaks.'}]]} start={1.55} size={130} align="right" /></div>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= 18. PROBLEM: chat apps send copies ================= */
export const VCopies: React.FC = () => {
  const {sp} = useT();
  const enter = useIn(0, 0.35);
  return (
    <AbsoluteFill style={enter}>
      <Space seed={19} gx={70} />
      <AbsoluteFill style={{perspective: 1500}}><AbsoluteFill style={{transformStyle: 'preserve-3d'}}>
        {Array.from({length: 8}, (_, i) => {
          const q = sp(0.3 + i * 0.13, {damping: 12, stiffness: 170});
          return <Slab key={i} x={980 + (i % 3) * 230} y={110 + Math.floor(i / 3) * 290} z={-i * 40} ry={-18} rz={(i % 2 ? 1 : -1) * (3 + i)} w={190} h={240} label={i === 0 ? 'AGREEMENT.PDF' : `AGREEMENT (${i}).PDF`} tag={['SENT', 'FWD', 'SAVED', 'FWD', 'EMAILED', 'COPY', 'COPY', '???'][i]} style={{transform: `scale(${q})`, opacity: clamp01(q * 2)}} />;
        })}
      </AbsoluteFill></AbsoluteFill>
      <div style={{position: 'absolute', left: 118, top: 330}}><VHead lines={[['Chat', 'apps'], ['send', {key: 'copies.'}]]} start={0.15} size={118} /></div>
      <Sub at={1.4} style={{position: 'absolute', left: 122, top: 630}}>No classification. No audit trail. No way back.</Sub>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= 19. TEAM CHAT: files stay documents ================= */
const CHAT_AV: [string, number, number, number][] = [['raj', 558, 243, 14], ['weiliang', 558, 371, 14], ['siti', 558, 462, 14], ['raj', 558, 590, 14], ['siti', 286, 426, 11], ['raj', 286, 464, 11], ['weiliang', 37, 869, 18]];
export const VChat: React.FC = () => {
  const {sp, io, out} = useT();
  const k = 0.76;
  const win = sp(0, {damping: 16, stiffness: 95});
  const leave = useWhip(4.2, 4.6);
  return (
    <AbsoluteFill style={leave}>
      <Space seed={20} gx={62} floor />
      <AbsoluteFill style={{perspective: 2400}}>
        <div style={{position: 'absolute', left: 740, top: 250, transformStyle: 'preserve-3d', transform: `translateY(${(1 - win) * 700}px) rotateX(${lerp(24, 8, win)}deg) rotateY(${lerp(-22, -12, win) + out(0.5, 4.5) * 4}deg)`}}>
          <GWin src="chat/chat-workspace.png" k={k} dim={0.2}>
            {CHAT_AV.map(([id, x, y, r], i) => <div key={i} style={{position: 'absolute', left: (x - r) * k, top: (y - r) * k}}><Avatar id={id} size={2 * r * k} /></div>)}
            <Lift src="chat/chat-workspace.png" at={1.1} x={585} y={280} w={415} h={56} k={k} s={0.22} dy={-18} />
            <Lift src="chat/chat-workspace.png" at={2.2} x={585} y={503} w={352} h={50} k={k} s={0.22} dy={-14} color={V.red} />
          </GWin>
        </div>
      </AbsoluteFill>
      {(() => { const q = sp(1.4, {damping: 12, stiffness: 170}); return <div style={{position: 'absolute', left: 118, top: 340, transform: `scale(${q})`, transformOrigin: 'left center'}}><Pill on>✦ The real document, not a copy</Pill></div>; })()}
      {(() => { const q = sp(2.5, {damping: 12, stiffness: 170}); return <div style={{position: 'absolute', left: 118, top: 430, transform: `scale(${q})`, transformOrigin: 'left center'}}><Pill style={{borderColor: V.red, color: '#FFD4D9', background: 'rgba(255,90,106,.14)'}}>🔒 Permissions checked on every click</Pill></div>; })()}
      <div style={{position: 'absolute', left: 118, top: 96}}><VHead lines={[['Files', 'stay'], [{key: 'documents.'}]]} start={0.25} size={96} /></div>
      <div style={{position: 'absolute', left: 118, bottom: 170, display: 'flex'}}>
        {['aisha', 'weiliang', 'siti', 'daniel', 'priya', 'marcus', 'faizal', 'meiling', 'raj'].map((id, i) => {
          const q = sp(3.0 + i * 0.05, {damping: 11, stiffness: 200});
          return <div key={id} style={{marginLeft: i ? -16 : 0, transform: `scale(${q})`}}><Avatar id={id} size={64} ring="#0B1430" /></div>;
        })}
      </div>
      <Sub at={3.4} style={{position: 'absolute', left: 118, bottom: 116, whiteSpace: 'nowrap'}}>Channels · DMs · voice notes</Sub>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= 20. STACK: a constellation ================= */
const STACK: [string | null, string, string, number, number][] = [
  ['microsoft-365.svg', 'Microsoft Entra SSO', '', 760, 230], ['openai.svg', 'OpenAI', '', 1240, 190], ['postgresql.svg', 'PostgreSQL + pgvector', '', 1560, 420],
  [null, 'Redis queue', 'R', 1500, 760], ['docker.svg', 'Docker', '', 1100, 870], [null, 'Tencent Cloud', 'TC', 660, 820], [null, 'GitHub Actions CI', 'CI', 480, 520]];
export const VStack: React.FC = () => {
  const {t, sp, io} = useT();
  const HX = 1060, HY = 540;
  const dive = io(3.9, 4.3, 0, 1, Easing.in(Easing.exp));
  const hub = sp(0.15, {damping: 13, stiffness: 120});
  return (
    <AbsoluteFill style={{transform: `scale(${lerp(1, 4, dive)})`, transformOrigin: `${HX}px ${HY}px`, opacity: 1 - dive * 0.85}}>
      <Space seed={21} gx={55} gy={50} />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <defs><filter id="sg"><feGaussianBlur stdDeviation="6" /></filter></defs>
        {STACK.map((s, i) => {
          const p = io(0.5 + i * 0.12, 1.0 + i * 0.12);
          const x2 = lerp(HX, s[3], p), y2 = lerp(HY, s[4], p);
          const u = ((t - 1 - i * 0.1) * 0.6) % 1;
          return <g key={i}><line x1={HX} y1={HY} x2={x2} y2={y2} stroke={V.cobalt} strokeWidth={8} opacity={0.3} filter="url(#sg)" /><line x1={HX} y1={HY} x2={x2} y2={y2} stroke="#BCD2FF" strokeWidth={2} />
            {t > 1.2 && <circle cx={lerp(HX, s[3], u)} cy={lerp(HY, s[4], u)} r={6} fill="#fff" />}</g>;
        })}
      </svg>
      {STACK.map(([logo, name, mono, x, y], i) => {
        const q = sp(0.5 + i * 0.12, {damping: 13, stiffness: 140});
        return (
          <div key={i} style={{position: 'absolute', left: x - 56, top: y - 56, width: 112, textAlign: 'center', transform: `scale(${q})`, opacity: clamp01(q * 2)}}>
            <Glass glow={0.5} style={{width: 112, height: 112, borderRadius: 32, display: 'grid', placeItems: 'center', background: 'rgba(255,255,255,.92)'}}>
              {logo ? <Img src={staticFile('logos/' + logo)} style={{width: 60, height: 60, objectFit: 'contain'}} /> : <span style={{font: `800 34px ${MANROPE}`, color: '#1B3A8A'}}>{mono}</span>}
            </Glass>
            <div style={{font: `700 19px ${INTER}`, color: V.pale, marginTop: 10, whiteSpace: 'nowrap', marginLeft: -80, marginRight: -80}}>{name}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: HX - 120, top: HY - 80, transform: `scale(${hub})`}}>
        <Glass glow={1} style={{width: 240, height: 160, borderRadius: 40, background: 'linear-gradient(160deg,#1B2E66,#0C1636)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8}}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={V.pale} strokeWidth="2.4" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5 21 21" /></svg>
          <div style={{font: `800 28px ${MANROPE}`, letterSpacing: '-0.02em'}}>AI Workspace</div>
        </Glass>
      </div>
      <div style={{position: 'absolute', left: 110, top: 96}}><VHead lines={[['Plugs', 'into'], ['your', {key: 'stack.'}]]} start={0.25} size={96} /></div>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= 21. RESULTS ================= */
export const VResults: React.FC = () => {
  const {sp, io, out} = useT();
  const open = io(0, 0.4, 0, 1, Easing.out(Easing.exp));
  const n = Math.round(37 * out(0.4, 1.9));
  const cards = [['130', 'staff accounts, Microsoft sign-in'], ['4', 'languages'], ['+58%', 'faster downloads for staff in China'], ['1,700+', 'automated tests']];
  return (
    <AbsoluteFill style={{clipPath: `circle(${open * 150}% at 50% 45%)`}}>
      <Space seed={22} gx={30} gy={40} floor />
      <AbsoluteFill style={{perspective: 2000}}>
        <div style={{position: 'absolute', left: 120, top: 110, transform: `rotateY(${lerp(22, 14, out(0.3, 5))}deg) rotateX(6deg) scale(${lerp(0.85, 1, sp(0.4, {damping: 14}))})`, transformOrigin: 'left center', display: 'flex', alignItems: 'baseline', gap: 30}}>
          <div style={{font: `800 400px/0.86 ${MANROPE}`, letterSpacing: '-0.065em', background: 'linear-gradient(175deg,#FFFFFF 0%,#BCD2FF 45%,#3D7BFF 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 0 50px rgba(61,123,255,.5))', fontVariantNumeric: 'tabular-nums'}}>{n}</div>
          <div style={{font: `800 120px ${MANROPE}`, color: '#fff', letterSpacing: '-0.04em'}}>days</div>
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 130, top: 520}}><VHead lines={[['from', 'first', 'commit'], ['to', {key: 'production.'}]]} start={1.0} size={74} /></div>
      {cards.map((c, i) => {
        const q = sp(1.7 + i * 0.2, {damping: 13, stiffness: 140});
        return <div key={i} style={{position: 'absolute', left: 1150 + (i % 2) * 340, top: 270 + Math.floor(i / 2) * 230 + (1 - q) * 120, opacity: q}}>
          <Glass style={{width: 310, padding: '24px 28px'}}><div style={{font: `800 62px ${MANROPE}`, letterSpacing: '-0.03em'}}>{c[0]}</div><div style={{font: `500 20px ${INTER}`, color: V.mist}}>{c[1]}</div></Glass>
        </div>;
      })}
      <Mono at={2.4} style={{position: 'absolute', left: 130, bottom: 96}}>OTSO MARKETS · LIVE SINCE 5 AUG 2026</Mono>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= 22. END CARD: the beam reveals the Codech logo ================= */
const LX = 960, LW = 520, LH = LW * 765 / 1076, GY = 440;
const CDX = (382 - 538) * LW / 1076, CR0 = 382 * LW / 1076; // the C mark's circle inside the logo image
export const VEnd: React.FC = () => {
  const {t, sp, io} = useT();
  const wipe = io(0, 0.6, 0, 1, Easing.inOut(Easing.cubic));
  const settle = sp(2.35, {damping: 16, stiffness: 110});
  const logoY = lerp(GY, GY - 40, settle), logoS = lerp(1.08, 0.86, settle);
  const CX = LX + CDX * logoS, CY = logoY, CR = CR0 * logoS;
  const rings = io(0.35, 1.3);
  const bx = lerp(LX - LW / 2 - 60, LX + LW / 2 + 60, io(0.9, 1.9, 0, 1, Easing.inOut(Easing.cubic)));
  const rev = clamp01((bx - (LX - LW / 2)) / LW);
  const bloom = Math.max(0, 1 - Math.abs(t - 1.95) / 0.5);
  const shock = io(1.9, 2.7, 0, 1, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill style={{clipPath: `circle(${wipe * 150}% at 50% 45%)`}}>
      <Space seed={23} gx={50} gy={40} />
      <div style={{position: 'absolute', left: LX - 520, top: GY - 380, width: 1040, height: 760, borderRadius: '50%', background: `rgba(61,123,255,${0.2 + bloom * 0.2})`, filter: 'blur(90px)'}} />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: 1 - io(2.4, 3.0)}}>
        {[0.42, 0.7, 0.97].map((f, k) => { const r = CR * f, L = 2 * Math.PI * r; return <circle key={k} cx={CX} cy={CY} r={r} fill="none" stroke="#9DBBFF" strokeWidth={k === 1 ? 2 : 1.2} opacity={0.6 - k * 0.12} strokeDasharray={L} strokeDashoffset={L * (1 - clamp01(rings * 1.3 - k * 0.15))} transform={`rotate(-90 ${CX} ${CY})`} />; })}
        <line x1={CX - 760 * rings} y1={CY} x2={CX + 760 * rings} y2={CY} stroke="#9DBBFF" strokeWidth={1.2} opacity={0.4} />
      </svg>
      {shock > 0 && shock < 1 && <div style={{position: 'absolute', left: CX - 200 - shock * 500, top: CY - 200 - shock * 500, width: 400 + shock * 1000, height: 400 + shock * 1000, borderRadius: '50%', border: `${3 * (1 - shock) + 0.5}px solid rgba(157,187,255,${0.7 * (1 - shock)})`}} />}
      <div style={{position: 'absolute', left: LX - LW / 2, top: logoY - LH / 2, width: LW, height: LH, transform: `scale(${logoS + bloom * 0.04})`,
        WebkitMaskImage: `linear-gradient(90deg,#000 ${rev * 100}%,transparent ${rev * 100}%)`, maskImage: `linear-gradient(90deg,#000 ${rev * 100}%,transparent ${rev * 100}%)`,
        filter: bloom > 0.02 ? `drop-shadow(0 0 ${bloom * 40}px rgba(61,123,255,.9))` : undefined}}>
        <Img src={staticFile('codech-logo-white.png')} style={{width: LW, height: LH}} />
      </div>
      {t > 0.85 && t < 2.0 && <Beam x={bx} w={0.6} />}
      <div style={{position: 'absolute', left: 0, right: 0, top: 690, display: 'flex', justifyContent: 'center'}}><VHead lines={[["Let's", 'build', {key: 'yours.'}]]} start={2.55} size={84} align="center" /></div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 820, display: 'flex', justifyContent: 'center', gap: 16}}>
        {[CONTACTS.web, CONTACTS.email, CONTACTS.phone].map((c, i) => {
          const p = sp(2.95 + i * 0.16, {damping: 12, stiffness: 170});
          return <div key={i} style={{transform: `translateY(${(1 - p) * 40}px)`, opacity: clamp01(p * 2)}}><Pill on={i === 0} style={{font: `600 25px ${INTER}`}}>{['🌐', '✉', '✆'][i]} {c}</Pill></div>;
        })}
      </div>
      {CONTACTS.qr && (() => {
        const p = sp(3.5, {damping: 13, stiffness: 150});
        return <div style={{position: 'absolute', right: 90, bottom: 70, display: 'flex', alignItems: 'center', gap: 18, transform: `translateY(${(1 - p) * 50}px)`, opacity: clamp01(p * 2)}}>
          <div style={{textAlign: 'right'}}><div style={{font: `500 13px ${MONO}`, letterSpacing: '.16em', color: V.ice}}>WHATSAPP</div><div style={{font: `700 22px ${INTER}`, color: '#fff', lineHeight: 1.25}}>Scan to chat<br />with us</div></div>
          <div style={{padding: 10, borderRadius: 18, background: '#fff', boxShadow: '0 0 40px rgba(61,123,255,.45)'}}><Img src={staticFile(CONTACTS.qr)} style={{width: 130, height: 130, display: 'block'}} /></div>
        </div>;
      })()}
      <Vig />
    </AbsoluteFill>
  );
};
