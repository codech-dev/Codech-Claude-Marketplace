import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile} from 'remotion';
import {INTER, MANROPE, MONO, Phone, clamp01, lerp, useT} from './lib';
import {Avatar, Compare, K, Lost, UIF} from './Concepts';
import {EndCard} from './EndCard';

/* Kiddy123 KiddyMatch AI case-study film · look "D · Tiny Town" (picked 13 Oct 2026), realistic Klang Valley tilt-shift
   aerial plates (ChatGPT Image via Codex, public/plates/) with KiddyMatch mini UIs and kinetic type on top.
   Every scene is written in LOCAL time (t = 0 at its start); timeline.json places them. DRAFT 1: rough motion. */
const W = 1920, H = 1080;
export const TT = {ink: '#0B2530', sun: '#FFC93C', sunDeep: '#9A5B00', haze: '#EAF4FF', white: '#FFFFFF', night: '#071521'};
export const SHADOW = '0 60px 120px -40px rgba(8,28,36,.75),0 0 0 1px rgba(255,255,255,.35)';

/* ---------------- building blocks ---------------- */
/** A plate with a slow camera move: scale s0→s1, pan (x0,y0)→(x1,y1) in px over `dur`, optional blur / dim. */
export const Plate: React.FC<{src: string; dur: number; s0?: number; s1?: number; x0?: number; x1?: number; y0?: number; y1?: number; blur?: number; dim?: number; origin?: string}> =
  ({src, dur, s0 = 1.04, s1 = 1.12, x0 = 0, x1 = 0, y0 = 0, y1 = 0, blur = 0, dim = 0, origin = '50% 50%'}) => {
    const {io} = useT();
    const p = io(0, dur, 0, 1, Easing.inOut(Easing.sin));
    return (
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <Img src={staticFile(`plates/${src}`)} style={{position: 'absolute', inset: 0, width: W, height: H, objectFit: 'cover', transformOrigin: origin,
          transform: `translate(${lerp(x0, x1, p)}px,${lerp(y0, y1, p)}px) scale(${lerp(s0, s1, p)})`, filter: blur ? `blur(${blur}px)` : undefined}} />
        {dim > 0 && <AbsoluteFill style={{background: `rgba(6,20,28,${dim})`}} />}
      </AbsoluteFill>
    );
  };
export const Shade: React.FC<{side?: 'left' | 'right' | 'top'; color?: string; to?: number}> = ({side = 'left', color = '8,28,36', to = 0.8}) => (
  <AbsoluteFill style={{background: side === 'top' ? `linear-gradient(180deg,rgba(${color},${to}) 0%,rgba(${color},0) 55%)` :
    `linear-gradient(${side === 'left' ? 90 : 270}deg,rgba(${color},${to}) 0%,rgba(${color},${to * 0.55}) 38%,rgba(${color},0) 62%)`}} />
);
export type Word = string | {hi: string};
/** Kinetic headline: words spring up out of a mask; {hi} words get a sun marker that wipes in behind them. */
export const THead: React.FC<{lines: Word[][]; start?: number; size?: number; color?: string; hiText?: string; align?: 'left' | 'right' | 'center'; stagger?: number}> =
  ({lines, start = 0.15, size = 104, color = '#fff', hiText = TT.ink, align = 'left', stagger = 0.08}) => {
    const {sp, expo} = useT();
    let k = 0;
    return (
      <div style={{font: `800 ${size}px/1.02 ${MANROPE}`, letterSpacing: '-0.045em', color, textAlign: align}}>
        {lines.map((line, li) => (
          <div key={li} style={{clipPath: 'inset(-0.3em -0.6em 0 -0.6em)', paddingBottom: '0.1em', marginBottom: '-0.04em'}}>
            {line.map((w, wi) => {
              const hi = typeof w !== 'string'; const text = hi ? (w as {hi: string}).hi : (w as string);
              const ws = start + (k++) * stagger; const p = sp(ws, {damping: 14, stiffness: 180});
              return (
                <span key={wi} style={{display: 'inline-block', position: 'relative', marginRight: wi < line.length - 1 ? '0.24em' : 0, transform: `translateY(${(1 - p) * 110}%)`, color: hi ? hiText : undefined, zIndex: 1}}>
                  {hi && <span style={{position: 'absolute', left: '-0.12em', right: '-0.12em', top: '0.06em', bottom: '-0.02em', background: TT.sun, borderRadius: '0.14em', zIndex: -1,
                    transform: `scaleX(${expo(ws + 0.2, ws + 0.6)})`, transformOrigin: '0 50%', boxShadow: '0 12px 30px -10px rgba(154,91,0,.5)'}} />}{text}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    );
  };
export const Sub: React.FC<{children: React.ReactNode; at?: number; color?: string; size?: number; style?: React.CSSProperties}> = ({children, at = 0.7, color = 'rgba(255,255,255,.88)', size = 30, style}) => {
  const {io} = useT(); const o = io(at, at + 0.4);
  return <div style={{font: `500 ${size}px/1.35 ${INTER}`, color, opacity: o, transform: `translateY(${(1 - o) * 14}px)`, ...style}}>{children}</div>;
};
/** Springs a child in (scale + rise + slight tilt) at `at`. */
export const In: React.FC<{at: number; children: React.ReactNode; from?: number; rot?: number; style?: React.CSSProperties}> = ({at, children, from = 80, rot = 0, style}) => {
  const {sp} = useT(); const p = sp(at, {damping: 15, stiffness: 140});
  return <div style={{position: 'absolute', opacity: clamp01(p * 2), transform: `translateY(${(1 - p) * from}px) scale(${lerp(0.9, 1, p)}) rotate(${(1 - p) * rot}deg)`, ...style}}>{children}</div>;
};
export const Glass: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{background: '#fff', borderRadius: 26, boxShadow: SHADOW, overflow: 'hidden', ...style}}>{children}</div>
);
export const typed = (text: string, t: number, a: number, b: number) => text.slice(0, Math.round(clamp01((t - a) / (b - a)) * text.length));

/* Points of interest over a plate: a white label on a stalk, with a glowing sun pin. */
export const Poi: React.FC<{x: number; y: number; n: string; f: string; rank?: number; at: number}> = ({x, y, n, f, rank, at}) => {
  const {sp} = useT(); const p = sp(at, {damping: 12, stiffness: 170});
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-100%) scale(${lerp(0.6, 1, p)})`, transformOrigin: '50% 100%', opacity: clamp01(p * 2), display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12, background: '#fff', borderRadius: 18, padding: '10px 18px 10px 10px', boxShadow: '0 22px 44px -14px rgba(11,37,48,.55)'}}>
        {rank != null && <span style={{width: 40, height: 40, borderRadius: 12, background: TT.ink, color: TT.sun, display: 'grid', placeItems: 'center', font: `800 19px ${INTER}`}}>{rank}</span>}
        <div><div style={{font: `800 20px ${INTER}`, color: TT.ink, whiteSpace: 'nowrap'}}>{n}</div><div style={{font: `600 17px ${MONO}`, color: TT.sunDeep}}>{f}</div></div>
      </div>
      <div style={{width: 3, height: 54 * p, background: 'linear-gradient(#fff,rgba(255,255,255,.2))'}} />
      <div style={{width: 18, height: 18, borderRadius: 9, background: TT.sun, boxShadow: '0 0 0 6px rgba(255,201,60,.45),0 0 30px rgba(255,201,60,.9)'}} />
    </div>
  );
};
export const ClientChip: React.FC<{label: string; dark?: boolean}> = ({label, dark}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 16, font: `600 26px ${INTER}`, color: dark ? 'rgba(255,255,255,.9)' : TT.ink}}>{label}
    <span style={{background: '#fff', borderRadius: 14, padding: '8px 14px', boxShadow: '0 10px 30px rgba(8,28,36,.25)'}}><Img src={staticFile('kiddy123-logo.png')} style={{height: 46, display: 'block'}} /></span><b>Kiddy123</b></div>
);
const PILLARS: [string, string][] = [['Match', '#FFC93C'], ['Answer', '#4FB3E8'], ['Insight', '#7BC67E']];
export const Pillars: React.FC<{at: number}> = ({at}) => {
  const {sp} = useT();
  return <div style={{display: 'flex', gap: 14}}>{PILLARS.map(([p, c], i) => { const q = sp(at + i * 0.14, {damping: 12, stiffness: 170});
    return <span key={p} style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 24px', borderRadius: 99, background: '#fff', font: `700 24px ${INTER}`, color: TT.ink, opacity: clamp01(q * 2), transform: `translateY(${(1 - q) * 30}px)`, boxShadow: '0 16px 34px -16px rgba(8,28,36,.5)'}}><i style={{width: 12, height: 12, borderRadius: 6, background: c, display: 'block'}} />{p}</span>; })}</div>;
};
/** Zoom-through exit over the last `len` seconds of a scene. */
export const useExit = (dur: number, len = 0.45) => { const {io} = useT(); return io(dur - len, dur, 0, 1, Easing.in(Easing.exp)); };

/* ================= 1 · OPENER ================= */
export const TOpener: React.FC = () => {
  const {io, sp} = useT(); const ex = useExit(4.4);
  const lc = sp(0.2, {damping: 14, stiffness: 150});
  return (
    <AbsoluteFill style={{transform: `scale(${lerp(1, 1.5, ex)})`, filter: ex > 0.02 ? `blur(${ex * 14}px)` : undefined}}>
      <Plate src="town2.png" dur={4.4} s0={1.12} s1={1.02} origin="70% 60%" />
      <AbsoluteFill style={{background: 'linear-gradient(115deg,rgba(234,244,255,.94) 0%,rgba(234,244,255,.62) 34%,rgba(234,244,255,0) 56%)'}} />
      <div style={{position: 'absolute', left: 110, top: 86, overflow: 'hidden', padding: 4}}><Img src={staticFile('codech-logo-crop.png')} style={{height: 78, transform: `translateY(${(1 - lc) * 120}%)`}} /></div>
      <div style={{position: 'absolute', left: 112, top: 222, font: `700 20px ${MONO}`, letterSpacing: '.3em', color: TT.ink, opacity: io(0.7, 1.0)}}>A CODECH CASE STUDY</div>
      <div style={{position: 'absolute', left: 110, top: 268}}><THead lines={[[{hi: 'AI'}, 'school-'], ['matching'], ['assistant']]} start={0.9} size={116} color={TT.ink} /></div>
      <div style={{position: 'absolute', left: 112, top: 668, opacity: io(2.0, 2.4)}}><ClientChip label="Proposed for" /></div>
      <div style={{position: 'absolute', left: 112, top: 770}}><Pillars at={2.5} /></div>
    </AbsoluteFill>
  );
};

/* ================= 2–5 · THE CHALLENGE ================= */
export const TSprawl: React.FC = () => {
  const {t, io} = useT(); const n = Math.round(15074 * io(0.2, 1.8, 0, 1, Easing.out(Easing.cubic)));
  return (
    <AbsoluteFill>
      <Plate src="sprawl.png" dur={3.2} s0={1.35} s1={1.0} origin="50% 60%" />
      <Shade side="top" color="234,244,255" to={0.9} />
      <div style={{position: 'absolute', left: 110, top: 90, font: `800 250px/0.9 ${MANROPE}`, letterSpacing: '-0.06em', color: TT.ink, fontVariantNumeric: 'tabular-nums'}}>{n.toLocaleString('en-US')}</div>
      <div style={{position: 'absolute', left: 118, top: 340}}><THead lines={[['schools', 'to', 'choose', 'from.']]} start={0.5} size={64} color={TT.ink} /></div>
      <div style={{position: 'absolute', left: 120, top: 430, font: `600 22px ${MONO}`, letterSpacing: '.2em', color: TT.ink, opacity: io(1.2, 1.6) * (t > 0 ? 1 : 0)}}>ONE DIRECTORY · KIDDY123.COM</div>
    </AbsoluteFill>
  );
};
export const TForm: React.FC = () => {
  const {t} = useT();
  const rows = Array.from({length: 18}, (_, i) => i);
  return (
    <AbsoluteFill>
      <Plate src="sprawl.png" dur={3.2} s0={1.1} s1={1.16} blur={9} dim={0.35} />
      <Shade side="left" to={0.85} />
      <div style={{position: 'absolute', left: 110, top: 330}}><THead lines={[['One', 'filter'], [{hi: 'form.'}]]} size={120} /></div>
      <div style={{position: 'absolute', left: 116, top: 600}}><Sub>Then long result pages, school by school.</Sub></div>
      <In at={0.25} rot={-4} style={{left: 980, top: 90}}>
        <div style={{width: 760, transform: 'rotate(-3deg)', background: '#F3F3F3', borderRadius: 14, padding: 26, boxShadow: SHADOW, fontFamily: 'Arial, sans-serif'}}>
          <div style={{font: '700 26px Arial', color: '#333'}}>Search Directory</div>
          {['Select Category', 'Select State', 'Select City', 'Child Age'].map((l) => <div key={l} style={{marginTop: 12, height: 44, background: '#fff', border: '1px solid #bbb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', font: '400 20px Arial', color: '#666'}}>{l}<span>▾</span></div>)}
          <div style={{marginTop: 16, height: 48, background: '#C0392B', color: '#fff', display: 'grid', placeItems: 'center', font: '700 20px Arial', letterSpacing: '.1em'}}>SEARCH</div>
          <div style={{height: 330, overflow: 'hidden', marginTop: 18, position: 'relative'}}>
            <div style={{transform: `translateY(${-t * 260}px)`}}>{rows.map((i) => <div key={i} style={{display: 'flex', gap: 14, padding: '10px 0', borderBottom: '1px solid #ddd'}}>
              <div style={{width: 90, height: 60, background: '#ccc'}} /><div style={{flex: 1}}><div style={{height: 14, width: `${60 + (i * 13) % 30}%`, background: '#999'}} /><div style={{height: 10, width: '85%', background: '#ccc', marginTop: 10}} /><div style={{height: 10, width: '70%', background: '#ccc', marginTop: 8}} /></div></div>)}</div>
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 80, background: 'linear-gradient(rgba(243,243,243,0),#F3F3F3)'}} />
          </div>
        </div>
      </In>
    </AbsoluteFill>
  );
};
export const TSlow: React.FC = () => {
  const {t, io} = useT(); const g = io(0.4, 1.6, 0, 19, Easing.out(Easing.cubic)); const bar = Math.min(0.35, t * 0.12);
  const R = 120, Cc = 2 * Math.PI * R;
  return (
    <AbsoluteFill>
      <Plate src="sprawl.png" dur={3.0} s0={1.2} s1={1.26} blur={9} dim={0.5} origin="30% 50%" />
      <Shade side="left" to={0.85} />
      <div style={{position: 'absolute', left: 110, top: 330}}><THead lines={[['Slow', 'on'], [{hi: 'phones.'}]]} size={120} /></div>
      <div style={{position: 'absolute', left: 116, top: 600}}><Sub>Listing pages: 20.3 s to load on mobile.</Sub></div>
      <In at={0.15} style={{left: 1000, top: 70}}>
        <div style={{transform: 'rotateY(-18deg)', filter: 'drop-shadow(0 70px 80px rgba(0,0,0,.7))'}}><Phone scale={1.12} bg="#fff">
          <div style={{height: 46, background: '#fff'}} />
          <div style={{height: 6, background: '#eee'}}><div style={{height: 6, width: `${bar * 100}%`, background: '#C0392B'}} /></div>
          <div style={{padding: 20}}>{[0, 1, 2, 3].map((i) => <div key={i} style={{marginTop: 18}}><div style={{height: 150, borderRadius: 10, background: `linear-gradient(90deg,#eee ${((t * 60 + i * 20) % 100) - 20}%,#f7f7f7,#eee ${((t * 60 + i * 20) % 100) + 20}%)`}} /><div style={{height: 14, width: '70%', background: '#eee', marginTop: 12, borderRadius: 4}} /></div>)}</div>
        </Phone></div>
      </In>
      <In at={0.5} style={{left: 1480, top: 560}}>
        <div style={{width: 300, height: 300, borderRadius: 28, background: '#fff', boxShadow: SHADOW, display: 'grid', placeItems: 'center', position: 'relative'}}>
          <svg width={280} height={280} style={{position: 'absolute', left: 10, top: 10}}><circle cx={140} cy={140} r={R} fill="none" stroke="#FDE2E1" strokeWidth={18} />
            <circle cx={140} cy={140} r={R} fill="none" stroke="#E5484D" strokeWidth={18} strokeLinecap="round" strokeDasharray={`${Cc * g / 100} ${Cc}`} transform="rotate(-90 140 140)" /></svg>
          <div style={{textAlign: 'center'}}><div style={{font: `800 92px/1 ${MANROPE}`, color: '#E5484D'}}>{Math.round(g)}</div><div style={{font: `600 18px ${MONO}`, color: '#6B7280', marginTop: 6}}>/ 100 · MOBILE</div></div>
        </div>
      </In>
    </AbsoluteFill>
  );
};
export const TDemand: React.FC = () => {
  const {t} = useT();
  const qs: [string, number, number][] = [['Montessori in Cheras?', 1150, 0.1], ['Is there a school bus?', 1430, 0.45], ['Halal meals?', 1000, 0.8], ['Under RM800?', 1560, 1.1], ['华文幼儿园?', 1250, 1.35], ['Takes 3-year-olds?', 1450, 1.7]];
  return (
    <AbsoluteFill>
      <Plate src="night.png" dur={3.0} s0={1.06} s1={1.12} />
      <Shade side="left" color="4,14,22" to={0.85} />
      {qs.map(([q, x, a], i) => { const p = clamp01((t - a) / 1.6); return (
        <div key={i} style={{position: 'absolute', left: x, top: lerp(860, 260, p), transform: 'translateX(-50%)', opacity: p <= 0 ? 0 : Math.sin(p * Math.PI) * 1.1, filter: `blur(${Math.max(0, p - 0.6) * 12}px)`,
          background: 'rgba(255,255,255,.92)', borderRadius: 22, padding: '12px 20px', font: `600 24px ${UIF}`, color: TT.ink, whiteSpace: 'nowrap', boxShadow: '0 20px 40px -14px rgba(0,0,0,.6)'}}>{q}</div>); })}
      <div style={{position: 'absolute', left: 110, top: 330}}><THead lines={[['No', 'view', 'of'], [{hi: 'demand.'}]]} size={120} /></div>
      <div style={{position: 'absolute', left: 116, top: 600}}><Sub>Parents ask. Nobody counts.</Sub></div>
    </AbsoluteFill>
  );
};

/* ================= 6 · OUR SOLUTION reveal ================= */
export const TReveal: React.FC = () => {
  const {t, io, sp} = useT();
  const pull = io(0, 1.3, 0, 1, Easing.in(Easing.cubic));
  const PIN = {x: 1240, y: 580};
  const chips: [string, number, number][] = [['15,074 schools', 1500, 180], ['One filter form', 1700, 760], ['No view of demand', 900, 860]];
  const pulse = Math.max(0, 1 - Math.abs(t - 1.35) / 0.35);
  return (
    <AbsoluteFill>
      <Plate src="town2.png" dur={5} s0={1.0} s1={1.06} origin="70% 55%" />
      <AbsoluteFill style={{background: 'linear-gradient(115deg,rgba(234,244,255,.93) 0%,rgba(234,244,255,.6) 34%,rgba(234,244,255,0) 56%)', opacity: io(1.2, 1.7)}} />
      {chips.map(([c, x, y], i) => (
        <div key={i} style={{position: 'absolute', left: lerp(x, PIN.x, pull), top: lerp(y, PIN.y, pull), transform: `translate(-50%,-50%) scale(${lerp(1, 0.2, pull)})`, opacity: 1 - io(1.15, 1.35),
          padding: '14px 24px', borderRadius: 18, background: '#fff', font: `700 28px ${INTER}`, color: '#9CA3AF', textDecoration: 'line-through', whiteSpace: 'nowrap', boxShadow: '0 20px 40px -14px rgba(0,0,0,.5)'}}>{c}</div>))}
      <div style={{position: 'absolute', left: PIN.x - 90, top: PIN.y - 90, width: 180, height: 180, borderRadius: 90, background: 'radial-gradient(circle,rgba(255,201,60,.95) 0 18%,rgba(255,201,60,.35) 40%,rgba(255,201,60,0) 70%)', transform: `scale(${0.6 + pulse * 1.8 + io(1.3, 2.2, 0, 2.5)})`, opacity: 1 - io(1.8, 2.4)}} />
      <div style={{position: 'absolute', left: 112, top: 150, font: `700 20px ${MONO}`, letterSpacing: '.3em', color: TT.ink, opacity: io(1.5, 1.8)}}>OUR SOLUTION</div>
      {t > 1.4 && <div style={{position: 'absolute', left: 110, top: 196}}><THead lines={[[{hi: 'AI'}, 'school-'], ['matching'], ['assistant']]} start={1.5} size={112} color={TT.ink} /></div>}
      <div style={{position: 'absolute', left: 112, top: 590, opacity: io(2.4, 2.8)}}><ClientChip label="Built by Codech · for" /></div>
      <div style={{position: 'absolute', left: 112, top: 690}}><Pillars at={2.9} /></div>
      <Poi x={1060} y={545} n="Little Oak Montessori" f="RM750–950" rank={2} at={3.3} />
      <Poi x={1425} y={600} n="De JowiTop Preschool" f="RM800–1,200" rank={1} at={3.1} />
      <Poi x={1745} y={700} n="Apple King Main Centre" f="RM380–650" rank={3} at={3.5} />
    </AbsoluteFill>
  );
};

/* ================= 7–10 · MATCH ================= */
const Bubble: React.FC<{me?: boolean; children: React.ReactNode; size?: number; at: number}> = ({me, children, size = 19, at}) => {
  const {sp} = useT(); const p = sp(at, {damping: 15, stiffness: 190});
  if (p <= 0.001) return null;
  const b = <div style={{background: me ? K.o : '#fff', color: me ? '#fff' : K.ink, border: me ? 'none' : `1.5px solid ${K.line}`, borderRadius: 18, padding: '10px 15px', font: `${me ? 600 : 500} ${size}px/1.45 ${UIF}`, maxWidth: me ? '86%' : '100%'}}>{children}</div>;
  return <div style={{display: 'flex', gap: 8, alignItems: 'flex-end', alignSelf: me ? 'flex-end' : 'stretch', opacity: clamp01(p * 2), transform: `translateY(${(1 - p) * 24}px)`, justifyContent: me ? 'flex-end' : 'flex-start'}}>{!me && <Avatar s={32} />}{b}</div>;
};
const KCard: React.FC<{img: string; name: string; meta: string; fee: string; why: string; spon?: boolean; at: number; hit?: boolean}> = ({img, name, meta, fee, why, spon, at, hit}) => {
  const {sp} = useT(); const p = sp(at, {damping: 14, stiffness: 160});
  if (p <= 0.001) return null;
  return (
    <div style={{display: 'grid', gridTemplateColumns: '104px 1fr', gap: '8px 14px', background: '#fff', border: `1.5px solid ${K.line}`, borderRadius: 18, padding: 12, marginLeft: 40, opacity: clamp01(p * 2), transform: `translateY(${(1 - p) * 40}px) scale(${lerp(0.94, 1, p)})`}}>
      <div style={{position: 'relative', height: 82, borderRadius: 12, overflow: 'hidden'}}><Img src={staticFile(`schools/${img}.webp`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        {spon && <span style={{position: 'absolute', left: 6, bottom: 6, font: `800 11px ${UIF}`, background: 'rgba(28,25,23,.82)', color: '#fff', borderRadius: 5, padding: '2px 6px'}}>Sponsored</span>}</div>
      <div><div style={{font: `800 19px ${UIF}`, color: K.ink}}>{name}</div><div style={{font: `500 15px ${UIF}`, color: K.mut, marginTop: 3}}>{meta}</div>
        <span style={{display: 'inline-block', marginTop: 7, font: `700 18px ${MONO}`, color: K.ot, borderRadius: 6, padding: '1px 6px', marginLeft: -6, background: hit ? K.tint : 'transparent', boxShadow: hit ? `0 0 0 2.5px ${TT.sun}` : 'none'}}>{fee}</span></div>
      <div style={{gridColumn: '1/-1', background: K.tint, borderRadius: 11, padding: '8px 12px', font: `500 15px/1.35 ${UIF}`, color: K.ink}}><div style={{font: `800 11px ${UIF}`, letterSpacing: '.12em', color: K.ot, marginBottom: 2}}>WHY IT FITS</div>{why}</div>
    </div>
  );
};
const KHeader: React.FC<{lang?: 'EN' | '中文'; ctx?: string; compact?: boolean}> = ({lang = 'EN', ctx, compact}) => (
  <>
    <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', background: `linear-gradient(135deg,${K.o2},${K.o})`, color: '#fff'}}>
      <Avatar s={46} /><div><div style={{font: `800 22px ${UIF}`}}>KiddyMatch AI</div><div style={{font: `500 15px ${UIF}`, opacity: 0.92}}>Kiddy123 school assistant</div></div>
      <div style={{marginLeft: 'auto', display: 'flex', gap: 2, background: 'rgba(255,255,255,.22)', borderRadius: 99, padding: 3}}>{(compact ? ['EN', '中文'] : ['EN', 'BM', '中文']).map((l) => <span key={l} style={{font: `700 14px ${UIF}`, padding: '4px 10px', whiteSpace: 'nowrap', borderRadius: 99, background: l === lang ? '#fff' : 'transparent', color: l === lang ? K.ot : '#fff'}}>{l}</span>)}</div>
    </div>
    {ctx && <div style={{background: K.tealT, color: K.teal, font: `700 15px ${UIF}`, padding: '8px 18px'}}>📍 {ctx}</div>}
  </>
);
const Composer: React.FC<{text: string; ph: string}> = ({text, ph}) => (
  <div style={{display: 'flex', gap: 10, padding: '12px 14px', borderTop: '1px solid #ECEAE7', background: '#fff'}}>
    <div style={{flex: 1, height: 46, borderRadius: 12, border: `1.5px solid ${text ? K.o2 : '#E2DFDC'}`, font: `500 17px ${UIF}`, color: text ? K.ink : '#A8A29E', display: 'flex', alignItems: 'center', padding: '0 12px', whiteSpace: 'nowrap', overflow: 'hidden'}}>{text || ph}</div>
    <div style={{width: 46, height: 46, borderRadius: 12, background: text ? K.o : '#FDB374'}} />
  </div>
);
export const TFind: React.FC = () => {
  const {t, io} = useT();
  const q = 'Montessori kindy in Cheras, under RM1,200, needs bus';
  const sent = t > 1.55;
  return (
    <AbsoluteFill>
      <Plate src="town2.png" dur={5} s0={1.4} s1={1.48} blur={6} origin="72% 62%" />
      <Shade side="left" to={0.82} />
      <div style={{position: 'absolute', left: 110, top: 330}}><THead lines={[['Describe', 'it.'], ['Get', 'a', {hi: 'shortlist.'}]]} size={108} /></div>
      <div style={{position: 'absolute', left: 116, top: 600}}><Sub at={0.9}>Real schools. Exact fees. From the listings.</Sub></div>
      <In at={0.05} style={{left: 1070, top: 120}}>
        <Glass style={{width: 600, background: '#FAFAF9', transform: 'rotateY(-10deg)'}}>
          <KHeader />
          <div style={{height: 600, padding: 16, display: 'flex', flexDirection: 'column', gap: 12}}>
            <Bubble at={1.6} me>{q}</Bubble>
            {t > 1.9 && t < 2.5 && <div style={{font: `500 16px ${UIF}`, color: K.mut, paddingLeft: 44}}>Searching 15,074 Kiddy123 listings…</div>}
            {t > 2.4 && <div style={{display: 'flex', gap: 6, paddingLeft: 40, opacity: io(2.4, 2.6)}}>{['📍 Cheras', '≤ RM1,200', '🚌 Bus'].map((c) => <span key={c} style={{font: `700 15px ${UIF}`, background: K.ink, color: '#fff', borderRadius: 8, padding: '4px 10px'}}>{c}</span>)}<span style={{font: `700 15px ${UIF}`, background: K.tealT, color: K.teal, borderRadius: 99, padding: '4px 10px', boxShadow: `inset 0 0 0 1.5px ${K.teal}`}}>Montessori</span></div>}
            <Bubble at={2.75}><b>3 schools in Cheras</b> pass every need.</Bubble>
            <KCard at={3.05} img="dejowitop" name="De JowiTop Preschool" meta="Taman Cheras Perdana · Ages 3–6" fee="RM800–1,200/mo" why="Montessori-blend, trilingual incl. Mandarin, and a school bus." spon hit={t > 3.9} />
            <KCard at={3.4} img="littleoak" name="Little Oak Montessori" meta="Cheras · Ages 2–6" fee="RM750–950/mo" why="Pure Montessori with Mandarin immersion; bus on your route." hit={t > 3.9} />
          </div>
          <Composer text={sent ? '' : typed(q, t, 0.3, 1.4)} ph="Ask about schools, fees, locations…" />
        </Glass>
      </In>
    </AbsoluteFill>
  );
};
const ChatPhone: React.FC<{children: React.ReactNode; lang: 'EN' | '中文'; ctx?: string; text?: string; ph: string}> = ({children, lang, ctx, text = '', ph}) => (
  <Phone scale={1.16} bg="#FAFAF9">
    <div style={{height: 44, background: K.o2}} />
    <div style={{transform: 'scale(.86)', transformOrigin: '0 0', width: 365 / 0.86, height: 140}}><KHeader lang={lang} ctx={ctx} compact /></div>
    <div style={{flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 10}}>
      <div style={{alignSelf: 'center', font: `600 13px ${UIF}`, color: K.mut, background: '#EFEDEA', borderRadius: 99, padding: '3px 12px'}}>Today</div>
      {children}
    </div>
    <div style={{transform: 'scale(.86)', transformOrigin: '0 100%', width: 365 / 0.86, marginBottom: 14}}><Composer text={text} ph={ph} /></div>
  </Phone>
);
export const TContext: React.FC = () => {
  const {t} = useT();
  const lang = t > 0.7 ? '中文' : 'EN';
  return (
    <AbsoluteFill>
      <Plate src="school.png" dur={4.2} s0={1.04} s1={1.12} origin="70% 50%" />
      <Shade side="left" to={0.8} />
      <div style={{position: 'absolute', left: 110, top: 300}}><THead lines={[['Asked', 'in', {hi: '中文.'}], ['Answered', 'from'], ['the', 'listing.']]} size={96} /></div>
      <In at={0.05} style={{left: 820, top: 50}}>
        <div style={{transform: 'rotateY(-16deg) rotateZ(1deg)', filter: 'drop-shadow(0 70px 80px rgba(0,0,0,.6))'}}>
          <ChatPhone lang={lang} ctx="You're viewing Apple King Main Centre" ph={lang === 'EN' ? 'Ask about this school…' : '询问这所学校…'} text={t > 1.0 && t < 1.7 ? typed('这里学费多少？有校车吗？', t, 1.0, 1.6) : ''}>
            <Bubble at={1.75} me size={17}>这里学费多少？有校车吗？</Bubble>
            <Bubble at={2.4} size={16}><b>Apple King Main Centre</b>：<br /><span style={{font: `700 15px ${MONO}`, color: K.ot, background: K.tint, borderRadius: 5, padding: '0 4px', boxShadow: t > 2.9 ? `0 0 0 2px ${TT.sun}` : 'none'}}>学费：每月 RM380–RM650</span><br /><b>提供校车</b>，路线和收费请联系学校。</Bubble>
          </ChatPhone>
        </div>
      </In>
      <In at={2.9} style={{left: 1450, top: 640}}>
        <div style={{background: '#fff', borderRadius: 18, padding: '14px 20px', boxShadow: SHADOW, font: `700 22px ${INTER}`, color: TT.ink}}><div style={{font: `600 14px ${MONO}`, letterSpacing: '.16em', color: TT.sunDeep}}>FROM THE LISTING</div>Fees RM380–650 · School bus ✓</div>
      </In>
    </AbsoluteFill>
  );
};
export const TGuess: React.FC = () => {
  const {sp} = useT();
  const b = sp(1.7, {damping: 13, stiffness: 160});
  return (
    <AbsoluteFill>
      <Plate src="school.png" dur={3.2} s0={1.25} s1={1.3} blur={10} dim={0.35} origin="70% 50%" />
      <div style={{position: 'absolute', left: 110, top: 120}}><THead lines={[['Never', 'a'], [{hi: 'guess.'}]]} size={128} /></div>
      <In at={0.4} style={{left: 760, top: 420}}><div style={{background: K.o, color: '#fff', borderRadius: 26, padding: '20px 28px', font: `600 36px ${UIF}`, boxShadow: SHADOW}}>Do they have CCTV in classrooms?</div></In>
      <In at={1.2} style={{left: 360, top: 580}}>
        <div style={{display: 'flex', gap: 16, alignItems: 'flex-end'}}><Avatar s={62} />
          <div style={{background: '#fff', borderRadius: 26, padding: '22px 28px', font: `500 32px/1.4 ${UIF}`, color: K.ink, boxShadow: SHADOW, maxWidth: 1000}}>
            <b>That isn't in this school's listing,</b> and I never guess facts. Want me to ask them in an enquiry?
            <div style={{marginTop: 16}}><span style={{display: 'inline-block', background: K.o, color: '#fff', borderRadius: 99, padding: '10px 24px', font: `700 26px ${UIF}`, transform: `scale(${lerp(0.7, 1, b)})`, opacity: clamp01(b * 2)}}>Send an enquiry</span></div>
          </div></div>
      </In>
    </AbsoluteFill>
  );
};
export const TCompare: React.FC = () => {
  const {t, io} = useT();
  const hit = t > 1.6 ? TT.sun : 'transparent';
  return (
    <AbsoluteFill>
      <Plate src="top.png" dur={4.2} s0={1.1} s1={1.18} />
      <Shade side="left" to={0.8} />
      <div style={{position: 'absolute', left: 110, top: 300}}><THead lines={[['Side', 'by', 'side.'], ['Fact', 'by', {hi: 'fact.'}]]} size={104} /></div>
      <In at={0.1} style={{left: 960, top: 120}}><div style={{transform: 'rotateY(-12deg) rotateZ(-1deg)', borderRadius: 26, boxShadow: SHADOW}}><Compare hit={hit} /></div></In>
      <In at={2.2} style={{left: 1010, top: 830}}>
        <div style={{background: TT.ink, color: '#fff', borderRadius: 20, padding: '16px 22px', font: `500 22px/1.45 ${INTER}`, boxShadow: SHADOW, width: 700, opacity: io(2.2, 2.5)}}>
          <b style={{color: TT.sun}}>Honest pick, from the listings only:</b> tightest budget → Apple King · daily Mandarin → De JowiTop · smallest classes → Little Oak</div>
      </In>
    </AbsoluteFill>
  );
};

/* ================= 11–13 · BROWSE ================= */
export const THome: React.FC = () => {
  const {t} = useT();
  return (
    <AbsoluteFill>
      <Plate src="town2.png" dur={4.2} s0={1.18} s1={1.1} x0={-60} x1={0} origin="60% 60%" />
      <Shade side="left" to={0.85} />
      <div style={{position: 'absolute', left: 110, top: 330}}><THead lines={[['A', 'cleaner'], [{hi: 'Kiddy123.'}]]} size={116} /></div>
      <div style={{position: 'absolute', left: 116, top: 600}}><Sub>16 page types, rebuilt mobile-first.</Sub></div>
      <In at={0.1} style={{left: 900, top: 120}}>
        <div style={{width: 940, borderRadius: 18, overflow: 'hidden', boxShadow: SHADOW, background: '#F7F7F5', transform: 'rotateY(-10deg)'}}>
          <div style={{height: 34, background: '#E7E5E4', display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px'}}>{[0, 1, 2].map((i) => <i key={i} style={{width: 11, height: 11, borderRadius: 6, background: '#C9C5C0', display: 'block'}} />)}<span style={{marginLeft: 16, font: `500 14px ${INTER}`, color: '#78716C'}}>kiddy123.com</span></div>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, padding: '14px 22px', background: '#fff'}}><Img src={staticFile('kiddy123-logo.png')} style={{height: 40}} />{['Home', 'Directory', 'Articles', 'Events', 'Jobs'].map((n, i) => <span key={n} style={{font: `700 15px ${UIF}`, color: i ? '#57534E' : K.ot}}>{n}</span>)}<span style={{marginLeft: 'auto', background: K.o, color: '#fff', borderRadius: 99, padding: '6px 16px', font: `700 15px ${UIF}`}}>Sign in</span></div>
          <div style={{margin: 16, borderRadius: 20, padding: '28px 30px', background: 'linear-gradient(140deg,#C2410C,#EA580C 45%,#F5821F)', color: '#fff', textAlign: 'center'}}>
            <div style={{font: `800 40px/1.08 ${UIF}`, letterSpacing: '-0.02em'}}>Ask KiddyMatch AI<br />to find the right preschool</div>
            <div style={{margin: '18px auto 0', width: 560, height: 52, borderRadius: 14, background: '#fff', color: K.ink, font: `500 18px ${UIF}`, display: 'flex', alignItems: 'center', padding: '0 16px', textAlign: 'left'}}>{typed('Which tadika near Mont Kiara takes 3 year olds?', t, 0.8, 2.2)}<span style={{opacity: Math.round(t * 2) % 2}}>|</span></div>
            <div style={{display: 'flex', gap: 8, justifyContent: 'center', marginTop: 14}}>{['Montessori in Cheras', 'Tadika halal di Cheras', '蕉赖华文幼儿园'].map((c) => <span key={c} style={{font: `600 14px ${UIF}`, border: '1px solid rgba(255,255,255,.5)', borderRadius: 99, padding: '5px 12px'}}>{c}</span>)}</div>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, padding: '0 16px 18px'}}>{[['littleoak', 'Little Oak Montessori', 'RM750–950'], ['dejowitop', 'De JowiTop Preschool', 'RM800–1,200'], ['appleking', 'Apple King Main Centre', 'RM380–650']].map(([im, n, f]) => <div key={im} style={{background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #E7E5E4'}}><Img src={staticFile(`schools/${im}.webp`)} style={{width: '100%', height: 110, objectFit: 'cover'}} /><div style={{padding: 10}}><div style={{font: `800 15px ${UIF}`, color: K.ink}}>{n}</div><div style={{font: `700 14px ${MONO}`, color: K.ot, marginTop: 4}}>{f}</div></div></div>)}</div>
        </div>
      </In>
    </AbsoluteFill>
  );
};
export const TParent: React.FC = () => {
  const {sp} = useT();
  const c = sp(1.4, {damping: 12, stiffness: 200});
  return (
    <AbsoluteFill>
      <Plate src="town2.png" dur={3.6} s0={1.5} s1={1.56} blur={7} origin="40% 70%" />
      <Shade side="left" to={0.85} />
      <div style={{position: 'absolute', left: 110, top: 330}}><THead lines={[['Pick', 'up', 'where'], ['you', {hi: 'left', }, {hi: 'off.'}]]} size={100} /></div>
      <div style={{position: 'absolute', left: 116, top: 580}}><Sub>Parent accounts: saved schools, compare, chat history.</Sub></div>
      <In at={0.1} style={{left: 960, top: 230}}>
        <Glass style={{width: 820, padding: 26, background: '#F7F7F5'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10}}><span style={{width: 36, height: 36, borderRadius: 18, background: K.o, color: '#fff', display: 'grid', placeItems: 'center', font: `800 17px ${UIF}`}}>M</span><b style={{font: `800 26px ${UIF}`, color: K.ink}}>Chat History</b></div>
          {[['Montessori kindergarten near Kajang for my 4-year-old', '24 Sep 2026 · Apple King Main Centre, Tadika Hati Ria', true], ['Chinese-medium kindergarten near Cheras', '19 Sep 2026 · Little Sun', false]].map(([a, b, on], i) => (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, background: '#fff', borderRadius: 16, padding: '16px 18px', marginTop: 14, border: '1.5px solid #E7E5E4', opacity: on ? 1 : 0.6}}>
              <div style={{flex: 1}}><div style={{font: `800 19px ${UIF}`, color: K.ink}}>{a as string}</div><div style={{font: `500 15px ${UIF}`, color: K.mut, marginTop: 3}}>{b as string}</div></div>
              <span style={{background: on ? K.o : '#fff', color: on ? '#fff' : K.ink, border: on ? 'none' : '1.5px solid #D6D3D1', borderRadius: 99, padding: '9px 20px', font: `700 17px ${UIF}`, transform: on ? `scale(${1 - Math.sin(clamp01(c) * Math.PI) * 0.08})` : undefined}}>Continue</span></div>))}
        </Glass>
      </In>
      <In at={1.7} style={{left: 1300, top: 640}}>
        <Glass style={{width: 520, padding: 16, background: '#FAFAF9'}}><Bubble at={1.8} size={18}>Welcome back, Mei! You were looking at <b>Apple King</b> and <b>Tadika Hati Ria</b> for your 4-year-old.</Bubble></Glass>
      </In>
    </AbsoluteFill>
  );
};
export const TSchool: React.FC = () => {
  const {io, sp} = useT();
  const rows: [string, string, number][] = [['Appeared in matches', '352', 100], ['Recommended', '176', 50], ['In the top 3', '71', 20], ['Enquired', '9', 3]];
  return (
    <AbsoluteFill>
      <Plate src="school.png" dur={3.6} s0={1.08} s1={1.14} blur={5} dim={0.15} origin="75% 50%" />
      <Shade side="left" to={0.85} />
      <div style={{position: 'absolute', left: 110, top: 330}}><THead lines={[['How', 'parents'], [{hi: 'found'}, {hi: 'them.'}]]} size={110} /></div>
      <div style={{position: 'absolute', left: 116, top: 600}}><Sub>Every school gets an AI Analysis Report.</Sub></div>
      <In at={0.1} style={{left: 980, top: 200}}>
        <Glass style={{width: 820, padding: 30}}>
          <div style={{font: `700 14px ${MONO}`, letterSpacing: '.18em', color: K.ot}}>SCHOOL PORTAL · SAMPLE DATA</div>
          <div style={{font: `800 32px ${UIF}`, color: K.ink, marginTop: 6}}>AI Analysis Report</div>
          <div style={{font: `500 17px ${UIF}`, color: K.mut}}>How KiddyMatch AI saw your centre in September</div>
          {rows.map(([k, n, w], i) => { const p = io(0.6 + i * 0.25, 1.3 + i * 0.25); return (
            <div key={k} style={{display: 'grid', gridTemplateColumns: '220px 1fr 60px', gap: 16, alignItems: 'center', marginTop: 20}}>
              <span style={{font: `700 19px ${UIF}`, color: K.ink}}>{k}</span>
              <i style={{height: 16, borderRadius: 8, background: '#F1EFEB', display: 'block', overflow: 'hidden'}}><u style={{display: 'block', height: '100%', width: `${w * p}%`, background: K.o, borderRadius: 8}} /></i>
              <b style={{font: `700 22px ${MONO}`, textAlign: 'right', color: K.ink, opacity: p}}>{n}</b></div>); })}
          <div style={{marginTop: 20, font: `500 16px ${UIF}`, color: K.mut, opacity: sp(2.2) }}>Rows under 5 conversations are hidden from the school.</div>
        </Glass>
      </In>
    </AbsoluteFill>
  );
};

/* ================= 14–16 · INSIGHT ================= */
export const TIntent: React.FC = () => {
  const {io} = useT();
  const areas: [string, string, number, number, number][] = [['Cheras', '2,140', 1250, 640, 92], ['Puchong', '1,556', 1520, 760, 67], ['Subang', '1,270', 1050, 820, 55], ['Ampang', '905', 1700, 560, 39]];
  return (
    <AbsoluteFill>
      <Plate src="night.png" dur={4.2} s0={1.04} s1={1.1} />
      <Shade side="left" color="4,14,22" to={0.85} />
      {areas.map(([n, v, x, y, h], i) => { const p = io(0.4 + i * 0.2, 1.4 + i * 0.2, 0, 1, Easing.out(Easing.cubic)); return (
        <div key={n} style={{position: 'absolute', left: x, top: y, transform: 'translateX(-50%)'}}>
          <div style={{position: 'absolute', left: -8, bottom: 0, width: 16, height: h * 3.6 * p, background: 'linear-gradient(180deg,rgba(255,201,60,0),rgba(255,201,60,.95))', borderRadius: 8, boxShadow: '0 0 30px rgba(255,201,60,.8)'}} />
          <div style={{position: 'absolute', left: 0, bottom: h * 3.6 * p + 12, transform: 'translateX(-50%)', background: '#fff', borderRadius: 14, padding: '8px 14px', whiteSpace: 'nowrap', opacity: p, boxShadow: '0 16px 30px -10px rgba(0,0,0,.6)'}}>
            <div style={{font: `800 18px ${INTER}`, color: TT.ink}}>{n}</div><div style={{font: `700 18px ${MONO}`, color: TT.sunDeep}}>{v} searches</div></div>
        </div>); })}
      <div style={{position: 'absolute', left: 110, top: 300}}><THead lines={[['Every', 'question'], ['becomes', {hi: 'data.'}]]} size={104} /></div>
      <div style={{position: 'absolute', left: 116, top: 560}}><Sub>Intent analytics: areas, needs, budgets.</Sub></div>
      <div style={{position: 'absolute', left: 116, top: 1000, font: `600 15px ${MONO}`, letterSpacing: '.18em', color: 'rgba(255,255,255,.55)'}}>ADMIN DASHBOARD · SAMPLE DATA</div>
    </AbsoluteFill>
  );
};
export const TLost: React.FC = () => {
  const {t} = useT();
  return (
    <AbsoluteFill>
      <Plate src="office.png" dur={3.6} s0={1.06} s1={1.12} origin="30% 50%" />
      <Shade side="left" to={0.85} />
      <div style={{position: 'absolute', left: 110, top: 300}}><THead lines={[['Why', 'a', 'school'], [{hi: 'lost'}, {hi: 'matches.'}]]} size={104} /></div>
      <div style={{position: 'absolute', left: 116, top: 560}}><Sub>A sales call backed by real demand.</Sub></div>
      <In at={0.1} style={{left: 960, top: 170}}><div style={{transform: 'rotateY(-12deg)', borderRadius: 26, boxShadow: SHADOW}}><Lost hit={t > 1.5 ? '#16A34A' : 'transparent'} /></div></In>
    </AbsoluteFill>
  );
};
export const TSponsor: React.FC = () => {
  const {io, sp} = useT();
  const rules = ['Only schools that meet every need', 'Always a visible Sponsored label', 'Never changes a fact or a verdict', 'At most 2 per result set'];
  const g = sp(2.5, {damping: 12, stiffness: 180});
  return (
    <AbsoluteFill>
      <Plate src="office.png" dur={3.6} s0={1.3} s1={1.36} blur={8} dim={0.25} origin="70% 50%" />
      <Shade side="left" to={0.85} />
      <div style={{position: 'absolute', left: 110, top: 300}}><THead lines={[['Sponsored.'], ['Always', {hi: 'labelled.'}]]} size={110} /></div>
      <div style={{position: 'absolute', left: 116, top: 560}}><Sub>AI placement Kiddy123 can sell, fairly.</Sub></div>
      <In at={0.1} style={{left: 980, top: 150}}>
        <Glass style={{width: 760, padding: 28}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, font: `800 26px ${UIF}`, color: K.ink}}><span style={{color: '#059669'}}>✓</span>Fairness rules, enforced in code</div>
          {rules.map((r, i) => { const p = io(0.5 + i * 0.25, 0.8 + i * 0.25); return <div key={r} style={{display: 'flex', gap: 12, alignItems: 'center', marginTop: 16, font: `600 21px ${UIF}`, color: K.ink, opacity: 0.25 + p * 0.75}}><span style={{width: 26, height: 26, borderRadius: 13, background: p > 0.5 ? '#059669' : '#E5E7EB', color: '#fff', display: 'grid', placeItems: 'center', font: `800 15px ${UIF}`}}>✓</span>{r}</div>; })}
          <div style={{marginTop: 24, display: 'flex', gap: 14, alignItems: 'center', background: '#FEF2F2', border: '1.5px solid #FCA5A5', borderRadius: 14, padding: '14px 18px', transform: `scale(${lerp(0.85, 1, g)})`, opacity: clamp01(g * 2)}}>
            <span style={{font: `800 26px ${UIF}`, color: '#DC2626'}}>⦸</span><div><div style={{font: `800 20px ${UIF}`, color: '#991B1B'}}>Cheras is full: 3 of 3 slots booked.</div><div style={{font: `500 17px ${UIF}`, color: '#B91C1C'}}>Placements can't be oversold.</div></div></div>
        </Glass>
      </In>
    </AbsoluteFill>
  );
};

/* ================= 17 · HOW IT WORKS ================= */
export const THow: React.FC = () => {
  const {io} = useT();
  const nodes: [string, string, string][] = [['logos/wordpress.svg', 'WordPress', 'Kiddy123 listings, exported read-only'], ['logos/postgresql.svg', 'PostgreSQL + pgvector', 'Exact filters + search by meaning'], ['logos/claude.svg', 'Claude', 'Explains only what was retrieved'], ['logos/wordpress.svg', 'Enquiry', 'Written back into Kiddy123 leads']];
  return (
    <AbsoluteFill>
      <Plate src="top.png" dur={4.2} s0={1.2} s1={1.28} blur={4} dim={0.55} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 130, display: 'flex', justifyContent: 'center'}}><THead lines={[['Facts', 'from', 'the', {hi: 'database.'}]]} size={92} align="center" /></div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center'}}><Sub at={0.6}>Words from the AI. Never the other way round.</Sub></div>
      <div style={{position: 'absolute', left: 230, top: 560, width: 1460, height: 4, borderRadius: 2, background: 'rgba(255,255,255,.25)'}}><div style={{height: 4, width: `${io(0.8, 2.8) * 100}%`, background: TT.sun, boxShadow: '0 0 20px rgba(255,201,60,.9)'}} /></div>
      {nodes.map(([lg, n, d], i) => (
        <In key={i} at={0.7 + i * 0.5} style={{left: 130 + i * 430, top: 440}}>
          <div style={{width: 360, background: '#fff', borderRadius: 24, padding: 24, boxShadow: SHADOW, textAlign: 'center'}}>
            <div style={{width: 84, height: 84, margin: '0 auto', borderRadius: 20, background: '#F4F6F8', display: 'grid', placeItems: 'center'}}><Img src={staticFile(lg)} style={{width: 52, height: 52}} /></div>
            <div style={{font: `800 26px ${INTER}`, color: TT.ink, marginTop: 14}}>{n}</div><div style={{font: `500 19px/1.35 ${INTER}`, color: '#4B5563', marginTop: 6}}>{d}</div></div>
        </In>))}
    </AbsoluteFill>
  );
};

/* ================= 18 · HOW WE DELIVERED ================= */
export const TDelivered: React.FC = () => {
  const {io} = useT();
  const steps: [string, string][] = [['12 Jul', 'Clickable prototype'], ['14 Sep', 'Proposal finalised'], ['16 Sep', 'Live database inspected'], ['28 Sep', 'Kiddy123 confirmed']];
  return (
    <AbsoluteFill>
      <Plate src="town2.png" dur={4.6} s0={1.05} s1={1.12} />
      <AbsoluteFill style={{background: 'rgba(234,244,255,.82)'}} />
      <div style={{position: 'absolute', left: 110, top: 150}}><THead lines={[['Prototyped,'], ['then', {hi: 'approved.'}]]} size={110} color={TT.ink} /></div>
      <div style={{position: 'absolute', left: 116, top: 410}}><Sub color="rgba(11,37,48,.75)">Kiddy123 clicked through it before a line was built.</Sub></div>
      <div style={{position: 'absolute', left: 200, top: 700, width: 1520, height: 6, borderRadius: 3, background: 'rgba(11,37,48,.12)'}}><div style={{height: 6, width: `${io(0.6, 3.0) * 100}%`, background: TT.ink, borderRadius: 3}} /></div>
      {steps.map(([d, l], i) => (
        <In key={i} at={0.8 + i * 0.55} style={{left: 200 + i * (1520 / 3) - 120, top: 640}}>
          <div style={{width: 240, textAlign: 'center'}}>
            <div style={{width: 64, height: 64, margin: '0 auto', borderRadius: 32, background: TT.sun, border: `6px solid ${TT.ink}`, display: 'grid', placeItems: 'center', font: `800 24px ${INTER}`, color: TT.ink}}>{i + 1}</div>
            <div style={{font: `700 20px ${MONO}`, color: TT.sunDeep, marginTop: 18}}>{d}</div><div style={{font: `800 26px/1.2 ${INTER}`, color: TT.ink, marginTop: 6}}>{l}</div></div>
        </In>))}
    </AbsoluteFill>
  );
};

/* ================= 19 · THE RESULTS ================= */
export const TResults: React.FC = () => {
  const {t, io, sp} = useT();
  const stats: [number, string, string][] = [[15074, '', 'schools matched from'], [3, '', 'languages: EN · BM · 中文'], [22, '', 'pages redesigned'], [16, '', 'admin screens']];
  const phase2 = t > 3.0;
  const mb = lerp(9.66, 3.45, io(3.4, 4.6, 0, 1, Easing.inOut(Easing.cubic)));
  const big = sp(4.6, {damping: 11, stiffness: 160});
  return (
    <AbsoluteFill>
      <Plate src="night.png" dur={6} s0={1.1} s1={1.0} />
      <AbsoluteFill style={{background: 'rgba(4,14,22,.62)'}} />
      {!phase2 && <>
        <div style={{position: 'absolute', left: 110, top: 150}}><THead lines={[['The', {hi: 'results.'}]]} size={110} /></div>
        <div style={{position: 'absolute', left: 110, top: 430, display: 'grid', gridTemplateColumns: 'repeat(4,400px)', gap: 44}}>
          {stats.map(([v, s, l], i) => { const p = io(0.5 + i * 0.2, 1.7 + i * 0.2, 0, 1, Easing.out(Easing.cubic)); return (
            <div key={i} style={{borderTop: `4px solid ${TT.sun}`, paddingTop: 22, opacity: clamp01(p * 3)}}>
              <div style={{font: `800 96px/1 ${MANROPE}`, letterSpacing: '-0.05em', color: '#fff', fontVariantNumeric: 'tabular-nums'}}>{Math.round(v * p).toLocaleString('en-US')}{s}</div>
              <div style={{font: `500 26px ${INTER}`, color: 'rgba(255,255,255,.8)', marginTop: 10}}>{l}</div></div>); })}
        </div>
      </>}
      {phase2 && <>
        <div style={{position: 'absolute', left: 110, top: 160, font: `700 22px ${MONO}`, letterSpacing: '.24em', color: TT.sun}}>HOME PAGE WEIGHT · MOBILE</div>
        <div style={{position: 'absolute', left: 110, top: 230, width: 1200}}>
          {[['8 Sep (before)', 9.66, 'rgba(255,255,255,.35)'], ['8 Oct (after)', mb, TT.sun]].map(([l, v, c], i) => (
            <div key={i} style={{marginTop: i ? 34 : 0}}><div style={{font: `600 24px ${INTER}`, color: 'rgba(255,255,255,.85)'}}>{l as string}</div>
              <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 10}}><div style={{height: 54, width: (v as number) / 9.66 * 1000, background: c as string, borderRadius: 12}} /><b style={{font: `700 34px ${MONO}`, color: '#fff'}}>{(v as number).toFixed(2)} MB</b></div></div>))}
        </div>
        <div style={{position: 'absolute', right: 140, top: 520, textAlign: 'right', transform: `scale(${lerp(0.6, 1, big)})`, transformOrigin: '100% 50%', opacity: clamp01(big * 2)}}>
          <div style={{font: `800 260px/0.9 ${MANROPE}`, letterSpacing: '-0.06em', color: TT.sun, textShadow: '0 0 60px rgba(255,201,60,.4)'}}>−64%</div>
          <div style={{font: `600 30px ${INTER}`, color: '#fff'}}>lighter home page, after Codech's image work</div></div>
      </>}
    </AbsoluteFill>
  );
};

/* ================= 20 · END CARD ================= */
export const TEnd: React.FC = () => (
  <EndCard bg={<><Plate src="town2.png" dur={7.5} s0={1.15} s1={1.22} blur={10} /><AbsoluteFill style={{background: 'rgba(250,248,244,.86)'}} /></>} />
);
