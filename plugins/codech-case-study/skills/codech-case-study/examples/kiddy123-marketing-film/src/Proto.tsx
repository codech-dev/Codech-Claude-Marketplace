import React from 'react';
import {Img, staticFile} from 'remotion';
import {loadFont as loadJakarta} from '@remotion/google-fonts/PlusJakartaSans';
import {loadFont as loadNunito} from '@remotion/google-fonts/NunitoSans';
import {MONO, NOTO, clamp01, useT} from './lib';

/* Faithful rebuilds of the KiddyMatch AI prototype (kiddymatch-ai-prototype.html, approved by Kiddy123):
   same tokens, fonts, radii, sizes and copy. Components are laid out in the prototype's own CSS pixels;
   scenes scale them up for video with <Scale k>. User direction 13 Oct 2026: "use more of the prototype design". */
export const JAK = `${loadJakarta('normal', {weights: ['600', '700', '800'], subsets: ['latin']}).fontFamily}, ${NOTO}, sans-serif`;
export const NUN = `${loadNunito('normal', {weights: ['400', '600', '700', '800'], subsets: ['latin']}).fontFamily}, ${NOTO}, sans-serif`;
export const P = {
  brand: '#F5821F', primary: '#EA580C', primaryHover: '#C2410C', teal: '#1295A3', tealDark: '#0E7490', bg: '#F7F7F5', surface: '#FFFFFF', border: '#E7E5E4',
  orangeTint: '#FFF4EA', orangeSoft: '#FFE8D3', tealTint: '#E6F7F9', tealSoft: '#CFF0F4', fg: '#1C1917', muted: '#57534E', subtle: '#A8A29E',
  success: '#16A34A', warning: '#D97706', danger: '#DC2626', grad: 'linear-gradient(135deg,#EA580C 0%,#F5821F 100%)',
  shSm: '0 1px 2px rgba(28,25,23,.05)', shMd: '0 4px 12px -2px rgba(28,25,23,.08)', shXl: '0 24px 48px -12px rgba(28,25,23,.22)',
};
const MONOF = `${MONO}, ui-monospace, monospace`;

/* lucide-style icons (24 grid, 2px stroke) */
const PATHS: Record<string, string> = {
  send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>', x: '<path d="M18 6 6 18M6 6l12 12"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>', check: '<path d="M20 6 9 17l-5-5"/>',
  warn: '<path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3z"/><path d="M12 9v4M12 17h.01"/>',
  trend: '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>', scale: '<path d="m16 16 3-8 3 8c-.9.7-1.9 1-3 1s-2.1-.3-3-1zM2 16l3-8 3 8c-.9.7-1.9 1-3 1s-2.1-.3-3-1zM7 21h10M12 3v18M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>', grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
  chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>', bars: '<path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/>', school: '<path d="M14 22v-4a2 2 0 1 0-4 0v4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M18 5v17M6 5v17M18 5l-6-3-6 3"/>',
  mega: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>', mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/>', gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>', star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>', users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
};
export const Ic: React.FC<{n: string; s?: number; c?: string; w?: number}> = ({n, s = 16, c = 'currentColor', w = 2}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink: 0, display: 'block'}} dangerouslySetInnerHTML={{__html: PATHS[n]}} />
);
/** Lays out children at prototype CSS px and scales them by k from the top-left. */
export const Scale: React.FC<{k: number; w: number; h: number; children: React.ReactNode; style?: React.CSSProperties}> = ({k, w, h, children, style}) => (
  <div style={{width: w * k, height: h * k, position: 'relative', ...style}}><div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, transform: `scale(${k})`, transformOrigin: '0 0'}}>{children}</div></div>
);

/* ---------- data (prototype SCHOOLS, De JowiTop fields from the real listing) ---------- */
export const SCH = {
  dejowitop: {name: 'De JowiTop Preschool', area: 'Taman Cheras Perdana, Cheras', ages: '3–6', fees: 'RM800–1,200/mo', badges: ['Transport', 'Meals'], teal: ['EN·BM·中文', 'Montessori-blend'], img: 'dejowitop', phone: '019-609 6866', hours: 'Mon–Fri, 7:45am–6:00pm', cls: '10–12 per class', medium: 'English, Bahasa Malaysia & Chinese'},
  littleoak: {name: 'Little Oak Montessori', area: 'Cheras', ages: '2–6', fees: 'RM750–950/mo', badges: ['Transport'], teal: ['Mandarin immersion', 'Outdoor play'], img: 'littleoak', phone: '012-338 0121', hours: 'Mon–Fri, 8:00am–6:00pm', cls: '8–10 per class', medium: 'English & Chinese'},
  appleking: {name: 'Apple King Main Centre (Tadika Epal Besar)', area: 'Sungai Chua, Kajang', ages: '2–6', fees: 'RM380–650/mo', badges: ['Transport', 'Meals'], teal: ['Fun & Play approach', '1:12 ratio'], img: 'appleking', phone: '018-227 9570', hours: 'Mon–Fri 8:00am–5:30pm · Sat 8:00am–1:00pm', cls: '1:12 teacher-student ratio', medium: 'English (classes in EN, BM & Chinese)'},
};
type School = typeof SCH.dejowitop;

/* ---------- springs ---------- */
/** Prototype motion: opacity 0→1, y 12→0, scale .98→1 over .25 s (ease-out); here a spring from `at`. */
export const useIn = (at: number) => { const {sp} = useT(); const p = sp(at, {damping: 18, stiffness: 200}); return {p, style: {opacity: clamp01(p * 1.6), transform: `translateY(${(1 - p) * 12}px) scale(${0.98 + p * 0.02})`} as React.CSSProperties}; };
export const Show: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, children, style}) => {
  const {t} = useT(); const {style: s} = useIn(at);
  if (t < at) return null;
  return <div style={{...s, ...style}}>{children}</div>;
};

/* ---------- chat widget ---------- */
export type Lang = 'en' | 'ms' | 'zh';
const LANG_NAME: Record<Lang, string> = {en: 'EN', ms: 'BM', zh: '中文'};
export const ChatHeader: React.FC<{lang: Lang; close?: boolean}> = ({lang, close = true}) => (
  <div style={{background: P.grad, color: '#fff', padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0}}>
    <div style={{width: 34, height: 34, borderRadius: 999, background: '#fff', border: `2px solid ${P.teal}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}><Img src={staticFile('mascot.png')} style={{width: 24, height: 24, objectFit: 'contain'}} /></div>
    <div style={{lineHeight: 1.2}}><div style={{fontFamily: JAK, fontWeight: 700, fontSize: 14}}>KiddyMatch AI</div><div style={{fontFamily: NUN, fontSize: 11, opacity: 0.9}}>Kiddy123 school assistant</div></div>
    <div style={{display: 'inline-flex', background: 'rgba(255,255,255,.22)', borderRadius: 999, padding: 3, gap: 2, marginLeft: 'auto'}}>
      {(['en', 'ms', 'zh'] as Lang[]).map((l) => <span key={l} style={{borderRadius: 999, padding: '3px 10px', fontSize: 11.5, fontWeight: 700, fontFamily: JAK, whiteSpace: 'nowrap', background: l === lang ? '#fff' : 'transparent', color: l === lang ? P.primaryHover : '#fff'}}>{LANG_NAME[l]}</span>)}
    </div>
    {close && <span style={{marginLeft: 6, padding: 2, color: '#fff'}}><Ic n="x" s={16} w={2.2} /></span>}
  </div>
);
export const Context: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{background: P.tealTint, color: P.tealDark, fontFamily: NUN, fontSize: 12.5, fontWeight: 700, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: `1px solid ${P.tealSoft}`, flexShrink: 0}}><Ic n="pin" s={13} />{children}</div>
);
export const InputBar: React.FC<{text?: string; ph: string; caret?: boolean}> = ({text = '', ph, caret}) => {
  const {t} = useT();
  return (
    <div style={{display: 'flex', gap: 8, padding: 12, borderTop: `1px solid ${P.border}`, background: P.surface, flexShrink: 0}}>
      <div style={{flex: 1, border: `1px solid ${text ? P.teal : P.border}`, boxShadow: text ? `0 0 0 3px ${P.tealTint}` : 'none', borderRadius: 8, padding: '10px 12px', fontSize: 14, fontFamily: NUN, color: text ? P.fg : P.subtle, whiteSpace: 'nowrap', overflow: 'hidden', display: 'flex', justifyContent: text ? 'flex-end' : 'flex-start'}}>
        <span>{text || ph}{caret && text ? <i style={{display: 'inline-block', width: 2, height: 16, background: P.fg, verticalAlign: -3, marginLeft: 1, opacity: Math.round(t * 2.5) % 2}} /> : null}</span></div>
      <div style={{width: 40, height: 40, borderRadius: 10, background: P.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}><Ic n="send" s={17} /></div>
    </div>
  );
};
/** The prototype panel: 384 px wide, header, optional context strip, scrolling body, input bar. */
export const Panel: React.FC<{lang: Lang; ctx?: React.ReactNode; h: number; scroll?: number; input?: React.ReactNode; children: React.ReactNode; w?: number}> = ({lang, ctx, h, scroll = 0, input, children, w = 384}) => (
  <div style={{width: w, height: h, background: P.surface, borderRadius: 20, boxShadow: P.shXl, border: `1px solid ${P.border}`, overflow: 'hidden', display: 'flex', flexDirection: 'column', fontFamily: NUN, color: P.fg}}>
    <ChatHeader lang={lang} />
    {ctx && <Context>{ctx}</Context>}
    <div style={{flex: 1, background: '#FCFBFA', overflow: 'hidden', position: 'relative'}}>
      <div style={{padding: 16, display: 'flex', flexDirection: 'column', gap: 12, transform: `translateY(${-scroll}px)`}}>{children}</div>
    </div>
    {input}
  </div>
);
export const Bot: React.FC<{at: number; children: React.ReactNode}> = ({at, children}) => (
  <Show at={at} style={{alignSelf: 'flex-start', maxWidth: '88%'}}>
    <div style={{background: P.surface, border: `1px solid ${P.border}`, borderRadius: '16px 16px 16px 4px', padding: '10px 14px', fontSize: 14, lineHeight: 1.55, boxShadow: P.shSm, fontFamily: NUN, color: P.fg}}>{children}</div>
  </Show>
);
export const User: React.FC<{at: number; children: React.ReactNode}> = ({at, children}) => (
  <Show at={at} style={{alignSelf: 'flex-end', maxWidth: '88%'}}>
    <div style={{background: P.grad, color: '#fff', borderRadius: '16px 16px 4px 16px', padding: '10px 14px', fontSize: 14, lineHeight: 1.55, fontFamily: NUN}}>{children}</div>
  </Show>
);
export const Typing: React.FC<{from: number; to: number}> = ({from, to}) => {
  const {t} = useT();
  if (t < from || t >= to) return null;
  return <div style={{alignSelf: 'flex-start', background: P.surface, border: `1px solid ${P.border}`, borderRadius: '16px 16px 16px 4px', padding: '12px 14px', boxShadow: P.shSm, display: 'inline-flex', gap: 4}}>
    {[0, 1, 2].map((i) => { const ph = ((t - from) / 1.2 - i * 0.125) % 1; const up = ph < 0.6 ? Math.sin((ph / 0.6) * Math.PI) : 0; return <i key={i} style={{width: 6, height: 6, borderRadius: '50%', background: P.teal, display: 'block', opacity: 0.3 + up * 0.7, transform: `translateY(${-up * 3}px)`}} />; })}
  </div>;
};
export const Chip: React.FC<{children: React.ReactNode; hot?: boolean}> = ({children, hot}) => (
  <span style={{border: `1px solid ${hot ? P.primary : P.border}`, background: hot ? P.orangeTint : P.surface, color: hot ? P.primaryHover : P.fg, borderRadius: 999, padding: '7px 14px', fontSize: 13, fontWeight: 600, fontFamily: NUN, whiteSpace: 'nowrap'}}>{children}</span>
);
export const Chips: React.FC<{at: number; items: string[]; hot?: number; gone?: number}> = ({at, items, hot = -1, gone}) => {
  const {t} = useT();
  if (gone != null && t >= gone) return null;
  return <Show at={at} style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>{items.map((c, i) => <Chip key={c} hot={i === hot}>{c}</Chip>)}</Show>;
};
export const Badge: React.FC<{children: React.ReactNode; tone?: 'orange' | 'teal' | 'green' | 'amber' | 'red'; style?: React.CSSProperties}> = ({children, tone = 'orange', style}) => {
  const c = {orange: [P.orangeSoft, P.primaryHover], teal: [P.tealSoft, P.tealDark], green: ['#DCFCE7', P.success], amber: ['#FEF3C7', P.warning], red: ['#FEE2E2', P.danger]}[tone];
  return <span style={{display: 'inline-flex', alignItems: 'center', gap: 4, background: c[0], color: c[1], borderRadius: 999, padding: '2px 9px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', fontFamily: NUN, ...style}}>{children}</span>;
};
export const Btn: React.FC<{children: React.ReactNode; kind?: 'primary' | 'secondary' | 'teal'; sm?: boolean; press?: number; style?: React.CSSProperties}> = ({children, kind = 'primary', sm, press = 0, style}) => {
  const k = {primary: [P.primary, '#fff', 'none'], secondary: [P.surface, P.fg, `1px solid ${P.border}`], teal: [P.teal, '#fff', 'none']}[kind];
  return <span style={{border: k[2], background: k[0], color: k[1], borderRadius: sm ? 8 : 10, padding: sm ? '6px 12px' : '9px 16px', fontSize: sm ? 12.5 : 13.5, fontWeight: 700, fontFamily: JAK, display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'center', transform: `scale(${1 - press * 0.04})`, whiteSpace: 'nowrap', ...style}}>{children}</span>;
};
/** The prototype's SchoolCard (cover photo, rank, Sponsored, name, area · ages, fee, badges, why it fits, buttons). */
export const SchoolCard: React.FC<{s: School; rank?: number; sponsored?: boolean; why?: string; whyLabel?: string; at: number; hiFee?: boolean; added?: boolean; enquirePress?: number}> = ({s, rank, sponsored, why, whyLabel = 'Why it fits', at, hiFee, added, enquirePress = 0}) => (
  <Show at={at}>
    <div style={{background: P.surface, border: `1px solid ${P.border}`, borderRadius: 12, overflow: 'hidden', boxShadow: P.shSm}}>
      <div style={{position: 'relative'}}>
        <Img src={staticFile(`schools/${s.img}.webp`)} style={{width: '100%', height: 110, objectFit: 'cover', display: 'block'}} />
        {rank && <span style={{position: 'absolute', top: 8, left: 8, background: P.primary, color: '#fff', fontFamily: JAK, fontSize: 11, fontWeight: 800, borderRadius: 999, padding: '3px 10px', boxShadow: P.shMd}}>#{rank}</span>}
        {sponsored && <span style={{position: 'absolute', top: 8, right: 8, display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,.96)', color: P.fg, border: `1px solid ${P.border}`, fontFamily: JAK, fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', lineHeight: 1.4, borderRadius: 999, padding: '3px 9px', boxShadow: P.shMd}}><i style={{width: 5, height: 5, borderRadius: '50%', background: P.subtle, display: 'block'}} />Sponsored</span>}
      </div>
      <div style={{padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: 8}}>
        <div>
          <div style={{fontFamily: JAK, fontWeight: 700, fontSize: 14, lineHeight: 1.3}}>{s.name}</div>
          <div style={{fontSize: 11.5, color: P.muted}}>{s.area} · Ages {s.ages}</div>
          <span style={{fontFamily: MONOF, fontWeight: 600, fontSize: 13, borderRadius: 4, padding: '0 3px', marginLeft: -3, background: hiFee ? P.orangeTint : 'transparent', boxShadow: hiFee ? `0 0 0 1.5px ${P.primary}` : 'none'}}>{s.fees}</span>
        </div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 5}}>{s.badges.map((b) => <Badge key={b}>{b}</Badge>)}{s.teal.map((b) => <Badge key={b} tone="teal">{b}</Badge>)}</div>
        {why && <div style={{background: P.orangeTint, borderRadius: 8, padding: '8px 10px', fontSize: 12.5, lineHeight: 1.5}}><b style={{color: P.primaryHover, fontFamily: JAK, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em', display: 'block', marginBottom: 2}}>{whyLabel}</b>{why}</div>}
        <div style={{display: 'flex', gap: 8}}><Btn sm press={enquirePress}>Enquire</Btn><Btn sm kind={added ? 'teal' : 'secondary'}>{added ? '✓ Added' : '+ Compare'}</Btn></div>
      </div>
    </div>
  </Show>
);

/* ---------- enquiry dialog + toast (prototype EnquiryModal / Toast) ---------- */
export const Field: React.FC<{label: React.ReactNode; value: string; tint?: boolean; ph?: string}> = ({label, value, tint, ph}) => (
  <div><div style={{fontSize: 12, fontWeight: 700, marginBottom: 3}}>{label}</div>
    <div style={{border: `1px solid ${P.border}`, borderRadius: 8, padding: '10px 12px', fontSize: 14, background: tint ? P.orangeTint : P.surface, color: value ? P.fg : P.subtle, minHeight: 41}}>{value || ph}</div></div>
);
export const Toast: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 8, background: '#14532D', color: '#fff', borderRadius: 12, padding: '11px 18px', fontSize: 13.5, fontWeight: 600, fontFamily: NUN, boxShadow: P.shXl}}><Ic n="check" s={15} w={2.5} />{children}</div>
);

/* ---------- admin (prototype AdminDashboard inside FramedScreen) ---------- */
export const ADMIN_NAV: [string, string, string][] = [['overview', 'grid', 'Overview'], ['conversations', 'chat', 'Conversations'], ['analytics', 'bars', 'Intent Analytics'], ['schools', 'school', 'School Performance'], ['gaps', 'warn', 'Content Gaps'], ['sponsorships', 'mega', 'Sponsorships'], ['reports', 'mail', 'AI SEO Reports'], ['guardrails', 'shield', 'Guardrails']];
export const AdminFrame: React.FC<{view: string; w?: number; h?: number; children: React.ReactNode}> = ({view, w = 1140, h = 700, children}) => (
  <div style={{width: w, borderRadius: 14, overflow: 'hidden', border: `1px solid ${P.border}`, boxShadow: P.shXl, background: '#fff', fontFamily: NUN, color: P.fg}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', background: '#ECEAE8', borderBottom: `1px solid ${P.border}`}}>
      {['#FC5F57', '#FDBC2E', '#29C740'].map((c) => <span key={c} style={{width: 11, height: 11, borderRadius: '50%', background: c, display: 'inline-block'}} />)}
      <div style={{marginLeft: 10, flex: 1, maxWidth: 340, background: '#fff', borderRadius: 7, padding: '4px 12px', fontSize: 11.5, color: P.muted, fontFamily: MONOF, display: 'flex', alignItems: 'center', gap: 6}}><Ic n="shield" s={12} c={P.success} />admin.kiddymatch.ai/dashboard</div>
    </div>
    <div style={{display: 'flex', height: h, background: '#F7F7F5'}}>
      <div style={{width: 232, background: '#1C1917', color: '#D6D3D1', padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0}}>
        <div style={{color: '#fff', fontWeight: 800, fontSize: 16, padding: '0 10px 16px', fontFamily: JAK}}>KiddyMatch <span style={{color: P.brand}}>Admin</span></div>
        {ADMIN_NAV.map(([id, ic, l]) => <div key={id} style={{padding: '9px 12px', borderRadius: 8, fontSize: 13, fontWeight: view === id ? 700 : 600, display: 'flex', gap: 9, alignItems: 'center', background: view === id ? P.primary : 'transparent', color: view === id ? '#fff' : '#D6D3D1'}}><Ic n={ic} s={15} />{l}</div>)}
        <div style={{marginTop: 'auto', padding: '9px 12px', fontSize: 13, fontWeight: 600, display: 'flex', gap: 9, alignItems: 'center'}}><Ic n="gear" s={15} />Settings</div>
      </div>
      <div style={{flex: 1, padding: '26px 30px', minWidth: 0, overflow: 'hidden', position: 'relative'}}>{children}</div>
    </div>
  </div>
);
export const AdminHead: React.FC<{title: string; sub: string; action?: React.ReactNode}> = ({title, sub, action}) => (
  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18}}>
    <div><div style={{fontFamily: JAK, fontWeight: 800, fontSize: 22}}>{title}</div><div style={{fontSize: 12, color: P.muted}}>{sub}</div></div>{action}
  </div>
);
export const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{background: P.surface, border: `1px solid ${P.border}`, borderRadius: 12, padding: 16, boxShadow: P.shSm, fontFamily: NUN, color: P.fg, ...style}}>{children}</div>
);
export const Kpi: React.FC<{v: string; l: string; d?: string; icon?: string; at: number; warn?: boolean}> = ({v, l, d, icon, at, warn}) => (
  <Show at={at}><Card>
    <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between'}}>
      <div><div style={{fontFamily: JAK, fontSize: 25, fontWeight: 800, lineHeight: 1.1}}>{v}</div><div style={{fontSize: 12, color: P.muted, fontWeight: 600, marginTop: 2}}>{l}</div></div>
      {icon && <div style={{width: 32, height: 32, borderRadius: 9, background: P.tealTint, display: 'flex', alignItems: 'center', justifyContent: 'center', color: P.tealDark}}><Ic n={icon} s={16} /></div>}
    </div>
    {d && <div style={{display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11.5, fontWeight: 700, borderRadius: 999, padding: '2px 8px', marginTop: 8, background: warn ? '#FEF3C7' : '#DCFCE7', color: warn ? P.warning : P.success}}><Ic n="trend" s={11} w={2.5} />{d}</div>}
  </Card></Show>
);
/** A horizontal bar that grows from 0 to w% between a and a+0.7 s (prototype: 0.7 s, ease-out). */
export const Grow: React.FC<{w: number; at: number; color: string; h: number; track: string; r?: number; style?: React.CSSProperties}> = ({w, at, color, h, track, r = 4, style}) => {
  const {io} = useT(); const p = io(at, at + 0.7, 0, 1);
  return <div style={{background: track, borderRadius: r, height: h, overflow: 'hidden', ...style}}><div style={{width: `${w * p}%`, background: color, height: h, borderRadius: r}} /></div>;
};
export const Table: React.FC<{head: string[]; rows: React.ReactNode[][]; mono?: number[]; size?: number}> = ({head, rows, mono = [], size = 12.5}) => (
  <table style={{width: '100%', borderCollapse: 'collapse', fontSize: size, fontFamily: NUN}}>
    <thead><tr>{head.map((h) => <th key={h} style={{background: P.tealSoft, color: P.tealDark, fontFamily: JAK, fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '.06em', padding: '6px 8px', textAlign: 'left'}}>{h}</th>)}</tr></thead>
    <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} style={{padding: '6px 8px', borderBottom: `1px solid ${P.border}`, verticalAlign: 'top', background: i % 2 ? '#FCFBFA' : 'transparent', fontFamily: mono.includes(j) ? MONOF : undefined}}>{c}</td>)}</tr>)}</tbody>
  </table>
);
