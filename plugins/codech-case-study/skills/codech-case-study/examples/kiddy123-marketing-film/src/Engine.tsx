import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile} from 'remotion';
import {INTER, MANROPE, MONO, clamp01, lerp, useT} from './lib';
import {Plate, Sub, THead, TT} from './Town';
import {Bot, NUN, P, Panel, SCH, Scale, SchoolCard} from './Proto';

/* Kiddy123 film · storyboard v3 (14 Oct 2026): redesigned "Facts from the database" (how the engine answers)
   and "How we delivered" (Propose AI Solution → Clickable interactive prototype → AI Development → Production). */
export const MONOF = `${MONO}, ui-monospace, monospace`;
export const GLASS: React.CSSProperties = {background: 'linear-gradient(160deg,rgba(255,255,255,.13),rgba(255,255,255,.05))', border: '1px solid rgba(255,255,255,.22)', borderRadius: 28,
  boxShadow: '0 40px 80px -30px rgba(0,0,0,.8),inset 0 1px 0 rgba(255,255,255,.25)', backdropFilter: 'blur(18px)'};
export const Pop: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties; from?: number}> = ({at, children, style, from = 26}) => {
  const {sp} = useT(); const p = sp(at, {damping: 15, stiffness: 170});
  return <div style={{opacity: clamp01(p * 2), transform: `translateY(${(1 - p) * from}px) scale(${lerp(0.94, 1, p)})`, ...style}}>{children}</div>;
};
export const Eyebrow: React.FC<{n: string; children: React.ReactNode; dark?: boolean}> = ({n, children, dark}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 12, font: `700 16px ${MONOF}`, letterSpacing: '.2em', color: dark ? TT.sunDeep : TT.sun}}>
    <span style={{width: 34, height: 34, borderRadius: 10, background: TT.sun, color: TT.ink, display: 'grid', placeItems: 'center', font: `800 15px ${INTER}`, letterSpacing: 0}}>{n}</span>{children}</div>
);
export const Logo: React.FC<{src: string; s?: number}> = ({src, s = 44}) => (
  <span style={{width: s + 16, height: s + 16, borderRadius: 14, background: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0, boxShadow: '0 10px 24px -10px rgba(0,0,0,.5)'}}><Img src={staticFile(src)} style={{width: s, height: s}} /></span>
);
export const Tag: React.FC<{children: React.ReactNode; soft?: boolean; at: number}> = ({children, soft, at}) => (
  <Pop at={at} from={14} style={{display: 'inline-block'}}>
    <span style={{display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: soft ? 999 : 10, padding: '8px 14px', font: `700 19px ${INTER}`, whiteSpace: 'nowrap',
      background: soft ? 'rgba(18,149,163,.2)' : '#fff', color: soft ? '#9EE7EF' : TT.ink, boxShadow: soft ? 'inset 0 0 0 1.5px #3CC3D1' : '0 8px 18px -8px rgba(0,0,0,.5)'}}>{children}</span>
  </Pop>
);
export const Check: React.FC<{at: number; children: React.ReactNode}> = ({at, children}) => (
  <Pop at={at} from={12} style={{display: 'flex', alignItems: 'center', gap: 12, font: `600 20px/1.3 ${INTER}`, color: '#fff'}}>
    <span style={{width: 30, height: 30, borderRadius: 15, background: '#16A34A', display: 'grid', placeItems: 'center', flexShrink: 0}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></span>{children}
  </Pop>
);
/** A glowing connector between two panels with pulses travelling along it from `at`. */
const Flow: React.FC<{x1: number; x2: number; y: number; at: number}> = ({x1, x2, y, at}) => {
  const {t, io} = useT(); const d = io(at, at + 0.4);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0}} width={1920} height={1080}>
      <line x1={x1} y1={y} x2={lerp(x1, x2, d)} y2={y} stroke={TT.sun} strokeWidth={4} strokeLinecap="round" opacity={0.85} style={{filter: 'drop-shadow(0 0 8px rgba(255,201,60,.9))'}} />
      {t > at + 0.4 && [0, 0.5].map((o) => { const p = ((t - at - 0.4) * 0.9 + o) % 1; return <circle key={o} cx={lerp(x1, x2, p)} cy={y} r={7} fill="#fff" style={{filter: 'drop-shadow(0 0 10px #FFC93C)'}} />; })}
      <polygon points={`${x2 - 2},${y} ${x2 - 16},${y - 9} ${x2 - 16},${y + 9}`} fill={TT.sun} opacity={d} />
    </svg>
  );
};

/* ================= HOW IT WORKS · facts from the database ================= */
export const CHow: React.FC = () => {
  const {t, io} = useT();
  const n = Math.round(lerp(15074, 3, io(1.7, 2.9, 0, 1, Easing.inOut(Easing.cubic))));
  const rows = ['De JowiTop Preschool', 'Tadika Seri Aman', 'Little Oak Montessori', 'Taska Cahaya', 'Kinder Garden Cheras', 'Smart Kids Kajang', 'Tadika Pelangi', 'One more match'];
  const keep = [0, 2, 7];
  const PX = [100, 700, 1300], PW = 520, PY = 300, PH = 640;
  return (
    <AbsoluteFill style={{background: TT.night}}>
      <Plate src="top.png" dur={5} s0={1.25} s1={1.32} blur={6} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg,rgba(5,16,26,.86),rgba(5,16,26,.93))'}} />
      <div style={{position: 'absolute', left: 100, top: 92}}><THead lines={[['Facts', 'from', 'the', {hi: 'database.'}]]} size={88} /></div>
      <div style={{position: 'absolute', left: 104, top: 205}}><Sub at={0.5}>Words from the AI. Never the other way round.</Sub></div>
      {/* 01 the question */}
      <Pop at={0.25} from={60} style={{position: 'absolute', left: PX[0], top: PY, width: PW, height: PH, padding: 30, ...GLASS}}>
        <Eyebrow n="01">THE QUESTION</Eyebrow>
        <div style={{marginTop: 22, background: P.grad, color: '#fff', borderRadius: '22px 22px 6px 22px', padding: '16px 20px', font: `600 22px/1.45 ${NUN}`}}>Affordable Montessori kindy in Cheras with a school bus for my 4-year-old — we speak Mandarin at home</div>
        <Pop at={0.8} from={10} style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 22, font: `600 18px ${INTER}`, color: 'rgba(255,255,255,.75)'}}><Logo src="logos/claude.svg" s={26} />Claude Haiku 4.5 splits it into…</Pop>
        <div style={{marginTop: 18, font: `700 14px ${MONOF}`, letterSpacing: '.18em', color: 'rgba(255,255,255,.6)', opacity: io(1.0, 1.2)}}>HARD NEEDS · EXACT</div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10}}><Tag at={1.05}>📍 Cheras</Tag><Tag at={1.15}>Age 4</Tag><Tag at={1.25}>🚌 School bus</Tag><Tag at={1.35}>Affordable</Tag></div>
        <div style={{marginTop: 18, font: `700 14px ${MONOF}`, letterSpacing: '.18em', color: 'rgba(255,255,255,.6)', opacity: io(1.4, 1.6)}}>SOFT PREFERENCES · BY MEANING</div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10}}><Tag at={1.5} soft>Montessori</Tag><Tag at={1.6} soft>Mandarin at home</Tag></div>
      </Pop>
      <Flow x1={PX[0] + PW + 8} x2={PX[1] - 8} y={PY + PH / 2} at={1.5} />
      {/* 02 exact filter */}
      <Pop at={0.4} from={60} style={{position: 'absolute', left: PX[1], top: PY, width: PW, height: PH, padding: 30, ...GLASS}}>
        <Eyebrow n="02">EXACT FILTER</Eyebrow>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 22}}><Logo src="logos/postgresql.svg" s={34} /><div><div style={{font: `800 24px ${INTER}`, color: '#fff'}}>PostgreSQL + pgvector</div><div style={{font: `500 17px ${INTER}`, color: 'rgba(255,255,255,.65)'}}>Kiddy123 listings, synced read-only</div></div></div>
        <div style={{marginTop: 18, font: `800 96px/1 ${MANROPE}`, letterSpacing: '-0.05em', color: n <= 3 ? TT.sun : '#fff', fontVariantNumeric: 'tabular-nums'}}>{n.toLocaleString('en-US')}</div>
        <div style={{font: `600 18px ${INTER}`, color: 'rgba(255,255,255,.7)', marginTop: 4}}>{n <= 3 ? 'schools pass every hard need' : 'school listings'}</div>
        <div style={{marginTop: 18, display: 'flex', flexDirection: 'column', gap: 7}}>{rows.map((r, i) => { const k = keep.includes(i); const gone = io(1.8 + i * 0.1, 2.1 + i * 0.1);
          return <div key={r} style={{display: 'flex', alignItems: 'center', gap: 10, height: 28, padding: '0 12px', borderRadius: 8, background: k ? `rgba(255,201,60,${0.08 + gone * 0.14})` : 'rgba(255,255,255,.06)', boxShadow: k && gone > 0.5 ? `inset 0 0 0 1.5px ${TT.sun}` : 'none', opacity: k ? 1 : 1 - gone * 0.8}}>
            <span style={{width: 8, height: 8, borderRadius: 4, background: k ? TT.sun : 'rgba(255,255,255,.35)'}} /><span style={{font: `600 16px ${INTER}`, color: k ? '#fff' : 'rgba(255,255,255,.6)', textDecoration: !k && gone > 0.5 ? 'line-through' : 'none', filter: k ? 'none' : `blur(${gone * 2.5}px)`}}>{k && i === 7 ? '+ 1 more match' : r}</span></div>; })}</div>
        <Pop at={3.0} from={10} style={{marginTop: 14}}><span style={{display: 'inline-flex', gap: 8, alignItems: 'center', font: `700 17px ${INTER}`, color: '#9EE7EF'}}>↕ Re-ranked by meaning: Montessori, Mandarin</span></Pop>
      </Pop>
      <Flow x1={PX[1] + PW + 8} x2={PX[2] - 8} y={PY + PH / 2} at={3.0} />
      {/* 03 Claude explains */}
      <Pop at={0.55} from={60} style={{position: 'absolute', left: PX[2], top: PY, width: PW, height: PH, padding: 30, ...GLASS}}>
        <Eyebrow n="03">CLAUDE EXPLAINS</Eyebrow>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 22}}><Logo src="logos/claude.svg" s={34} /><div><div style={{font: `800 24px ${INTER}`, color: '#fff'}}>Claude Sonnet 5</div><div style={{font: `500 17px ${INTER}`, color: 'rgba(255,255,255,.65)'}}>Writes only from retrieved fields</div></div></div>
        <Pop at={3.2} style={{marginTop: 22}}><Scale k={1.18} w={384} h={150}><div style={{width: 384}}><Bot at={3.2}>Great news! 🎉 <b style={{fontWeight: 800}}>3 schools in Cheras</b> pass your hard requirements (age 4 eligible ✅ within budget ✅ school bus 🚌).</Bot></div></Scale></Pop>
        <div style={{display: 'flex', flexDirection: 'column', gap: 14, marginTop: 20}}>
          <Check at={3.6}>Fees, ages and phones as listed</Check>
          <Check at={3.8}>Output check: no unsupported claims</Check>
        </div>
        <Pop at={4.1} from={10} style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 26, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,.18)'}}><Logo src="logos/wordpress.svg" s={30} /><span style={{font: `600 19px/1.35 ${INTER}`, color: '#fff'}}>Enquiries go straight into<br />Kiddy123's existing leads</span></Pop>
      </Pop>
      {t < 0 && <span />}
    </AbsoluteFill>
  );
};

/* ================= HOW WE DELIVERED · four steps ================= */
export const StepCard: React.FC<{i: number; at: number; title: string; desc: string; visual: React.ReactNode; live?: boolean; x?: number; y?: number; w?: number; vh?: number}> = ({i, at, title, desc, visual, live, x, y, w = 400, vh = 300}) => {
  const {sp} = useT(); const p = sp(at, {damping: 14, stiffness: 140});
  return (
    <div style={{position: 'absolute', left: x ?? 100 + i * 440, top: y ?? 300, width: w, opacity: clamp01(p * 2), transform: `translateY(${(1 - p) * 70}px) rotate(${(1 - p) * (i % 2 ? 2 : -2)}deg)`}}>
      <div style={{background: '#fff', borderRadius: 28, overflow: 'hidden', boxShadow: '0 50px 90px -30px rgba(8,28,36,.55),0 0 0 1px rgba(11,37,48,.06)'}}>
        <div style={{height: vh, position: 'relative', overflow: 'hidden', background: '#F1F4F7'}}>{visual}</div>
        <div style={{padding: '24px 26px 28px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
            <span style={{font: `700 15px ${MONOF}`, letterSpacing: '.2em', color: TT.sunDeep}}>STEP 0{i + 1}</span>
            {live && <span style={{marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 7, background: '#DCFCE7', color: '#15803D', borderRadius: 99, padding: '4px 12px', font: `800 14px ${INTER}`}}><i style={{width: 8, height: 8, borderRadius: 4, background: '#16A34A', display: 'block'}} />LIVE</span>}
          </div>
          <div style={{font: `800 31px/1.12 ${MANROPE}`, letterSpacing: '-0.03em', color: TT.ink, marginTop: 10, minHeight: 70}}>{title}</div>
          <div style={{font: `500 19px/1.4 ${INTER}`, color: '#4B5563', marginTop: 10, wordBreak: 'keep-all'}}>{desc}</div>
        </div>
      </div>
    </div>
  );
};
const Arrow: React.FC<{i: number; at: number}> = ({i, at}) => {
  const {sp} = useT(); const p = sp(at, {damping: 12, stiffness: 200});
  return <div style={{position: 'absolute', left: 100 + i * 440 + 400 + 20 - 24, top: 300 + 150 - 24, width: 48, height: 48, borderRadius: 24, background: TT.sun, color: TT.ink, display: 'grid', placeItems: 'center', transform: `scale(${p})`, boxShadow: '0 10px 24px -8px rgba(154,91,0,.6)', zIndex: 3}}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={TT.ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></div>;
};
export type DeliverStep = {title: string; desc: string; live?: boolean; visual: React.ReactNode};
export const useDeliverSteps = (): DeliverStep[] => {
  const {t} = useT();
  const code = ['tools = [', '  search_schools,', '  get_school_details,', '  compare_schools,', '  start_enquiry,', ']'];
  const shown = Math.floor(clamp01((t - 2.0) / 0.9) * code.length);
  return [
    {title: 'Propose AI Solution', desc: "An AI proposal built on Kiddy123's own listings.", visual: <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg,#D35207,#EA6509)'}}><Img src={staticFile('proposal-cover-ai.webp')} style={{width: '100%', display: 'block'}} /></div>},
    {title: 'Clickable interactive prototype', desc: "Kiddy123 clicked through it before the build.", visual: <div style={{position: 'absolute', left: 34, top: 18, transform: 'rotate(-3deg)', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,.25))'}}><Scale k={0.86} w={384} h={420}><Panel lang="en" h={420}>
          <Bot at={0}>Great news! 🎉 <b style={{fontWeight: 800}}>3 schools in Cheras</b> pass your hard requirements.</Bot>
          <SchoolCard at={0} s={SCH.dejowitop} rank={1} sponsored /></Panel></Scale></div>},
    {title: 'AI Development', desc: "Exact filters for facts, Claude for the words.", visual: <div style={{position: 'absolute', inset: 0, background: '#0D1117', padding: '26px 28px', font: `500 22px/1.6 ${MONOF}`}}>
          <div style={{display: 'flex', gap: 7, marginBottom: 16}}>{['#FC5F57', '#FDBC2E', '#29C740'].map((c) => <i key={c} style={{width: 11, height: 11, borderRadius: 6, background: c, display: 'block'}} />)}<span style={{marginLeft: 10, font: `500 14px ${MONOF}`, color: '#8B949E'}}>engine/tools.py</span></div>
          {code.slice(0, shown).map((l, i) => <div key={i} style={{color: i === 0 || i === code.length - 1 ? '#FF7B72' : '#79C0FF', whiteSpace: 'pre'}}>{l}</div>)}
          <div style={{position: 'absolute', right: 20, bottom: 18, display: 'flex', gap: 8}}>{['claude', 'postgresql', 'fastapi'].map((l) => <span key={l} style={{width: 40, height: 40, borderRadius: 10, background: '#fff', display: 'grid', placeItems: 'center'}}><Img src={staticFile(`logos/${l}.svg`)} style={{width: 26, height: 26}} /></span>)}</div></div>},
    {title: 'Production', desc: "On every Kiddy123 page, in EN, BM and 中文.", live: true, visual: <><Img src={staticFile('plates/town2.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '62% 60%'}} />
          <div style={{position: 'absolute', right: 26, bottom: 24, width: 84, height: 84, borderRadius: 42, background: P.primary, display: 'grid', placeItems: 'center', boxShadow: `0 0 0 ${8 + Math.sin(t * 5) * 4}px rgba(234,88,12,.25),0 14px 30px rgba(234,88,12,.5)`}}><Img src={staticFile('mascot.png')} style={{width: 46}} /></div>
          <div style={{position: 'absolute', left: 20, top: 20, background: '#fff', borderRadius: 99, padding: '8px 16px', font: `800 17px ${INTER}`, color: TT.ink, display: 'flex', alignItems: 'center', gap: 8}}><i style={{width: 9, height: 9, borderRadius: 5, background: '#16A34A', display: 'block'}} />kiddy123.com</div></>},
  ];
};
export const CDelivered: React.FC = () => {
  const steps = useDeliverSteps();
  return (
    <AbsoluteFill>
      <Plate src="town2.png" dur={5.2} s0={1.06} s1={1.12} blur={3} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg,rgba(234,244,255,.93),rgba(234,244,255,.8))'}} />
      <div style={{position: 'absolute', left: 100, top: 92}}><THead lines={[['From', 'proposal', 'to', {hi: 'production.'}]]} size={88} color={TT.ink} /></div>
      <div style={{position: 'absolute', left: 104, top: 205}}><Sub at={0.5} color="rgba(11,37,48,.75)">How Codech delivered KiddyMatch AI for Kiddy123.</Sub></div>
      {steps.map((st, i) => <StepCard key={i} i={i} at={0.45 + i * 0.5} title={st.title} desc={st.desc} live={st.live} visual={st.visual} />)}
      {[0, 1, 2].map((i) => <Arrow key={i} i={i} at={0.85 + i * 0.5} />)}
    </AbsoluteFill>
  );
};
