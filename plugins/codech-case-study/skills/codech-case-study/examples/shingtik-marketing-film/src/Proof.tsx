import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile} from 'remotion';
import {getLength, getPointAtLength} from '@remotion/paths';
import {Backdrop, Bubble, C, Cursor, Headline, INTER, MANROPE, MONO, NOTO, Orb, Phone, PhotoTile, Play, SendBtn, StatusBar, UI, Vignette, Wave, clamp01, lerp, useT} from './lib';

const W = 1920, H = 1080;
const ORB = 160; // transition orb base size
const AV = {x: 1100, y: 400, size: 170}; // agent avatar on the Meet card

/* ---------------- HOOK ---------------- */
const ROWS: [string, string, string, string, number, string][] = [
  ['K', 'Kepong 店', '香菇头大 5包, 素叉烧 3包', '23:47', 12, '#8A6A3A'], ['C', 'Cheras 店', '📷 Photo', '23:46', 8, '#5E7340'], ['P', 'Puchong 店', '🎤 Voice message (0:14)', '23:45', 5, '#3A6283'],
  ['L', 'Klang 店', 'Tolong hantar 3 kotak esok', '23:41', 9, '#5B4C8A'], ['I', 'Ipoh 店', 'Same as last week boss 🙏', '23:38', 3, '#9A5A2A'], ['S', 'Seremban 店', 'AA豆包 x2 PKT', '23:30', 6, '#0E5B47'],
  ['B', 'Bangsar 店', '猴头菇 还有吗?', '23:22', 2, '#B42318'], ['M', 'Melaka 店', '🎤 Voice message (0:21)', '23:15', 4, '#3A6283'], ['J', 'Johor 店', 'Add 2 ctn 叉烧', '23:02', 7, '#5E7340']];
type B = {kind: 't' | 'p' | 'v'; txt: string; x: number; y: number; s: number; r: number; out?: boolean};
const BUBS: B[] = [
  {kind: 't', txt: '香菇头大 5包', x: 760, y: 430, s: 1.1, r: -6, out: true}, {kind: 'p', txt: '豆', x: 1640, y: 140, s: 1, r: 8}, {kind: 'v', txt: '0:09', x: 820, y: 640, s: 1.05, r: -4},
  {kind: 't', txt: 'Same as last week boss 🙏', x: 1520, y: 760, s: 1.15, r: 5}, {kind: 't', txt: 'Tolong hantar 3 kotak', x: 300, y: 820, s: 1.2, r: -3, out: true}, {kind: 'v', txt: '0:14', x: 1660, y: 420, s: 1, r: 6},
  {kind: 'p', txt: '香', x: 560, y: 580, s: 0.9, r: -10}, {kind: 't', txt: '猴头菇 还有吗?', x: 1460, y: 960, s: 1, r: -4, out: true}, {kind: 't', txt: 'Add 2 ctn 叉烧', x: 140, y: 560, s: 1.05, r: 4},
  {kind: 'v', txt: '0:21', x: 980, y: 900, s: 1.1, r: 3}, {kind: 'p', txt: '鸡', x: 1760, y: 620, s: 0.85, r: -6}, {kind: 't', txt: 'AA豆包 x2 PKT', x: 640, y: 960, s: 1.1, r: 6, out: true},
  {kind: 't', txt: '明天几点送?', x: 1180, y: 60, s: 0.95, r: -5}, {kind: 't', txt: '素肉丝 3包 + 豆包 10', x: 360, y: 400, s: 1, r: 3, out: true}, {kind: 'p', txt: '素', x: 120, y: 760, s: 0.8, r: 10},
  {kind: 't', txt: '斋鹅 2条 送 Kepong', x: 1500, y: 300, s: 1.05, r: -3, out: true}];
const ORIGIN = {x: 1190, y: 580};

const BubbleView: React.FC<{b: B; t: number}> = ({b, t}) =>
  b.kind === 't' ? <Bubble out={b.out} size={26}>{b.txt}</Bubble> :
  b.kind === 'p' ? <div style={{padding: 8, borderRadius: 16, background: C.waOut, boxShadow: '0 22px 40px -16px rgba(40,30,10,.35)'}}><PhotoTile ch={b.txt} w={190} /></div> :
  <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderRadius: 18, background: C.waOut, boxShadow: '0 22px 40px -16px rgba(40,30,10,.35)'}}><Play /><Wave n={22} on={9} t={t} /><span style={{font: `500 15px ${INTER}`, color: '#667'}}>{b.txt}</span></div>;

export const Hook: React.FC = () => {
  const {t, sp, io, out} = useT();
  const exit = io(4.35, 4.85);
  // camera punches on each badge jump
  const punch = (s: number) => (t > s ? Math.max(0, 1 - (t - s) / 0.3) ** 2 : 0);
  const cam = 1 + 0.03 * (t - 1.3) / 3 + 0.035 * (punch(2.4) + punch(2.9) + punch(3.4));
  // cold-open type morphs into the headline position
  const slam = sp(0.05, {damping: 12, stiffness: 140});
  const morph = sp(1.25, {damping: 20, stiffness: 110});
  const hx = lerp(330, 118, morph), hy = lerp(300, 104, morph), hs = lerp(1, 98 / 230, morph) * lerp(1.35, 1, slam);
  // phone flight
  const pp = sp(1.3, {damping: 16, stiffness: 100});
  const rotY = lerp(-78, -16, pp) + Math.sin(t * 0.7) * 3 + (t - 1.3) * 1.6, rotX = lerp(38, 6, pp), ty = lerp(1250, 0, pp);
  const badge = t < 2.4 ? '12' : t < 2.9 ? '47' : '99+';
  const lastJump = t < 2.4 ? 2.2 : t < 2.9 ? 2.4 : t < 3.4 ? 2.9 : 3.4;
  const bpop = 1 + 0.35 * Math.max(0, 1 - (t - lastJump) / 0.25);
  return (
    <AbsoluteFill style={{transform: `scale(${cam * lerp(1, 0.86, exit)})`, opacity: 1 - exit, filter: exit > 0 ? `blur(${exit * 10}px)` : undefined}}>
      {/* phone */}
      <div style={{position: 'absolute', left: 990, top: 175, perspective: 1800, opacity: t < 1.3 ? 0 : 1}}>
        <div style={{transform: `translateY(${ty}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`, transformStyle: 'preserve-3d'}}>
          <Phone scale={1.06} bg="#fff">
            <StatusBar time="23:47" />
            <div style={{background: C.wa, color: '#fff', padding: '6px 20px 14px', flex: 'none'}}>
              <div style={{font: `700 26px ${INTER}`}}>Chats</div>
              <div style={{marginTop: 10, height: 36, borderRadius: 18, background: 'rgba(255,255,255,.18)', font: `400 14px ${INTER}`, display: 'flex', alignItems: 'center', padding: '0 14px'}}>🔍 Search</div>
            </div>
            <div style={{background: '#fff', flex: 1}}>
              {ROWS.map((r, i) => {
                const p = out(1.65 + i * 0.07, 2.05 + i * 0.07);
                const cnt = Math.round(r[4] * out(2.2 + i * 0.05, 3.2 + i * 0.05)) || 1;
                return (
                  <div key={i} style={{display: 'flex', gap: 12, alignItems: 'center', padding: '11px 16px', borderBottom: '1px solid #f0f0f0', opacity: p, transform: `translateX(${(1 - p) * 40}px)`}}>
                    <div style={{width: 44, height: 44, borderRadius: '50%', background: r[5], color: '#fff', display: 'grid', placeItems: 'center', font: `700 19px ${NOTO}`, flex: 'none'}}>{r[0]}</div>
                    <div style={{flex: 1, minWidth: 0}}>
                      <div style={{display: 'flex', justifyContent: 'space-between'}}><b style={{font: `600 16px ${UI}`}}>{r[1]}</b><span style={{font: `600 12px ${INTER}`, color: '#1FA855'}}>{r[3]}</span></div>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 3}}>
                        <span style={{font: `400 14px ${UI}`, color: '#667', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200}}>{r[2]}</span>
                        <span style={{minWidth: 22, height: 22, borderRadius: 11, background: '#25D366', color: '#fff', font: `700 12px ${INTER}`, display: 'grid', placeItems: 'center', padding: '0 6px'}}>{cnt}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Phone>
          <div style={{position: 'absolute', left: 330, top: -10, transform: `translateZ(60px) scale(${sp(2.2, {damping: 9}) * bpop})`, minWidth: 116, height: 70, borderRadius: 35, background: C.red, color: '#fff', font: `800 34px ${INTER}`, display: 'grid', placeItems: 'center', padding: '0 16px', boxShadow: '0 14px 30px -8px rgba(229,72,77,.6)'}}>{badge}</div>
        </div>
      </div>
      {/* notification banners */}
      {[['Kepong 店', '香菇头大 5包, 素叉烧 3包, 斋鹅 2条', 'now'], ['Cheras 店', '📷 Photo', '1m'], ['Puchong 店', '🎤 Voice message', '2m']].map((n, i) => {
        const p = sp(1.85 + i * 0.22, {damping: 15, stiffness: 150});
        return (
          <div key={i} style={{position: 'absolute', left: 1330 - i * 24, top: 90 + (2 - i) * 18 + (1 - p) * -220, opacity: p * (1 - i * 0.22), transform: `scale(${1 - i * 0.05})`, transformOrigin: 'top center', zIndex: 3 - i,
            width: 440, padding: '14px 18px', display: 'flex', gap: 14, alignItems: 'center', borderRadius: 22, background: 'rgba(255,255,255,.86)', boxShadow: '0 30px 60px -24px rgba(40,30,10,.4)', border: '1px solid rgba(255,255,255,.9)'}}>
            <div style={{width: 44, height: 44, borderRadius: 12, background: '#25D366', display: 'grid', placeItems: 'center', flex: 'none'}}><Img src={staticFile('logos/whatsapp.svg')} style={{width: 28, filter: 'brightness(10)'}} /></div>
            <div style={{flex: 1}}><div style={{display: 'flex', justifyContent: 'space-between'}}><b style={{font: `700 17px ${UI}`}}>ShingTik 盛德 · {n[0]}</b><span style={{font: `500 13px ${INTER}`, color: '#889'}}>{n[2]}</span></div>
              <div style={{font: `400 16px ${UI}`, color: '#444', marginTop: 2}}>{n[1]}</div></div>
          </div>
        );
      })}
      {/* headline: cold open -> top-left */}
      <div style={{position: 'absolute', left: hx, top: hy, transform: `scale(${hs})`, transformOrigin: '0 0'}}>
        <div style={{position: 'absolute', top: -46, left: 4, font: `500 ${17 / (98 / 230)}px ${MONO}`, letterSpacing: '.18em', color: C.mute, opacity: io(1.6, 2.1), whiteSpace: 'nowrap'}}>BUILT FOR SHINGTIK VEGETARIAN · 11:47 PM</div>
        <Headline lines={[['Orders'], ['never', {gold: 'stop.'}]]} start={0.1} size={230} stagger={0.3} />
      </div>
    </AbsoluteFill>
  );
};

/* bubbles live above the hook layer so they can swirl into the orb after the hook exits */
export const Bubbles: React.FC = () => {
  const {t, sp, io} = useT();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {BUBS.map((b, i) => {
        const s = 2.1 + i * 0.09;
        if (t < s) return null;
        const p = sp(s, {damping: 15, stiffness: 85});
        const q = io(4.35 + i * 0.012, 5.0 + i * 0.008, 0, 1, Easing.in(Easing.cubic));
        let x = lerp(ORIGIN.x, b.x, p), y = lerp(ORIGIN.y, b.y, p);
        // swirl into the orb at screen centre
        const cx = W / 2 - 120, cy = H / 2 - 40;
        const ang = q * 2.2 + i;
        x = lerp(x, cx, q) + Math.cos(ang) * Math.sin(q * Math.PI) * 160;
        y = lerp(y, cy, q) + Math.sin(ang) * Math.sin(q * Math.PI) * 110;
        const sc = lerp(0.2, b.s, p) * (1 - q * 0.85);
        const blur = (1 - clamp01(p)) * 9 + q * 4;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, transform: `scale(${sc}) rotate(${lerp(-25, b.r, p) + q * 90}deg)`, opacity: clamp01(p * 3) * (1 - io(4.85, 5.05)), filter: blur > 0.3 ? `blur(${blur}px)` : undefined}}>
            <BubbleView b={b} t={t} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------------- MEET ---------------- */
const INS = [{kind: 't', x: 150, y: 360, w: 420, h: 66}, {kind: 'p', x: 250, y: 520, w: 286, h: 210}, {kind: 'v', x: 150, y: 820, w: 380, h: 70}] as const;
const OUTS: [string, string, string, string][] = [['#25D366', '文', 'Reads 中文 · English · Bahasa', 'Typed, photo or voice'], ['#D4B895', '✓', 'Matches 1,800+ products', 'Aliases, brands, habits'], ['#2563EB', 'SO', 'Books orders in SQL Account', 'In seconds, 24/7'], ['#F59E0B', 'CS', 'Hands off to your team', 'The moment CS replies']];
const CARD = {l: 820, tp: 210, w: 560, h: 720};
const curve = (x1: number, y1: number, x2: number, y2: number, k = 180) => `M${x1} ${y1} C${x1 + k} ${y1} ${x2 - k} ${y2} ${x2} ${y2}`;
const IN_PATHS = INS.map((b, i) => curve(b.x + b.w, b.y + b.h / 2, CARD.l, 470 + i * 110));
const OUT_Y = [270, 450, 630, 810];
const OUT_PATHS = OUT_Y.map((y, i) => curve(CARD.l + CARD.w, 430 + i * 110, 1470, y + 46, 120));

const Link: React.FC<{d: string; start: number; t: number; io: any; pulseOff: number}> = ({d, start, t, io, pulseOff}) => {
  const L = getLength(d), p = io(start, start + 0.55);
  const u = ((Math.max(0, t - start - 0.4) * 0.45 + pulseOff) % 1);
  const pt = getPointAtLength(d, L * u);
  return (
    <g>
      <path d={d} stroke="#C9A46A" strokeWidth={16} opacity={0.2 * p} fill="none" filter="url(#mb)" />
      <path d={d} stroke="#D4B895" strokeWidth={5} fill="none" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} />
      {t > start + 0.4 && <><circle cx={pt.x} cy={pt.y} r={20} fill="rgba(212,184,149,.4)" filter="url(#mb)" /><circle cx={pt.x} cy={pt.y} r={10} fill="#fff" stroke="#C9A46A" strokeWidth={5} /></>}
    </g>
  );
};

export const Meet: React.FC = () => {
  const {t, sp, io, out, expo} = useT();
  const zoom = io(10.62, 11.15, 0, 1, Easing.in(Easing.exp));
  const press = Math.sin(Math.PI * io(10.45, 10.65)) * 0.03;
  const stageRot = lerp(9, 2, out(5.4, 10.6));
  const reveal = io(5.85, 6.45, 0, 1, Easing.out(Easing.cubic));
  const title = 'AI Ordering Agent';
  const typed = title.slice(0, Math.round(title.length * io(6.4, 6.95, 0, 1, Easing.linear)));
  const count = Math.round(3840 * out(6.9, 7.7));
  return (
    <AbsoluteFill style={{transform: `scale(${lerp(1, 7, zoom)})`, transformOrigin: `${AV.x}px ${AV.y}px`, filter: zoom > 0.02 ? `blur(${zoom * 12}px)` : undefined}}>
      <Backdrop dots glowX={57} glowY={40} />
      <div style={{position: 'absolute', left: AV.x - 380, top: 160, width: 760, height: 760, borderRadius: '50%', background: 'rgba(212,184,149,.42)', filter: 'blur(60px)', opacity: reveal}} />
      <AbsoluteFill style={{perspective: 2400}}>
        <AbsoluteFill style={{transform: `rotateY(${stageRot}deg) scale(${lerp(0.96, 1, out(5.4, 10.6))})`, transformStyle: 'preserve-3d'}}>
          <svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
            <defs><filter id="mb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8" /></filter></defs>
            {[440, 580].map((r, k) => <circle key={k} cx={AV.x} cy={570} r={r * lerp(0.6, 1, reveal)} fill="none" stroke={`rgba(201,164,106,${(0.35 - k * 0.12) * reveal})`} strokeWidth={2.5 - k * 0.6} strokeDasharray={k ? '6 14' : undefined} />)}
            {IN_PATHS.map((d, i) => <Link key={i} d={d} start={7.0 + i * 0.12} t={t} io={io} pulseOff={i * 0.2} />)}
            {OUT_PATHS.map((d, i) => <Link key={'o' + i} d={d} start={7.55 + i * 0.2} t={t} io={io} pulseOff={i * 0.15} />)}
          </svg>
          {/* inputs fly in */}
          {INS.map((b, i) => {
            const p = sp(6.55 + i * 0.15, {damping: 14, stiffness: 130});
            return (
              <div key={i} style={{position: 'absolute', left: b.x + (1 - p) * -620, top: b.y, transform: `rotate(${(1 - p) * -12}deg)`, opacity: clamp01(p * 2)}}>
                {b.kind === 't' ? <Bubble out size={30}>香菇头大 5包, 素叉烧 3包</Bubble> :
                 b.kind === 'p' ? <div style={{padding: 8, borderRadius: 16, background: C.waOut, boxShadow: '0 22px 40px -16px rgba(40,30,10,.35)'}}><PhotoTile ch="豆" w={262} /></div> :
                 <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderRadius: 20, background: C.waOut, boxShadow: '0 22px 40px -16px rgba(40,30,10,.35)'}}><Play size={40} /><Wave n={26} h={34} on={10} t={t} /><span style={{font: `500 17px ${INTER}`, color: '#667'}}>0:14</span></div>}
              </div>
            );
          })}
          {/* agent card grows out of the orb */}
          <div style={{position: 'absolute', left: CARD.l, top: CARD.tp, width: CARD.w, height: CARD.h, borderRadius: 44, background: '#fff', overflow: 'hidden', transform: `scale(${1 - press})`,
            clipPath: `circle(${reveal * 140}% at ${AV.x - CARD.l}px ${AV.y - CARD.tp}px)`,
            boxShadow: '0 0 0 12px rgba(212,184,149,.18),0 80px 130px -34px rgba(120,85,30,.45),0 0 0 1px rgba(0,0,0,.05)'}}>
            <div style={{height: 370, position: 'relative', background: 'radial-gradient(120% 110% at 50% 30%,#FFFFFF 0%,#FBF4EA 55%,#F3E6D4 100%)'}}>
              <div style={{position: 'absolute', left: AV.x - CARD.l - 140, top: AV.y - CARD.tp - 140, width: 280, height: 280, borderRadius: '50%', border: '2px dashed rgba(200,140,80,.30)', transform: `rotate(${t * 20}deg) scale(${expo(6.0, 6.8)})`}} />
              <div style={{position: 'absolute', left: AV.x - CARD.l - AV.size / 2, top: AV.y - CARD.tp - AV.size / 2}}><Orb size={AV.size} /></div>
              <div style={{position: 'absolute', left: 26, top: 26, transform: `scale(${sp(6.35, {damping: 12})})`, transformOrigin: 'left center', padding: '7px 14px', borderRadius: 99, background: 'rgba(255,255,255,.8)', font: `600 16px ${INTER}`, color: '#5b6170'}}>Built for ShingTik Vegetarian</div>
              <div style={{position: 'absolute', right: 26, top: 26, transform: `scale(${sp(6.5, {damping: 12})})`, transformOrigin: 'right center', padding: '7px 14px', borderRadius: 99, background: '#fff', font: `600 16px ${INTER}`, color: '#13703F'}}>● Online · 24/7</div>
            </div>
            <div style={{padding: '30px 36px'}}>
              <div style={{font: `800 50px ${MANROPE}`, letterSpacing: '-0.03em', color: C.ink, height: 60}}>{typed}<span style={{opacity: t < 7.1 && Math.floor(t * 4) % 2 === 0 ? 1 : 0, color: C.gold}}>|</span></div>
              <div style={{font: `500 22px ${INTER}`, color: C.mute, marginTop: 6, opacity: io(6.85, 7.2)}}>On WhatsApp · built by Codech</div>
              <div style={{marginTop: 26, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12}}>
                {[[count.toLocaleString('en-US'), 'orders booked'], ['3', 'languages'], ['24/7', 'always on']].map((m, i) => {
                  const p = sp(6.95 + i * 0.12, {damping: 14});
                  return <div key={i} style={{background: '#F7F4EE', borderRadius: 18, padding: '14px 16px', transform: `translateY(${(1 - p) * 30}px)`, opacity: p}}><div style={{font: `800 30px ${MANROPE}`, color: C.ink, fontVariantNumeric: 'tabular-nums'}}>{m[0]}</div><div style={{font: `500 16px ${INTER}`, color: C.mute}}>{m[1]}</div></div>;
                })}
              </div>
              <div style={{marginTop: 20, display: 'flex', alignItems: 'center', gap: 12, font: `600 18px ${INTER}`, color: '#13703F', opacity: io(7.7, 8.0)}}>
                <span style={{width: 26, height: 26, borderRadius: '50%', background: C.green, color: '#fff', display: 'grid', placeItems: 'center', font: `800 14px ${INTER}`, transform: `scale(${sp(7.7, {damping: 8})})`}}>✓</span>Last order booked 2s ago · SO-01258
              </div>
            </div>
          </div>
          {/* skill callouts */}
          {OUTS.map((o, i) => {
            const p = sp(7.75 + i * 0.22, {damping: 14, stiffness: 140});
            return (
              <div key={i} style={{position: 'absolute', left: 1470 + (1 - p) * 420, top: OUT_Y[i], opacity: clamp01(p * 2), display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px 16px 16px', borderRadius: 24, background: '#fff', whiteSpace: 'nowrap',
                boxShadow: '0 2px 0 rgba(0,0,0,.03),0 40px 70px -26px rgba(40,30,10,.38),0 0 0 1px rgba(0,0,0,.05)'}}>
                <div style={{width: 60, height: 60, borderRadius: 17, background: o[0], color: '#fff', display: 'grid', placeItems: 'center', font: `800 22px ${UI}`, transform: `rotate(${(1 - p) * -120}deg) scale(${p})`, boxShadow: `0 12px 22px -10px ${o[0]}`}}>{o[1]}</div>
                <div><div style={{font: `700 25px ${UI}`, color: C.ink}}>{o[2]}</div><div style={{font: `500 18px ${INTER}`, color: C.mute, marginTop: 3}}>{o[3]}</div></div>
              </div>
            );
          })}
        </AbsoluteFill>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 118, top: 104}}><Headline lines={[['Meet', 'your'], [{gold: 'AI agent.'}]]} start={5.65} size={98} letters /></div>
      <Vignette />
    </AbsoluteFill>
  );
};

/* ---------------- TYPE teaser ---------------- */
export const TypeTeaser: React.FC = () => {
  const {t, sp, io} = useT();
  const p = sp(11.05, {damping: 15, stiffness: 95});
  const msg = '早安 老板\n香菇头大 5包\n素叉烧 3包';
  const typed = msg.slice(0, Math.round(msg.length * io(11.45, 12.0, 0, 1, Easing.linear)));
  const sent = t > 12.05;
  return (
    <AbsoluteFill>
      <Backdrop glowX={30} glowY={45} />
      <div style={{position: 'absolute', left: 420, top: 120, perspective: 2000}}>
        <div style={{transform: `translateX(${(1 - p) * 900}px) rotateY(${lerp(55, -24, p)}deg) rotateX(4deg)`}}>
          <Phone scale={1.1}>
            <StatusBar />
            <div style={{background: C.wa, color: '#fff', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px 14px', flex: 'none'}}>
              <span style={{fontSize: 22}}>‹</span><div style={{width: 42, height: 42, borderRadius: '50%', background: '#1d7a5f', display: 'grid', placeItems: 'center', font: `700 19px ${NOTO}`}}>盛</div>
              <div><b style={{font: `600 18px ${INTER}`, display: 'block'}}>ShingTik 盛德</b><small style={{font: `400 13px ${INTER}`, opacity: 0.85}}>Business account</small></div>
            </div>
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: 14, gap: 9}}>
              <div style={{alignSelf: 'center', background: '#fff', borderRadius: 8, padding: '4px 12px', font: `500 13px ${INTER}`, color: '#54656F', boxShadow: '0 1px 1px rgba(0,0,0,.06)', marginBottom: 4}}>Today</div>
              {sent && <div style={{alignSelf: 'flex-end', background: C.waOut, borderRadius: 14, padding: '9px 12px', font: `400 17px/1.4 ${UI}`, whiteSpace: 'pre', transform: `scale(${sp(12.05, {damping: 12})})`, transformOrigin: 'bottom right'}}>{msg}</div>}
            </div>
            <div style={{height: 62, background: '#F4F1EC', display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px 6px', flex: 'none'}}>
              <div style={{flex: 1, minHeight: 42, borderRadius: 21, background: '#fff', font: `400 15px/1.3 ${UI}`, display: 'flex', alignItems: 'center', padding: '0 16px', color: sent || !typed ? '#999' : C.ink, whiteSpace: 'nowrap', overflow: 'hidden'}}>{sent || !typed ? 'Message' : typed.replace(/\n/g, ' ')}</div>
              <SendBtn typing={!sent && !!typed} />
            </div>
          </Phone>
        </div>
      </div>
      <div style={{position: 'absolute', right: 118, top: 104}}><Headline lines={[['Just'], [{gold: 'type'}, 'it.']]} start={11.3} size={98} align="right" /></div>
      <Vignette />
    </AbsoluteFill>
  );
};

/* ---------------- ORB transition + flash ---------------- */
export const OrbTransition: React.FC = () => {
  const {t, sp, io} = useT();
  if (t < 4.5 || t > 6.1) return null;
  const appear = sp(4.5, {damping: 11, stiffness: 120});
  const grow = io(5.0, 5.42, 0, 1, Easing.in(Easing.exp));
  const shrink = io(5.42, 5.95, 0, 1, Easing.out(Easing.exp));
  const cx = lerp(W / 2, AV.x, shrink), cy = lerp(H / 2, AV.y, shrink);
  const scale = t < 5.42 ? lerp(appear, 15, grow) : lerp(15, AV.size / ORB, shrink);
  const fade = io(5.9, 6.05);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: 1 - fade}}>
      <div style={{position: 'absolute', left: cx - ORB / 2, top: cy - ORB / 2, transform: `scale(${scale})`}}><Orb size={ORB} glow={1.4} /></div>
    </AbsoluteFill>
  );
};

export const Proof: React.FC = () => {
  const {t, io} = useT();
  const flash = Math.max(0, 1 - Math.abs(t - 11.05) / 0.18);
  return (
    <AbsoluteFill style={{background: C.paper}}>
      <Backdrop glowX={65} glowY={35} />
      {t < 5.6 && <Hook />}
      {t < 5.2 && <Bubbles />}
      {t >= 5.4 && t < 11.25 && <Meet />}
      {t >= 10.95 && <TypeTeaser />}
      <OrbTransition />
      {t > 9.8 && t < 10.75 && <Cursor x={lerp(1720, 1190, io(9.85, 10.4))} y={lerp(1010, 650, io(9.85, 10.4))} click={io(10.45, 10.8, 0, 1, Easing.out(Easing.cubic))} />}
      {flash > 0 && <AbsoluteFill style={{background: '#FFFDF8', opacity: flash}} />}
      <AbsoluteFill style={{pointerEvents: 'none', opacity: io(0, 0.25, 1, 0), background: C.paper}} />
    </AbsoluteFill>
  );
};
