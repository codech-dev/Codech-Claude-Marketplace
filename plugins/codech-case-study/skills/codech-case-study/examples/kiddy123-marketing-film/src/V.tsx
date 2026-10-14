import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile} from 'remotion';
import {INTER, MANROPE, MONO, clamp01, lerp, useT} from './lib';
import {ClientChip, In, Pillars, Poi, Sub, THead, TT, typed} from './Town';
import {B, CompareChat, CompareTable, ContextPanel, ChinesePanel, DoneBubble, EnquireDialog, FLOAT, FindPanel, GapsCard, GuessPanel} from './Chat';
import {Check, Eyebrow, GLASS, Logo, Pop, StepCard, Tag, useDeliverSteps} from './Engine';
import {Badge, Bot, Btn, Card, Grow, Ic, JAK, Kpi, NUN, P, Scale, Show, Toast} from './Proto';
import {EndCard} from './EndCard';
import {Entry, FilmCut, TLF, TLS} from './Film';

/* 9:16 (1080 x 1920) cuts for Instagram / Facebook Reels and Stories (14 Oct 2026). Same scenes, same LOCAL timing as the
   16:9 film (so the music fit and audio/cues.py carry over); re-laid for the tall frame on 9:16 ChatGPT Image plates
   (public/plates/v_*.png). Safe zones: nothing important above y 230 (app header) or below y ~1530 (caption + buttons),
   and the right ~120 px stays clear of the Reels action buttons. */
const VW = 1080, VH = 1920;
const MONOF = `${MONO}, ui-monospace, monospace`;
const VPlate: React.FC<{src: string; dur: number; s0?: number; s1?: number; origin?: string; blur?: number; dim?: number}> = ({src, dur, s0 = 1.04, s1 = 1.1, origin = '50% 60%', blur = 0, dim = 0}) => {
  const {io} = useT(); const p = io(0, dur, 0, 1, Easing.inOut(Easing.sin));
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Img src={staticFile(`plates/v_${src}.png`)} style={{position: 'absolute', inset: 0, width: VW, height: VH, objectFit: 'cover', transformOrigin: origin, transform: `scale(${lerp(s0, s1, p)})`, filter: blur ? `blur(${blur}px)` : undefined}} />
      {dim > 0 && <AbsoluteFill style={{background: `rgba(6,20,28,${dim})`}} />}
    </AbsoluteFill>
  );
};
/** Dark wash behind white headlines (top) and a softer one at the bottom so the app caption stays legible. */
const DarkTop: React.FC<{to?: number; reach?: number}> = ({to = 0.85, reach = 48}) => (
  <AbsoluteFill style={{background: `linear-gradient(180deg,rgba(8,28,36,${to}) 0%,rgba(8,28,36,${to * 0.7}) ${reach * 0.55}%,rgba(8,28,36,0) ${reach}%),linear-gradient(0deg,rgba(8,28,36,.55) 0%,rgba(8,28,36,0) 22%)`}} />
);
const LightTop: React.FC<{reach?: number; o?: number}> = ({reach = 56, o = 1}) => (
  <AbsoluteFill style={{opacity: o, background: `linear-gradient(180deg,rgba(234,244,255,.96) 0%,rgba(234,244,255,.9) ${reach * 0.6}%,rgba(234,244,255,0) ${reach}%)`}} />
);
const Head: React.FC<{children: React.ReactNode; top?: number}> = ({children, top = 330}) => <div style={{position: 'absolute', left: 70, right: 70, top}}>{children}</div>;
const useExit = (dur: number, len = 0.45) => { const {io} = useT(); return io(dur - len, dur, 0, 1, Easing.in(Easing.exp)); };
/** A chat panel (384 x 560 css) centred under the headline. */
const PanelSlot: React.FC<{children: React.ReactNode; top?: number; k?: number; h?: number; from?: number}> = ({children, top = 575, k = 1.66, h = 560, from = 60}) => (
  <In at={0} from={from} style={{left: (VW - 384 * k) / 2, top, filter: FLOAT}}><Scale k={k} w={384} h={h}>{children}</Scale></In>
);

/* ================= opener ================= */
const VOpener: React.FC = () => {
  const {io, sp} = useT(); const ex = useExit(4.4); const lc = sp(0.2, {damping: 14, stiffness: 150});
  return (
    <AbsoluteFill style={{transform: `scale(${lerp(1, 1.5, ex)})`, filter: ex > 0.02 ? `blur(${ex * 14}px)` : undefined}}>
      <VPlate src="town2" dur={4.4} s0={1.12} s1={1.02} origin="50% 75%" />
      <LightTop reach={62} />
      <div style={{position: 'absolute', left: 70, top: 300, overflow: 'hidden', padding: 4}}><Img src={staticFile('codech-logo-crop.png')} style={{height: 84, transform: `translateY(${(1 - lc) * 120}%)`}} /></div>
      <div style={{position: 'absolute', left: 72, top: 440, font: `700 22px ${MONOF}`, letterSpacing: '.3em', color: TT.ink, opacity: io(0.7, 1.0)}}>A CODECH CASE STUDY</div>
      <Head top={490}><THead lines={[[{hi: 'AI'}, 'school-'], ['matching'], ['assistant']]} start={0.9} size={124} color={TT.ink} /></Head>
      <div style={{position: 'absolute', left: 72, top: 905, opacity: io(2.0, 2.4)}}><ClientChip label="Proposed for" /></div>
      <div style={{position: 'absolute', left: 72, top: 1010}}><Pillars at={2.5} /></div>
    </AbsoluteFill>
  );
};

/* ================= the challenge ================= */
const VSprawl: React.FC = () => {
  const {io} = useT(); const n = Math.round(15074 * io(0.2, 1.8, 0, 1, Easing.out(Easing.cubic)));
  return (
    <AbsoluteFill>
      <VPlate src="sprawl" dur={3.2} s0={1.35} s1={1.0} origin="50% 60%" />
      <LightTop reach={50} />
      <div style={{position: 'absolute', left: 62, top: 330, font: `800 236px/0.9 ${MANROPE}`, letterSpacing: '-0.06em', color: TT.ink, fontVariantNumeric: 'tabular-nums'}}>{n.toLocaleString('en-US')}</div>
      <Head top={570}><THead lines={[['schools', 'to'], ['choose', 'from.']]} start={0.5} size={84} color={TT.ink} /></Head>
      <div style={{position: 'absolute', left: 74, top: 780, font: `600 24px ${MONOF}`, letterSpacing: '.2em', color: TT.ink, opacity: io(1.2, 1.6)}}>ONE DIRECTORY · KIDDY123.COM</div>
    </AbsoluteFill>
  );
};
const VForm: React.FC = () => {
  const {t} = useT();
  return (
    <AbsoluteFill>
      <VPlate src="sprawl" dur={3.2} s0={1.1} s1={1.16} blur={9} dim={0.35} />
      <DarkTop />
      <Head><THead lines={[['One', 'filter'], [{hi: 'form.'}]]} size={124} /></Head>
      <div style={{position: 'absolute', left: 74, top: 600}}><Sub>Then long result pages, school by school.</Sub></div>
      <In at={0.25} rot={-4} style={{left: 110, top: 720}}>
        <div style={{width: 860, transform: 'rotate(-3deg)', background: '#F3F3F3', borderRadius: 14, padding: 30, boxShadow: '0 60px 120px -40px rgba(0,0,0,.8)', fontFamily: 'Arial, sans-serif'}}>
          <div style={{font: '700 30px Arial', color: '#333'}}>Search Directory</div>
          {['Select Category', 'Select State', 'Select City', 'Child Age'].map((l) => <div key={l} style={{marginTop: 14, height: 52, background: '#fff', border: '1px solid #bbb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', font: '400 23px Arial', color: '#666'}}>{l}<span>▾</span></div>)}
          <div style={{marginTop: 18, height: 56, background: '#C0392B', color: '#fff', display: 'grid', placeItems: 'center', font: '700 22px Arial', letterSpacing: '.1em'}}>SEARCH</div>
          <div style={{height: 300, overflow: 'hidden', marginTop: 20, position: 'relative'}}>
            <div style={{transform: `translateY(${-t * 260}px)`}}>{Array.from({length: 18}, (_, i) => <div key={i} style={{display: 'flex', gap: 16, padding: '12px 0', borderBottom: '1px solid #ddd'}}>
              <div style={{width: 100, height: 66, background: '#ccc'}} /><div style={{flex: 1}}><div style={{height: 16, width: `${60 + (i * 13) % 30}%`, background: '#999'}} /><div style={{height: 11, width: '85%', background: '#ccc', marginTop: 11}} /><div style={{height: 11, width: '70%', background: '#ccc', marginTop: 9}} /></div></div>)}</div>
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 90, background: 'linear-gradient(rgba(243,243,243,0),#F3F3F3)'}} />
          </div>
        </div>
      </In>
    </AbsoluteFill>
  );
};
const VDemand: React.FC = () => {
  const {t} = useT();
  const qs: [string, number, number][] = [['Montessori in Cheras?', 330, 0.1], ['Is there a school bus?', 720, 0.45], ['Halal meals?', 300, 0.8], ['Under RM800?', 760, 1.1], ['华文幼儿园?', 420, 1.35], ['Takes 3-year-olds?', 700, 1.7]];
  return (
    <AbsoluteFill>
      <VPlate src="night" dur={3.0} s0={1.06} s1={1.12} />
      <DarkTop />
      {qs.map(([q, x, a], i) => { const p = clamp01((t - a) / 1.6); return (
        <div key={i} style={{position: 'absolute', left: x, top: lerp(1500, 760, p), transform: 'translateX(-50%)', opacity: p <= 0 ? 0 : Math.sin(p * Math.PI) * 1.1, filter: `blur(${Math.max(0, p - 0.6) * 12}px)`,
          background: 'rgba(255,255,255,.94)', borderRadius: 26, padding: '16px 26px', font: `600 32px ${NUN}`, color: TT.ink, whiteSpace: 'nowrap', boxShadow: '0 20px 40px -14px rgba(0,0,0,.6)'}}>{q}</div>); })}
      <Head><THead lines={[['No', 'view', 'of'], [{hi: 'demand.'}]]} size={124} /></Head>
      <div style={{position: 'absolute', left: 74, top: 600}}><Sub>Parents ask. Nobody counts.</Sub></div>
    </AbsoluteFill>
  );
};

/* ================= our solution ================= */
const VReveal: React.FC = () => {
  const {t, io} = useT();
  const pull = io(0, 1.3, 0, 1, Easing.in(Easing.cubic));
  const PIN = {x: 560, y: 1180};
  const chips: [string, number, number][] = [['15,074 schools', 300, 760], ['One filter form', 760, 1000], ['No view of demand', 360, 1420]];
  const pulse = Math.max(0, 1 - Math.abs(t - 1.35) / 0.35);
  return (
    <AbsoluteFill>
      <VPlate src="town2" dur={5} s0={1.0} s1={1.06} origin="50% 75%" />
      <LightTop reach={58} o={io(1.2, 1.7)} />
      {chips.map(([c, x, y], i) => (
        <div key={i} style={{position: 'absolute', left: lerp(x, PIN.x, pull), top: lerp(y, PIN.y, pull), transform: `translate(-50%,-50%) scale(${lerp(1, 0.2, pull)})`, opacity: 1 - io(1.15, 1.35),
          padding: '18px 30px', borderRadius: 22, background: '#fff', font: `700 36px ${INTER}`, color: '#9CA3AF', textDecoration: 'line-through', whiteSpace: 'nowrap', boxShadow: '0 20px 40px -14px rgba(0,0,0,.5)'}}>{c}</div>))}
      <div style={{position: 'absolute', left: PIN.x - 110, top: PIN.y - 110, width: 220, height: 220, borderRadius: 110, background: 'radial-gradient(circle,rgba(255,201,60,.95) 0 18%,rgba(255,201,60,.35) 40%,rgba(255,201,60,0) 70%)', transform: `scale(${0.6 + pulse * 1.8 + io(1.3, 2.2, 0, 2.5)})`, opacity: 1 - io(1.8, 2.4)}} />
      {t > 1.4 && <Head><THead lines={[[{hi: 'AI'}, 'school-'], ['matching'], ['assistant']]} start={1.5} size={120} color={TT.ink} /></Head>}
      <div style={{position: 'absolute', left: 72, top: 735, opacity: io(2.4, 2.8)}}><ClientChip label="Built by Codech · for" /></div>
      <div style={{position: 'absolute', left: 72, top: 835}}><Pillars at={2.9} /></div>
      <Poi x={330} y={1150} n="Little Oak Montessori" f="RM750–950" rank={2} at={3.3} />
      <Poi x={760} y={1090} n="De JowiTop Preschool" f="RM800–1,200" rank={1} at={3.1} />
      <Poi x={600} y={1400} n="Apple King Main Centre" f="RM380–650" rank={3} at={3.5} />
    </AbsoluteFill>
  );
};

/* ================= match ================= */
const VFind: React.FC = () => (
  <AbsoluteFill>
    <VPlate src="town2" dur={5.6} s0={1.3} s1={1.36} blur={6} origin="50% 70%" />
    <DarkTop to={0.9} reach={40} />
    <Head><THead lines={[['Describe', 'it.'], ['Get', 'a', {hi: 'shortlist.'}]]} size={96} /></Head>
    <PanelSlot><FindPanel /></PanelSlot>
  </AbsoluteFill>
);
const VEnquire: React.FC = () => {
  const {t, sp, io} = useT();
  const close = io(2.45, 2.75); const toast = sp(2.7, {damping: 14, stiffness: 180});
  return (
    <AbsoluteFill>
      <VPlate src="town2" dur={4.4} s0={1.22} s1={1.28} blur={8} origin="50% 70%" />
      <AbsoluteFill style={{background: 'rgba(28,25,23,.5)'}} />
      <DarkTop to={0.7} />
      <Head><THead lines={[['Straight', 'to', 'an'], [{hi: 'enquiry.'}]]} size={112} /></Head>
      <div style={{position: 'absolute', left: 74, top: 590}}><Sub at={0.8}>Pre-filled from the chat. PDPA consent first.</Sub></div>
      <In at={0} from={60} style={{left: 140, top: 680, opacity: 1 - close, filter: FLOAT}}><Scale k={2.0} w={400} h={410}><EnquireDialog /></Scale></In>
      <div style={{position: 'absolute', left: 540, top: 1360, transform: `translate(-50%,${(1 - toast) * 40}px) scale(1.9)`, opacity: clamp01(toast * 2)}}><Toast>Enquiry sent to De JowiTop Preschool</Toast></div>
      {t > 2.9 && <In at={2.95} style={{left: 156, top: 820, filter: FLOAT}}><Scale k={2.0} w={384} h={150}><DoneBubble /></Scale></In>}
    </AbsoluteFill>
  );
};
const VCompare: React.FC = () => {
  const {io} = useT();
  return (
    <AbsoluteFill style={{background: '#F7F7F5'}}>
      <VPlate src="top" dur={4.6} s0={1.1} s1={1.16} blur={14} />
      <AbsoluteFill style={{background: 'rgba(247,247,245,.88)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', opacity: io(0, 0.4)}}>
        <div style={{fontFamily: MONOF, fontSize: 22, textTransform: 'uppercase', letterSpacing: '.14em', color: P.primaryHover, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10}}><Ic n="scale" s={22} />COMPARE SCHOOLS</div>
        <div style={{fontFamily: JAK, fontWeight: 800, fontSize: 70, lineHeight: 1.1, color: P.fg, marginTop: 14}}>Side by side,<br /><span style={{color: P.primary}}>fact by fact</span></div>
      </div>
      <In at={0.15} from={50} style={{left: 58, top: 590}}><Scale k={1.12} w={860} h={420}><CompareTable /></Scale></In>
      <In at={0.3} from={50} style={{left: (VW - 384 * 1.55) / 2, top: 1075, filter: FLOAT}}><Scale k={1.55} w={384} h={290}><CompareChat h={290} sc={300} /></Scale></In>
    </AbsoluteFill>
  );
};

/* ================= answer ================= */
const ListingV: React.FC<{dur: number; s0?: number; head: React.ReactNode; children: React.ReactNode}> = ({dur, s0 = 1.04, head, children}) => (
  <AbsoluteFill>
    <VPlate src="school" dur={dur} s0={s0} s1={s0 + 0.06} origin="50% 70%" />
    <DarkTop to={0.9} reach={40} />
    <Head>{head}</Head>
    {children}
  </AbsoluteFill>
);
const VContext: React.FC = () => (
  <ListingV dur={4.6} head={<THead lines={[['It', 'knows', 'the'], [{hi: 'school'}, {hi: "you're"}, {hi: 'on.'}]]} size={96} />}>
    <PanelSlot k={1.5}><ContextPanel /></PanelSlot>
    <In at={2.8} style={{left: 130, top: 1428}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 16, background: '#fff', borderRadius: 20, padding: '16px 26px', boxShadow: '0 30px 60px -20px rgba(0,0,0,.6)', font: `700 30px ${INTER}`, color: TT.ink}}>
        <span style={{font: `700 18px ${MONO}`, letterSpacing: '.16em', color: TT.sunDeep}}>FROM THE LISTING</span>RM380–650 · school bus ✓</div>
    </In>
  </ListingV>
);
const VChinese: React.FC = () => (
  <ListingV dur={4.0} s0={1.1} head={<THead lines={[['EN.', 'BM.', {hi: '中文.'}]]} size={120} />}>
    <div style={{position: 'absolute', left: 74, top: 470}}><Sub at={0.7}>Switch any time. The facts stay exact.</Sub></div>
    <PanelSlot from={0}><ChinesePanel /></PanelSlot>
  </ListingV>
);
const VGuess: React.FC = () => (
  <ListingV dur={3.8} s0={1.16} head={<THead lines={[['Never', 'a', {hi: 'guess.'}]]} size={112} />}>
    <div style={{position: 'absolute', left: 74, top: 470}}><Sub at={0.7}>If the listing doesn't say, it says so.</Sub></div>
    <PanelSlot from={0}><GuessPanel /></PanelSlot>
  </ListingV>
);

/* ================= insight (admin, sample data) ================= */
const VAdmin: React.FC<{title: string; sub: string; action: React.ReactNode; view: string; children: React.ReactNode}> = ({title, sub, action, view, children}) => (
  <div style={{width: 600, borderRadius: 16, overflow: 'hidden', background: '#F7F7F5', boxShadow: P.shXl, border: `1px solid ${P.border}`, fontFamily: NUN, color: P.fg}}>
    <div style={{height: 44, background: '#1C1917', display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px'}}>
      <span style={{fontFamily: JAK, fontWeight: 800, fontSize: 15, color: '#fff'}}>KiddyMatch <span style={{color: P.brand}}>Admin</span></span>
      <span style={{marginLeft: 'auto', background: P.primary, color: '#fff', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 700}}>{view}</span>
    </div>
    <div style={{padding: 18}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14}}><div><div style={{fontFamily: JAK, fontWeight: 800, fontSize: 20}}>{title}</div><div style={{fontSize: 11.5, color: P.muted}}>{sub}</div></div>{action}</div>
      {children}
    </div>
  </div>
);
const AdminV: React.FC<{dur: number; head: React.ReactNode; children: React.ReactNode; lift?: React.ReactNode}> = ({dur, head, children, lift}) => (
  <AbsoluteFill>
    <VPlate src="office" dur={dur} s0={1.08} s1={1.14} blur={6} dim={0.3} origin="50% 60%" />
    <DarkTop to={0.9} reach={42} />
    <Head>{head}</Head>
    <In at={0} from={70} style={{left: 75, top: 575, filter: FLOAT}}><Scale k={1.55} w={600} h={600}>{children}</Scale></In>
    {lift}
    <div style={{position: 'absolute', left: 0, right: 0, top: 1490, textAlign: 'center', font: `600 18px ${MONO}`, letterSpacing: '.18em', color: 'rgba(255,255,255,.7)'}}>ADMIN DASHBOARD · SAMPLE DATA</div>
  </AbsoluteFill>
);
const Lift: React.FC<{at: number; x: number; y: number; k: number; children: React.ReactNode}> = ({at, x, y, k, children}) => {
  const {sp} = useT(); const p = sp(at, {damping: 14, stiffness: 120});
  return <div style={{position: 'absolute', left: x, top: y, transform: `scale(${lerp(1, k, p)})`, transformOrigin: '50% 50%', opacity: clamp01(p * 3), filter: `drop-shadow(0 ${50 * p}px ${70 * p}px rgba(6,20,28,.6))`}}>{children}</div>;
};
const Kpis: React.FC<{items: [string, string, string?, string?][]}> = ({items}) => (
  <div style={{display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 12}}>{items.map(([v, l, d, icon], i) => <Kpi key={l} at={0.3 + i * 0.08} v={v} l={l} d={d} icon={icon} />)}</div>
);
const VIntent: React.FC = () => {
  const bars: [string, string, number, boolean][] = [['Cheras', '2,140', 88, true], ['Puchong', '1,556', 64, true], ['Subang', '1,270', 52, true], ['Ampang', '905', 38, false], ['Setapak', '688', 29, false]];
  return (
    <AdminV dur={4.8} head={<THead lines={[['Every', 'question'], ['becomes', {hi: 'data.'}]]} size={92} />}
      lift={<Lift at={2.6} x={90} y={1130} k={1.18}><Scale k={2.0} w={446} h={190}><GapsCard w={446} /></Scale></Lift>}>
      <VAdmin view="Intent Analytics" title="Intent Analytics" sub="Last 30 days · All languages" action={<Btn sm kind="secondary">Export CSV</Btn>}>
        <Kpis items={[['12,480', 'Conversations', '+18%'], ['1,304', 'Leads generated', '+31%'], ['87%', '"Helpful" rating', '+4 pts'], ['96.2%', 'Fact accuracy', '+1.1 pts']]} />
        <Show at={0.6}><Card>
          <div style={{fontFamily: JAK, fontWeight: 700, fontSize: 14, marginBottom: 10}}>Top requested areas</div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 7, fontSize: 12}}>{bars.map(([a, n, w, teal]) => <div key={a} style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <span style={{width: 66, color: P.muted}}>{a}</span><Grow w={w} at={0.9} h={16} color={teal ? P.teal : P.primary} track={P.tealTint} style={{flex: 1}} /><span style={{width: 44, textAlign: 'right', fontFamily: MONOF}}>{n}</span></div>)}</div>
        </Card></Show>
      </VAdmin>
    </AdminV>
  );
};
const VLost: React.FC = () => {
  const lost: [string, number, number, boolean][] = [['No fee listed on the profile', 89, 100, true], ["Fee above the parent's budget", 42, 47, false], ["Age range didn't cover the child", 21, 24, false], ['Missing facility — transport', 14, 16, true]];
  const row = (l: typeof lost[0], i: number, big?: boolean) => <div key={l[0]} style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, padding: big ? '8px 10px' : 0, background: big ? '#F0FDF4' : 'transparent', borderRadius: 8, boxShadow: big ? 'inset 0 0 0 2px #86EFAC' : 'none'}}>
    <span style={{flex: 1}}>{l[0]}{l[3] && <Badge tone="green" style={{marginLeft: 6, fontSize: 9.5}}>fixable</Badge>}</span>
    <Grow w={l[2]} at={1.0 + i * 0.07} h={16} color={P.warning} track="#FEF3C7" style={{width: 84}} /><span style={{width: 26, textAlign: 'right', fontFamily: MONOF, fontWeight: 700}}>{l[1]}</span></div>;
  return (
    <AdminV dur={4.4} head={<THead lines={[['Why', 'a', 'school'], [{hi: 'lost'}, {hi: 'matches.'}]]} size={92} />}
      lift={<Lift at={2.4} x={110} y={1330} k={1.12}><Scale k={1.8} w={470} h={44}><div style={{width: 470, background: '#fff', borderRadius: 10, fontFamily: NUN, color: P.fg}}>{row(lost[0], 0, true)}</div></Scale></Lift>}>
      <VAdmin view="School Performance" title="School Performance" sub="Wesley Preschool, Klang · Gold · Last 30 days" action={<Btn sm kind="secondary">Export CSV</Btn>}>
        <Kpis items={[['312', 'Appeared in matches', '+22%', 'search'], ['146', 'Recommended', '+9%', 'star'], ['58', 'Card clicks', '+14%', 'users'], ['11', 'Enquiries', '+3', 'mail']]} />
        <Show at={0.7}><Card><div style={{fontFamily: JAK, fontWeight: 700, fontSize: 14, marginBottom: 4}}>Why this school lost matches <Badge tone="amber" style={{marginLeft: 4}}>sales hook</Badge></div>
          <div style={{fontSize: 11.5, color: P.muted, marginBottom: 10}}>Each bar is a parent who wanted this school's category and area, but didn't see it.</div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 9}}>{lost.map((l, i) => row(l, i))}</div></Card></Show>
      </VAdmin>
    </AdminV>
  );
};
const VSponsor: React.FC = () => {
  const {t} = useT();
  const inv: [string, number, number][] = [['Preschool · Klang', 3, 3], ['Preschool · Cheras', 2, 3], ['Enrichment · Puchong', 1, 3]];
  const rules = ['A sponsored school only appears if it meets every requirement the parent gave.', 'Sponsored results always carry a visible Sponsored label.', 'Sponsorship never changes a factual answer, and never sways the comparison verdict.', 'If no sponsor qualifies, the slot is left empty — never filled with a worse match.'];
  return (
    <AdminV dur={4.4} head={<THead lines={[['Sponsored.'], ['Always', {hi: 'labelled.'}]]} size={100} />}>
      <VAdmin view="Sponsorships" title="Sponsorship Manager" sub="Bookable AI placement · sold as the AI SEO package" action={<Btn sm>+ New placement</Btn>}>
        <Show at={0.6}><Card style={{marginBottom: 12}}><div style={{fontFamily: JAK, fontWeight: 700, fontSize: 14, marginBottom: 10}}>Inventory availability</div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12}}>{inv.map(([sc, sold, cap]) => { const full = sold >= cap; return <div key={sc}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 4}}><span style={{color: P.muted}}>{sc}</span><span style={{fontFamily: MONOF, fontWeight: 700, color: full ? P.danger : P.fg}}>{sold} / {cap}{full && ' · full'}</span></div>
            <div style={{display: 'flex', gap: 4}}>{Array.from({length: cap}, (_, i) => <div key={i} style={{flex: 1, height: 14, borderRadius: 4, background: i < sold ? (full ? P.danger : P.primary) : P.tealTint}} />)}</div></div>; })}</div></Card></Show>
        <Show at={0.7}><Card><div style={{fontFamily: JAK, fontWeight: 700, fontSize: 14, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 7}}><Ic n="shield" s={15} c={P.success} />Fairness rules — enforced automatically</div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5}}>{rules.map((r, i) => <div key={i} style={{display: 'flex', gap: 8, alignItems: 'flex-start', opacity: t > 1.1 + i * 0.35 ? 1 : 0.25}}><span style={{marginTop: 2}}><Ic n="check" s={14} c={P.success} w={2.5} /></span>{r}</div>)}</div></Card></Show>
      </VAdmin>
    </AdminV>
  );
};

/* ================= how it works ================= */
const VHow: React.FC = () => {
  const {io} = useT();
  const n = Math.round(lerp(15074, 3, io(1.7, 2.9, 0, 1, Easing.inOut(Easing.cubic))));
  const X = 70, PW = 940;
  const arrow = (y: number, at: number) => { const d = io(at, at + 0.4); return <div style={{position: 'absolute', left: VW / 2 - 3, top: y, width: 6, height: 34 * d, borderRadius: 3, background: TT.sun, boxShadow: '0 0 14px rgba(255,201,60,.9)'}} />; };
  return (
    <AbsoluteFill style={{background: TT.night}}>
      <VPlate src="top" dur={5} s0={1.25} s1={1.32} blur={6} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg,rgba(5,16,26,.88),rgba(5,16,26,.94))'}} />
      <Head><THead lines={[['Facts', 'from', 'the'], [{hi: 'database.'}]]} size={96} /></Head>
      <Pop at={0.25} from={60} style={{position: 'absolute', left: X, top: 575, width: PW, height: 300, padding: 28, ...GLASS}}>
        <Eyebrow n="01">THE QUESTION</Eyebrow>
        <div style={{marginTop: 18, background: P.grad, color: '#fff', borderRadius: '22px 22px 6px 22px', padding: '14px 20px', font: `600 25px/1.4 ${NUN}`}}>Affordable Montessori kindy in Cheras with a school bus for my 4-year-old — we speak Mandarin at home</div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16}}><Tag at={1.05}>📍 Cheras</Tag><Tag at={1.15}>Age 4</Tag><Tag at={1.25}>🚌 Bus</Tag><Tag at={1.35}>Affordable</Tag><Tag at={1.5} soft>Montessori</Tag><Tag at={1.6} soft>Mandarin</Tag></div>
      </Pop>
      {arrow(882, 1.5)}
      <Pop at={0.4} from={60} style={{position: 'absolute', left: X, top: 925, width: PW, height: 280, padding: 28, ...GLASS}}>
        <Eyebrow n="02">EXACT FILTER</Eyebrow>
        <div style={{display: 'flex', alignItems: 'center', gap: 28, marginTop: 14}}>
          <div style={{font: `800 110px/1 ${MANROPE}`, letterSpacing: '-0.05em', color: n <= 3 ? TT.sun : '#fff', fontVariantNumeric: 'tabular-nums', minWidth: 420}}>{n.toLocaleString('en-US')}</div>
          <div><div style={{display: 'flex', alignItems: 'center', gap: 12}}><Logo src="logos/postgresql.svg" s={30} /><span style={{font: `800 24px ${INTER}`, color: '#fff'}}>PostgreSQL + pgvector</span></div>
            <div style={{font: `600 22px ${INTER}`, color: 'rgba(255,255,255,.72)', marginTop: 10}}>{n <= 3 ? 'schools pass every hard need' : 'Kiddy123 school listings'}</div></div>
        </div>
        <Pop at={3.0} from={10} style={{marginTop: 14, font: `700 21px ${INTER}`, color: '#9EE7EF'}}>↕ Re-ranked by meaning: Montessori, Mandarin</Pop>
      </Pop>
      {arrow(1212, 3.0)}
      <Pop at={0.55} from={60} style={{position: 'absolute', left: X, top: 1255, width: PW, height: 270, padding: 28, ...GLASS}}>
        <Eyebrow n="03">CLAUDE EXPLAINS</Eyebrow>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 16}}><Logo src="logos/claude.svg" s={30} /><span style={{font: `800 24px ${INTER}`, color: '#fff'}}>Claude Sonnet 5 · only from retrieved fields</span></div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginTop: 18}}>
          <Check at={3.6}>Fees, ages and phones as listed</Check>
          <Check at={3.8}>Output check: no unsupported claims</Check>
          <Check at={4.1}>Enquiries go into Kiddy123's leads</Check>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};

/* ================= how we delivered ================= */
const VDelivered: React.FC = () => {
  const steps = useDeliverSteps();
  return (
    <AbsoluteFill>
      <VPlate src="town2" dur={5.2} s0={1.06} s1={1.12} blur={3} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg,rgba(234,244,255,.95),rgba(234,244,255,.84))'}} />
      <Head><THead lines={[['From', 'proposal', 'to'], [{hi: 'production.'}]]} size={92} color={TT.ink} /></Head>
      {steps.map((st, i) => <StepCard key={i} i={i} at={0.45 + i * 0.5} title={st.title} desc={st.desc} live={st.live} visual={st.visual} x={70 + (i % 2) * 480} y={575 + Math.floor(i / 2) * 475} w={460} vh={250} />)}
    </AbsoluteFill>
  );
};

/* ================= results ================= */
const VResults: React.FC = () => {
  const {io} = useT();
  const stats: [number, string][] = [[15074, 'school listings searched'], [3, 'languages: EN · BM · 中文'], [4, 'modes: finder, listing, compare, admin'], [16, 'admin dashboard screens']];
  return (
    <AbsoluteFill>
      <VPlate src="night" dur={4.8} s0={1.1} s1={1.0} />
      <AbsoluteFill style={{background: 'rgba(4,14,22,.62)'}} />
      <Head><THead lines={[['The', {hi: 'results.'}]]} size={124} /></Head>
      <div style={{position: 'absolute', left: 70, top: 600, display: 'grid', gridTemplateColumns: 'repeat(2,440px)', gap: '70px 60px'}}>
        {stats.map(([v, l], i) => { const p = io(0.5 + i * 0.2, 1.7 + i * 0.2, 0, 1, Easing.out(Easing.cubic)); return (
          <div key={i} style={{borderTop: `5px solid ${TT.sun}`, paddingTop: 24, opacity: clamp01(p * 3)}}>
            <div style={{font: `800 124px/1 ${MANROPE}`, letterSpacing: '-0.05em', color: '#fff', fontVariantNumeric: 'tabular-nums'}}>{Math.round(v * p).toLocaleString('en-US')}</div>
            <div style={{font: `500 30px/1.3 ${INTER}`, color: 'rgba(255,255,255,.85)', marginTop: 12}}>{l}</div></div>); })}
      </div>
      <div style={{position: 'absolute', left: 70, right: 120, top: 1290}}><Sub at={1.8} size={34}>Every fee, age and phone number from Kiddy123's own listings.</Sub></div>
    </AbsoluteFill>
  );
};

/* ================= end card ================= */
const VEnd: React.FC = () => {
  const {io} = useT();
  return <EndCard v bg={<><VPlate src="town2" dur={7.5} s0={1.15} s1={1.22} blur={10} /><AbsoluteFill style={{background: 'rgba(250,248,244,.86)'}} /></>} />;
};

export const VSCENES: Record<string, React.ReactNode> = {
  opener: <VOpener />, sprawl: <VSprawl />, form: <VForm />, demand: <VDemand />, reveal: <VReveal />,
  find: <VFind />, enquire: <VEnquire />, compare: <VCompare />, context: <VContext />, chinese: <VChinese />, guess: <VGuess />,
  intent: <VIntent />, lost: <VLost />, sponsor: <VSponsor />, how: <VHow />, delivered: <VDelivered />, results: <VResults />, end: <VEnd />,
};
export const FilmV: React.FC = () => <FilmCut tl={TLF} scenes={VSCENES} vertical />;
export const FilmVShort: React.FC = () => <FilmCut tl={TLS} scenes={VSCENES} vertical />;
export type {Entry};
