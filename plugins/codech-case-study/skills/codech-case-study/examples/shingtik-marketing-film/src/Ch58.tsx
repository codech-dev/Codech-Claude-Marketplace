import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile} from 'remotion';
import {Backdrop, Bubble, C, Cursor, Headline, INTER, MANROPE, MONO, NOTO, Phone, SendBtn, StatusBar, UI, Vignette, clamp01, lerp, useT} from './lib';

const W = 1920, H = 1080;
const Check: React.FC<{s?: number; p?: number}> = ({s = 26, p = 1}) => <span style={{width: s, height: s, borderRadius: '50%', background: C.green, color: '#fff', display: 'inline-grid', placeItems: 'center', font: `800 ${s * 0.55}px ${INTER}`, transform: `scale(${p})`, flex: 'none'}}>✓</span>;
const Tile: React.FC<{ch: string; tint?: number; size?: number}> = ({ch, tint = 0, size = 58}) => {
  const T = [['#F7EBD6', '#EAD5B2', '#8A6A3A'], ['#F9E9D9', '#F0CFAE', '#9A5A2A'], ['#ECE6F7', '#D8CDEF', '#5B4C8A'], ['#EEF3E2', '#D9E6C2', '#5E7340'], ['#E3EEF5', '#C9DDEB', '#3A6283']][tint];
  return <div style={{width: size, height: size, borderRadius: size * 0.22, background: `linear-gradient(145deg,${T[0]},${T[1]})`, color: T[2], display: 'grid', placeItems: 'center', font: `700 ${size * 0.48}px ${NOTO}`, flex: 'none'}}>{ch}</div>;
};
const Msg: React.FC<{out?: boolean; at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({out, at, children, style}) => {
  const {t, sp} = useT();
  if (t < at) return null;
  const p = sp(at, {damping: 13, stiffness: 180});
  return <div style={{alignSelf: out ? 'flex-end' : 'flex-start', maxWidth: '86%', background: out ? C.waOut : '#fff', borderRadius: 14, padding: '9px 12px 7px', font: `400 16px/1.4 ${UI}`, boxShadow: '0 1px 1px rgba(0,0,0,.08)', transform: `scale(${p}) translateY(${(1 - p) * 20}px)`, transformOrigin: out ? 'bottom right' : 'bottom left', ...style}}>{children}</div>;
};
const WaHeader: React.FC = () => (
  <div style={{background: C.wa, color: '#fff', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px 14px', flex: 'none'}}>
    <span style={{fontSize: 22}}>‹</span><div style={{width: 42, height: 42, borderRadius: '50%', background: '#1d7a5f', display: 'grid', placeItems: 'center', font: `700 19px ${NOTO}`}}>盛</div>
    <div><b style={{font: `600 18px ${INTER}`, display: 'block'}}>ShingTik 盛德</b><small style={{font: `400 13px ${INTER}`, opacity: 0.85}}>Business account</small></div>
  </div>
);

/* ---------------- 5.1 ORDER PAGE ---------------- */
const CATS = [['我的常购', '7/8'], ['为您推荐', '5'], ['菇类', '2/4'], ['素肉', '4/5'], ['豆制品', '1/2'], ['面食', '']];
const LIST_A: [string, string, string, number, number][] = [['香', '香菇球（觉明）', '1kg · 上次 12 天前', 5, 0], ['豆', 'AA豆包', '500g · 上次 9 天前', 2, 1], ['三', '三层肉（觉明）', '1kg · 上次 8 天前', 2, 2], ['猴', '猴头菇（觉明）', '上次 12 天前', 3, 3]];
const LIST_B: [string, string, string, number, number][] = [['鸡', '大自然-鸡丁', '上次 15 天前', 0, 4], ['叉', '鸿缘叉烧-切', '1 CTN · 上次 20 天前', 1, 1], ['港', '佛心 港味叉烧-大', '上次 18 天前', 2, 0], ['肉', '素肉丝', '上次 9 天前', 3, 3]];
export const OrderPageScene: React.FC = () => {
  const {t, sp, io, out} = useT();
  const enter = clamp01((t - 41.85) / 0.45), ee = 1 - Math.pow(1 - enter, 3);
  const flip1 = io(43.55, 43.95), flip2 = io(46.05, 46.45);
  const onPage = (t >= 43.75 && t < 46.25);
  const rotY = t < 46 ? Math.sin(Math.PI * flip1) * 90 * (flip1 < 0.5 ? 1 : -1) : Math.sin(Math.PI * flip2) * 90 * (flip2 < 0.5 ? 1 : -1);
  const railSel = t < 44.6 ? 0 : 3;
  const listP = io(44.6, 44.95);
  const v = (base: number, i: number, list: 'a' | 'b') => {
    if (list === 'a' && i === 1) return t > 44.2 ? 3 : base;
    if (list === 'b' && i === 0) return Math.min(4, Math.max(0, Math.floor((t - 45.0) / 0.12) + 1));
    return base;
  };
  const items = 7 + (t > 44.2 ? 1 : 0) + (t > 45.0 ? Math.min(4, Math.max(0, Math.floor((t - 45.0) / 0.12) + 1)) : 0);
  const exit = io(48.55, 48.9);
  const burst = (at: number, label: string, x: number, y: number, ch: string, tint: number) => {
    if (t < at) return null;
    const p = sp(at, {damping: 11, stiffness: 140});
    return <div style={{position: 'absolute', left: x + p * 260, top: y - p * 120, transform: `scale(${p})`, opacity: 1 - io(at + 1.6, at + 2.0), display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderRadius: 20, background: '#fff', boxShadow: '0 30px 60px -20px rgba(40,30,10,.4),0 0 0 1px rgba(0,0,0,.05)'}}><Tile ch={ch} tint={tint} size={50} /><b style={{font: `800 30px ${INTER}`, color: C.wa}}>{label}</b></div>;
  };
  return (
    <AbsoluteFill style={{transform: `translateX(${(1 - ee) * W}px)`, filter: enter < 1 ? `blur(${Math.sin(Math.PI * enter) * 24}px)` : undefined, opacity: 1 - exit}}>
      <Backdrop glowX={35} glowY={45} />
      <div style={{position: 'absolute', left: 420, top: 160, width: 760, height: 760, borderRadius: '50%', background: 'rgba(14,91,71,.10)', filter: 'blur(70px)'}} />
      <div style={{position: 'absolute', left: 560, top: 120, perspective: 2000}}>
        <div style={{transform: `rotateY(${rotY - 12 + Math.sin(t * 0.6) * 2}deg) rotateX(4deg) scale(${1 + out(42, 48.5) * 0.03})`}}>
          {!onPage ? (
            <Phone scale={1.06}>
              <StatusBar /><WaHeader />
              <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: 14, gap: 9, overflow: 'hidden'}}>
              <div style={{alignSelf: 'center', background: '#fff', borderRadius: 8, padding: '4px 12px', font: `500 13px ${INTER}`, color: '#54656F', boxShadow: '0 1px 1px rgba(0,0,0,.06)', marginBottom: 4}}>Today</div>
                <Msg out at={42.3}>我要下单</Msg>
                <Msg at={42.7}>好的 👍 请点开您的专属下单页，常买的都帮您准备好了：<div style={{marginTop: 8, borderRadius: 10, background: '#F1F7F2', border: '1px solid #CFE3D5', padding: 10, fontSize: 14, transform: `scale(${1 - Math.sin(Math.PI * io(43.25, 43.5)) * 0.05})`}}><b style={{color: C.wa}}>🌐 ShingTik Order Page</b><br /><span style={{color: '#667'}}>觉明素食 · 2 小时内有效</span></div></Msg>
                {t > 46.25 && <Msg out at={46.75}><b>📋 订单 #W7K3QX</b><br />香菇球（觉明）× 5 PKT<br />AA豆包 × 3 PKT<br />大自然-鸡丁 × 4 PKT<br />…共 {items} 项</Msg>}
                {t > 46.25 && <Msg at={47.3}>✅ 已入单 <b style={{color: C.wa}}>SO-02481</b><br />送货: 周五 · Cheras 店</Msg>}
              </div>
              <div style={{height: 62, background: '#F4F1EC', display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px 6px', flex: 'none'}}>
                <div style={{flex: 1, height: 42, borderRadius: 21, background: '#fff', font: `400 14px ${UI}`, display: 'flex', alignItems: 'center', padding: '0 14px', color: t > 46.25 && t < 46.75 ? C.ink : '#999', whiteSpace: 'nowrap', overflow: 'hidden'}}>{t > 46.25 && t < 46.75 ? '📋 订单 #W7K3QX · ' + items + ' 项' : 'Message'}</div>
                <SendBtn typing={t > 46.25 && t < 46.75} pulse={Math.max(0, 1 - Math.abs(t - 46.7) / 0.12)} />
              </div>
            </Phone>
          ) : (
            <Phone scale={1.06} bg="#fff">
              <StatusBar dark />
              <div style={{padding: '8px 18px 4px', flex: 'none'}}><div style={{font: `800 24px ${NOTO}`}}>你好，<span style={{color: C.wa}}>觉明素食</span></div><div style={{font: `400 12px ${NOTO}`, color: '#889'}}>Cheras 店 · 周二、周五送货</div>
                <div style={{margin: '10px 0 6px', height: 38, borderRadius: 19, background: '#F3F4F2', font: `400 13px ${NOTO}`, color: '#99a', display: 'flex', alignItems: 'center', padding: '0 14px'}}>🔍 搜索：香菇、char siew…</div></div>
              <div style={{flex: 1, display: 'flex', overflow: 'hidden'}}>
                <div style={{width: 96, background: '#F5F6F4', position: 'relative'}}>
                  <div style={{position: 'absolute', left: 0, right: 0, top: lerp(0, 3, listP) * 62, height: 62, background: '#fff', borderLeft: `3px solid ${C.wa}`}} />
                  {CATS.map((c, i) => <div key={i} style={{position: 'relative', height: 62, padding: '12px 10px', font: `600 14px ${NOTO}`, color: i === railSel ? C.wa : '#556'}}>{c[0]}<div style={{font: `400 11px ${INTER}`, color: '#99a'}}>{c[1]}</div></div>)}
                </div>
                <div style={{flex: 1, padding: '4px 12px', position: 'relative', overflow: 'hidden'}}>
                  {[['a', LIST_A], ['b', LIST_B]].map(([k, L]: any) => (
                    <div key={k} style={{position: 'absolute', left: 12, right: 12, top: 4, transform: `translateY(${(k === 'a' ? -listP : 1 - listP) * 420}px)`, opacity: k === 'a' ? 1 - listP : listP}}>
                      {(L as typeof LIST_A).map((it, i) => {
                        const val = v(it[3], i, k);
                        const bump = k === 'a' && i === 1 ? Math.max(0, 1 - Math.abs(t - 44.25) / 0.15) : k === 'b' && i === 0 ? (t > 45 && t < 45.6 ? 0.6 : 0) : 0;
                        return (
                          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '11px 0', borderBottom: '1px solid #F0EDE6'}}>
                            <Tile ch={it[0]} tint={it[4]} />
                            <div style={{flex: 1, font: `600 15px ${NOTO}`}}>{it[1]}<div style={{font: `400 11px ${NOTO}`, color: C.mute, marginTop: 2}}><span style={{background: '#FDE7C8', color: '#9A5A2A', borderRadius: 4, padding: '0 4px', marginRight: 4}}>按习惯预填</span>{it[2]}</div></div>
                            <div style={{display: 'flex', alignItems: 'center', border: `1.5px solid ${C.wa}`, borderRadius: 22, height: 32, font: `700 15px ${INTER}`, color: C.wa, background: bump ? `rgba(14,91,71,${0.12 * bump})` : '#fff'}}><span style={{width: 26, textAlign: 'center'}}>−</span><span style={{display: 'inline-block', transform: `scale(${1 + bump * 0.4})`}}>{val}</span><span style={{width: 26, textAlign: 'center'}}>+</span></div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{padding: '12px 16px 18px', borderTop: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 12, flex: 'none'}}>
                <div style={{font: `600 14px ${INTER}`, color: '#556'}}>{items} items</div>
                <div style={{flex: 1, height: 46, borderRadius: 23, background: C.wa, color: '#fff', font: `700 17px ${NOTO}`, display: 'grid', placeItems: 'center', transform: `scale(${1 - Math.sin(Math.PI * io(45.75, 46.0)) * 0.06})`}}>确认订单 →</div>
              </div>
            </Phone>
          )}
        </div>
      </div>
      {burst(44.2, '+1', 900, 520, '豆', 1)}
      {burst(45.05, '+4', 900, 400, '鸡', 4)}
      {/* side cards */}
      <div style={{position: 'absolute', left: 1130, top: 520, transform: `scale(${sp(43.95, {damping: 12})})`, transformOrigin: 'left center', display: 'flex', alignItems: 'center', gap: 14, padding: '18px 24px', borderRadius: 24, background: '#fff', boxShadow: '0 40px 80px -30px rgba(40,30,10,.42),0 0 0 1px rgba(0,0,0,.05)'}}>
        <div style={{width: 52, height: 52, borderRadius: 15, background: C.goldTint, color: C.goldText, display: 'grid', placeItems: 'center', font: `800 24px ${INTER}`}}>↺</div>
        <div><b style={{font: `700 24px ${INTER}`}}>Prefilled from order history</b><div style={{font: `400 17px ${INTER}`, color: C.mute}}>usual items, usual quantities</div></div>
      </div>
      <div style={{position: 'absolute', left: 1130, top: 700, transform: `scale(${sp(47.35, {damping: 11})})`, transformOrigin: 'left center', display: 'flex', alignItems: 'center', gap: 16, padding: '18px 24px', borderRadius: 24, background: '#fff', boxShadow: '0 40px 80px -30px rgba(40,30,10,.42),0 0 0 1px rgba(0,0,0,.05)'}}>
        <span style={{font: `700 24px ${MONO}`, color: C.ink}}>#W7K3QX</span><span style={{font: `800 26px ${INTER}`, color: C.gold}}>→</span>
        <span style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 99, background: '#E3F6EA', color: '#13703F', font: `700 22px ${INTER}`}}><Check s={24} />SO-02481</span>
      </div>
      {t > 43.0 && t < 43.7 && <Cursor x={lerp(1150, 790, io(43.0, 43.25))} y={lerp(900, 640, io(43.0, 43.25))} click={io(43.25, 43.6)} />}
      {t > 45.4 && t < 46.1 && <Cursor x={lerp(1150, 880, io(45.4, 45.7))} y={lerp(980, 900, io(45.4, 45.7))} click={io(45.72, 46.05)} />}
      <div style={{position: 'absolute', right: 118, top: 104}}><Headline lines={[['Reorder', 'in'], [{gold: 'one tap.'}]]} start={42.3} size={98} align="right" /></div>
      <Vignette />
    </AbsoluteFill>
  );
};

/* ---------------- ink colour flip ---------------- */
export const InkFlip: React.FC = () => {
  const {sp, io} = useT();
  const open = io(48.6, 49.05, 0, 1, Easing.out(Easing.exp));
  const close = io(49.75, 50.15, 0, 1, Easing.in(Easing.exp));
  return (
    <AbsoluteFill style={{clipPath: `circle(${open * 150 * (1 - close)}% at 40% 55%)`, background: '#0B0D12'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(70% 70% at 50% 50%,#1B1A17,#08090B)'}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <Headline lines={[['And', 'inside'], ['the', {gold: 'office…'}]]} start={48.85} size={140} color="#fff" goldColor={C.gold} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------- portal helpers ---------------- */
const Crop: React.FC<{src: string; x: number; y: number; w: number; h: number; k: number; style?: React.CSSProperties}> = ({src, x, y, w, h, k, style}) => (
  <div style={{width: w * k, height: h * k, overflow: 'hidden', borderRadius: 14 * k, background: '#fff', position: 'relative', ...style}}>
    <Img src={staticFile(`portal/${src}.png`)} style={{position: 'absolute', left: -x * k, top: -y * k, width: 1440 * k, height: 900 * k}} />
  </div>
);
const Browser: React.FC<{src: string; k: number; children?: React.ReactNode}> = ({src, k, children}) => (
  <div style={{width: 1440 * k, borderRadius: 18, overflow: 'hidden', background: '#fff', position: 'relative', boxShadow: '0 2px 0 rgba(0,0,0,.03),0 90px 140px -40px rgba(40,30,10,.42),0 0 0 1px rgba(0,0,0,.07)'}}>
    <div style={{height: 40, display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', background: '#F4F2EE', borderBottom: '1px solid #E7E3DB'}}>
      {['#FF5F57', '#FEBC2E', '#28C840'].map(c => <i key={c} style={{width: 12, height: 12, borderRadius: 6, background: c, display: 'block'}} />)}
      <div style={{margin: '0 auto', background: '#fff', border: '1px solid #E7E3DB', borderRadius: 9, padding: '4px 56px', font: `500 13px ${INTER}`, color: '#5b6170'}}>🔒 ShingTik AI Portal</div>
    </div>
    <div style={{position: 'relative', width: 1440 * k, height: 900 * k}}><Img src={staticFile(`portal/${src}.png`)} style={{width: 1440 * k, height: 900 * k, display: 'block'}} />{children}</div>
  </div>
);
const lifted = '0 50px 90px -24px rgba(40,30,10,.45),0 0 0 1px rgba(0,0,0,.06)';

/* ---------------- 6.1 DASHBOARD ---------------- */
export const DashboardScene: React.FC = () => {
  const {t, sp, io, out} = useT();
  const k = 0.86;
  const win = sp(49.95, {damping: 16, stiffness: 90});
  const push = out(50.4, 53.8);
  const ox = 470, oy = 250;
  const kpi = [[248, 392], [543, 392], [838, 392], [1133, 392]];
  const leave = io(53.75, 54.15, 0, 1, Easing.in(Easing.cubic));
  return (
    <AbsoluteFill style={{transform: `translateX(${-leave * W * 0.6}px)`, opacity: 1 - leave, filter: leave > 0.02 ? `blur(${leave * 20}px)` : undefined}}>
      <Backdrop glowX={60} glowY={45} />
      <AbsoluteFill style={{perspective: 2200}}>
        <div style={{position: 'absolute', left: ox, top: oy, transformStyle: 'preserve-3d', transformOrigin: '600px 400px',
          transform: `translateY(${(1 - win) * 700}px) rotateX(${lerp(28, 9, win) - push * 3}deg) rotateY(${lerp(-26, -12, win) + push * 6}deg) scale(${1 + push * 0.12})`}}>
          <Browser src="dashboard" k={k} />
          {/* exploded KPI cards */}
          {kpi.map(([x, y], i) => {
            const q = sp(51.0 + i * 0.12, {damping: 13, stiffness: 140});
            return <div key={i} style={{position: 'absolute', left: x * k + (i - 1.5) * 30 * q, top: 40 + y * k - q * 70, transform: `translateZ(${q * 140}px) scale(${1 + q * 0.12})`, opacity: q > 0.01 ? 1 : 0}}><Crop src="dashboard" x={x} y={y} w={283} h={107} k={k} style={{boxShadow: lifted}} /></div>;
          })}
          {/* alert lifts with a red glow */}
          {(() => {
            const q = sp(52.2, {damping: 12, stiffness: 140});
            return <div style={{position: 'absolute', left: 1054 * k + q * 120, top: 40 + 645 * k - q * 40, transform: `translateZ(${q * 200}px) scale(${1 + q * 0.3})`, opacity: q > 0.01 ? 1 : 0}}><Crop src="dashboard" x={1054} y={645} w={345} h={90} k={k} style={{boxShadow: `${lifted},0 0 0 ${3 * q}px rgba(229,72,77,.7),0 0 40px rgba(229,72,77,${0.35 * q})`}} /></div>;
          })()}
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 118, top: 104}}><Headline lines={[['AI', 'for', 'your'], [{gold: 'whole team.'}]]} start={50.05} size={98} /></div>
      <Vignette />
    </AbsoluteFill>
  );
};

/* ---------------- 6.2 AI CHAT ---------------- */
export const ChatScene: React.FC = () => {
  const {t, sp, io, out} = useT();
  const k = 0.82;
  const enter = io(53.8, 54.25, 0, 1, Easing.out(Easing.cubic));
  const q = 'Top 5 products in the last 30 days';
  const typed = q.slice(0, Math.round(q.length * io(54.3, 55.0, 0, 1, Easing.linear)));
  const drop = sp(55.05, {damping: 14, stiffness: 160});
  const rows = [153, 189, 225, 261, 296];
  const chart = io(56.2, 57.0, 0, 1, Easing.out(Easing.cubic));
  const leave = io(57.75, 58.15, 0, 1, Easing.in(Easing.cubic));
  const ox = 650, oy = 200;
  return (
    <AbsoluteFill style={{transform: `translateX(${(1 - enter) * W * 0.6 - leave * W * 0.6}px)`, opacity: enter * (1 - leave), filter: enter < 0.98 || leave > 0.02 ? `blur(${(1 - enter + leave) * 20}px)` : undefined}}>
      <Backdrop glowX={50} glowY={40} />
      <AbsoluteFill style={{perspective: 2200}}>
        <div style={{position: 'absolute', left: ox, top: oy, transformStyle: 'preserve-3d', transform: `rotateY(${lerp(14, 8, out(54, 58))}deg) rotateX(5deg) scale(${1 + out(54, 58) * 0.06})`}}>
          <Browser src="chat-answer" k={k} />
          {rows.map((y, i) => {
            const p = sp(55.4 + i * 0.13, {damping: 13, stiffness: 160});
            return <div key={i} style={{position: 'absolute', left: 621 * k, top: 40 + y * k, transformOrigin: 'center', transform: `translateY(${-p * 3}px) scale(${1 + p * 0.035})`, opacity: p > 0.01 ? 1 : 0}}><Crop src="chat-answer" x={621} y={y} w={722} h={36} k={k} style={{borderRadius: 6, boxShadow: `0 ${18 * p}px ${36 * p}px -14px rgba(40,30,10,.38),0 0 0 2px rgba(212,184,149,${0.85 * (1 - out(55.4 + i * 0.13 + 0.3, 55.4 + i * 0.13 + 0.8))})`}} /></div>;
          })}
          {/* chart lifts in place: scales up over its own position while its bars grow bottom-up */}
          {t > 56.0 && (() => {
            const p = sp(56.05, {damping: 14, stiffness: 120});
            return <div style={{position: 'absolute', left: 621 * k, top: 40 + 366 * k, transformOrigin: 'center', transform: `translateY(${-p * 10}px) scale(${1 + p * 0.14})`}}>
              <div style={{position: 'relative'}}>
                <Crop src="chat-answer" x={621} y={366} w={722} h={280} k={k} style={{boxShadow: `0 ${40 * p}px ${80 * p}px -26px rgba(40,30,10,.45),0 0 0 1px rgba(0,0,0,.06)`}} />
                <div style={{position: 'absolute', left: 90 * k, right: 20 * k, top: 40 * k, height: 192 * k, background: '#fff', transformOrigin: 'top', transform: `scaleY(${1 - chart})`}} />
              </div></div>;
          })()}
        </div>
      </AbsoluteFill>
      {/* the question */}
      <div style={{position: 'absolute', left: 1020, top: 130, transform: `translateY(${(1 - drop) * -40}px) scale(${t > 55.05 ? lerp(1.1, 1, drop) : 1})`, opacity: io(54.2, 54.4), padding: '18px 26px', borderRadius: '24px 24px 6px 24px', background: C.ink, color: '#fff', font: `600 28px ${INTER}`, boxShadow: '0 40px 60px -24px rgba(0,0,0,.45)'}}>
        {typed}<span style={{opacity: t < 55.05 && Math.floor(t * 4) % 2 ? 1 : 0, color: C.gold}}>|</span>
      </div>
      <div style={{position: 'absolute', left: 118, bottom: 104}}><Headline lines={[['Ask', 'your'], [{gold: 'data.'}]]} start={54.0} size={98} /></div>
      <Vignette />
    </AbsoluteFill>
  );
};

/* ---------------- 6.3 KNOWLEDGE BASE ---------------- */
export const KBScene: React.FC = () => {
  const {t, sp, io, out} = useT();
  const k = 0.84;
  const enter = io(57.8, 58.25, 0, 1, Easing.out(Easing.cubic));
  const leave = io(61.75, 62.15, 0, 1, Easing.in(Easing.cubic));
  const lift = (at: number, x: number, y: number, w: number, h: number, dz: number, dx = 0, dy = -50, s = 0.12) => {
    const q = sp(at, {damping: 13, stiffness: 140});
    return <div style={{position: 'absolute', left: x * k + q * dx, top: 40 + y * k + q * dy, transform: `translateZ(${q * dz}px) scale(${1 + q * s})`, opacity: q > 0.01 ? 1 : 0}}><Crop src="kb" x={x} y={y} w={w} h={h} k={k} style={{boxShadow: lifted}} /></div>;
  };
  const chip = sp(60.2, {damping: 11, stiffness: 160});
  return (
    <AbsoluteFill style={{transform: `translateX(${(1 - enter) * W * 0.6 - leave * W * 0.3}px) scale(${1 - leave * 0.2})`, opacity: enter * (1 - leave), filter: enter < 0.98 || leave > 0.02 ? `blur(${(1 - enter + leave) * 20}px)` : undefined}}>
      <Backdrop glowX={45} glowY={45} />
      <AbsoluteFill style={{perspective: 2400}}>
        <div style={{position: 'absolute', left: 150, top: 270, transformStyle: 'preserve-3d', transform: `rotateX(${lerp(34, 26, out(58, 62))}deg) rotateZ(${lerp(10, 6, out(58, 62))}deg) rotateY(${-6}deg)`}}>
          <Browser src="kb" k={k} />
          {lift(58.9, 450, 230, 568, 102, 120, -30, -40)}
          {lift(59.4, 1040, 130, 380, 50, 160, 40, -70, 0.25)}
          {lift(59.8, 1040, 588, 380, 212, 140, 60, -30)}
          {lift(60.4, 868, 200, 136, 22, 180, 30, -60, 0.6)}
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 1240, top: 300, transform: `scale(${chip})`, display: 'flex', alignItems: 'center', gap: 14, padding: '18px 24px', borderRadius: 24, background: '#fff', boxShadow: lifted}}>
        <div style={{width: 52, height: 52, borderRadius: 15, background: '#7C5CFF', color: '#fff', display: 'grid', placeItems: 'center', font: `800 20px ${INTER}`}}>KB</div>
        <div><b style={{font: `700 26px ${INTER}`}}>Cited 34× in AI answers</b><div style={{font: `400 17px ${UI}`, color: C.mute}}>送货路线与司机分配 SOP · v3</div></div>
      </div>
      <div style={{position: 'absolute', right: 118, top: 104}}><Headline lines={[['One', 'source'], ['of', {gold: 'truth.'}]]} start={58.0} size={98} align="right" /></div>
      <Vignette />
    </AbsoluteFill>
  );
};

/* ---------------- 6.4 MODULES: fan -> grid -> converge ---------------- */
export const ModulesScene: React.FC = () => {
  const {t, sp, io} = useT();
  const k = 0.42;
  const enter = io(61.8, 62.2);
  const spread = sp(62.3, {damping: 15, stiffness: 90});
  const conv = io(65.2, 65.75, 0, 1, Easing.in(Easing.cubic));
  const mods = [['po', 'PO intake', '#F59E0B'], ['payment', 'Payment check', '#16A34A'], ['delivery', 'Delivery runs', '#14B8A6'], ['alerts', 'Alerts', '#E5484D']];
  const grid = [[650, 245], [1270, 245], [650, 680], [1270, 680]];
  return (
    <AbsoluteFill style={{opacity: enter}}>
      <Backdrop glowX={55} glowY={50} dots />
      {mods.map((m, i) => {
        const fan = {x: 760 + (i - 1.5) * 40, y: 380 + (i - 1.5) * 26, r: (i - 1.5) * 7};
        const g = {x: grid[i][0], y: grid[i][1], r: 0};
        const x = lerp(lerp(fan.x, g.x, spread), 820, conv), y = lerp(lerp(fan.y, g.y, spread), 420, conv);
        const r = lerp(lerp(fan.r, g.r, spread), (i - 1.5) * 12, conv);
        const label = sp(62.8 + i * 0.15, {damping: 12});
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, transform: `rotate(${r}deg) scale(${lerp(1, 0.35, conv)})`, opacity: 1 - io(65.6, 65.8)}}>
            <Browser src={m[0]} k={k} />
            <div style={{position: 'absolute', left: -14, top: -22, transform: `scale(${label})`, transformOrigin: 'left center', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 99, background: '#fff', font: `700 20px ${INTER}`, boxShadow: '0 14px 30px -12px rgba(0,0,0,.3)'}}><span style={{width: 12, height: 12, borderRadius: 6, background: m[2]}} />{m[1]}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 118, top: 104, opacity: 1 - conv}}><Headline lines={[['Capture.', 'Verify.'], [{gold: 'Deliver.'}]]} start={62.0} size={90} stagger={0.2} /></div>
      <Vignette />
    </AbsoluteFill>
  );
};

/* ---------------- 7.1 RESULTS (dark) ---------------- */
export const ResultsScene: React.FC = () => {
  const {t, sp, io, out} = useT();
  const open = io(65.7, 66.1, 0, 1, Easing.out(Easing.exp));
  const n = Math.round(90 * out(66.1, 67.8));
  const cards = [['3,840', 'orders booked by the AI'], ['14 wks', 'kickoff to live'], ['3', 'languages']];
  return (
    <AbsoluteFill style={{clipPath: `circle(${open * 150}% at 50% 45%)`, background: '#0B0D12'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(80% 70% at 55% 45%,#211D16 0%,#0D0E11 55%,#060709 100%)'}} />
      <div style={{position: 'absolute', left: 560, top: 140, width: 1100, height: 700, borderRadius: '50%', background: 'rgba(212,170,110,.30)', filter: 'blur(90px)', opacity: out(66, 67)}} />
      {[[1650, 160, 90, 0.6], [260, 300, 150, 0.25], [1780, 760, 170, 0.3], [1160, 90, 40, 0.8], [520, 860, 110, 0.25]].map((b, i) => (
        <div key={i} style={{position: 'absolute', left: b[0] + Math.sin(t * 0.5 + i) * 20, top: b[1] + Math.cos(t * 0.4 + i) * 14, width: b[2], height: b[2], borderRadius: '50%', background: `rgba(255,225,170,${b[3]})`, filter: `blur(${b[2] / 6}px)`}} />
      ))}
      <AbsoluteFill style={{perspective: 2000}}>
        <div style={{position: 'absolute', left: 600, top: 170, transform: `rotateY(${lerp(-26, -16, out(66, 71))}deg) rotateX(8deg) scale(${lerp(0.85, 1, sp(66.1, {damping: 14}))})`, transformOrigin: 'center'}}>
          <div style={{font: `800 370px/0.86 ${MANROPE}`, letterSpacing: '-0.065em', background: 'linear-gradient(175deg,#FFFFFF 0%,#F3E6CC 45%,#C9A46A 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 30px 60px rgba(212,170,110,.35))', fontVariantNumeric: 'tabular-nums'}}>~{n}%</div>
        </div>
      </AbsoluteFill>
      {cards.map((c, i) => {
        const q = sp(67.4 + i * 0.22, {damping: 13, stiffness: 140});
        return (
          <div key={i} style={{position: 'absolute', left: 900 + i * 330, top: 640 + (1 - q) * 120, opacity: q, padding: '22px 28px', borderRadius: 24, background: 'linear-gradient(160deg,rgba(255,255,255,.14),rgba(255,255,255,.04))', border: '1px solid rgba(255,255,255,.22)', boxShadow: '0 40px 80px -20px rgba(0,0,0,.8)'}}>
            <div style={{font: `800 54px ${MANROPE}`, color: '#fff', letterSpacing: '-0.03em'}}>{c[0]}</div><div style={{font: `500 19px ${INTER}`, color: '#C9BFAE'}}>{c[1]}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 118, bottom: 104}}>
        <div style={{font: `500 17px ${MONO}`, letterSpacing: '.18em', color: '#8C8576', marginBottom: 18, opacity: io(66.4, 66.8)}}>SHINGTIK VEGETARIAN · SEP 2026</div>
        <Headline lines={[['of', "ShingTik's", 'sales', 'orders,'], [{gold: 'booked by AI.'}]]} start={66.5} size={84} color="#fff" goldColor={C.gold} />
      </div>
    </AbsoluteFill>
  );
};
