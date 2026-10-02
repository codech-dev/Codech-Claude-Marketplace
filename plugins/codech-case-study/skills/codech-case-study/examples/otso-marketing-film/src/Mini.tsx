import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile} from 'remotion';
import {Cursor, INTER, MANROPE, MONO, NOTO, UI, clamp01, lerp, useT} from './lib';
import {Avatar, Glass, Mono, Pill, Slab, Space, Sub, V, VHead, Vig, typed, useIn, useWhip} from './Vault';

/* OTSO film v3: focused mini UIs (after the case-study vignettes) floating in the Midnight Vault world.
   Each card is OTSO's own product styling (white surface, navy, blue) at video scale; one feature per card.
   Every scene is in LOCAL time. */
const W = 1920, H = 1080;
const P = {ink: '#0B1A33', text: '#1E293B', mute: '#64748B', line: '#E2E8F0', soft: '#F1F5F9', blue: '#2563EB', blueSoft: '#E8EFFF', navy: '#0B1A33',
  amber: '#B45309', amberBg: '#FEF3C7', red: '#DC2626', redBg: '#FEE2E2', green: '#16A34A', greenBg: '#DCFCE7'};

/* ---------------- product parts ---------------- */
/** A floating product card: springs up, tilted, cobalt rim light. */
const Card: React.FC<{x: number; y: number; w: number; h?: number; ry?: number; rx?: number; rz?: number; at?: number; from?: number; children: React.ReactNode; pad?: number; style?: React.CSSProperties}> = ({x, y, w, h, ry = -14, rx = 6, rz = 0, at = 0, from = 600, children, pad = 0, style}) => {
  const {sp, out, t} = useT();
  const q = sp(at, {damping: 16, stiffness: 100});
  const drift = out(at, at + 5) * 4;
  return (
    <AbsoluteFill style={{perspective: 2200}}>
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `translateY(${(1 - q) * from}px) rotateY(${ry + drift}deg) rotateX(${rx}deg) rotateZ(${rz}deg)`, opacity: clamp01(q * 3),
        borderRadius: 22, background: '#fff', overflow: 'hidden', padding: pad, color: P.text, font: `400 22px ${UI}`,
        boxShadow: `0 90px 150px -40px rgba(0,0,0,.95),0 0 0 1px rgba(150,180,255,.35),${ry < 0 ? -36 : 36}px 0 100px -24px rgba(61,123,255,.6)`, ...style}}>{children}</div>
    </AbsoluteFill>
  );
};
const Badge: React.FC<{kind: 'conf' | 'int' | 'res' | 'pub'; s?: number}> = ({kind, s = 1}) => {
  const m = {conf: ['CONFIDENTIAL', P.amber, P.amberBg], int: ['INTERNAL', P.blue, P.blueSoft], res: ['RESTRICTED', P.red, P.redBg], pub: ['PUBLIC', P.green, P.greenBg]}[kind];
  return <span style={{font: `700 ${13 * s}px ${INTER}`, letterSpacing: '.06em', color: m[1], background: m[2], border: `1px solid ${m[1]}55`, borderRadius: 6, padding: `${3 * s}px ${8 * s}px`, whiteSpace: 'nowrap'}}>{m[0]}</span>;
};
const FIco: React.FC<{kind?: 'pdf' | 'doc' | 'xls' | 'img' | 'folder'; s?: number}> = ({kind = 'pdf', s = 34}) => kind === 'folder'
  ? <svg width={s} height={s} viewBox="0 0 24 24"><path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h4.6l2 2h8.4A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z" fill={P.blue} /></svg>
  : <div style={{width: s * 0.8, height: s, borderRadius: s * 0.12, background: {pdf: '#FEE2E2', doc: '#DBEAFE', xls: '#DCFCE7', img: '#F3E8FF'}[kind], display: 'grid', placeItems: 'center', flex: 'none', font: `800 ${s * 0.26}px ${INTER}`, color: {pdf: P.red, doc: P.blue, xls: P.green, img: '#9333EA'}[kind]}}>{kind.toUpperCase()}</div>;
const Toggle: React.FC<{on: boolean; s?: number}> = ({on, s = 1}) => (
  <div style={{width: 52 * s, height: 30 * s, borderRadius: 15 * s, background: on ? P.blue : '#CBD5E1', position: 'relative', flex: 'none'}}><div style={{position: 'absolute', top: 3 * s, left: on ? 25 * s : 3 * s, width: 24 * s, height: 24 * s, borderRadius: 12 * s, background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,.2)'}} /></div>
);
const Btn: React.FC<{children: React.ReactNode; tone?: 'blue' | 'ghost' | 'green'; press?: number; style?: React.CSSProperties}> = ({children, tone = 'blue', press = 0, style}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, font: `700 20px ${INTER}`, transform: `scale(${1 - Math.sin(Math.PI * clamp01(press)) * 0.06})`,
    ...(tone === 'blue' ? {background: P.blue, color: '#fff'} : tone === 'green' ? {background: P.green, color: '#fff'} : {border: `1px solid ${P.line}`, color: P.text}), ...style}}>{children}</div>
);
const Hl: React.FC<{children: React.ReactNode; on?: number}> = ({children, on = 1}) => <mark style={{background: `rgba(37,99,235,${0.16 * on})`, color: 'inherit', borderRadius: 4, padding: '0 3px', boxShadow: on > 0.5 ? 'inset 0 -2px 0 rgba(37,99,235,.5)' : 'none'}}>{children}</mark>;
const pop = (sp: (s: number, c?: object) => number, at: number) => { const q = sp(at, {damping: 13, stiffness: 180}); return {transform: `translateY(${(1 - q) * 18}px) scale(${lerp(0.96, 1, q)})`, opacity: clamp01(q * 2)} as React.CSSProperties; };
const Shimmer: React.FC<{w: string | number; h?: number}> = ({w, h = 14}) => {
  const {t} = useT();
  return <div style={{width: w, height: h, borderRadius: h / 2, background: `linear-gradient(90deg,${P.soft} 0%,#DCE4F2 ${((t * 80) % 200) - 50}%,${P.soft} 100%)`}} />;
};

/* ================= PROBLEM: built for everyone, not for you ================= */
export const MGeneric: React.FC = () => {
  const {t, sp, io} = useT();
  const enter = useIn(0, 0.35);
  const leave = useWhip(2.65, 3.0);
  const stamp = sp(1.5, {damping: 10, stiffness: 240});
  return (
    <AbsoluteFill style={t > 2.6 ? leave : enter}>
      <Space seed={31} gx={65} />
      {/* identical grey folders: a one-size drive */}
      <AbsoluteFill style={{perspective: 1600}}>
        {Array.from({length: 12}, (_, i) => {
          const q = sp(0.1 + i * 0.04, {damping: 14, stiffness: 160});
          return <div key={i} style={{position: 'absolute', left: 980 + (i % 4) * 200, top: 200 + Math.floor(i / 4) * 210, transform: `rotateY(-22deg) scale(${q})`, opacity: 0.55}}>
            <svg width="150" height="120" viewBox="0 0 24 19"><path d="M1 3a2 2 0 0 1 2-2h5l2 2h11a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2z" fill="#4A5675" /></svg>
            <div style={{font: `600 15px ${MONO}`, color: 'rgba(190,210,255,.5)', marginTop: 6}}>New folder ({i + 1})</div>
          </div>;
        })}
        <div style={{position: 'absolute', left: 1080, top: 430, transform: `rotate(-12deg) scale(${lerp(2.4, 1, stamp)})`, opacity: clamp01(stamp * 3), padding: '16px 34px', border: `5px solid ${V.red}`, borderRadius: 14, color: V.red, font: `800 54px ${MANROPE}`, letterSpacing: '.06em', boxShadow: '0 0 40px rgba(255,90,106,.5)', textShadow: '0 0 20px rgba(255,90,106,.6)', background: 'rgba(4,6,13,.6)'}}>ONE SIZE FITS ALL</div>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 118, top: 340}}><VHead lines={[['Built', 'for', 'everyone.'], ['Not', 'for', {key: 'you.'}]]} start={0.2} size={104} /></div>
      <Sub at={1.8} style={{position: 'absolute', left: 122, top: 620}}>Your rules, your structure, your teams: left out.</Sub>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= MEET follow-up: built for your company (pillars) ================= */
export const MPillars: React.FC = () => {
  const {t, sp, io} = useT();
  const leave = useWhip(3.05, 3.45);
  const cols: [string, string, string][] = [['Store', 'Every drive, folder and version', 'M4 7h16M4 12h16M4 17h10'], ['Share', 'Safely, by classification', 'M8 12h8M14 8l4 4-4 4'], ['Manage', 'Audit, hold, permissions', 'M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z']];
  return (
    <AbsoluteFill style={leave}>
      <Space seed={32} gy={55} floor />
      <div style={{position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', justifyContent: 'center'}}><VHead lines={[['One', 'platform,', 'built', 'for'], [{key: 'OTSO.'}]]} start={0.1} size={92} align="center" /></div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 470, display: 'flex', justifyContent: 'center', gap: 40}}>
        {cols.map(([n, d, path], i) => {
          const q = sp(0.6 + i * 0.2, {damping: 13, stiffness: 140});
          return <div key={i} style={{transform: `translateY(${(1 - q) * 160}px) rotateX(${(1 - q) * 30}deg)`, opacity: clamp01(q * 2)}}>
            <Glass glow={0.8} style={{width: 420, padding: '34px 34px 30px'}}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={V.pale} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={path} /></svg>
              <div style={{font: `800 54px ${MANROPE}`, letterSpacing: '-0.03em', marginTop: 16}}>{n}</div>
              <div style={{font: `500 24px ${INTER}`, color: V.mist, marginTop: 6}}>{d}</div>
            </Glass>
          </div>;
        })}
      </div>
      <Mono at={1.6} style={{position: 'absolute', left: 0, right: 0, bottom: 110, textAlign: 'center'}}>WITH AI IN EVERY STEP</Mono>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= STORE: drives ================= */
const DRIVES: [string, string, string, string][] = [['My Drive', 'PERSONAL', 'Only you', '15 files'], ['Client Onboarding', 'TEAM', '4 members', '128 files'], ['Compliance & Risk', 'TEAM', '12 members', '96 files'], ['Research', 'TEAM', '3 members', '41 files']];
export const MDrives: React.FC = () => {
  const {t, sp, io, out} = useT();
  const leave = useWhip(3.05, 3.45);
  const menu = sp(1.9, {damping: 14, stiffness: 200});
  return (
    <AbsoluteFill style={leave}>
      <Space seed={33} gx={60} floor />
      <Card x={640} y={210} w={1160} h={680} ry={-16}>
        <div style={{display: 'flex', height: '100%'}}>
          <div style={{width: 280, background: P.navy, color: '#CBD5E1', padding: '26px 20px', display: 'flex', flexDirection: 'column', gap: 6, font: `500 21px ${INTER}`}}>
            <div style={{position: 'relative'}}><Btn press={io(1.6, 1.9)} style={{width: '100%', justifyContent: 'center', borderRadius: 99}}>＋ New</Btn>
              {t > 1.9 && <div style={{position: 'absolute', left: 30, top: 60, width: 260, background: '#fff', color: P.text, borderRadius: 14, padding: 8, boxShadow: '0 30px 60px -20px rgba(0,0,0,.6)', transform: `scale(${menu})`, transformOrigin: 'top left', zIndex: 3}}>
                {['New folder', 'Upload files', 'New shared drive'].map((m, i) => <div key={i} style={{padding: '12px 14px', borderRadius: 10, background: i === 2 ? P.blueSoft : 'transparent', font: `600 20px ${INTER}`}}>{m}</div>)}</div>}
            </div>
            <div style={{marginTop: 16, padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,.08)', color: '#fff'}}>⌂  Home</div>
            <div style={{padding: '10px 14px'}}>▢  My Drive</div>
            <div style={{font: `600 14px ${MONO}`, letterSpacing: '.14em', color: '#64748B', margin: '18px 14px 6px'}}>SHARED DRIVES</div>
            {['Client Onboarding', 'Compliance & Risk', 'Research', 'Finance'].map((d, i) => <div key={i} style={{padding: '9px 14px', ...pop(sp, 0.5 + i * 0.1)}}>▤  {d}</div>)}
          </div>
          <div style={{flex: 1, padding: '34px 36px', background: '#F8FAFC'}}>
            <div style={{font: `800 40px ${MANROPE}`, color: P.ink, letterSpacing: '-0.02em'}}>Home</div>
            <div style={{font: `500 20px ${INTER}`, color: P.mute}}>Your latest activity across every drive</div>
            <div style={{font: `700 15px ${MONO}`, letterSpacing: '.14em', color: P.mute, marginTop: 30}}>YOUR DRIVES</div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 14}}>
              {DRIVES.map(([n, k, m, f], i) => (
                <div key={i} style={{background: '#fff', borderRadius: 16, padding: '20px 22px', border: `1px solid ${P.line}`, boxShadow: '0 10px 24px -14px rgba(15,23,42,.25)', ...pop(sp, 0.7 + i * 0.14)}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}><FIco kind="folder" s={36} /><span style={{font: `700 13px ${INTER}`, letterSpacing: '.08em', color: k === 'PERSONAL' ? P.amber : P.blue, background: k === 'PERSONAL' ? P.amberBg : P.blueSoft, borderRadius: 99, padding: '4px 10px'}}>{k}</span></div>
                  <div style={{font: `700 24px ${INTER}`, color: P.ink, marginTop: 12}}>{n}</div>
                  <div style={{display: 'flex', justifyContent: 'space-between', font: `500 18px ${INTER}`, color: P.mute, marginTop: 4}}><span>{m}</span><span>{f}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
      <Cursor x={lerp(1100, 800, out(0.9, 1.6))} y={lerp(800, 270, out(0.9, 1.6))} click={io(1.6, 1.95)} />
      <div style={{position: 'absolute', left: 110, top: 300}}><VHead lines={[['Every'], ['drive.'], [{key: 'One place.'}]]} start={0.2} size={98} /></div>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= STORE: upload, you choose what AI sees ================= */
const UPS: [string, 'pdf' | 'img' | 'doc', string][] = [['KYC - Acme Capital Pte Ltd.pdf', 'pdf', '2.2 MB'], ['Director passport scan.jpg', 'img', '1.4 MB'], ['Board minutes - Sep.docx', 'doc', '86 KB']];
export const MUpload: React.FC = () => {
  const {t, sp, io, out} = useT();
  const enter = useIn(0, 0.4, -1);
  const leave = useWhip(3.25, 3.6);
  const off = t > 1.95; // passport scan kept out of AI
  const upClick = io(2.45, 2.75);
  const prog = io(2.7, 3.3);
  return (
    <AbsoluteFill style={t > 3.2 ? leave : enter}>
      <Space seed={34} gx={35} floor />
      {/* low hero angle */}
      <Card x={150} y={170} w={920} ry={14} rx={-8} at={0.05}>
        <div style={{padding: '28px 32px'}}>
          <div style={{font: `800 32px ${MANROPE}`, color: P.ink}}>Upload documents</div>
          <div style={{marginTop: 18, border: `2px dashed #C7D2E3`, borderRadius: 16, padding: '22px', textAlign: 'center', font: `600 21px ${INTER}`, color: P.text, background: P.soft}}>Drop files and folders here <span style={{color: P.mute, fontWeight: 500}}>· PDF, Word, Excel, scans</span></div>
          <div style={{font: `700 15px ${MONO}`, letterSpacing: '.12em', color: P.mute, margin: '22px 0 10px', display: 'flex', justifyContent: 'space-between'}}><span>STAGED · NOTHING SENT YET</span><span>AI</span></div>
          {UPS.map(([n, k, s], i) => {
            const isOff = i === 1 && off;
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 16, padding: '14px 4px', borderTop: `1px solid ${P.line}`, ...pop(sp, 0.4 + i * 0.16)}}>
                <FIco kind={k} s={38} />
                <div style={{flex: 1}}><div style={{font: `600 22px ${INTER}`, color: P.ink}}>{n}</div>
                  <div style={{font: `500 17px ${INTER}`, color: isOff ? P.amber : P.mute}}>{isOff ? 'Kept out of AI and the assistant' : s}</div>
                  {prog > 0 && <div style={{height: 6, borderRadius: 3, background: P.soft, marginTop: 8, overflow: 'hidden'}}><div style={{width: `${clamp01(prog * (1.3 - i * 0.15)) * 100}%`, height: '100%', background: P.blue}} /></div>}
                </div>
                <div style={{transform: `scale(${i === 1 ? 1 + Math.max(0, 1 - Math.abs(t - 1.95) / 0.15) * 0.15 : 1})`}}><Toggle on={!isOff} /></div>
              </div>
            );
          })}
          <div style={{display: 'flex', justifyContent: 'flex-end', gap: 14, marginTop: 20}}><Btn tone="ghost">Cancel</Btn><Btn press={upClick}>{prog > 0.95 ? '✓ Uploaded' : 'Upload 3 files'}</Btn></div>
        </div>
      </Card>
      <Cursor x={t < 2.1 ? lerp(700, 1010, out(1.2, 1.85)) : lerp(1010, 930, out(2.1, 2.45))} y={t < 2.1 ? lerp(900, 490, out(1.2, 1.85)) : lerp(490, 665, out(2.1, 2.45))} click={t < 2.2 ? io(1.85, 2.15) : io(2.45, 2.8)} />
      <div style={{position: 'absolute', right: 110, top: 310}}><VHead lines={[['Staff', 'choose'], ['what', 'AI'], [{key: 'sees.'}]]} start={0.3} size={100} align="right" /></div>
      <Sub at={2.0} style={{position: 'absolute', right: 114, top: 650, textAlign: 'right'}}>Nothing uploads until you click.</Sub>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= STORE: every version kept ================= */
export const MVersions: React.FC = () => {
  const {t, sp, io} = useT();
  const leave = useWhip(2.65, 3.0);
  const cmp = io(1.2, 1.6);
  const vs: [string, string, string, string][] = [['v3', 'aisha', 'Aisha M.', 'just now'], ['v2', 'weiliang', 'Wei Liang', 'yesterday'], ['v1', 'siti', 'Siti J.', '10 Aug']];
  return (
    <AbsoluteFill style={leave}>
      <Space seed={35} gx={60} />
      <Card x={700} y={230} w={1080} ry={-12} rx={8} at={0}>
        <div style={{display: 'flex'}}>
          <div style={{width: 340, borderRight: `1px solid ${P.line}`, padding: '26px 22px'}}>
            <div style={{font: `700 15px ${MONO}`, letterSpacing: '.12em', color: P.mute}}>VERSION HISTORY</div>
            {vs.map(([v, id, n, w], i) => (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 14, padding: '12px', borderRadius: 12, background: i === 1 && t > 1.1 ? P.blueSoft : 'transparent', ...pop(sp, 0.3 + i * 0.15)}}>
                <Avatar id={id} size={42} /><div><div style={{font: `700 20px ${INTER}`, color: P.ink}}>{v} · {n}</div><div style={{font: `500 16px ${INTER}`, color: P.mute}}>{w}</div></div>
              </div>
            ))}
          </div>
          <div style={{flex: 1, padding: '26px 30px'}}>
            <div style={{font: `800 28px ${MANROPE}`, color: P.ink}}>Compliance review, week of 10 Aug</div>
            <div style={{display: 'flex', gap: 10, marginTop: 8, opacity: cmp}}><span style={{font: `700 15px ${INTER}`, color: P.blue, background: P.blueSoft, borderRadius: 6, padding: '4px 10px'}}>Comparing v2 → v3</span></div>
            <div style={{font: `400 23px/1.7 ${UI}`, color: P.text, marginTop: 18}}>
              Acme Capital KYC: passport copy expires in <s style={{background: `rgba(220,38,38,${0.15 * cmp})`, color: cmp > 0.5 ? P.red : P.text, textDecorationColor: cmp > 0.5 ? P.red : 'transparent'}}>April</s>{cmp > 0.5 && <span style={{background: 'rgba(22,163,74,.16)', color: P.green, borderRadius: 4, padding: '0 4px', marginLeft: 6, ...pop(sp, 1.4)}}>March</span>}. Updated copy requested from the client.
              <br />Meridian Holdings agreement countersigned{cmp > 0.5 && <span style={{background: 'rgba(22,163,74,.16)', color: P.green, borderRadius: 4, padding: '0 4px', marginLeft: 6, ...pop(sp, 1.6)}}>and filed under Client Agreements</span>}.
            </div>
          </div>
        </div>
      </Card>
      <div style={{position: 'absolute', left: 110, top: 330}}><VHead lines={[['Every'], ['version'], [{key: 'kept.'}]]} start={0.2} size={100} /></div>
      <Sub at={1.5} style={{position: 'absolute', left: 114, top: 690}}>Compare any two, word by word.</Sub>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= FIND: search by meaning ================= */
export const MSearch: React.FC = () => {
  const {t, sp, io} = useT();
  const enter = useIn(0, 0.4);
  const leave = useWhip(3.65, 4.0, 1);
  const q = 'when does the Acme passport expire?';
  const res = t > 1.45;
  return (
    <AbsoluteFill style={t > 3.6 ? leave : enter}>
      <Space seed={36} gx={62} floor />
      <Card x={640} y={190} w={1180} ry={-14} at={0.05}>
        <div style={{padding: '30px 36px'}}>
          <div style={{font: `800 38px ${MANROPE}`, color: P.ink}}>Search</div>
          <div style={{font: `500 19px ${INTER}`, color: P.mute}}>Keyword + semantic search across every drive you can access.</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 20, padding: '16px 20px', borderRadius: 14, border: `2px solid ${t > 0.3 ? P.blue : P.line}`, boxShadow: t > 0.3 ? '0 0 0 4px rgba(37,99,235,.15)' : 'none'}}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={P.mute} strokeWidth="2.2"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5 21 21" /></svg>
            <div style={{flex: 1, font: `500 26px ${INTER}`, color: P.ink}}>{typed(q, t, 0.35, 1.35)}<span style={{color: P.blue, opacity: t < 1.45 && Math.floor(t * 4) % 2 ? 1 : 0}}>|</span></div>
            <span style={{font: `700 16px ${INTER}`, color: P.blue, background: P.blueSoft, borderRadius: 99, padding: '6px 14px'}}>✦ Semantic</span>
          </div>
          {res && <div style={{font: `700 15px ${MONO}`, letterSpacing: '.12em', color: P.mute, margin: '24px 0 10px'}}>3 RESULTS</div>}
          {res && [
            ['Compliance Review - Weekly Notes', 'doc', <>Acme Capital KYC <Hl>passport copy expires in March</Hl>. Updated copy requested.</>, 'Client Onboarding · matched by meaning', '92%'],
            ['KYC - Acme Capital Pte Ltd.pdf', 'pdf', <>Scanned PDF · <Hl>passport expiry 14 March 2027</Hl> read by AI</>, 'Client Onboarding · KYC Documents', '88%'],
            ['客户尽职调查流程.pdf', 'pdf', <>董事<Hl>护照到期</Hl>前须更新身份证明文件</>, 'Compliance & Risk · 中文', '81%'],
          ].map(([n, k, snip, meta, m], i) => {
            const hero = i === 0;
            const lift = sp(1.9, {damping: 13, stiffness: 150});
            return (
              <div key={i} style={{display: 'flex', gap: 16, padding: '18px 20px', borderRadius: 14, marginTop: 10, border: `1px solid ${hero ? P.blue : P.line}`, background: hero ? '#F8FAFF' : '#fff', ...pop(sp, 1.5 + i * 0.14),
                ...(hero ? {transform: `translateY(${-lift * 6}px) scale(${1 + lift * 0.02})`, boxShadow: `0 ${20 * lift}px 40px -20px rgba(37,99,235,.5)`} : {})}}>
                <FIco kind={k as 'pdf'} s={38} />
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{font: `700 23px ${UI}`, color: P.ink}}>{n as string}</div>
                  <div style={{font: `400 20px ${UI}`, color: P.text, marginTop: 4}}>{snip}</div>
                  <div style={{font: `500 16px ${INTER}`, color: P.mute, marginTop: 4}}>{meta as string}</div>
                </div>
                <div style={{font: `800 22px ${INTER}`, color: P.blue, alignSelf: 'center'}}>{m as string}</div>
              </div>
            );
          })}
        </div>
      </Card>
      <div style={{position: 'absolute', left: 110, top: 360}}><VHead lines={[['Search', 'by'], [{key: 'meaning.'}]]} start={1.9} size={100} /></div>
      <Sub at={2.4} style={{position: 'absolute', left: 114, top: 600}}>English, 中文 and scanned PDFs.</Sub>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= FIND: AI reads it first ================= */
const FACTS: [string, string][] = [['Client', 'Acme Capital Pte Ltd'], ['Entity type', 'Private limited (Singapore)'], ['UBO', 'Tan W.K. (82%)'], ['Passport expiry', '14 March 2027']];
export const MSummary: React.FC = () => {
  const {t, sp, io} = useT();
  const leave = useWhip(3.45, 3.8);
  const reading = t < 1.3;
  const sum = 'KYC pack for Acme Capital Pte Ltd: certificate of incorporation, director and UBO identification, proof of address and a source-of-funds declaration.';
  return (
    <AbsoluteFill style={leave}>
      <Space seed={37} gx={40} floor />
      {/* overhead-ish: card lies back */}
      <Card x={160} y={150} w={1000} ry={10} rx={18} at={0}>
        <div style={{padding: '28px 32px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}><FIco kind="pdf" s={46} /><div><div style={{font: `700 26px ${INTER}`, color: P.ink}}>KYC - Acme Capital Pte Ltd.pdf</div><div style={{font: `500 18px ${INTER}`, color: P.mute}}>Scanned PDF · Client Onboarding</div></div><span style={{marginLeft: 'auto'}}><Badge kind="conf" s={1.2} /></span></div>
          <div style={{marginTop: 22, display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 99, background: reading ? P.blueSoft : P.greenBg, color: reading ? P.blue : P.green, font: `600 18px ${INTER}`}}>{reading ? '✦ AI is reading this document…' : '✓ Read by AI · searchable'}</div>
          <div style={{font: `700 15px ${MONO}`, letterSpacing: '.12em', color: P.mute, marginTop: 22}}>AI SUMMARY</div>
          <div style={{marginTop: 10, minHeight: 100}}>{reading ? <div style={{display: 'grid', gap: 10}}><Shimmer w="100%" /><Shimmer w="92%" /><Shimmer w="60%" /></div>
            : <div style={{font: `400 23px/1.5 ${UI}`, color: P.text}}>{typed(sum, t, 1.3, 2.2)}</div>}</div>
          <div style={{font: `700 15px ${MONO}`, letterSpacing: '.12em', color: P.mute, marginTop: 16}}>TAGS</div>
          <div style={{display: 'flex', gap: 10, marginTop: 10}}>{['KYC', 'corporate client', 'due diligence'].map((x, i) => <span key={x} style={{font: `600 19px ${INTER}`, color: P.blue, background: P.blueSoft, borderRadius: 8, padding: '6px 12px', ...pop(sp, 2.2 + i * 0.1)}}>{x}</span>)}</div>
          <div style={{font: `700 15px ${MONO}`, letterSpacing: '.12em', color: P.mute, marginTop: 18}}>KEY FACTS</div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10}}>
            {FACTS.map(([k, v], i) => <div key={k} style={{padding: '10px 14px', borderRadius: 10, background: P.soft, ...pop(sp, 2.5 + i * 0.12)}}><div style={{font: `500 15px ${INTER}`, color: P.mute}}>{k}</div><div style={{font: `700 20px ${INTER}`, color: P.ink}}>{v}</div></div>)}
          </div>
        </div>
      </Card>
      <div style={{position: 'absolute', right: 110, top: 340}}><VHead lines={[['AI', 'reads', 'it'], [{key: 'first.'}]]} start={0.2} size={104} align="right" /></div>
      <Sub at={1.4} style={{position: 'absolute', right: 114, top: 590, textAlign: 'right'}}>Summary, tags and key facts,<br />even from a scan.</Sub>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= FIND: four languages ================= */
const L4: [string, string[]][] = [['English', ['Home', 'Your drives', 'Recent files', 'Search docs, folders, drives…']], ['中文', ['主页', '您的云端硬盘', '最近的文件', '搜索文档、文件夹、云端硬盘…']], ['Tiếng Việt', ['Trang chủ', 'Ổ đĩa của bạn', 'Tệp gần đây', 'Tìm tài liệu, thư mục, ổ đĩa…']], ['Bahasa Indonesia', ['Beranda', 'Drive Anda', 'File terbaru', 'Cari dokumen, folder, drive…']]];
export const MLangs: React.FC = () => {
  const {t, sp} = useT();
  const enter = useIn(0, 0.35, -1);
  const leave = useWhip(2.65, 3.0);
  const act = t < 1.0 ? 0 : t < 1.6 ? 1 : t < 2.1 ? 2 : 3;
  const sw = (a: number) => Math.max(0, 1 - Math.abs(t - a) / 0.12);
  const flash = sw(1.0) + sw(1.6) + sw(2.1);
  const L = L4[act][1];
  return (
    <AbsoluteFill style={t > 2.6 ? leave : enter}>
      <Space seed={38} gx={50} gy={60} floor />
      <Card x={560} y={360} w={800} ry={0} rx={28} at={0}>
        <div style={{padding: '24px 30px', opacity: 1 - flash * 0.5, filter: flash > 0.05 ? `blur(${flash * 4}px)` : undefined}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 12, background: P.soft, font: `500 22px ${UI}`, color: P.mute}}>⌕ {L[3]}</div>
          <div style={{font: `800 40px ${MANROPE}, ${NOTO}`, color: P.ink, marginTop: 22}}>{L[0]}</div>
          <div style={{font: `700 15px ${MONO}`, letterSpacing: '.12em', color: P.mute, marginTop: 14}}>{L[1].toUpperCase()}</div>
          <div style={{display: 'flex', gap: 14, marginTop: 12}}>{['My Drive', 'Client Onboarding', 'Compliance'].map((d) => <div key={d} style={{flex: 1, padding: '16px', borderRadius: 12, border: `1px solid ${P.line}`, font: `700 19px ${INTER}`, color: P.ink}}><FIco kind="folder" s={26} /><div style={{marginTop: 6}}>{d}</div></div>)}</div>
          <div style={{font: `700 15px ${MONO}`, letterSpacing: '.12em', color: P.mute, marginTop: 18}}>{L[2].toUpperCase()}</div>
        </div>
      </Card>
      <div style={{position: 'absolute', left: 0, right: 0, top: 110, display: 'flex', justifyContent: 'center'}}><VHead lines={[['Four', {key: 'languages.'}]]} start={0.2} size={92} align="center" /></div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 240, display: 'flex', justifyContent: 'center', gap: 14}}>
        {L4.map(([l], i) => { const q = sp(0.3 + i * 0.1, {damping: 12, stiffness: 180}); return <div key={l} style={{transform: `translateY(${(1 - q) * 40}px) scale(${i === act ? 1.08 : 1})`, opacity: clamp01(q * 2)}}><Pill on={i === act}>{l}</Pill></div>; })}
      </div>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= SHARE: classification gates links ================= */
const LV: [string, string, string][] = [['Public', P.green, P.greenBg], ['Internal', P.blue, P.blueSoft], ['Confidential', P.amber, P.amberBg], ['Restricted', P.red, P.redBg]];
export const MShare: React.FC = () => {
  const {t, sp, io, out} = useT();
  const leave = useWhip(3.0, 3.4);
  const lvl = t < 1.0 ? 1 : t < 1.45 ? 2 : 3;
  const locked = lvl === 3;
  const laser = io(1.5, 1.8);
  return (
    <AbsoluteFill style={leave}>
      <Space seed={39} gx={35} />
      <Card x={200} y={250} w={860} ry={18} at={0.05} style={locked ? {boxShadow: '0 90px 150px -40px rgba(0,0,0,.95),0 0 0 2px rgba(255,90,106,.7),0 0 80px rgba(255,90,106,.35)'} : undefined}>
        <div style={{padding: '30px 34px'}}>
          <div style={{font: `800 30px ${MANROPE}`, color: P.ink}}>Share “KYC - Acme Capital Pte Ltd.pdf”</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 20}}>
            {(['aisha', 'weiliang', 'siti'] as const).map((id, i) => <div key={id} style={{marginLeft: i ? -12 : 0}}><Avatar id={id} size={46} ring="#fff" /></div>)}
            <span style={{font: `500 19px ${INTER}`, color: P.mute}}>Aisha, Wei Liang and Siti have access</span>
          </div>
          <div style={{font: `700 15px ${MONO}`, letterSpacing: '.12em', color: P.mute, marginTop: 26}}>CLASSIFICATION</div>
          <div style={{display: 'flex', gap: 10, marginTop: 12}}>{LV.map(([l, c, bg], i) => <span key={l} style={{padding: '10px 18px', borderRadius: 10, font: `700 19px ${INTER}`, color: i === lvl ? '#fff' : c, background: i === lvl ? c : bg, transform: `scale(${i === lvl ? 1.06 : 1})`}}>{l}</span>)}</div>
          <div style={{font: `700 15px ${MONO}`, letterSpacing: '.12em', color: P.mute, marginTop: 26}}>EXTERNAL LINK</div>
          <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 16, marginTop: 12, padding: '16px 20px', borderRadius: 14, background: locked ? P.redBg : P.soft, border: `1px solid ${locked ? '#FCA5A5' : P.line}`, overflow: 'hidden'}}>
            <span style={{fontSize: 26}}>{locked ? '🔒' : '🔗'}</span>
            <div style={{flex: 1, font: `600 21px ${INTER}`, color: locked ? P.red : P.ink}}>{locked ? 'Links disabled for Restricted files' : lvl === 2 ? 'Password-protected link' : 'Staff-only link'}</div>
            <Toggle on={!locked} />
            {locked && [0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: `${i * 22 - 8}%`, top: -20, width: 3, height: 120, background: P.red, transform: `rotate(35deg) scaleY(${laser})`, opacity: 0.55}} />)}
          </div>
        </div>
      </Card>
      <Cursor x={lerp(1150, 900, out(0.4, 1.3))} y={lerp(760, 540, out(0.4, 1.3))} click={io(1.35, 1.7)} />
      <div style={{position: 'absolute', right: 118, top: 360}}><VHead lines={[['Nothing'], [{key: 'leaks.'}]]} start={1.55} size={130} align="right" /></div>
      <Sub at={1.9} style={{position: 'absolute', right: 122, top: 650, textAlign: 'right'}}>Sharing follows each file's classification.</Sub>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= SHARE: send the real file, with a courtesy check ================= */
export const MSend: React.FC = () => {
  const {t, sp, io, out} = useT();
  const enter = useIn(0, 0.35);
  const leave = useWhip(3.05, 3.4);
  const picked = t > 0.95;
  const warn = sp(1.15, {damping: 13, stiffness: 170});
  const granted = t > 2.0;
  return (
    <AbsoluteFill style={t > 3.0 ? leave : enter}>
      <Space seed={40} gx={65} floor />
      <Card x={760} y={170} w={940} ry={-16} at={0.05}>
        <div style={{padding: '28px 32px'}}>
          <div style={{font: `800 30px ${MANROPE}`, color: P.ink}}>Send file / folder</div><div style={{font: `500 19px ${INTER}`, color: P.mute}}>to #deals-desk · 9 members</div>
          {[['Deals desk - weekly notes', 'doc', 'int'], ['Client Agreements', 'folder', 'conf'], ['Mandates 2026', 'folder', 'int']].map(([n, k, b], i) => (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 12, padding: '14px 16px', borderRadius: 12, border: `1px solid ${i === 1 && picked ? P.blue : P.line}`, background: i === 1 && picked ? '#F8FAFF' : '#fff'}}>
              <div style={{width: 24, height: 24, borderRadius: 6, border: `2px solid ${i === 1 && picked ? P.blue : '#CBD5E1'}`, background: i === 1 && picked ? P.blue : '#fff', color: '#fff', display: 'grid', placeItems: 'center', font: `800 15px ${INTER}`}}>{i === 1 && picked ? '✓' : ''}</div>
              <FIco kind={k as 'folder'} s={32} /><div style={{flex: 1, font: `600 22px ${INTER}`, color: P.ink}}>{n}</div><Badge kind={b as 'int'} s={1.15} />
            </div>
          ))}
          {t > 1.15 && <div style={{marginTop: 18, padding: '18px 20px', borderRadius: 14, background: granted ? P.greenBg : P.amberBg, border: `1px solid ${granted ? '#86EFAC' : '#FCD34D'}`, transform: `scale(${lerp(0.9, 1, warn)})`, opacity: clamp01(warn * 2)}}>
            <div style={{font: `700 21px ${INTER}`, color: granted ? P.green : P.amber}}>{granted ? '✓ Shared with Raj and Nadia. Everyone can open it.' : '2 people here can’t open this folder'}</div>
            {!granted && <div style={{display: 'flex', gap: 10, marginTop: 12}}><Btn press={io(1.75, 2.05)} style={{background: P.amber}}>Share with them</Btn><Btn tone="ghost">Send anyway</Btn></div>}
          </div>}
          <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 18}}><Btn press={io(2.5, 2.8)}>{t > 2.75 ? '✓ Sent to #deals-desk' : 'Send to #deals-desk'}</Btn></div>
        </div>
      </Card>
      <Cursor x={t < 1.0 ? lerp(1300, 790, out(0.4, 0.9)) : t < 2.2 ? lerp(790, 870, out(1.3, 1.75)) : lerp(870, 1440, out(2.1, 2.5))} y={t < 1.0 ? lerp(800, 370, out(0.4, 0.9)) : t < 2.2 ? lerp(370, 630, out(1.3, 1.75)) : lerp(630, 640, out(2.1, 2.5))} click={t < 1.2 ? io(0.9, 1.2) : t < 2.3 ? io(1.75, 2.05) : io(2.5, 2.8)} />
      <div style={{position: 'absolute', left: 110, top: 330}}><VHead lines={[['Send', 'the'], [{key: 'real file.'}]]} start={0.2} size={100} /></div>
      <Sub at={1.3} style={{position: 'absolute', left: 114, top: 570}}>Not a copy. Access checked first.</Sub>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= SHARE: team chat ================= */
type Msg = [string, string, string, number, React.ReactNode?];
export const MChat: React.FC = () => {
  const {t, sp} = useT();
  const leave = useWhip(3.45, 3.8);
  const msgs: Msg[] = [
    ['raj', 'Raj T.', 'Acme want the revised mandate signed before Friday.', 0.5,
      <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, padding: '12px 16px', borderRadius: 12, border: `1px solid ${P.line}`, width: 'fit-content'}}><FIco kind="pdf" s={34} /><div><div style={{font: `700 20px ${INTER}`, color: P.ink}}>Acme Capital - Brokerage Agreement.pdf</div><div style={{font: `500 16px ${INTER}`, color: P.mute}}>Brokerage Ops · v3 · 1.4 MB</div></div><Badge kind="conf" /></div>],
    ['weiliang', 'Wei Liang', 'Compliance flagged the same clause last quarter. Pulling the precedent.', 1.2],
    ['siti', 'Siti J.', 'Precedent is in the compliance drive:', 1.8,
      <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, padding: '12px 16px', borderRadius: 12, border: '1px dashed #FCA5A5', background: '#FFF7F7', width: 'fit-content'}}><span style={{fontSize: 22}}>🔒</span><div><div style={{font: `700 20px ${INTER}`, color: P.ink}}>Clause Precedent Register.xlsx <Badge kind="res" /></div><div style={{font: `500 16px ${INTER}`, color: P.red}}>You don't have access. Ask Siti J.</div></div></div>],
  ];
  return (
    <AbsoluteFill style={leave}>
      <Space seed={41} gx={62} floor />
      <Card x={680} y={150} w={1140} ry={-12} rx={4} at={0}>
        <div style={{display: 'flex'}}>
          <div style={{width: 260, background: '#F8FAFC', borderRight: `1px solid ${P.line}`, padding: '24px 18px', font: `500 20px ${INTER}`, color: P.text}}>
            <div style={{font: `800 24px ${MANROPE}`, color: P.ink}}>Team chat</div>
            <div style={{font: `700 13px ${MONO}`, letterSpacing: '.12em', color: P.mute, margin: '20px 0 8px'}}>CHANNELS</div>
            {['🔒 deals-desk', '🔒 compliance', '#  research', '#  general'].map((c, i) => <div key={c} style={{padding: '9px 12px', borderRadius: 10, background: i === 0 ? P.blueSoft : 'transparent', fontWeight: i === 0 ? 700 : 500}}>{c}</div>)}
            <div style={{font: `700 13px ${MONO}`, letterSpacing: '.12em', color: P.mute, margin: '18px 0 8px'}}>DIRECT MESSAGES</div>
            {[['siti', 'Siti Jamil'], ['raj', 'Raj Thevar']].map(([id, n]) => <div key={id} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '7px 12px'}}><Avatar id={id} size={30} />{n}</div>)}
          </div>
          <div style={{flex: 1, padding: '24px 28px', minHeight: 640}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 12}}><span style={{font: `800 28px ${MANROPE}`, color: P.ink}}>🔒 deals-desk</span><span style={{font: `700 13px ${INTER}`, color: P.mute, border: `1px solid ${P.line}`, borderRadius: 6, padding: '3px 8px'}}>PRIVATE</span>
              <div style={{marginLeft: 'auto', display: 'flex'}}>{['raj', 'siti', 'weiliang', 'priya'].map((id, i) => <div key={id} style={{marginLeft: i ? -10 : 0}}><Avatar id={id} size={36} ring="#fff" /></div>)}</div></div>
            <div style={{alignSelf: 'center', textAlign: 'center', font: `600 15px ${INTER}`, color: P.mute, margin: '14px 0'}}>Today</div>
            {msgs.map(([id, n, m, at, extra], i) => t > at && (
              <div key={i} style={{display: 'flex', gap: 14, marginTop: 16, ...pop(sp, at)}}>
                <Avatar id={id} size={46} />
                <div><div style={{font: `700 20px ${INTER}`, color: P.ink}}>{n} <span style={{font: `500 15px ${INTER}`, color: P.mute}}>09:{14 + i * 9}</span></div>
                  <div style={{font: `400 21px ${UI}`, color: P.text, marginTop: 2}}>{m}</div>{extra}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
      <div style={{position: 'absolute', left: 110, top: 300}}><VHead lines={[['Files'], ['stay'], [{key: 'documents.'}]]} start={0.25} size={96} /></div>
      {(() => { const q = sp(2.3, {damping: 12, stiffness: 170}); return <div style={{position: 'absolute', left: 110, top: 640, transform: `scale(${q})`, transformOrigin: 'left center'}}><Pill on>Permissions checked on every click</Pill></div>; })()}
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= ASSISTANT: answers with sources ================= */
export const MAssist: React.FC = () => {
  const {t, sp, io} = useT();
  const enter = useIn(0, 0.4);
  const leave = useWhip(3.85, 4.2);
  const q = 'Find our AML policy and tell me what it covers.';
  const sent = t > 1.35;
  const bullets = ['Firm-wide anti-money-laundering and counter-terrorism-financing policy', 'Customer due diligence tiers and ongoing monitoring', 'Escalation to the Money Laundering Reporting Officer'];
  return (
    <AbsoluteFill style={t > 3.8 ? leave : enter}>
      <Space seed={42} gx={65} floor />
      <Card x={900} y={110} w={820} ry={-16} at={0.05}>
        <div style={{background: P.navy, color: '#fff', padding: '22px 28px', display: 'flex', alignItems: 'center', gap: 14}}>
          <span style={{width: 48, height: 48, borderRadius: 14, background: '#1B2E52', display: 'grid', placeItems: 'center', color: '#8FB2FF', fontSize: 24}}>✦</span>
          <div><div style={{font: `800 24px ${MANROPE}`}}>OTSO Assistant</div><div style={{font: `500 16px ${INTER}`, color: '#9FB2D6'}}>● Private · sees only your documents</div></div>
        </div>
        <div style={{padding: '22px 28px', minHeight: 600, display: 'flex', flexDirection: 'column', gap: 16}}>
          {sent && <div style={{alignSelf: 'flex-end', maxWidth: '82%', background: P.navy, color: '#fff', borderRadius: '18px 18px 4px 18px', padding: '14px 20px', font: `500 22px ${UI}`, ...pop(sp, 1.35)}}>{q}</div>}
          {t > 1.7 && <div style={{font: `700 15px ${MONO}`, letterSpacing: '.12em', color: P.mute, ...pop(sp, 1.7)}}>✦ SEARCHED YOUR DOCUMENTS</div>}
          {t > 2.0 && <div style={{background: P.soft, borderRadius: 16, padding: '18px 22px', font: `400 21px/1.45 ${UI}`, color: P.text, ...pop(sp, 2.0)}}>The “AML & CFT Policy 2026.pdf” covers:
            <ul style={{margin: '8px 0 0', paddingLeft: 24}}>{bullets.map((b, i) => <li key={i} style={{...pop(sp, 2.2 + i * 0.2)}}>{b}</li>)}</ul></div>}
          {t > 2.9 && (() => { const g = sp(2.9, {damping: 12, stiffness: 160}); return <div style={{transform: `scale(${lerp(0.9, 1, g)})`, opacity: clamp01(g * 2)}}>
            <div style={{font: `700 14px ${MONO}`, letterSpacing: '.12em', color: P.mute}}>REFERENCED</div>
            <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, padding: '12px 16px', borderRadius: 12, border: `2px solid ${P.blue}`, boxShadow: `0 0 ${30 * g}px rgba(37,99,235,.45)`, width: 'fit-content'}}><FIco kind="pdf" s={30} /><b style={{font: `700 20px ${INTER}`, color: P.ink}}>AML & CFT Policy 2026.pdf</b></div></div>; })()}
          <div style={{marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderRadius: 14, border: `2px solid ${t < 1.35 ? P.blue : P.line}`, font: `500 21px ${UI}`, color: t < 1.35 && t > 0.3 ? P.ink : P.mute}}>
            <div style={{flex: 1, whiteSpace: 'nowrap', overflow: 'hidden'}}>{t < 1.35 && t > 0.3 ? typed(q, t, 0.3, 1.2) : 'Ask or instruct the assistant…'}</div>
            <div style={{width: 40, height: 40, borderRadius: 12, background: P.blue, color: '#fff', display: 'grid', placeItems: 'center', transform: `scale(${1 + Math.max(0, 1 - Math.abs(t - 1.3) / 0.12) * 0.2})`}}>↑</div>
          </div>
          <div style={{font: `500 16px ${INTER}`, color: P.mute}}>🔒 Changes always ask for your confirmation first.</div>
        </div>
      </Card>
      <div style={{position: 'absolute', left: 110, top: 340}}><VHead lines={[['Answers,'], ['with', {key: 'sources.'}]]} start={2.0} size={100} /></div>
      <Sub at={2.6} style={{position: 'absolute', left: 114, top: 590}}>Only from files the user can access.</Sub>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= ASSISTANT: propose -> confirm ================= */
export const MConfirm: React.FC = () => {
  const {t, sp, io, out} = useT();
  const click = io(1.65, 2.0);
  const done = t > 1.85;
  const leave = io(2.95, 3.3, 0, 1, Easing.in(Easing.exp));
  return (
    <AbsoluteFill style={{transform: `scale(${lerp(1, 1.6, leave)})`, opacity: 1 - leave, filter: leave > 0.02 ? `blur(${leave * 16}px)` : undefined}}>
      <Space seed={43} gx={70} />
      <Card x={1000} y={300} w={720} ry={-10} rz={2} at={0.1}>
        <div style={{background: P.navy, color: '#fff', padding: '18px 26px', display: 'flex', alignItems: 'center', gap: 12, font: `700 21px ${INTER}`}}>✦ OTSO Assistant<span style={{marginLeft: 'auto', font: `500 14px ${MONO}`, letterSpacing: '.14em', color: '#9FB2D6'}}>PROPOSED ACTION</span></div>
        <div style={{padding: '26px 28px'}}>
          <div style={{font: `500 19px ${INTER}`, color: P.mute}}>Create folder</div>
          <div style={{font: `800 30px ${MANROPE}`, color: P.ink, marginTop: 4}}>Client Onboarding / KYC 2027</div>
          <div style={{display: 'flex', gap: 14, marginTop: 26}}><Btn tone={done ? 'green' : 'blue'} press={click}>{done ? '✓ Done' : 'Confirm'}</Btn><Btn tone="ghost">Cancel</Btn></div>
        </div>
      </Card>
      <Cursor x={lerp(1600, 1090, out(0.8, 1.6))} y={lerp(950, 610, out(0.8, 1.6))} click={click} />
      <div style={{position: 'absolute', left: 110, top: 340}}><VHead lines={[['A', 'person'], [{key: 'confirms.'}]]} start={0.3} size={100} /></div>
      <Sub at={1.0} style={{position: 'absolute', left: 114, top: 600}}>The AI proposes. Staff decide.</Sub>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= MANAGE: audit trail (append-only, newest on top) ================= */
const EV: [string, string, string, string, string][] = [['just now', 'aisha', 'VIEWED', 'KYC - Acme Capital Pte Ltd.pdf', 'conf'], ['1m', 'weiliang', 'EDITED', 'Compliance Review - Weekly Notes', 'int'], ['3m', 'siti', 'SHARED', 'Client Agreement - Meridian.pdf', 'conf'], ['6m', 'raj', 'SIGN-IN', 'Microsoft SSO', 'int'], ['9m', 'priya', 'DOWNLOADED', 'Q3 Market Outlook 2026.pdf', 'pub']];
export const MAudit: React.FC = () => {
  const {t, sp, io} = useT();
  const leave = useWhip(3.5, 3.85);
  const n = EV.filter((_, i) => t > 0.9 + (EV.length - 1 - i) * 0.22).length;
  const shown = EV.slice(EV.length - n);
  const hold = t > 2.4;
  return (
    <AbsoluteFill style={leave}>
      <Space seed={44} gx={62} floor />
      <Card x={700} y={170} w={1100} ry={-14} rx={10} at={0}>
        <div style={{padding: '26px 32px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}><span style={{font: `700 13px ${MONO}`, letterSpacing: '.12em', color: '#fff', background: P.navy, borderRadius: 99, padding: '5px 12px'}}>COMPLIANCE</span>
            <span style={{marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 10, font: `700 19px ${INTER}`, color: hold ? P.red : P.mute}}>Legal hold <Toggle on={hold} /></span></div>
          <div style={{font: `800 36px ${MANROPE}`, color: P.ink, marginTop: 10}}>Audit trail</div>
          <div style={{font: `500 18px ${INTER}`, color: P.mute}}>🔒 Append-only, enforced by the database.</div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginTop: 18}}>
            {[['27', 'events (24h)'], ['0', 'downloads'], ['4', 'shares'], ['0', 'flagged']].map(([v, l], i) => <div key={l} style={{padding: '14px 16px', borderRadius: 12, border: `1px solid ${P.line}`, ...pop(sp, 0.3 + i * 0.1)}}><div style={{font: `800 34px ${MANROPE}`, color: P.ink}}>{v}</div><div style={{font: `600 14px ${MONO}`, letterSpacing: '.08em', color: P.mute}}>{l.toUpperCase()}</div></div>)}
          </div>
          <div style={{marginTop: 16, minHeight: 330}}>
            {[...shown].reverse().map(([w, id, a, doc, c], i) => (
              <div key={doc} style={{display: 'flex', alignItems: 'center', gap: 14, padding: '11px 6px', borderTop: `1px solid ${P.line}`, ...(i === 0 ? pop(sp, 0.9 + (EV.length - n) * 0.22) : {})}}>
                <span style={{width: 92, font: `500 17px ${INTER}`, color: P.mute}}>{w}</span><Avatar id={id} size={34} />
                <span style={{width: 140, font: `700 14px ${INTER}`, letterSpacing: '.04em', color: P.ink, border: `1px solid ${P.line}`, borderRadius: 6, padding: '4px 8px', textAlign: 'center'}}>{a}</span>
                <span style={{flex: 1, font: `500 19px ${INTER}`, color: P.ink}}>{doc}</span><Badge kind={c as 'int'} /><span style={{font: `600 17px ${INTER}`, color: P.green}}>✓</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
      <div style={{position: 'absolute', left: 110, top: 150}}><VHead lines={[['Compliance'], ['by', {key: 'default.'}]]} start={0.2} size={92} /></div>
      {['Append-only audit trail', 'Legal hold', 'Classification levels', 'Per-file AI & download controls'].map((l, i) => {
        const q = sp(1.0 + i * 0.3, {damping: 12, stiffness: 170});
        return <div key={i} style={{position: 'absolute', left: 114, top: 460 + i * 70, transform: `translateX(${(1 - q) * -80}px)`, opacity: clamp01(q * 2), display: 'flex', alignItems: 'center', gap: 14, font: `600 25px ${INTER}`, color: V.pale}}><span style={{width: 30, height: 30, borderRadius: 15, background: V.cobalt, color: '#fff', display: 'grid', placeItems: 'center', font: `800 16px ${INTER}`, boxShadow: '0 0 16px rgba(61,123,255,.8)'}}>✓</span>{l}</div>;
      })}
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= OWN IT: your cloud, your data, your rules ================= */
export const MOwn: React.FC = () => {
  const {t, sp, io} = useT();
  const leave = useWhip(3.25, 3.6);
  const cube = sp(0.1, {damping: 14, stiffness: 100});
  const chips: [string, number, number][] = [['Runs in their own cloud account', -1, -150], ['Microsoft sign-in for every staff member', -1, 20], ['Their classification levels', -1, 190], ['Their drives, their structure', 1, -70], ['Four languages', 1, 120]];
  const CX = 1200, CY = 600;
  return (
    <AbsoluteFill style={leave}>
      <Space seed={45} gx={60} gy={55} floor />
      {/* the vault block: a glass server stack holding the company's platform */}
      <AbsoluteFill style={{perspective: 1800}}>
        <div style={{position: 'absolute', left: CX - 230, top: CY - 230, width: 460, transform: `translateY(${(1 - cube) * 500}px) rotateX(18deg) rotateY(${-24 + t * 3}deg)`, transformStyle: 'preserve-3d'}}>
          {[0, 1, 2].map((i) => (
            <Glass key={i} glow={0.9 - i * 0.2} style={{height: 130, marginTop: i ? 14 : 0, display: 'flex', alignItems: 'center', gap: 18, padding: '0 28px'}}>
              <div style={{display: 'flex', gap: 8}}>{[0, 1, 2].map((d) => <i key={d} style={{width: 12, height: 12, borderRadius: 6, background: (Math.floor(t * 3) + d + i) % 3 ? V.cobalt : '#BCD2FF', boxShadow: '0 0 10px rgba(61,123,255,.9)', display: 'block'}} />)}</div>
              <div style={{font: `700 22px ${INTER}`, color: V.pale}}>{['Documents & AI search', 'AI assistant', 'Team chat'][i]}</div>
            </Glass>
          ))}
          <div style={{marginTop: 18, textAlign: 'center', font: `600 15px ${MONO}`, letterSpacing: '.2em', color: V.ice}}>OTSO CLOUD · SINGAPORE REGION</div>
        </div>
      </AbsoluteFill>
      {chips.map(([c, dx, dy], i) => {
        const q = sp(0.9 + i * 0.22, {damping: 12, stiffness: 160});
        return <div key={c} style={{position: 'absolute', left: dx < 0 ? undefined : CX + 290, right: dx < 0 ? W - (CX - 290) : undefined, top: CY + dy, transform: `translateY(-50%) scale(${q})`, transformOrigin: dx < 0 ? 'right center' : 'left center', opacity: clamp01(q * 2)}}><Pill on={i === 0}>{c}</Pill></div>;
      })}
      <div style={{position: 'absolute', left: 110, top: 110}}><VHead lines={[['In', "OTSO's", 'own'], [{key: 'cloud.'}]]} start={0.2} size={88} /></div>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= OWN IT: grows with you ================= */
export const MGrows: React.FC = () => {
  const {t, sp, io} = useT();
  const zoom = io(2.65, 3.0, 0, 1, Easing.in(Easing.exp));
  const mods: [string, string, boolean][] = [['Documents & AI search', 'Store · find · summarise', false], ['AI assistant', 'Answers with sources', false], ['Team chat', 'Files stay documents', false], ['Next module', 'When OTSO needs it', true]];
  return (
    <AbsoluteFill style={{transform: `scale(${lerp(1, 1.5, zoom)})`, opacity: 1 - zoom}}>
      <Space seed={46} gy={60} floor />
      <AbsoluteFill style={{perspective: 1800}}>
        <div style={{position: 'absolute', left: 600, top: 330, width: 1200, transform: 'rotateX(30deg) rotateZ(-4deg)', transformStyle: 'preserve-3d'}}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26}}>
            {mods.map(([n, d, dashed], i) => {
              const q = sp(0.35 + i * 0.32, {damping: 11, stiffness: 160});
              return <div key={n} style={{transform: `translateZ(${(1 - q) * 500}px)`, opacity: clamp01(q * 2)}}>
                <Glass glow={dashed ? 0 : 0.8} style={{height: 210, padding: '30px 34px', border: dashed ? '2px dashed rgba(157,187,255,.6)' : undefined, background: dashed ? 'rgba(61,123,255,.06)' : undefined}}>
                  <div style={{font: `800 40px ${MANROPE}`, letterSpacing: '-0.02em', color: dashed ? V.ice : '#fff'}}>{dashed ? '＋ ' : ''}{n}</div>
                  <div style={{font: `500 24px ${INTER}`, color: V.mist, marginTop: 8}}>{d}</div>
                </Glass>
              </div>;
            })}
          </div>
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 110, top: 130}}><VHead lines={[['Built', 'to'], [{key: 'grow.'}]]} start={0.2} size={110} /></div>
      <Sub at={1.6} style={{position: 'absolute', left: 114, top: 400}}>Team chat added on the same platform.</Sub>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= CASE STUDY: the client ================= */
export const MClient: React.FC = () => {
  const {sp} = useT();
  const leave = useWhip(3.0, 3.4);
  const card = sp(0.3, {damping: 15, stiffness: 110});
  const facts: [string, string][] = [['Online brokerage', 'FX & CFD trading'], ['Several Asian markets', 'Operating across Asia'], ['130 staff accounts', 'Signed in with Microsoft']];
  return (
    <AbsoluteFill style={leave}>
      <Space seed={47} gx={60} floor />
      <div style={{position: 'absolute', left: 110, top: 320}}><VHead lines={[['Meet'], [{key: 'OTSO Markets.'}]]} start={0.15} size={110} /></div>
      <AbsoluteFill style={{perspective: 2000}}>
        <div style={{position: 'absolute', left: 1060, top: 200, transform: `translateY(${(1 - card) * 500}px) rotateY(-16deg) rotateX(6deg)`}}>
          <Glass glow={0.8} style={{width: 720, padding: '34px 36px'}}>
            <div style={{display: 'inline-block', padding: '14px 22px', borderRadius: 16, background: '#fff'}}><Img src={staticFile('otso-logo-trimmed.png')} style={{height: 70, display: 'block'}} /></div>
            {facts.map(([a, b], i) => <div key={a} style={{display: 'flex', alignItems: 'baseline', gap: 16, marginTop: i ? 18 : 30, paddingTop: 18, borderTop: '1px solid rgba(150,180,255,.2)', ...pop(sp, 0.8 + i * 0.2)}}>
              <span style={{font: `800 34px ${MANROPE}`, letterSpacing: '-0.02em'}}>{a}</span><span style={{font: `500 22px ${INTER}`, color: V.mist}}>{b}</span></div>)}
          </Glass>
        </div>
      </AbsoluteFill>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= CASE STUDY: the challenge, a regulated business ================= */
export const MRegulated: React.FC = () => {
  const {t, sp} = useT();
  const enter = useIn(0, 0.35);
  const leave = useWhip(2.65, 3.0);
  const reqs = ['Every change audited', 'No leaks through share links', 'Legal holds block deletion', 'Any file kept away from AI'];
  return (
    <AbsoluteFill style={t > 2.6 ? leave : enter}>
      <Space seed={48} gx={65} />
      <div style={{position: 'absolute', left: 110, top: 300}}><VHead lines={[['A', 'regulated'], ['business.'], ['Nothing', 'can', {key: 'slip.'}]]} start={0.15} size={96} /></div>
      <div style={{position: 'absolute', left: 1080, top: 260, display: 'flex', flexDirection: 'column', gap: 22}}>
        {reqs.map((r, i) => {
          const q = sp(0.6 + i * 0.25, {damping: 12, stiffness: 170});
          return <div key={r} style={{transform: `translateX(${(1 - q) * 300}px) rotate(${(1 - q) * 6}deg)`, opacity: clamp01(q * 2), marginLeft: i * 30}}>
            <Glass style={{width: 640, display: 'flex', alignItems: 'center', gap: 18, padding: '22px 26px'}}>
              <span style={{font: `700 14px ${MONO}`, letterSpacing: '.12em', color: V.red, border: `1px solid ${V.red}`, borderRadius: 6, padding: '4px 8px'}}>REQUIRED</span>
              <span style={{font: `700 28px ${INTER}`}}>{r}</span>
            </Glass>
          </div>;
        })}
      </div>
      <Vig />
    </AbsoluteFill>
  );
};

/* ================= CASE STUDY: how we delivered ================= */
export const MProcess: React.FC = () => {
  const {sp, io} = useT();
  const leave = io(3.1, 3.45, 0, 1, Easing.in(Easing.exp));
  const steps: [string, string, string][] = [['01', 'Requirements', 'Scoped with OTSO'], ['02', 'Clickable prototype', 'Approved by OTSO'], ['03', 'Production', 'Every screen tested against the prototype']];
  const line = io(0.6, 2.2);
  return (
    <AbsoluteFill style={{transform: `scale(${lerp(1, 1.4, leave)})`, opacity: 1 - leave, filter: leave > 0.02 ? `blur(${leave * 14}px)` : undefined}}>
      <Space seed={49} gy={55} floor />
      <div style={{position: 'absolute', left: 0, right: 0, top: 130, display: 'flex', justifyContent: 'center'}}><VHead lines={[['Prototype', 'first.', 'Then', {key: 'built.'}]]} start={0.1} size={96} align="center" /></div>
      <div style={{position: 'absolute', left: 260, top: 560, width: 1400 * line, height: 3, background: '#BCD2FF', boxShadow: '0 0 20px rgba(61,123,255,.9)'}} />
      {steps.map(([n, a, b], i) => {
        const q = sp(0.6 + i * 0.55, {damping: 12, stiffness: 150});
        return <div key={n} style={{position: 'absolute', left: 260 + i * 560 - 40, top: 420, width: 440, transform: `translateY(${(1 - q) * 80}px)`, opacity: clamp01(q * 2)}}>
          <div style={{width: 80, height: 80, borderRadius: 40, background: i === 2 ? V.cobalt : '#0E1A3A', border: '2px solid #BCD2FF', display: 'grid', placeItems: 'center', font: `800 26px ${MONO}`, color: '#fff', boxShadow: '0 0 30px rgba(61,123,255,.7)', marginTop: 100}}>{n}</div>
          <div style={{font: `800 36px ${MANROPE}`, color: '#fff', marginTop: 24, letterSpacing: '-0.02em'}}>{a}</div>
          <div style={{font: `500 22px ${INTER}`, color: V.mist, marginTop: 6}}>{b}</div>
        </div>;
      })}
      <Vig />
    </AbsoluteFill>
  );
};
