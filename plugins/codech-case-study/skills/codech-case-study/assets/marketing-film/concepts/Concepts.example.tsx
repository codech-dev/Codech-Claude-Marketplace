import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {INTER, MANROPE, MONO, Crop, clamp01, lerp, useT} from './lib';

/* THROWAWAY concept frames for picking the OTSO film's look (A Midnight Vault, B Ink & Paper, C Infinite Canvas).
   Two stills each: the hero reveal and one product beat on a real screen. */
const W = 1920, H = 1080;
const Word: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => <span style={{display: 'inline-block', ...style}}>{children}</span>;
const Win: React.FC<{src: string; k: number; bar: string; border: string; children?: React.ReactNode; style?: React.CSSProperties; imgStyle?: React.CSSProperties}> = ({src, k, bar, border, children, style, imgStyle}) => (
  <div style={{width: 1440 * k, borderRadius: 16, overflow: 'hidden', position: 'relative', border: `1px solid ${border}`, ...style}}>
    <div style={{height: 34, background: bar, display: 'flex', alignItems: 'center', gap: 7, padding: '0 14px'}}>{[0, 1, 2].map((i) => <i key={i} style={{width: 10, height: 10, borderRadius: 5, background: border, display: 'block'}} />)}</div>
    <div style={{position: 'relative', width: 1440 * k, height: 900 * k}}><Img src={staticFile(src)} style={{width: 1440 * k, height: 900 * k, display: 'block', ...imgStyle}} />{children}</div>
  </div>
);

/* ================= A · MIDNIGHT VAULT ================= */
const A = {bg0: '#0D1836', bg1: '#04060D', cobalt: '#3D7BFF', ice: '#9DBBFF', glass: 'rgba(160,190,255,.07)', edge: 'rgba(150,180,255,.28)', gold: '#D4B895'};
const Dust: React.FC<{n?: number; seed?: number}> = ({n = 70, seed = 1}) => {
  const {t} = useT();
  return <>{Array.from({length: n}, (_, i) => {
    const x = (Math.sin(i * 91.7 + seed) * 0.5 + 0.5) * W, y = (Math.cos(i * 53.3 + seed) * 0.5 + 0.5) * H;
    const r = 1 + (i % 4) * 0.7;
    return <i key={i} style={{position: 'absolute', left: x + Math.sin(t * 0.3 + i) * 12, top: y - t * (4 + (i % 5) * 3), width: r * 2, height: r * 2, borderRadius: r, background: A.ice, opacity: 0.08 + (i % 6) * 0.05, display: 'block'}} />;
  })}</>;
};
const Slab: React.FC<{x: number; y: number; w: number; h: number; z: number; ry: number; lit: number; label: string}> = ({x, y, w, h, z, ry, lit, label}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `translateZ(${z}px) rotateY(${ry}deg) rotateX(8deg)`, borderRadius: 18,
    background: `linear-gradient(150deg,rgba(170,200,255,${0.1 + lit * 0.12}),rgba(120,150,255,.03))`, border: `1px solid rgba(150,180,255,${0.25 + lit * 0.5})`,
    boxShadow: `0 40px 80px -30px rgba(0,0,0,.9),inset 0 1px 0 rgba(255,255,255,.15)${lit ? `,0 0 ${60 * lit}px rgba(61,123,255,${0.45 * lit})` : ''}`, padding: 22, overflow: 'hidden'}}>
    <div style={{width: 34, height: 42, borderRadius: 6, border: `2px solid rgba(157,187,255,${0.4 + lit * 0.6})`}} />
    {[0.85, 0.7, 0.92, 0.55].map((f, i) => <div key={i} style={{height: 7, width: `${f * 100}%`, borderRadius: 4, background: `rgba(157,187,255,${0.15 + lit * 0.35})`, marginTop: i ? 12 : 22}} />)}
    <div style={{position: 'absolute', left: 22, bottom: 16, font: `600 14px ${MONO}`, letterSpacing: '.08em', color: `rgba(190,210,255,${0.45 + lit * 0.5})`}}>{label}</div>
  </div>
);
export const VaultHero: React.FC = () => {
  const {t} = useT();
  const beam = 0.62; // beam x position (0..1)
  const slabs: [number, number, number, number, number, number, string][] = [
    [180, 130, 230, 290, -260, 24, 'KYC_ACME.PDF'], [470, 420, 210, 260, -120, 18, 'AGREEMENT.PDF'], [760, 90, 220, 280, -380, 12, 'AML_POLICY.DOCX'],
    [1080, 400, 230, 290, -60, -10, 'PASSPORT.JPG'], [1360, 130, 210, 260, -300, -18, 'Q3_RESEARCH.PDF'], [1600, 420, 220, 280, -180, -24, 'FEES.XLSX']];
  return (
    <AbsoluteFill style={{background: `radial-gradient(90% 80% at 55% 40%,${A.bg0},${A.bg1})`, overflow: 'hidden'}}>
      <Dust />
      <AbsoluteFill style={{perspective: 1600}}><AbsoluteFill style={{transformStyle: 'preserve-3d'}}>
        {slabs.map((s, i) => { const lit = clamp01(1 - Math.abs((s[0] + s[2] / 2) / W - beam) * 5); return <Slab key={i} x={s[0]} y={s[1]} w={s[2]} h={s[3]} z={s[4]} ry={s[5]} lit={lit} label={s[6]} />; })}
      </AbsoluteFill></AbsoluteFill>
      {/* the AI: a vertical cobalt scan beam sweeping the archive */}
      <div style={{position: 'absolute', left: W * beam - 160, top: 0, width: 320, height: H, background: 'linear-gradient(90deg,rgba(61,123,255,0),rgba(61,123,255,.22),rgba(61,123,255,0))'}} />
      <div style={{position: 'absolute', left: W * beam - 2, top: 0, width: 4, height: H, background: '#BCD2FF', boxShadow: '0 0 30px 8px rgba(61,123,255,.9),0 0 120px 30px rgba(61,123,255,.45)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 110, textAlign: 'center', zIndex: 10, transform: 'translateZ(400px)'}}>
        <div style={{font: `800 132px/1 ${MANROPE}`, letterSpacing: '-0.045em', color: '#fff', textShadow: '0 10px 40px rgba(0,0,0,.8)'}}>Meet your <Word style={{background: 'linear-gradient(180deg,#D6E3FF,#3D7BFF)', WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 0 30px rgba(61,123,255,.6))'}}>AI workspace.</Word></div>
        <div style={{font: `600 18px ${MONO}`, letterSpacing: '.32em', color: A.ice, opacity: 0.8, marginTop: 30}}>BUILT BY CODECH</div>
      </div>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(120% 100% at 50% 40%,rgba(0,0,0,0) 55%,rgba(0,0,0,.6) 100%)'}} />
    </AbsoluteFill>
  );
};
export const VaultProduct: React.FC = () => {
  const k = 0.8;
  return (
    <AbsoluteFill style={{background: `radial-gradient(90% 80% at 60% 45%,${A.bg0},${A.bg1})`, overflow: 'hidden'}}>
      <Dust seed={4} />
      {/* floor reflection glow */}
      <div style={{position: 'absolute', left: 500, top: 820, width: 1300, height: 300, borderRadius: '50%', background: 'rgba(61,123,255,.25)', filter: 'blur(80px)'}} />
      <AbsoluteFill style={{perspective: 2200}}>
        <div style={{position: 'absolute', left: 640, top: 190, transform: 'rotateY(-20deg) rotateX(6deg)'}}>
          <Win src="screens/09-search.jpg" k={k} bar="#0E1630" border="rgba(150,180,255,.35)" style={{boxShadow: '0 80px 140px -40px rgba(0,0,0,.95),0 0 0 1px rgba(150,180,255,.25),-30px 0 90px -20px rgba(61,123,255,.55)'}}>
            <div style={{position: 'absolute', inset: 0, background: 'rgba(5,10,30,.35)'}} />
            <div style={{position: 'absolute', left: 330 * k, top: 432 * k, transform: 'translateY(-10px) scale(1.06)'}}>
              <Crop src="screens/09-search.jpg" x={330} y={432} w={1035} h={99} k={k} style={{borderRadius: 10, boxShadow: '0 0 0 2px #3D7BFF,0 0 60px rgba(61,123,255,.8),0 40px 80px -20px rgba(0,0,0,.9)'}} />
            </div>
          </Win>
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 1530, top: 520, padding: '10px 18px', borderRadius: 99, background: 'rgba(61,123,255,.18)', border: '1px solid #3D7BFF', color: '#CFE0FF', font: `700 22px ${INTER}`, boxShadow: '0 0 40px rgba(61,123,255,.5)'}}>94% match · by meaning</div>
      <div style={{position: 'absolute', left: 110, top: 360, font: `800 108px/1.02 ${MANROPE}`, letterSpacing: '-0.045em', color: '#fff'}}>Search by<br /><Word style={{color: '#7FA8FF', textShadow: '0 0 40px rgba(61,123,255,.7)'}}>meaning.</Word></div>
      <div style={{position: 'absolute', left: 114, top: 620, font: `500 26px ${INTER}`, color: 'rgba(200,215,255,.65)'}}>English · 中文 · scanned PDFs</div>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(120% 100% at 50% 40%,rgba(0,0,0,0) 55%,rgba(0,0,0,.6) 100%)'}} />
    </AbsoluteFill>
  );
};

/* ================= B · INK & PAPER ================= */
const B = {paper: '#FDFDFB', graphite: '#24262B', pencil: '#9A9DA4', ink: '#1E46F0', inkSoft: '#DCE4FF'};
const Paper: React.FC = () => (
  <>
    <div style={{position: 'absolute', inset: 0, background: B.paper}} />
    <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: 0.5}}><filter id="pg"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" /><feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.08 0" /></filter><rect width={W} height={H} filter="url(#pg)" /></svg>
  </>
);
/** a pencil-sketched document: wobbly outline + scribbled lines; ink = 0..1 floods it with cobalt */
const SketchDoc: React.FC<{x: number; y: number; s?: number; rot?: number; ink?: number; seed?: number}> = ({x, y, s = 1, rot = 0, ink = 0, seed = 0}) => {
  const wob = (k: number) => Math.sin(k * 12.9898 + seed * 78.233) * 2.2;
  const w = 200, h = 260;
  const outline = `M${4 + wob(1)} ${2 + wob(2)} L${w - 46 + wob(3)} ${wob(4)} L${w + wob(5)} ${46 + wob(6)} L${w - 2 + wob(7)} ${h + wob(8)} L${wob(9)} ${h - 2 + wob(10)} Z M${w - 46} 0 L${w - 44 + wob(11)} ${44} L${w} 46`;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg) scale(${s})`, transformOrigin: 'top left'}}>
      <svg width={w + 20} height={h + 20} viewBox={`-10 -10 ${w + 20} ${h + 20}`} style={{overflow: 'visible'}}>
        <defs><filter id={`bl${seed}`}><feTurbulence baseFrequency="0.04" numOctaves="2" seed={seed + 2} /><feDisplacementMap in="SourceGraphic" scale="14" /></filter></defs>
        {ink > 0 && <path d={outline.split(' M')[0]} fill={B.ink} opacity={ink * 0.92} filter={`url(#bl${seed})`} />}
        <path d={outline} fill="none" stroke={ink > 0.5 ? '#fff' : B.graphite} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" />
        {[60, 92, 124, 156, 188].map((yy, i) => <path key={i} d={`M24 ${yy + wob(20 + i)} Q ${w / 2} ${yy + wob(30 + i) * 2} ${w - 30 - (i % 2) * 40} ${yy + wob(40 + i)}`} fill="none" stroke={ink > 0.5 ? 'rgba(255,255,255,.85)' : B.pencil} strokeWidth={2} strokeLinecap="round" />)}
      </svg>
    </div>
  );
};
export const InkHero: React.FC = () => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <Paper />
    <SketchDoc x={210} y={150} rot={-8} seed={1} />
    <SketchDoc x={520} y={110} rot={4} s={0.85} seed={2} />
    <SketchDoc x={1180} y={130} rot={-3} s={0.9} seed={3} />
    <SketchDoc x={1480} y={170} rot={7} seed={4} />
    <SketchDoc x={860} y={90} rot={-1} s={1.1} ink={1} seed={5} />
    {/* ink drip line from the understood doc into the headline */}
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}><path d="M975 400 C 980 480, 940 520, 960 600" stroke={B.ink} strokeWidth={6} fill="none" strokeLinecap="round" /></svg>
    <div style={{position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center'}}>
      <div style={{font: `800 128px/1 ${MANROPE}`, letterSpacing: '-0.045em', color: B.graphite}}>Meet your <Word style={{color: B.ink, position: 'relative'}}>AI workspace.
        <svg width="760" height="40" viewBox="0 0 760 40" style={{position: 'absolute', left: 0, bottom: -26}}><path d="M6 24 C 140 6, 300 34, 450 16 S 700 30, 754 12" stroke={B.ink} strokeWidth={7} fill="none" strokeLinecap="round" /></svg></Word></div>
      <div style={{font: `500 24px ${MONO}`, letterSpacing: '.24em', color: B.pencil, marginTop: 60}}>BUILT BY CODECH</div>
    </div>
  </AbsoluteFill>
);
export const InkProduct: React.FC = () => {
  const k = 0.74;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Paper />
      <div style={{position: 'absolute', left: 740, top: 200, transform: 'rotate(-2deg)'}}>
        <Win src="screens/05-viewer-details.jpg" k={k} bar="#F2F2F0" border="#2A2C31" style={{boxShadow: '14px 14px 0 #24262B'}} imgStyle={{filter: 'grayscale(1) contrast(1.05)', opacity: 0.55}}>
          {/* only what the AI understood is in colour */}
          <div style={{position: 'absolute', left: 1105 * k, top: 335 * k, transform: 'scale(1.18)', transformOrigin: 'left top'}}>
            <Crop src="screens/05-viewer-details.jpg" x={1105} y={335} w={330} h={320} k={k} style={{borderRadius: 4, boxShadow: '8px 8px 0 #1E46F0'}} />
          </div>
        </Win>
      </div>
      {/* hand-drawn ink loop + arrow to the AI panel */}
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <path d="M1520 330 C 1640 290, 1850 330, 1850 500 S 1680 740, 1560 660 S 1460 390, 1560 330" stroke={B.ink} strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d="M560 700 C 800 690, 1150 760, 1500 600" stroke={B.graphite} strokeWidth={3} fill="none" strokeDasharray="2 12" strokeLinecap="round" />
        <path d="M1478 585 L1505 600 L1482 626" stroke={B.graphite} strokeWidth={3} fill="none" strokeLinecap="round" />
      </svg>
      <div style={{position: 'absolute', left: 110, top: 330, font: `800 104px/1.02 ${MANROPE}`, letterSpacing: '-0.045em', color: B.graphite}}>Every file,<br /><Word style={{color: B.ink}}>understood.</Word></div>
      <div style={{position: 'absolute', left: 114, top: 600, font: `500 25px ${INTER}`, color: '#6B6E76'}}>Summary · tags · key facts</div>
    </AbsoluteFill>
  );
};

/* ================= C · INFINITE CANVAS ================= */
const Cc = {slate: '#E8ECF2', dot: '#C3CAD6', ink: '#111827', violet: '#7C5CFF', blue: '#2F7BFF', sel: '#7C5CFF'};
const Grid: React.FC<{ox?: number; oy?: number}> = ({ox = 0, oy = 0}) => (
  <div style={{position: 'absolute', inset: 0, background: Cc.slate, backgroundImage: `radial-gradient(${Cc.dot} 1.8px, transparent 1.8px)`, backgroundSize: '36px 36px', backgroundPosition: `${ox}px ${oy}px`}} />
);
const Caret: React.FC<{h: number}> = ({h}) => <span style={{display: 'inline-block', width: h * 0.09, height: h, borderRadius: h * 0.05, background: `linear-gradient(180deg,${Cc.violet},${Cc.blue})`, boxShadow: `0 0 ${h * 0.5}px rgba(124,92,255,.6)`, verticalAlign: 'middle'}} />;
const Artboard: React.FC<{x: number; y: number; label: string; src?: string; k: number; sel?: boolean; dim?: boolean}> = ({x, y, label, src, k, sel, dim}) => (
  <div style={{position: 'absolute', left: x, top: y, opacity: dim ? 0.55 : 1}}>
    <div style={{font: `600 15px ${INTER}`, color: sel ? Cc.sel : '#6B7280', marginBottom: 8}}>{label}</div>
    <div style={{position: 'relative', width: 1440 * k, height: 900 * k, borderRadius: 6, overflow: 'hidden', background: '#fff', boxShadow: '0 30px 60px -30px rgba(17,24,39,.35)', outline: sel ? `3px solid ${Cc.sel}` : 'none', outlineOffset: 4}}>
      {src && <Img src={staticFile(src)} style={{width: '100%', height: '100%'}} />}
    </div>
  </div>
);
export const CanvasHero: React.FC = () => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <Grid />
    <Artboard x={-120} y={90} label="Drive" src="screens/02-home.jpg" k={0.34} dim />
    <Artboard x={1500} y={110} label="Assistant" src="screens/19-assistant.jpg" k={0.34} dim />
    <Artboard x={-60} y={720} label="Audit trail" src="screens/13-audit.jpg" k={0.3} dim />
    <Artboard x={1440} y={740} label="Team chat" src="chat/chat-workspace.png" k={0.32} dim />
    {/* connectors */}
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      {[[370, 260], [1500, 270], [380, 860], [1440, 900]].map(([x, y], i) => <path key={i} d={`M960 520 C ${(960 + x) / 2} 520, ${(960 + x) / 2} ${y}, ${x} ${y}`} stroke={Cc.violet} strokeWidth={2.5} fill="none" strokeDasharray="8 8" opacity={0.6} />)}
    </svg>
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
      <div style={{padding: '30px 46px', borderRadius: 28, background: '#fff', boxShadow: '0 50px 100px -40px rgba(17,24,39,.45),0 0 0 1px rgba(17,24,39,.06)', font: `800 112px/1 ${MANROPE}`, letterSpacing: '-0.045em', color: Cc.ink}}>
        Meet your <Word style={{background: `linear-gradient(90deg,${Cc.violet},${Cc.blue})`, WebkitBackgroundClip: 'text', color: 'transparent'}}>AI workspace</Word><Caret h={110} />
      </div>
      <div style={{font: `600 18px ${MONO}`, letterSpacing: '.28em', color: '#6B7280', marginTop: 30}}>BUILT BY CODECH</div>
    </AbsoluteFill>
  </AbsoluteFill>
);
export const CanvasProduct: React.FC = () => {
  const k = 0.72;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Grid ox={14} oy={6} />
      <Artboard x={800} y={150} label="Assistant · answers with sources" src="screens/19-assistant.jpg" k={k} sel />
      {/* figma-style selection on the cited source + comment pin */}
      <div style={{position: 'absolute', left: 800 + 1094 * k - 6, top: 150 + 23 + 692 * k - 6, width: 313 * k + 12, height: 32 * k + 12, border: `3px solid ${Cc.blue}`, borderRadius: 6}}>
        {[[-6, -6], [313 * k + 3, -6], [-6, 32 * k + 3], [313 * k + 3, 32 * k + 3]].map(([x, y], i) => <i key={i} style={{position: 'absolute', left: x, top: y, width: 9, height: 9, background: '#fff', border: `2px solid ${Cc.blue}`, display: 'block'}} />)}
        <div style={{position: 'absolute', left: -2, top: -40, padding: '5px 10px', borderRadius: 6, background: Cc.blue, color: '#fff', font: `700 15px ${INTER}`, whiteSpace: 'nowrap'}}>Source · AML & CFT Policy 2026.pdf</div>
      </div>
      <div style={{position: 'absolute', left: 110, top: 360, font: `800 104px/1.02 ${MANROPE}`, letterSpacing: '-0.045em', color: Cc.ink}}>Answers,<br />with <Word style={{background: `linear-gradient(90deg,${Cc.violet},${Cc.blue})`, WebkitBackgroundClip: 'text', color: 'transparent'}}>sources</Word><Caret h={96} /></div>
      {/* minimap */}
      <div style={{position: 'absolute', right: 40, bottom: 40, width: 200, height: 120, borderRadius: 10, background: 'rgba(255,255,255,.8)', boxShadow: '0 10px 30px -12px rgba(17,24,39,.3)'}}>
        {[[20, 20], [90, 30], [40, 70], [130, 70]].map(([x, y], i) => <i key={i} style={{position: 'absolute', left: x, top: y, width: 44, height: 28, borderRadius: 3, background: i === 1 ? Cc.violet : '#CBD2DD', display: 'block'}} />)}
      </div>
    </AbsoluteFill>
  );
};
