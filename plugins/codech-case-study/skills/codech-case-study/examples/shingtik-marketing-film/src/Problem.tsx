import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile} from 'remotion';
import {Backdrop, Bubble, C, Headline, INTER, MANROPE, MONO, NOTO, Orb, PhotoTile, Play, UI, Vignette, Wave, clamp01, lerp, useT} from './lib';

/* All scenes here use LOCAL time (t = 0 at the scene start). */
const lifted = '0 50px 90px -24px rgba(40,30,10,.42),0 0 0 1px rgba(0,0,0,.06)';
const Check: React.FC<{s?: number}> = ({s = 24}) => <span style={{width: s, height: s, borderRadius: '50%', background: C.green, color: '#fff', display: 'inline-grid', placeItems: 'center', font: `800 ${s * 0.55}px ${INTER}`, flex: 'none'}}>✓</span>;

/* ---------- A+B+C: the customer-service problem (8 s) ---------- */
const CHATS = [['K', 'Kepong 店', '香菇头大 5包, 素叉烧 3包', '#8A6A3A'], ['C', 'Cheras 店', '📷 Photo', '#5E7340'], ['P', 'Puchong 店', '🎤 Voice message (0:14)', '#3A6283'], ['L', 'Klang 店', 'Tolong hantar 3 kotak esok', '#5B4C8A'],
  ['I', 'Ipoh 店', 'Same as last week boss 🙏', '#9A5A2A'], ['S', 'Seremban 店', 'AA豆包 x2 PKT', '#0E5B47'], ['B', 'Bangsar 店', '猴头菇 还有吗?', '#B42318'], ['M', 'Melaka 店', '🎤 Voice message (0:21)', '#3A6283'],
  ['J', 'Johor 店', 'Add 2 ctn 叉烧', '#5E7340'], ['T', 'Taiping 店', '明天几点送?', '#8A6A3A'], ['R', 'Rawang 店', '📷 Photo', '#5B4C8A'], ['N', 'Nilai 店', '斋鹅 2条', '#9A5A2A']];
export const ProblemCS: React.FC = () => {
  const {t, sp, io, out} = useT();
  // A: inbox overflow (0–2.6)
  const aOut = io(2.45, 2.8, 0, 1, Easing.in(Easing.cubic));
  const rowsIn = Math.min(CHATS.length, Math.floor(Math.max(0, t - 0.15) / 0.16) + 1);
  const waiting = Math.round(lerp(3, 47, out(0.2, 2.4)));
  // B: retyping (2.6–5.4)
  const bIn = io(2.6, 2.95, 0, 1, Easing.out(Easing.cubic)), bOut = io(5.2, 5.5, 0, 1, Easing.in(Easing.cubic));
  const code = 'MSH-L';
  const typed = code.slice(0, Math.round(code.length * io(3.3, 4.0, 0, 1, Easing.linear)));
  const wrongFlash = t > 4.35 && t < 4.95 ? Math.abs(Math.sin((t - 4.35) * 16)) : 0;
  // C: strike-through (5.4–8.0)
  const cIn = io(5.35, 5.6);
  const words = ['Reading.', 'Retyping.', 'Checking.'];
  return (
    <AbsoluteFill style={{background: C.paper}}>
      <Backdrop glowX={50} glowY={45} />
      {/* A */}
      {t < 2.85 && (
        <AbsoluteFill style={{transform: `scale(${lerp(1, 1.12, aOut)})`, opacity: 1 - aOut, filter: aOut > 0.02 ? `blur(${aOut * 14}px)` : undefined}}>
          <AbsoluteFill style={{perspective: 2200}}>
            <div style={{position: 'absolute', left: 960, top: 190, width: 760, height: 780, borderRadius: 28, background: '#fff', overflow: 'hidden', transform: `rotateY(-16deg) rotateX(6deg) translateY(${(1 - sp(0, {damping: 16})) * 300}px)`, boxShadow: lifted}}>
              <div style={{height: 64, display: 'flex', alignItems: 'center', gap: 12, padding: '0 24px', borderBottom: '1px solid #EEEBE4'}}>
                <Img src={staticFile('logos/respond-io.svg')} style={{height: 26}} /><span style={{font: `700 22px ${INTER}`}}>Inbox</span>
                <span style={{marginLeft: 'auto', font: `800 20px ${INTER}`, color: '#fff', background: C.red, borderRadius: 99, padding: '6px 14px', transform: `scale(${1 + Math.max(0, Math.sin(t * 9)) * 0.06})`}}>{waiting} waiting</span>
              </div>
              <div style={{position: 'relative', height: 736, overflow: 'hidden'}}>
                {CHATS.slice(0, rowsIn).map((c, i, arr) => {
                  const j = arr.length - 1 - i; // newest on top
                  const q = sp(0.15 + i * 0.16, {damping: 16, stiffness: 220});
                  return (
                    <div key={i} style={{position: 'absolute', left: 0, right: 0, top: (j - (i === arr.length - 1 ? 1 - q : 0)) * 74, height: 74, display: 'flex', gap: 14, alignItems: 'center', padding: '0 24px', borderBottom: '1px solid #F3F0EA', background: i === arr.length - 1 ? `rgba(253,232,232,${1 - q * 0.7})` : '#fff'}}>
                      <div style={{width: 46, height: 46, borderRadius: '50%', background: c[3], color: '#fff', display: 'grid', placeItems: 'center', font: `700 19px ${NOTO}`}}>{c[0]}</div>
                      <div style={{flex: 1}}><b style={{font: `600 19px ${UI}`}}>{c[1]}</b><div style={{font: `400 16px ${UI}`, color: C.mute}}>{c[2]}</div></div>
                      <span style={{minWidth: 26, height: 26, borderRadius: 13, background: '#25D366', color: '#fff', font: `700 14px ${INTER}`, display: 'grid', placeItems: 'center', padding: '0 7px'}}>{1 + (i * 7) % 9}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </AbsoluteFill>
          {/* swamped agent */}
          <div style={{position: 'absolute', left: 1500, top: 760, transform: `scale(${sp(0.9, {damping: 11})}) rotate(${Math.sin(t * 14) * 1.5}deg)`, display: 'flex', alignItems: 'center', gap: 14, padding: '16px 22px', borderRadius: 22, background: '#fff', boxShadow: lifted}}>
            <div style={{width: 52, height: 52, borderRadius: '50%', background: '#C9A26B', color: '#fff', display: 'grid', placeItems: 'center', font: `700 22px ${INTER}`}}>M</div>
            <div><b style={{font: `700 21px ${INTER}`}}>Mei · Customer service</b><div style={{font: `500 16px ${INTER}`, color: C.red}}>typing… {Math.max(1, Math.round(waiting / 6))} chats open</div></div>
          </div>
          <div style={{position: 'absolute', left: 118, top: 104}}><Headline lines={[['One', 'team.'], [{gold: 'Hundreds of chats.'}]]} start={0.1} size={92} /></div>
        </AbsoluteFill>
      )}
      {/* B */}
      {t >= 2.6 && t < 5.55 && (
        <AbsoluteFill style={{transform: `translateX(${(1 - bIn) * 600 - bOut * 400}px)`, opacity: bIn * (1 - bOut), filter: bIn < 0.98 || bOut > 0.02 ? `blur(${(1 - bIn + bOut) * 16}px)` : undefined}}>
          <div style={{position: 'absolute', left: 150, top: 430}}><Bubble out size={34}>香菇头大 5包, 素叉烧 3包</Bubble></div>
          <div style={{position: 'absolute', left: 230, top: 560, display: 'flex', gap: 14}}>
            <span style={{padding: '10px 18px', borderRadius: 99, background: C.goldTint, color: C.goldText, font: `700 20px ${INTER}`, transform: `scale(${sp(3.6, {damping: 11})})`}}>1,800 look-alike products</span>
            <span style={{padding: '10px 18px', borderRadius: 99, background: C.goldTint, color: C.goldText, font: `700 20px ${INTER}`, transform: `scale(${sp(3.8, {damping: 11})})`}}>Voice notes: 1 in 4 messages</span>
          </div>
          <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}><path d="M640 470 C 760 470, 820 430, 900 430" stroke="#D4B895" strokeWidth={5} fill="none" strokeDasharray="10 12" strokeDashoffset={-t * 60} /></svg>
          <div style={{position: 'absolute', left: 920, top: 250, width: 820, borderRadius: 26, background: '#fff', overflow: 'hidden', boxShadow: lifted, transform: 'perspective(2000px) rotateY(-10deg)'}}>
            <div style={{height: 60, display: 'flex', alignItems: 'center', gap: 12, padding: '0 24px', borderBottom: '1px solid #EEEBE4', font: `600 20px ${INTER}`}}><Img src={staticFile('logos/sql-account.png')} style={{height: 24}} />New Sales Order · Cheras 店</div>
            <div style={{padding: 26}}>
              <div style={{font: `600 14px ${MONO}`, letterSpacing: '.12em', color: C.mute, marginBottom: 8}}>ITEM CODE</div>
              <div style={{height: 54, borderRadius: 12, border: `2px solid ${C.gold}`, display: 'flex', alignItems: 'center', padding: '0 16px', font: `500 24px ${MONO}`}}>{typed}<span style={{opacity: Math.floor(t * 4) % 2 ? 1 : 0}}>|</span></div>
              <div style={{marginTop: 12, borderRadius: 12, border: '1px solid #EEEBE4', overflow: 'hidden', opacity: io(3.7, 3.9)}}>
                {[['MSH-L', '香菇头（大）1kg'], ['MSH-S', '香菇头（小）1kg'], ['MSH-SL', '香菇头 切片 500g'], ['MSH-P', '香菇头 特级 1kg']].map((r, i) => {
                  const hover = Math.floor(clamp01((t - 3.95) / 0.45) * 3.99);
                  const wrong = i === 1 && t > 4.35;
                  return <div key={i} style={{display: 'flex', gap: 16, padding: '13px 16px', borderBottom: '1px solid #F3F0EA', font: `500 21px ${UI}`, background: wrong ? `rgba(229,72,77,${0.15 + wrongFlash * 0.25})` : i === hover && t < 4.35 ? C.goldTint : '#fff'}}><span style={{font: `500 18px ${MONO}`, width: 100}}>{r[0]}</span>{r[1]}{wrong && <b style={{marginLeft: 'auto', color: C.red, font: `700 18px ${INTER}`}}>Wrong item?</b>}</div>;
                })}
              </div>
            </div>
          </div>
          <div style={{position: 'absolute', left: 118, top: 104}}><Headline lines={[['Every', 'order,'], [{gold: 'retyped by hand.'}]]} start={2.7} size={92} /></div>
        </AbsoluteFill>
      )}
      {/* C: kinetic strike-through */}
      {t >= 5.35 && (
        <AbsoluteFill style={{opacity: cIn, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6}}>
          {words.map((w, i) => {
            const p = sp(5.45 + i * 0.32, {damping: 12, stiffness: 200});
            const strike = io(5.75 + i * 0.32, 6.0 + i * 0.32, 0, 1, Easing.out(Easing.cubic));
            return (
              <div key={i} style={{position: 'relative', font: `800 150px/1.02 ${MANROPE}`, letterSpacing: '-0.045em', color: C.ink, transform: `translateY(${(1 - p) * 60}px)`, opacity: clamp01(p * 2) * (1 - strike * 0.55)}}>
                {w}<div style={{position: 'absolute', left: -10, top: '54%', height: 14, width: `${strike * 104}%`, background: C.gold, borderRadius: 7}} />
              </div>
            );
          })}
          <div style={{marginTop: 26, font: `700 34px ${INTER}`, color: C.mute, opacity: io(6.85, 7.15), letterSpacing: '0.02em'}}>Every single order. Every single day.</div>
        </AbsoluteFill>
      )}
      <Vignette />
    </AbsoluteFill>
  );
};

/* ---------- D: routine vs exceptions (3 s) ---------- */
export const SolutionSplit: React.FC = () => {
  const {t, sp, io} = useT();
  const bar = io(0.4, 1.3, 0, 1, Easing.inOut(Easing.cubic));
  const out = io(2.6, 3.0, 0, 1, Easing.in(Easing.cubic));
  return (
    <AbsoluteFill style={{background: C.paper, transform: `translateX(${-Math.pow(out, 1) * 2000}px)`, filter: out > 0.02 ? `blur(${Math.sin(Math.PI * out) * 24}px)` : undefined}}>
      <Backdrop glowX={50} glowY={50} dots />
      <div style={{position: 'absolute', left: 0, right: 0, top: 210, display: 'flex', justifyContent: 'center'}}><Headline lines={[['AI', 'handles', 'the', {gold: 'routine.'}]]} start={0.05} size={96} /></div>
      <div style={{position: 'absolute', left: 260, right: 260, top: 470, height: 130, borderRadius: 30, background: '#EFEBE3', overflow: 'hidden', display: 'flex', boxShadow: 'inset 0 2px 6px rgba(0,0,0,.06)'}}>
        <div style={{width: `${bar * 84}%`, background: 'linear-gradient(90deg,#F3D9BC,#E8B57A)', display: 'flex', alignItems: 'center', gap: 18, paddingLeft: 34, overflow: 'hidden', whiteSpace: 'nowrap'}}>
          <div style={{flex: 'none'}}><Orb size={70} glow={0.5} /></div><span style={{font: `800 34px ${INTER}`, color: '#5C3A12', opacity: io(1.0, 1.3)}}>Routine orders → AI agent · 24/7</span>
        </div>
        <div style={{flex: 1, background: '#0E5B47', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', font: `700 24px ${INTER}`, opacity: io(1.2, 1.5)}}>Team</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 680, display: 'flex', justifyContent: 'center'}}><Headline lines={[['Your', 'team', 'handles', 'the', {gold: 'exceptions.'}]]} start={1.35} size={64} /></div>
      <Vignette />
    </AbsoluteFill>
  );
};

/* ---------- E+F: the data problem (6 s, dark) ---------- */
const QS = ['Which customers stopped ordering?', "Who's overdue 60+ days?", 'What sold most this month?', 'How much 斋鹅 did E395 buy?'];
export const ProblemData: React.FC = () => {
  const {t, sp, io} = useT();
  const eOut = io(2.8, 3.15, 0, 1, Easing.in(Easing.cubic));
  const fIn = io(3.0, 3.35, 0, 1, Easing.out(Easing.cubic));
  const ask = 'How much 斋鹅 did E395 order this month?';
  const typedQ = ask.slice(0, Math.round(ask.length * io(3.4, 4.1, 0, 1, Easing.linear)));
  const reply = "Sorry, I don't have access to your company's data.";
  const typedR = reply.slice(0, Math.round(reply.length * io(4.5, 5.2, 0, 1, Easing.linear)));
  return (
    <AbsoluteFill style={{background: '#0B0D12'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(70% 70% at 55% 50%,#1B1A17,#08090B)'}} />
      {/* E: endless rows + unanswered questions */}
      {t < 3.2 && (
        <AbsoluteFill style={{opacity: 1 - eOut, transform: `scale(${lerp(1, 0.92, eOut)})`}}>
          <AbsoluteFill style={{perspective: 1800}}>
            <div style={{position: 'absolute', left: 760, top: -200, width: 1000, height: 1500, transform: 'rotateX(38deg) rotateZ(-14deg)', overflow: 'hidden', WebkitMaskImage: 'linear-gradient(to bottom,transparent,#000 25%,#000 70%,transparent)'}}>
              <div style={{transform: `translateY(${-((t * 900) % 62)}px)`}}>
                {Array.from({length: 26}, (_, i) => {
                  const n = Math.floor(t * 900 / 62) + i;
                  return <div key={i} style={{height: 62, display: 'grid', gridTemplateColumns: '1fr 1.2fr .6fr 1fr .8fr', alignItems: 'center', padding: '0 24px', borderBottom: '1px solid rgba(255,255,255,.06)', font: `500 20px ${MONO}`, color: 'rgba(255,255,255,.38)'}}>
                    <span>SO-{String(1000 + (n * 37) % 9000).padStart(5, '0')}</span><span>C-{String((n * 53) % 4000).padStart(4, '0')}</span><span>{(n * 7) % 9 + 1}</span><span>{((n * 131) % 9000 / 10).toFixed(2)}</span><span>{String((n * 3) % 28 + 1).padStart(2, '0')} Aug</span>
                  </div>;
                })}
              </div>
            </div>
          </AbsoluteFill>
          {QS.map((q, i) => {
            const p = sp(0.5 + i * 0.35, {damping: 13, stiffness: 150});
            const pos = [[1080, 220], [1250, 430], [980, 640], [1300, 820]][i];
            return <div key={i} style={{position: 'absolute', left: pos[0], top: pos[1] + Math.sin(t * 2 + i) * 8, transform: `scale(${p})`, transformOrigin: 'left center', padding: '16px 24px', borderRadius: '22px 22px 22px 6px', background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.22)', color: '#fff', font: `600 26px ${UI}`, display: 'flex', alignItems: 'center', gap: 14, backdropFilter: 'blur(8px)'}}>
              {q}<span style={{width: 30, height: 30, borderRadius: 15, background: 'rgba(255,255,255,.18)', display: 'grid', placeItems: 'center', font: `800 18px ${INTER}`, color: C.gold}}>?</span></div>;
          })}
          <div style={{position: 'absolute', left: 118, top: 104}}><Headline lines={[['The', 'answers', 'are', 'in'], ['your', 'data.', {gold: 'Somewhere.'}]]} start={0.1} size={84} color="#fff" goldColor={C.gold} /></div>
        </AbsoluteFill>
      )}
      {/* F: generic AI fails */}
      {t >= 3.0 && (
        <AbsoluteFill style={{opacity: fIn, transform: `translateY(${(1 - fIn) * 60}px)`}}>
          <div style={{position: 'absolute', left: 820, top: 360, width: 900, borderRadius: 28, background: '#F5F5F6', overflow: 'hidden', boxShadow: '0 60px 120px -30px rgba(0,0,0,.8)', filter: t > 5.5 ? `grayscale(${io(5.5, 5.9)})` : undefined, transform: `rotate(${t > 5.5 ? io(5.5, 5.9) * -3 : 0}deg) scale(${t > 5.5 ? 1 - io(5.5, 5.9) * 0.04 : 1})`}}>
            <div style={{height: 60, display: 'flex', alignItems: 'center', gap: 12, padding: '0 24px', borderBottom: '1px solid #E4E4E7', font: `600 20px ${INTER}`, color: '#52525B'}}><span style={{width: 34, height: 34, borderRadius: 10, background: '#A1A1AA', color: '#fff', display: 'grid', placeItems: 'center', font: `800 15px ${INTER}`}}>AI</span>Generic AI chatbot</div>
            <div style={{padding: 28, display: 'flex', flexDirection: 'column', gap: 18, minHeight: 330}}>
              <div style={{alignSelf: 'flex-end', background: C.ink, color: '#fff', borderRadius: '20px 20px 6px 20px', padding: '14px 20px', font: `500 24px ${UI}`}}>{typedQ}<span style={{opacity: t < 4.15 && Math.floor(t * 4) % 2 ? 1 : 0}}>|</span></div>
              {t > 4.2 && t < 4.5 && <div style={{alignSelf: 'flex-start', background: '#fff', borderRadius: 18, padding: '14px 18px', display: 'flex', gap: 6}}>{[0, 1, 2].map(i => <i key={i} style={{width: 9, height: 9, borderRadius: 5, background: '#A1A1AA', transform: `translateY(${Math.sin(t * 12 - i) * 3}px)`}} />)}</div>}
              {t >= 4.5 && <div style={{alignSelf: 'flex-start', background: '#fff', border: '1px solid #E4E4E7', borderRadius: '20px 20px 20px 6px', padding: '14px 20px', font: `500 24px ${UI}`, color: '#52525B'}}>{typedR}</div>}
            </div>
          </div>
          <div style={{position: 'absolute', left: 118, top: 104}}><Headline lines={[['Generic', 'AI'], [{gold: "doesn't know you."}]]} start={3.1} size={92} color="#fff" goldColor={C.gold} /></div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* ---------- G: an AI that knows your business (4 s, light) ---------- */
const SRC = [['Your customers', 'E395 · Cheras 店 · 339 accounts', '#8A6A3A', 215], ['Your products', '斋鹅 · 香菇头（大）· aliases', '#5E7340', -55], ['Your numbers', 'Live from SQL Account', '#2563EB', 12], ['Your SOPs', 'Knowledge base, cited', '#7C5CFF', 82], ['Your team', 'Roles & permissions', '#F59E0B', 148]];
export const CustomAI: React.FC = () => {
  const {t, sp, io, out} = useT();
  const burst = io(0, 0.5, 0, 1, Easing.out(Easing.exp));
  const orb = sp(0.05, {damping: 12, stiffness: 120});
  const dive = io(3.45, 4.0, 0, 1, Easing.in(Easing.exp));
  const CX = 1120, CY = 610;
  return (
    <AbsoluteFill style={{background: '#0B0D12'}}>
      <AbsoluteFill style={{clipPath: `circle(${burst * 150}% at ${CX}px ${CY}px)`, transform: `scale(${lerp(1, 6, dive)})`, transformOrigin: `${CX}px ${CY}px`, filter: dive > 0.02 ? `blur(${dive * 14}px)` : undefined}}>
        <Backdrop glowX={60} glowY={52} dots />
        <div style={{position: 'absolute', left: CX - 360, top: CY - 330, width: 720, height: 660, borderRadius: '50%', background: 'rgba(240,170,100,.38)', filter: 'blur(70px)'}} />
        <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
          {[200, 300].map((r, k) => <circle key={k} cx={CX} cy={CY} r={r * orb} fill="none" stroke={`rgba(201,150,90,${0.4 - k * 0.12})`} strokeWidth={2.5} strokeDasharray={k ? '6 14' : undefined} transform={`rotate(${t * 20 * (k ? -1 : 1)} ${CX} ${CY})`} />)}
          {SRC.map((s, i) => {
            const a = (s[3] as number) * Math.PI / 180, R = 420;
            const x = CX + Math.cos(a) * R, y = CY + Math.sin(a) * R * 0.78;
            const p = io(0.9 + i * 0.15, 1.4 + i * 0.15);
            return <line key={i} x1={x} y1={y} x2={lerp(x, CX, p)} y2={lerp(y, CY, p)} stroke="#D4B895" strokeWidth={4} strokeLinecap="round" />;
          })}
        </svg>
        {SRC.map((s, i) => {
          const a = (s[3] as number) * Math.PI / 180, R = 420;
          const x = CX + Math.cos(a) * R, y = CY + Math.sin(a) * R * 0.78;
          const q = sp(0.6 + i * 0.15, {damping: 12, stiffness: 150});
          return <div key={i} style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${q})`, display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderRadius: 22, background: '#fff', whiteSpace: 'nowrap', boxShadow: lifted}}>
            <span style={{width: 14, height: 14, borderRadius: 7, background: s[2] as string}} /><div><b style={{font: `700 24px ${INTER}`}}>{s[0]}</b><div style={{font: `400 17px ${UI}`, color: C.mute}}>{s[1]}</div></div></div>;
        })}
        <div style={{position: 'absolute', left: CX - 110, top: CY - 110, transform: `scale(${orb * (1 + Math.sin(t * 3) * 0.02)})`}}><Orb size={220} glow={1.3} /></div>
        <div style={{position: 'absolute', left: 118, top: 104}}><Headline lines={[['So', 'we', 'built', 'an', 'AI'], ['that', {gold: 'knows your business.'}]]} start={0.35} size={78} /></div>
        <Vignette />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
