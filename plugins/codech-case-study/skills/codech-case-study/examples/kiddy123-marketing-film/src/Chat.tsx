import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile} from 'remotion';
import {INTER, MANROPE, MONO, clamp01, lerp, useT} from './lib';
import {Plate, Shade, Sub, THead, TT, In, typed} from './Town';
import {AdminFrame, AdminHead, Badge, Bot, Btn, Card, Chips, Field, Grow, Ic, JAK, Kpi, NUN, P, Panel, SCH, Scale, SchoolCard, Show, Table, Toast, Typing, User, InputBar, Lang} from './Proto';

/* Kiddy123 film v2 (13 Oct 2026): the AI chatbot only (user: "focus on the AI chatbot, no cleaner website / faster site"),
   every product screen rebuilt from the KiddyMatch prototype (Proto.tsx) and scaled up for video. Local time per scene. */
const MONOF = `${MONO}, ui-monospace, monospace`;
export const FLOAT = 'drop-shadow(0 70px 90px rgba(6,20,28,.55))';
export const B: React.FC<{children: React.ReactNode}> = ({children}) => <b style={{fontWeight: 800}}>{children}</b>;
export const Code: React.FC<{children: React.ReactNode; hi?: boolean}> = ({children, hi}) => <span style={{fontFamily: MONOF, fontSize: 13, background: hi ? P.orangeTint : '#F5F5F4', borderRadius: 4, padding: '1px 5px', boxShadow: hi ? `0 0 0 1.5px ${P.primary}` : 'none'}}>{children}</span>;

/* ================= MATCH 1 · school finder ================= */
export const FindPanel: React.FC = () => {
  const {t, io} = useT();
  const q = 'Affordable Montessori kindy in Cheras with a school bus for my 4-year-old — we speak Mandarin at home';
  const scroll = io(2.95, 3.6, 0, 250, Easing.inOut(Easing.cubic)) + io(4.3, 4.9, 0, 130, Easing.inOut(Easing.cubic));
  return (
    <Panel lang="en" h={560} scroll={scroll} input={<InputBar ph="Ask about schools, fees, locations…" text={t < 1.95 ? typed(q, t, 0.35, 1.85) : ''} caret />}>
      <Bot at={0}>Hi, I'm KiddyMatch! 👋 Tell me your area, budget and your child's age — I'll find schools from Kiddy123's listings that truly fit. Or just tap a suggestion below 👇</Bot>
      <Chips at={0} items={['Montessori kindy in Cheras, RM1,000, needs bus', 'Chinese-medium kindergarten nearby', 'Special needs support nearby']} gone={1.95} />
      <User at={1.95}>{q}</User>
      <Typing from={2.15} to={2.85} />
      <Bot at={2.85}>Great news! 🎉 <B>3 schools in Cheras</B> pass your hard requirements (age 4 eligible ✅ within budget ✅ school bus 🚌). Ranked by Montessori &amp; Mandarin fit:<br />Sponsored schools are labelled.</Bot>
      <SchoolCard at={3.3} s={SCH.dejowitop} rank={1} sponsored why="Montessori-blended curriculum, trilingual daily environment (incl. Mandarin), and a school bus — fits your budget with room to spare." />
      <SchoolCard at={3.8} s={SCH.littleoak} rank={2} why="Pure Montessori method with Mandarin immersion classes on weekdays; bus available on your route." />
    </Panel>
  );
};
export const CFind: React.FC = () => (
  <AbsoluteFill>
    <Plate src="town2.png" dur={5.6} s0={1.35} s1={1.42} blur={6} origin="72% 62%" />
    <Shade side="left" to={0.82} />
    <div style={{position: 'absolute', left: 110, top: 330}}><THead lines={[['Describe', 'it.'], ['Get', 'a', {hi: 'shortlist.'}]]} size={104} /></div>
    <div style={{position: 'absolute', left: 116, top: 590}}><Sub at={0.9}>Real Kiddy123 schools, ranked by fit.</Sub></div>
    <In at={0} from={60} style={{left: 1150, top: 100, filter: FLOAT}}><Scale k={1.72} w={384} h={560}><FindPanel /></Scale></In>
  </AbsoluteFill>
);

/* ================= MATCH 2 · enquiry hand-off ================= */
export const EnquireDialog: React.FC = () => {
  const {t} = useT();
  const consent = t > 1.95; const press = Math.max(0, 1 - Math.abs(t - 2.35) / 0.12);
  return (
          <div style={{background: '#fff', borderRadius: 16, padding: 22, width: 400, fontFamily: NUN, color: P.fg}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4}}><div style={{fontFamily: JAK, fontWeight: 800, fontSize: 17, flex: 1}}>Send Enquiry</div><span style={{color: P.muted}}><Ic n="x" s={18} /></span></div>
            <div style={{fontSize: 13, color: P.muted, marginBottom: 14}}>To <b style={{color: P.fg}}>De JowiTop Preschool</b> — pre-filled from your conversation.</div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
              <Field label="Your name*" value={typed('Mei Ling Tan', t, 0.35, 0.95)} ph="e.g. Sarah Tan" />
              <Field label={<>Child's age <span style={{color: P.tealDark, fontWeight: 600}}>(from chat)</span></>} value="4 years old" tint />
              <Field label="Contact number*" value={typed('012-345 6789', t, 1.05, 1.7)} ph="e.g. 012-345 6789" />
              <div style={{display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12, color: P.muted}}>
                <span style={{width: 15, height: 15, borderRadius: 3, marginTop: 2, flexShrink: 0, border: `1.5px solid ${consent ? P.primary : '#A8A29E'}`, background: consent ? P.primary : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'}}>{consent && <Ic n="check" s={11} w={3} />}</span>
                <span>I consent to sharing my details with this school for enrolment purposes (PDPA 2010).</span></div>
              <Btn press={press} style={{width: '100%', opacity: consent ? 1 : 0.5}}>Submit Enquiry</Btn>
            </div>
          </div>
  );
};
export const DoneBubble: React.FC = () => <div style={{width: 384, padding: 8}}><Bot at={2.95}>Done! 🎉 Your enquiry has been sent to <B>De JowiTop Preschool</B> — they'll contact you directly. I've included your child's age and preferences so you won't repeat yourself.</Bot></div>;
export const CEnquire: React.FC = () => {
  const {t, sp, io} = useT();
  const close = io(2.45, 2.75); const toast = sp(2.7, {damping: 14, stiffness: 180});
  return (
    <AbsoluteFill>
      <Plate src="town2.png" dur={4.4} s0={1.22} s1={1.28} blur={8} origin="45% 70%" />
      <AbsoluteFill style={{background: 'rgba(28,25,23,.5)'}} />
      <Shade side="left" to={0.7} />
      <div style={{position: 'absolute', left: 110, top: 330}}><THead lines={[['Straight', 'to', 'an'], [{hi: 'enquiry.'}]]} size={110} /></div>
      <div style={{position: 'absolute', left: 116, top: 590}}><Sub at={0.8}>Pre-filled from the chat. PDPA consent first.</Sub></div>
      <In at={0} from={60} style={{left: 1060, top: 150, opacity: 1 - close, filter: FLOAT}}>
        <Scale k={1.9} w={400} h={410}><EnquireDialog /></Scale>
      </In>
      <div style={{position: 'absolute', left: 1460, top: 880, transform: `translate(-50%,${(1 - toast) * 40}px) scale(1.7)`, opacity: clamp01(toast * 2)}}><Toast>Enquiry sent to De JowiTop Preschool</Toast></div>
      {t > 2.9 && <In at={2.95} style={{left: 1110, top: 420, filter: FLOAT}}><Scale k={1.7} w={384} h={150}><DoneBubble /></Scale></In>}
    </AbsoluteFill>
  );
};

/* ================= MATCH 3 · compare page (prototype ComparePage) ================= */
const useCompare = () => {
  const {t, io} = useT();
  const ids = ['dejowitop', 'littleoak', 'appleking'] as const;
  const v1 = t > 2.0, v2 = t > 2.5, v3 = t > 3.0;
  const hl = (on: boolean): React.CSSProperties => (on ? {background: P.orangeTint, boxShadow: `inset 0 0 0 2px ${P.primary}`, borderRadius: 6} : {});
  const ok = <span style={{color: P.success, fontWeight: 800}}>✓ Yes</span>;
  const rows: [string, (i: number) => React.ReactNode][] = [
    ['Admission & Fees', (i) => <span style={{fontFamily: MONOF, fontWeight: 600, padding: '2px 4px', ...hl(v1 && i === 2)}}>{SCH[ids[i]].fees.replace('/mo', '/mo')}</span>],
    ['Student Age Group', (i) => <span style={{fontFamily: MONOF}}>{SCH[ids[i]].ages} years old</span>],
    ['Class Size', (i) => <span style={{padding: '2px 4px', ...hl(v3 && i === 1)}}>{SCH[ids[i]].cls}</span>],
    ['Medium', (i) => <span style={{padding: '2px 4px', ...hl(v2 && i === 0)}}>{SCH[ids[i]].medium}</span>],
    ['Transport', () => ok],
    ['Meals', (i) => (i === 1 ? <span style={{color: P.subtle}}>—</span> : ok)],
  ];
  return {t, io, ids, v1, v2, v3, rows};
};
export const CompareTable: React.FC = () => {
  const {ids, rows} = useCompare();
  return (
          <div style={{width: 860, background: '#fff', border: `1px solid ${P.border}`, borderRadius: 16, boxShadow: P.shMd, overflow: 'hidden', fontFamily: NUN, color: P.fg, fontSize: 13}}>
            <div style={{display: 'grid', gridTemplateColumns: '140px repeat(3,1fr)'}}>
              <div />{ids.map((id) => <div key={id} style={{padding: '14px 14px 10px'}}><Img src={staticFile(`schools/${SCH[id].img}.webp`)} style={{width: '100%', height: 100, objectFit: 'cover', borderRadius: 10, display: 'block'}} />
                <div style={{fontFamily: JAK, fontWeight: 700, fontSize: 14, lineHeight: 1.3, marginTop: 8}}>{SCH[id].name}</div>
                <div style={{fontSize: 11.5, color: P.muted, display: 'flex', alignItems: 'center', gap: 3, marginTop: 2}}><Ic n="pin" s={11} />{SCH[id].area}</div></div>)}
            </div>
            {rows.map(([l, f], ri) => <div key={l} style={{display: 'grid', gridTemplateColumns: '140px repeat(3,1fr)', borderTop: `1px solid ${P.border}`, background: ri % 2 ? '#FCFBFA' : '#fff'}}>
              <div style={{padding: '9px 10px', color: P.muted, fontWeight: 700}}>{l}</div>{[0, 1, 2].map((i) => <div key={i} style={{padding: '9px 10px'}}>{f(i)}</div>)}</div>)}
          </div>
  );
};
export const CompareChat: React.FC<{h?: number; sc?: number}> = ({h = 545, sc = 60}) => {
  const {t, io, v1, v2, v3} = useCompare();
  return (
          <Panel lang="en" h={h} ctx={<>Comparing 3 schools — ask me which fits best</>} scroll={io(1.1, 1.6, 0, sc)}>
            <Bot at={0}>I can see you're comparing <B>De JowiTop</B>, <B>Little Oak</B> and <B>Apple King</B> ⚖️ Ask me anything about them — I'll answer from their listing data and help you pick the best fit!</Bot>
            <Chips at={0} items={['Which fits a RM900 budget?', 'Best for Mandarin?', 'Just tell me your pick']} hot={t > 0.7 ? 2 : -1} gone={1.05} />
            <User at={1.05}>Just tell me your pick</User>
            <Typing from={1.25} to={1.85} />
            <Bot at={1.85}>Honest take, using only the listing data 🤝:<br />
              <span style={{opacity: v1 ? 1 : 0.15}}>• <B>Tightest budget</B> → <B>Apple King</B> (<Code>RM380–650</Code>, bus, meals, Saturday hours) 💰</span><br />
              <span style={{opacity: v2 ? 1 : 0.15}}>• <B>Mandarin + trilingual</B> → <B>De JowiTop</B> (daily Mandarin, Montessori-blend) 🀄</span><br />
              <span style={{opacity: v3 ? 1 : 0.15}}>• <B>Smallest classes</B> → <B>Little Oak</B> (8–10 per class, pure Montessori) 🌱</span></Bot>
          </Panel>
  );
};
export const CCompare: React.FC = () => {
  const {io} = useT();
  return (
    <AbsoluteFill style={{background: 'radial-gradient(600px 400px at 15% 10%, rgba(245,130,31,.08), transparent 70%), radial-gradient(700px 500px at 90% 85%, rgba(18,149,163,.10), transparent 70%), #F7F7F5'}}>
      <Plate src="top.png" dur={4.6} s0={1.1} s1={1.16} blur={14} dim={0} />
      <AbsoluteFill style={{background: 'rgba(247,247,245,.88)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', opacity: io(0, 0.4)}}>
        <div style={{fontFamily: MONOF, fontSize: 18, textTransform: 'uppercase', letterSpacing: '.14em', color: P.primaryHover, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8}}><Ic n="scale" s={18} />COMPARE SCHOOLS</div>
        <div style={{fontFamily: JAK, fontWeight: 800, fontSize: 60, lineHeight: 1.15, color: P.fg, marginTop: 12}}>Side by side, <span style={{color: P.primary}}>fact by fact</span></div>
      </div>
      <In at={0.15} from={50} style={{left: 90, top: 250}}>
        <Scale k={1.32} w={860} h={560}>
          <CompareTable />
        </Scale>
      </In>
      <In at={0.3} from={50} style={{left: 1290, top: 250, filter: FLOAT}}>
        <Scale k={1.42} w={384} h={545}>
          <CompareChat />
        </Scale>
      </In>
    </AbsoluteFill>
  );
};

/* ================= ANSWER · listing context (EN → 中文 → never a guess) ================= */
export const GREET: Record<Lang, React.ReactNode> = {
  en: <>Hi! 👋 I can see you're looking at <B>Apple King Main Centre (Tadika Epal Besar)</B> 🏫 Ask me anything about this school — fees, hours, transport, contact — or ask for similar options nearby!</>,
  ms: null, zh: <>您好！👋 您正在浏览 <B>Apple King Main Centre (Tadika Epal Besar)</B> 🏫 关于这所学校的任何问题都可以问我——学费、时间、校车、联系方式！</>,
};
const ListingStage: React.FC<{dur: number; head: React.ReactNode; sub: React.ReactNode; children: React.ReactNode; s0?: number}> = ({dur, head, sub, children, s0 = 1.04}) => (
  <AbsoluteFill>
    <Plate src="school.png" dur={dur} s0={s0} s1={s0 + 0.06} origin="72% 50%" />
    <Shade side="left" to={0.82} />
    <div style={{position: 'absolute', left: 110, top: 300}}>{head}</div>
    <div style={{position: 'absolute', left: 116, top: 600}}>{sub}</div>
    {children}
  </AbsoluteFill>
);
export const ContextPanel: React.FC = () => {
  const {t, io} = useT();
  return (
          <Panel lang="en" h={560} ctx={<>You're viewing Apple King Main Centre (Tadika Epal Besar)</>} scroll={io(1.6, 2.2, 0, 150) + io(2.9, 3.4, 0, 120)} input={<InputBar ph="Ask about this school…" />}>
            <Bot at={0}>{GREET.en}</Bot>
            <Chips at={0} items={['What are the fees? Is there a bus?', 'Ages & opening hours?', 'Do they have CCTV?', 'Similar schools nearby']} hot={t > 0.75 ? 0 : -1} />
            <User at={1.2}>What are the fees here, and is there a school bus?</User>
            <Typing from={1.45} to={2.15} />
            <Bot at={2.15}>For <B>Apple King Main Centre (Tadika Epal Besar)</B>:<br />💰 <Code hi={t > 2.8}>Fees: RM380–RM650/month</Code> (subject to change)<br />🚌 <B>School bus available</B> — contact the school for routes &amp; pricing!</Bot>
          </Panel>
  );
};
export const CContext: React.FC = () => {
  const {t, io} = useT();
  return (
    <ListingStage dur={4.6} head={<THead lines={[['It', 'knows', 'the'], [{hi: 'school'}, {hi: "you're"}, {hi: 'on.'}]]} size={96} />} sub={<Sub at={0.8}>Answers from that school's listing.</Sub>}>
      <In at={0} from={60} style={{left: 1150, top: 100, filter: FLOAT}}>
        <Scale k={1.72} w={384} h={560}>
          <ContextPanel />
        </Scale>
      </In>
      <In at={2.8} style={{left: 160, top: 760}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, background: '#fff', borderRadius: 18, padding: '14px 22px', boxShadow: '0 30px 60px -20px rgba(0,0,0,.6)', font: `700 24px ${INTER}`, color: TT.ink}}>
          <span style={{font: `700 15px ${MONO}`, letterSpacing: '.16em', color: TT.sunDeep}}>FROM THE LISTING</span>RM380–650 · school bus ✓</div>
      </In>
    </ListingStage>
  );
};
export const ChinesePanel: React.FC = () => {
  const {t} = useT();
  const lang: Lang = t > 0.45 ? 'zh' : 'en';
  const q = '这里学费多少？有校车吗？';
  return (
          <Panel lang={lang} h={560} ctx={<>{lang === 'zh' ? '您正在浏览' : "You're viewing"} Apple King Main Centre (Tadika Epal Besar)</>} input={<InputBar ph={lang === 'zh' ? '询问这所学校…' : 'Ask about this school…'} text={t > 0.8 && t < 1.55 ? typed(q, t, 0.8, 1.45) : ''} caret />}>
            {lang === 'en' ? <Bot at={0}>{GREET.en}</Bot> : <Bot at={0.45}>{GREET.zh}</Bot>}
            {lang === 'zh' && <Chips at={0.5} items={['这里学费多少？有校车吗？', '收几岁的孩子？几点开门？']} gone={1.55} />}
            <User at={1.55}>{q}</User>
            <Typing from={1.75} to={2.35} />
            <Bot at={2.35}><B>Apple King Main Centre (Tadika Epal Besar)</B>：<br />💰 <Code hi={t > 2.9}>学费：每月RM380–RM650</Code>（或有调整）<br />🚌 <B>提供校车</B>——路线和收费请联系学校！</Bot>
          </Panel>
  );
};
export const CChinese: React.FC = () => {
  const {t} = useT();
  const lang: Lang = t > 0.45 ? 'zh' : 'en';
  const q = '这里学费多少？有校车吗？';
  return (
    <ListingStage dur={4.0} s0={1.1} head={<THead lines={[['EN.', 'BM.'], [{hi: '中文.'}]]} size={120} />} sub={<Sub at={0.7}>Switch any time. The facts stay exact.</Sub>}>
      <In at={0} from={0} style={{left: 1150, top: 100, filter: FLOAT}}>
        <Scale k={1.72} w={384} h={560}>
          <ChinesePanel />
        </Scale>
      </In>
    </ListingStage>
  );
};
export const GuessPanel: React.FC = () => {
  const {t, io} = useT();
  const q = 'Do they have CCTV in classrooms?';
  return (
          <Panel lang="en" h={560} ctx={<>You're viewing Apple King Main Centre (Tadika Epal Besar)</>} scroll={io(1.5, 2.0, 0, 130)} input={<InputBar ph="Ask about this school…" text={t < 1.05 ? typed(q, t, 0.25, 0.95) : ''} caret />}>
            <Bot at={0}>{GREET.en}</Bot>
            <User at={1.05}>{q}</User>
            <Typing from={1.25} to={1.85} />
            <Bot at={1.85}>Honest answer 🙏 <B>that detail isn't in this school's listing</B>, and I never guess facts. The fastest way to find out is to ask them directly — want me to include the question in an enquiry? 📩</Bot>
            <Chips at={2.4} items={['Send an enquiry', 'Similar schools nearby']} hot={0} />
          </Panel>
  );
};
export const CGuess: React.FC = () => {
  const {t, io} = useT();
  const q = 'Do they have CCTV in classrooms?';
  return (
    <ListingStage dur={3.8} s0={1.16} head={<THead lines={[['Never', 'a'], [{hi: 'guess.'}]]} size={124} />} sub={<Sub at={0.7}>If the listing doesn't say, it says so.</Sub>}>
      <In at={0} from={0} style={{left: 1150, top: 100, filter: FLOAT}}>
        <Scale k={1.72} w={384} h={560}>
          <GuessPanel />
        </Scale>
      </In>
    </ListingStage>
  );
};

/* ================= INSIGHT · admin dashboard (prototype AdminDashboard) ================= */
const AdminStage: React.FC<{dur: number; head: React.ReactNode; sub: React.ReactNode; view: string; children: React.ReactNode; lift?: React.ReactNode}> = ({dur, head, sub, view, children, lift}) => (
  <AbsoluteFill>
    <Plate src="office.png" dur={dur} s0={1.08} s1={1.14} blur={6} dim={0.3} origin="30% 50%" />
    <Shade side="left" to={0.85} />
    <div style={{position: 'absolute', left: 100, top: 110}}>{head}</div>
    <div style={{position: 'absolute', left: 106, top: 322}}>{sub}</div>
    <In at={0} from={70} style={{left: 640, top: 360, filter: FLOAT}}><Scale k={1.06} w={1140} h={660}><AdminFrame view={view} h={620}>{children}</AdminFrame></Scale></In>
    {lift}
    <div style={{position: 'absolute', left: 106, top: 1010, font: `600 15px ${MONO}`, letterSpacing: '.18em', color: 'rgba(255,255,255,.6)'}}>ADMIN DASHBOARD · SAMPLE DATA</div>
  </AbsoluteFill>
);
const Lift: React.FC<{at: number; x: number; y: number; k: number; children: React.ReactNode}> = ({at, x, y, k, children}) => {
  const {sp} = useT(); const p = sp(at, {damping: 14, stiffness: 120});
  return <div style={{position: 'absolute', left: x, top: y, transform: `scale(${lerp(1, k, p)})`, transformOrigin: '50% 50%', opacity: clamp01(p * 3), filter: `drop-shadow(0 ${50 * p}px ${70 * p}px rgba(6,20,28,.6))`}}>{children}</div>;
};
const GAPS = [<><B>214 searches</B> for special-needs preschools in <B>Klang</B> — only 2 listings.</>, <><B>168 searches</B> mention <B>halal meals</B> in Shah Alam — 71% of listings missing this field.</>, <><B>92 BM conversations</B> asked about <B>infant care in Kajang</B> — zero matches under RM600.</>];
export const GapsCard: React.FC<{w: number}> = ({w}) => (
  <Card style={{width: w}}>
    <div style={{fontFamily: JAK, fontWeight: 700, fontSize: 14, marginBottom: 12}}>Content gaps <Badge style={{marginLeft: 4}}>growth signal</Badge></div>
    <div style={{display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5}}>{GAPS.map((g, i) => <div key={i} style={{display: 'flex', gap: 8, alignItems: 'flex-start'}}><span style={{marginTop: 2}}><Ic n="warn" s={13} c={P.warning} /></span><span>{g}</span></div>)}</div>
  </Card>
);
export const CIntent: React.FC = () => {
  const bars: [string, string, number, boolean][] = [['Cheras', '2,140', 88, true], ['Puchong', '1,556', 64, true], ['Subang', '1,270', 52, true], ['Ampang', '905', 38, false], ['Setapak', '688', 29, false]];
  return (
    <AdminStage dur={4.8} view="analytics" head={<THead lines={[['Every', 'question'], ['becomes', {hi: 'data.'}]]} size={88} />} sub={<Sub at={0.7}>What parents ask, area by area.</Sub>}
      lift={<Lift at={2.6} x={1290} y={600} k={1.32}><Scale k={1.1} w={446} h={190}><GapsCard w={446} /></Scale></Lift>}>
      <AdminHead title="Intent Analytics" sub="Last 30 days · All languages" action={<Btn sm kind="secondary">Export CSV</Btn>} />
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 18}}>
        <Kpi at={0.3} v="12,480" l="Conversations" d="+18%" /><Kpi at={0.38} v="1,304" l="Leads generated" d="+31%" /><Kpi at={0.46} v="87%" l={'"Helpful" rating'} d="+4 pts" /><Kpi at={0.54} v="96.2%" l="Fact accuracy" d="+1.1 pts" />
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 14}}>
        <Show at={0.6}><Card>
          <div style={{fontFamily: JAK, fontWeight: 700, fontSize: 14, marginBottom: 12}}>Top requested areas</div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12}}>{bars.map(([a, n, w, teal]) => <div key={a} style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <span style={{width: 66, color: P.muted}}>{a}</span><Grow w={w} at={0.9} h={18} color={teal ? P.teal : P.primary} track={P.tealTint} style={{flex: 1}} /><span style={{width: 44, textAlign: 'right', fontFamily: MONOF}}>{n}</span></div>)}</div>
        </Card></Show>
        <Show at={0.7}><GapsCard w={446} /></Show>
      </div>
      <Show at={0.85} style={{marginTop: 14}}><Card>
        <div style={{fontFamily: JAK, fontWeight: 700, fontSize: 14, marginBottom: 12}}>Recent high-intent searches (anonymised)</div>
        <Table head={['Parent request', 'Lang', 'Area', 'Budget', 'Matched', 'Outcome']} mono={[3]} rows={[
          ['Montessori kindy, school bus, Mandarin at home', 'EN', 'Cheras', '≤RM1,000', '3', <Badge tone="green">Lead sent</Badge>],
          ['Tadika berdekatan dengan makanan halal', 'BM', 'Shah Alam', '≤RM700', '5', <Badge tone="green">Lead sent</Badge>]]} />
      </Card></Show>
    </AdminStage>
  );
};
export const CLost: React.FC = () => {
  const funnel: [string, string, number, string][] = [['Appeared in matches', '312', 100, P.teal], ['Shown as a recommendation', '146', 47, P.teal], ['Card clicked', '58', 19, P.primary], ['Enquiry sent', '11', 8, P.primary]];
  const lost: [string, number, number, boolean][] = [['No fee listed on the profile', 89, 100, true], ["Fee above the parent's budget", 42, 47, false], ["Age range didn't cover the child", 21, 24, false], ['Missing facility — transport', 14, 16, true]];
  const row = (l: typeof lost[0], i: number, big?: boolean) => <div key={l[0]} style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, padding: big ? '8px 10px' : 0, background: big ? '#F0FDF4' : 'transparent', borderRadius: 8, boxShadow: big ? `inset 0 0 0 2px #86EFAC` : 'none'}}>
    <span style={{flex: 1}}>{l[0]}{l[3] && <Badge tone="green" style={{marginLeft: 6, fontSize: 9.5}}>fixable</Badge>}</span>
    <Grow w={l[2]} at={1.0 + i * 0.07} h={16} color={P.warning} track="#FEF3C7" style={{width: 84}} /><span style={{width: 26, textAlign: 'right', fontFamily: MONOF, fontWeight: 700}}>{l[1]}</span></div>;
  return (
    <AdminStage dur={4.4} view="schools" head={<THead lines={[['Why', 'a', 'school'], [{hi: 'lost'}, {hi: 'matches.'}]]} size={88} />} sub={<Sub at={0.7}>A sales call backed by demand.</Sub>}
      lift={<Lift at={2.4} x={1240} y={720} k={1.35}><Scale k={1.1} w={470} h={44}><div style={{width: 470, background: '#fff', borderRadius: 10, fontFamily: NUN, color: P.fg}}>{row(lost[0], 0, true)}</div></Scale></Lift>}>
      <AdminHead title="School Performance" sub="Wesley Preschool, Klang · Gold · Last 30 days" action={<Btn sm kind="secondary">Export CSV</Btn>} />
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 18}}>
        <Kpi at={0.3} icon="search" v="312" l="Appeared in matches" d="+22%" /><Kpi at={0.38} icon="star" v="146" l="Recommended" d="+9%" /><Kpi at={0.46} icon="users" v="58" l="Card clicks" d="+14%" /><Kpi at={0.54} icon="mail" v="11" l="Enquiries" d="+3" />
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 14}}>
        <Show at={0.6}><Card><div style={{fontFamily: JAK, fontWeight: 700, fontSize: 14, marginBottom: 12}}>Match funnel</div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12}}>{funnel.map(([l, v, w, c], i) => <div key={l}><div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 4}}><span style={{color: P.muted}}>{l}</span><span style={{fontFamily: MONOF, fontWeight: 700}}>{v}</span></div><Grow w={w} at={0.85 + i * 0.08} h={14} color={c} track={P.tealTint} /></div>)}</div></Card></Show>
        <Show at={0.7}><Card><div style={{fontFamily: JAK, fontWeight: 700, fontSize: 14, marginBottom: 4}}>Why this school lost matches <Badge tone="amber" style={{marginLeft: 4}}>sales hook</Badge></div>
          <div style={{fontSize: 11.5, color: P.muted, marginBottom: 12}}>Each bar is a parent who wanted this school's category and area, but didn't see it.</div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 9}}>{lost.map((l, i) => row(l, i))}</div></Card></Show>
      </div>
    </AdminStage>
  );
};
export const CSponsor: React.FC = () => {
  const {t} = useT();
  const inv: [string, number, number][] = [['Preschool · Klang', 3, 3], ['Preschool · Cheras', 2, 3], ['Enrichment · Puchong', 1, 3], ['Intl School · Subang', 0, 2]];
  const rules = ['A sponsored school only appears if it meets every requirement the parent gave.', 'Sponsored results always carry a visible Sponsored label.', 'Sponsorship never changes a factual answer, and never sways the comparison verdict.', 'If no sponsor qualifies, the slot is left empty — never filled with a worse match.'];
  return (
    <AdminStage dur={4.4} view="sponsorships" head={<THead lines={[['Sponsored.'], ['Always', {hi: 'labelled.'}]]} size={96} />} sub={<Sub at={0.7}>Paid placement that can't bend the answers.</Sub>}>
      <AdminHead title="Sponsorship Manager" sub="Bookable AI placement inventory · sold as the AI SEO package" action={<Btn sm>+ New placement</Btn>} />
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 18}}>
        <Kpi at={0.3} icon="mega" v="4" l="Active placements" d="+2" /><Kpi at={0.38} icon="calendar" v="6 / 11" l="Slots sold this quarter" /><Kpi at={0.46} icon="search" v="2,847" l="Sponsored appearances" d="+19%" /><Kpi at={0.54} icon="mail" v="34" l="Enquiries from sponsored" d="+11" />
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 14}}>
        <Show at={0.6}><Card><div style={{fontFamily: JAK, fontWeight: 700, fontSize: 14, marginBottom: 4}}>Inventory availability</div>
          <div style={{fontSize: 11.5, color: P.muted, marginBottom: 12}}>Slots are capped per category and area so placements stay scarce — and can't be oversold.</div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 11, fontSize: 12}}>{inv.map(([sc, sold, cap]) => { const full = sold >= cap; return <div key={sc}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 4}}><span style={{color: P.muted}}>{sc}</span><span style={{fontFamily: MONOF, fontWeight: 700, color: full ? P.danger : P.fg}}>{sold} / {cap}{full && ' · full'}</span></div>
            <div style={{display: 'flex', gap: 4}}>{Array.from({length: cap}, (_, i) => <div key={i} style={{flex: 1, height: 14, borderRadius: 4, background: i < sold ? (full ? P.danger : P.primary) : P.tealTint}} />)}</div></div>; })}</div></Card></Show>
        <Show at={0.7}><Card><div style={{fontFamily: JAK, fontWeight: 700, fontSize: 14, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 7}}><Ic n="shield" s={15} c={P.success} />Fairness rules — enforced automatically</div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5}}>{rules.map((r, i) => <div key={i} style={{display: 'flex', gap: 8, alignItems: 'flex-start', opacity: t > 1.1 + i * 0.35 ? 1 : 0.25}}><span style={{marginTop: 2}}><Ic n="check" s={14} c={P.success} w={2.5} /></span>{r}</div>)}</div></Card></Show>
      </div>
    </AdminStage>
  );
};

/* ================= RESULTS (chatbot numbers) ================= */
export const CResults: React.FC = () => {
  const {io} = useT();
  const stats: [number, string][] = [[15074, 'school listings searched'], [3, 'languages: EN · BM · 中文'], [4, 'modes: finder, listing, compare, admin'], [16, 'admin dashboard screens']];
  return (
    <AbsoluteFill>
      <Plate src="night.png" dur={4.8} s0={1.1} s1={1.0} />
      <AbsoluteFill style={{background: 'rgba(4,14,22,.62)'}} />
      <div style={{position: 'absolute', left: 110, top: 170}}><THead lines={[['The', {hi: 'results.'}]]} size={116} /></div>
      <div style={{position: 'absolute', left: 110, top: 460, display: 'grid', gridTemplateColumns: 'repeat(4,400px)', gap: 44}}>
        {stats.map(([v, l], i) => { const p = io(0.5 + i * 0.2, 1.7 + i * 0.2, 0, 1, Easing.out(Easing.cubic)); return (
          <div key={i} style={{borderTop: `4px solid ${TT.sun}`, paddingTop: 22, opacity: clamp01(p * 3)}}>
            <div style={{font: `800 100px/1 ${MANROPE}`, letterSpacing: '-0.05em', color: '#fff', fontVariantNumeric: 'tabular-nums'}}>{Math.round(v * p).toLocaleString('en-US')}</div>
            <div style={{font: `500 26px/1.3 ${INTER}`, color: 'rgba(255,255,255,.82)', marginTop: 10}}>{l}</div></div>); })}
      </div>
      <div style={{position: 'absolute', left: 110, top: 800}}><Sub at={1.8} size={30}>Every fee, age and phone number from Kiddy123's own listings.</Sub></div>
    </AbsoluteFill>
  );
};
