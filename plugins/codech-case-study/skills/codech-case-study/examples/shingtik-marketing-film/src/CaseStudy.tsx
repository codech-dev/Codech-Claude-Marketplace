import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile} from 'remotion';
import {Backdrop, C, Headline, INTER, MANROPE, MONO, NOTO, Orb, UI, Vignette, clamp01, lerp, useT} from './lib';

/* Case-study framing scenes (local time, t = 0 at the scene start). */

/** The client: who ShingTik is, before their challenge. 4.5 s. */
export const MeetClient: React.FC = () => {
  const {t, sp, io, out} = useT();
  const enter = io(0, 0.45, 0, 1, Easing.out(Easing.cubic));
  const exit = io(4.05, 4.5, 0, 1, Easing.in(Easing.cubic));
  const card = sp(0.25, {damping: 15, stiffness: 120});
  const facts: [string, number, string, string][] = [['1,800', 1800, 'products in the catalogue', ''], ['467', 467, 'customers ordering on WhatsApp', ''], ['B2B', 0, 'restaurants & retail outlets', '']];
  const packs = ['op-doubao', 'op-xianggutou-l', 'op-zhaie', 'op-chashao-qie', 'op-houtougu', 'op-surousi'];
  return (
    <AbsoluteFill style={{opacity: enter * (1 - exit), transform: `scale(${lerp(1.04, 1, enter) * lerp(1, 0.94, exit)})`}}>
      <Backdrop glowX={30} glowY={45} dots />
      <div style={{position: 'absolute', left: 118, top: 112}}>
        <div style={{font: `500 17px ${MONO}`, letterSpacing: '.18em', color: C.mute, marginBottom: 18, opacity: io(0.2, 0.6)}}>THE CLIENT</div>
        <Headline lines={[['Supplying'], ['hundreds', 'of'], [{gold: 'kitchens.'}]]} start={0.3} size={78} />
      </div>
      {/* client card */}
      <div style={{position: 'absolute', left: 118, top: 470, width: 640, padding: '30px 34px', borderRadius: 28, background: '#fff', transform: `translateY(${(1 - card) * 80}px)`, opacity: clamp01(card * 2), boxShadow: '0 50px 90px -30px rgba(60,45,20,.38),0 0 0 1px rgba(0,0,0,.05)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
          <div style={{width: 110, height: 110, borderRadius: 22, background: '#FFF8EF', display: 'grid', placeItems: 'center', boxShadow: '0 0 0 1px rgba(0,0,0,.06)'}}><Img src={staticFile('shingtik-logo-trimmed.png')} style={{width: 92}} /></div>
          <div>
            <div style={{font: `800 38px ${MANROPE}`, letterSpacing: '-0.03em', color: C.ink}}>ShingTik Vegetarian</div>
            <div style={{font: `700 24px ${NOTO}`, color: C.goldText, marginTop: 2}}>盛德素料</div>
          </div>
        </div>
        <div style={{font: `500 22px/1.45 ${INTER}`, color: '#4A4F5C', marginTop: 20}}>Wholesale distributor of vegetarian and frozen food, Malaysia</div>
      </div>
      {/* product shelf */}
      <div style={{position: 'absolute', left: 900, top: 150, width: 900, height: 360}}>
        {packs.map((p, i) => {
          const q = sp(0.6 + i * 0.1, {damping: 13, stiffness: 150});
          const x = (i % 3) * 300, y = Math.floor(i / 3) * 190;
          return <Img key={p} src={staticFile(`products/${p}.jpg`)} style={{position: 'absolute', left: x + Math.sin(t * 0.8 + i) * 6, top: y + (1 - q) * 70 + Math.cos(t * 0.7 + i) * 5, width: 170, height: 170, borderRadius: 22, objectFit: 'cover', opacity: clamp01(q * 2), transform: `rotate(${(i % 2 ? 3 : -3) * (1 - q * 0.5)}deg) scale(${lerp(0.7, 1, q)})`, boxShadow: '0 30px 60px -24px rgba(60,45,20,.45),0 0 0 1px rgba(0,0,0,.05)'}} />;
        })}
      </div>
      {/* fact tiles */}
      <div style={{position: 'absolute', left: 900, top: 640, display: 'flex', gap: 22}}>
        {facts.map(([label, n, sub], i) => {
          const q = sp(1.3 + i * 0.18, {damping: 13, stiffness: 160});
          const v = n ? Math.round(n * out(1.4 + i * 0.18, 2.6 + i * 0.18)).toLocaleString('en-US') : label;
          return (
            <div key={i} style={{width: 270, padding: '22px 24px', borderRadius: 22, background: '#fff', transform: `translateY(${(1 - q) * 60}px)`, opacity: clamp01(q * 2), boxShadow: '0 30px 60px -26px rgba(60,45,20,.4),0 0 0 1px rgba(0,0,0,.05)'}}>
              <div style={{font: `800 50px ${MANROPE}`, letterSpacing: '-0.03em', color: i === 1 ? C.goldText : C.ink, fontVariantNumeric: 'tabular-nums'}}>{v}</div>
              <div style={{font: `500 18px ${INTER}`, color: C.mute, marginTop: 4}}>{sub}</div>
            </div>
          );
        })}
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};

/** Our proposal (6 s): each challenge is a live mini-scene that gets pulled into the AI orb and comes out the other side as Codech's solution. */
const OX = 960, OY = 600; // orb centre
const TW = 400, TH = 124, CW = 470, CH = 130;
const TILES = [{x: 150, y: 345}, {x: 150, y: 540}, {x: 150, y: 735}];
const CARDS = [{x: 1330, y: 340}, {x: 1330, y: 535}, {x: 1330, y: 730}];
const bez = (a: [number, number], c: [number, number], b: [number, number], p: number): [number, number] =>
  [(1 - p) * (1 - p) * a[0] + 2 * (1 - p) * p * c[0] + p * p * b[0], (1 - p) * (1 - p) * a[1] + 2 * (1 - p) * p * c[1] + p * p * b[1]];
const SOL: [string, string, string][] = [
  ['AI ordering agent on WhatsApp', 'Text, photos and voice, 24/7', 'logos/whatsapp.svg'],
  ['Exact product matching', 'Across 1,800 items, even “my usual”', ''],
  ['Booked into SQL Account', 'Automatically, with CS able to step in', 'logos/sql-account.png'],
];
const Pain: React.FC<{i: number; t: number}> = ({i, t}) => {
  const jit = Math.sin(t * 23 + i * 2) * 1.6;
  const label = ['Orders as text, photos, voice', '1,800 look-alike products', 'Every order retyped by hand'][i];
  return (
    <div style={{width: TW, height: TH, borderRadius: 24, background: '#fff', padding: '16px 18px', boxShadow: '0 30px 60px -28px rgba(60,45,20,.45),0 0 0 1.5px rgba(229,72,77,.35)', display: 'flex', flexDirection: 'column', gap: 10, transform: `translateX(${jit}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 8, font: `600 15px ${MONO}`, letterSpacing: '.1em', color: C.red}}><span style={{width: 20, height: 20, borderRadius: 10, background: 'rgba(229,72,77,.14)', display: 'grid', placeItems: 'center', font: `800 13px ${INTER}`}}>!</span>{label.toUpperCase()}</div>
      {i === 0 && (
        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <span style={{padding: '8px 12px', borderRadius: 12, background: C.waOut, font: `500 17px ${UI}`, whiteSpace: 'nowrap'}}>香菇头大 5包</span>
          <Img src={staticFile('products/photo-doubao.jpg')} style={{width: 66, height: 66, borderRadius: 10, objectFit: 'cover'}} />
          <span style={{display: 'flex', alignItems: 'center', gap: 2, padding: '10px 10px', borderRadius: 12, background: C.waOut}}>{[8, 16, 11, 20, 9, 14, 18, 7, 12].map((h, k) => <i key={k} style={{display: 'block', width: 3, height: h * (0.6 + 0.4 * Math.abs(Math.sin(t * 6 + k))), borderRadius: 2, background: C.wa}} />)}</span>
        </div>
      )}
      {i === 1 && (
        <div style={{display: 'flex', alignItems: 'center', gap: 0, position: 'relative'}}>
          {['op-xianggutou-l', 'op-xianggu-qiu', 'op-houtougu', 'op-zhaie'].map((p, k) => <Img key={p} src={staticFile(`products/${p}.jpg`)} style={{width: 72, height: 72, borderRadius: 12, objectFit: 'cover', marginLeft: k ? -18 : 0, transform: `rotate(${(k - 1.5) * 6 + Math.sin(t * 3 + k) * 2}deg)`, boxShadow: '0 8px 16px -8px rgba(0,0,0,.35),0 0 0 2px #fff'}} />)}
          <span style={{marginLeft: 16, font: `800 30px ${MANROPE}`, color: C.red}}>?</span>
        </div>
      )}
      {i === 2 && (
        <div style={{display: 'grid', gridTemplateColumns: '90px 1fr', gap: 6, font: `500 15px ${MONO}`, color: '#5b6170'}}>
          <span>ITEM</span><span style={{background: '#F4F2EE', borderRadius: 6, padding: '3px 8px', color: C.ink}}>{'MSH-L 香菇头'.slice(0, Math.floor((t * 6) % 11))}<i style={{display: 'inline-block', width: 2, height: 15, background: C.ink, verticalAlign: 'middle', opacity: Math.floor(t * 4) % 2}} /></span>
          <span>QTY</span><span style={{background: 'rgba(229,72,77,.10)', borderRadius: 6, padding: '3px 8px', color: C.red}}>5 ✗</span>
        </div>
      )}
    </div>
  );
};
const Fix: React.FC<{i: number; check: number}> = ({i, check}) => (
  <div style={{width: CW, height: CH, borderRadius: 24, background: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 18, boxShadow: '0 40px 80px -30px rgba(60,45,20,.5),0 0 0 1.5px rgba(212,184,149,.8)'}}>
    <div style={{width: 64, height: 64, borderRadius: 18, flex: 'none', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg,#FBF3E6,#F2DCC0)'}}>
      {SOL[i][2] ? <Img src={staticFile(SOL[i][2])} style={{width: 38, height: 38, objectFit: 'contain'}} /> : <span style={{font: `800 19px ${MANROPE}`, color: C.green}}>98%</span>}
    </div>
    <div style={{flex: 1}}>
      <div style={{font: `500 13px ${MONO}`, letterSpacing: '.14em', color: C.goldText}}>OUR SOLUTION</div>
      <div style={{font: `800 25px/1.15 ${MANROPE}`, letterSpacing: '-0.02em', color: C.ink, marginTop: 3}}>{SOL[i][0]}</div>
      <div style={{font: `400 16px ${INTER}`, color: C.mute, marginTop: 3}}>{SOL[i][1]}</div>
    </div>
    <span style={{width: 40, height: 40, borderRadius: '50%', background: C.green, color: '#fff', display: 'grid', placeItems: 'center', font: `800 22px ${INTER}`, transform: `scale(${check})`, flex: 'none'}}>✓</span>
  </div>
);
export const Proposal: React.FC = () => {
  const {t, sp, io} = useT();
  const exit = io(5.45, 6.0, 0, 1, Easing.in(Easing.cubic));
  const orbIn = sp(0.9, {damping: 11, stiffness: 140});
  const push = io(0, 6, 1, 1.05, Easing.linear);
  return (
    <AbsoluteFill>
      <Backdrop glowX={50} glowY={55} dots />
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: `${OX}px ${OY}px`}}>
        <div style={{position: 'absolute', left: 118, top: 100, opacity: 1 - exit}}>
          <div style={{font: `500 17px ${MONO}`, letterSpacing: '.18em', color: C.mute, marginBottom: 14, opacity: io(0.1, 0.5)}}>WHAT CODECH PROPOSED</div>
          <Headline lines={[['Our', {gold: 'proposal.'}]]} start={0.15} size={96} />
        </div>
        {/* column labels */}
        <div style={{position: 'absolute', left: TILES[0].x + 4, top: 290, font: `600 15px ${MONO}`, letterSpacing: '.18em', color: C.red, opacity: io(0.4, 0.8) * (1 - exit)}}>THE CHALLENGE</div>
        <div style={{position: 'absolute', left: CARDS[0].x + 4, top: 300, font: `600 15px ${MONO}`, letterSpacing: '.18em', color: C.goldText, opacity: io(2.0, 2.4) * (1 - exit)}}>OUR SOLUTION</div>
        {/* glow + paths */}
        <div style={{position: 'absolute', left: OX - 330, top: OY - 330, width: 660, height: 660, borderRadius: '50%', background: 'rgba(240,160,90,.30)', filter: 'blur(70px)', opacity: orbIn * (1 - exit)}} />
        <svg width="1920" height="1080" style={{position: 'absolute', inset: 0, opacity: 1 - exit}}>
          {TILES.map((tl, i) => {
            const a: [number, number] = [tl.x + TW, tl.y + TH / 2], c: [number, number] = [(a[0] + OX) / 2, a[1]];
            const cd = CARDS[i], b: [number, number] = [cd.x, cd.y + CH / 2], c2: [number, number] = [(OX + b[0]) / 2, b[1]];
            const d1 = io(1.0 + i * 0.12, 1.6 + i * 0.12), d2 = io(2.0 + i * 0.55, 2.4 + i * 0.55);
            const L = 700;
            return (
              <g key={i}>
                <path d={`M${a[0]} ${a[1]} Q${c[0]} ${c[1]} ${OX} ${OY}`} fill="none" stroke="rgba(229,72,77,.35)" strokeWidth={2.5} strokeDasharray={L} strokeDashoffset={L * (1 - d1)} />
                <path d={`M${OX} ${OY} Q${c2[0]} ${c2[1]} ${b[0]} ${b[1]}`} fill="none" stroke="#C9A46A" strokeWidth={3} strokeDasharray={L} strokeDashoffset={L * (1 - d2)} />
              </g>
            );
          })}
        </svg>
        {/* challenge tiles: spring in, then get pulled into the orb */}
        {TILES.map((tl, i) => {
          const q = sp(0.3 + i * 0.15, {damping: 13, stiffness: 160});
          const pull = io(1.65 + i * 0.55, 2.1 + i * 0.55, 0, 1, Easing.in(Easing.cubic));
          const ghost = io(1.9 + i * 0.55, 2.3 + i * 0.55) * (1 - exit);
          const label = ['Orders as text, photos, voice', '1,800 look-alike products', 'Every order retyped by hand'][i];
          const ghostEl = ghost > 0 ? <div key={'g' + i} style={{position: 'absolute', left: tl.x, top: tl.y, width: TW, height: TH, borderRadius: 24, border: '2px dashed rgba(229,72,77,.35)', display: 'flex', alignItems: 'center', padding: '0 22px', opacity: ghost * 0.85}}>
            <span style={{position: 'relative', font: `600 21px ${UI}`, color: '#9A8F86'}}>{label}<i style={{position: 'absolute', left: -4, right: -4, top: '52%', height: 3, borderRadius: 2, background: C.red, opacity: 0.7, transformOrigin: 'left', transform: `scaleX(${io(2.2 + i * 0.55, 2.55 + i * 0.55)})`}} /></span>
          </div> : null;
          if (pull >= 1) return ghostEl;
          const a: [number, number] = [tl.x + TW / 2, tl.y + TH / 2], c: [number, number] = [(tl.x + TW + OX) / 2, tl.y + TH / 2];
          const [x, y] = bez(a, c, [OX, OY], pull);
          return (
            <React.Fragment key={i}>{ghostEl}<div style={{position: 'absolute', left: x - TW / 2, top: y - TH / 2, opacity: clamp01(q * 2) * (1 - pull * pull), transform: `translateX(${(1 - q) * -160}px) scale(${lerp(1, 0.12, pull)}) rotate(${pull * 25}deg)`, filter: pull > 0.05 ? `blur(${pull * 4}px)` : undefined}}>
              <Pain i={i} t={t} />
            </div></React.Fragment>
          );
        })}
        {/* orb */}
        {(() => {
          const pulse = [0, 1, 2].reduce((m, i) => Math.max(m, 1 - Math.abs(t - (2.1 + i * 0.55)) / 0.25), 0);
          const sz = 230 * lerp(0.3, 1, orbIn) * (1 + Math.max(0, pulse) * 0.12) * lerp(1, 1.6, exit);
          return (
            <div style={{position: 'absolute', left: OX - sz / 2, top: OY - sz / 2, opacity: clamp01(orbIn * 2)}}>
              <Orb size={sz} glow={1 + Math.max(0, pulse)} />
              <div style={{position: 'absolute', left: -40, top: -40, width: sz + 80, height: sz + 80, borderRadius: '50%', border: `2px solid rgba(212,170,110,${0.45 * (1 - exit)})`, transform: `scale(${1 + Math.max(0, pulse) * 0.25})`}} />
              <div style={{position: 'absolute', left: 0, right: 0, top: sz + 26, textAlign: 'center', font: `600 15px ${MONO}`, letterSpacing: '.18em', color: C.goldText, whiteSpace: 'nowrap', opacity: io(1.2, 1.6) * (1 - exit)}}>CODECH AI</div>
            </div>
          );
        })()}
        {/* solution cards: burst out of the orb and land */}
        {CARDS.map((cd, i) => {
          const go = io(2.15 + i * 0.55, 2.6 + i * 0.55, 0, 1, Easing.out(Easing.cubic));
          if (go <= 0) return null;
          const land = sp(2.6 + i * 0.55, {damping: 12, stiffness: 180});
          const check = sp(2.75 + i * 0.55, {damping: 10, stiffness: 200});
          const b: [number, number] = [cd.x + CW / 2, cd.y + CH / 2], c: [number, number] = [(OX + cd.x) / 2, cd.y + CH / 2];
          const [x, y] = bez([OX, OY], c, b, go);
          const [ex, ey] = [lerp(x, OX, exit), lerp(y, OY, exit)];
          return (
            <div key={i} style={{position: 'absolute', left: ex - CW / 2, top: ey - CH / 2, opacity: clamp01(go * 3) * (1 - exit * exit), transform: `scale(${lerp(0.15, 1, go) * (1 + (1 - land) * 0.06) * lerp(1, 0.2, exit)})`}}>
              <Fix i={i} check={check} />
            </div>
          );
        })}
      </AbsoluteFill>
      <Vignette />
    </AbsoluteFill>
  );
};


/** Case-study chapter pill, top centre (film time). */
const PARTS: [number, number, string][] = [
  [3.5, 15.6, 'The challenge'],
  [15.8, 68.8, 'Our solution'],
  [68.95, 76.0, 'The challenge'],
  [76.1, 95.9, 'Our solution'],
  [96.2, 105.2, 'The results'],
];
export const ChapterPill: React.FC = () => {
  const {t} = useT();
  const part = PARTS.find(([a, b]) => t >= a && t < b);
  if (!part) return null;
  const [a, b, label] = part;
  const vis = clamp01((t - a) / 0.35) * clamp01((b - t) / 0.3);
  const n = ['The challenge', 'Our solution', 'The results'].indexOf(label) + 1;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 30, display: 'flex', justifyContent: 'center', pointerEvents: 'none'}}>
      <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, padding: '10px 20px 10px 12px', borderRadius: 99, background: 'rgba(255,255,255,.92)', boxShadow: '0 14px 30px -14px rgba(40,30,10,.35),0 0 0 1px rgba(0,0,0,.05)',
        opacity: vis, transform: `translateY(${(1 - vis) * -14}px)`}}>
        <span style={{width: 28, height: 28, borderRadius: 14, background: n === 3 ? C.gold : n === 1 ? '#F3D6D2' : '#EFE7DA', color: n === 1 ? '#B4413B' : C.goldText, display: 'grid', placeItems: 'center', font: `700 14px ${MONO}`}}>{`0${n}`}</span>
        <span style={{font: `600 15px ${MONO}`, letterSpacing: '.16em', color: C.ink, textTransform: 'uppercase'}}>{label}</span>
      </div>
    </div>
  );
};
