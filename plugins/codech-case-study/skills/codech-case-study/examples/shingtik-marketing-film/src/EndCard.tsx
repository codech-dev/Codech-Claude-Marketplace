import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile} from 'remotion';
import {Backdrop, C, Headline, INTER, MONO, clamp01, lerp, useT} from './lib';

/* Codech end card on the film's cream + gold theme. Local time: t = 0 when it starts (circle-wipes in over the dark results). */
const LX = 960, LY = 400, LW = 520, GY = 470; // GY: centre of the guides, rings and logo during the reveal // logo centre and width (logo is 1076 x 765)
const LH = LW * 765 / 1076;
export const EndCard: React.FC = () => {
  const {t, sp, io, out} = useT();
  const wipe = io(0, 0.6, 0, 1, Easing.inOut(Easing.cubic));
  const guides = io(0.35, 1.2, 0, 1, Easing.out(Easing.cubic));
  const sweep = io(0.85, 1.85, 0, 360, Easing.inOut(Easing.cubic));
  const bloom = Math.max(0, 1 - Math.abs(t - 1.95) / 0.5);
  const shock = io(1.85, 2.7, 0, 1, Easing.out(Easing.cubic));
  const settle = sp(2.35, {damping: 16, stiffness: 110});
  const logoY = lerp(GY, GY - 40, settle), logoS = lerp(1.08, 0.86, settle) + bloom * 0.04;
  const guideFade = 1 - io(2.4, 3.0);
  return (
    <AbsoluteFill style={{clipPath: `circle(${wipe * 150}% at 50% 45%)`}}>
      <Backdrop glowX={50} glowY={40} dots />
      <div style={{position: 'absolute', left: LX - 520, top: LY - 380, width: 1040, height: 760, borderRadius: '50%', background: `rgba(212,184,149,${0.36 + bloom * 0.25})`, filter: 'blur(80px)'}} />
      {/* blueprint guides */}
      <svg width="1920" height="1080" style={{position: 'absolute', inset: 0, opacity: guideFade}}>
        <line x1={LX - 760 * guides} y1={GY} x2={LX + 760 * guides} y2={GY} stroke="#C9A46A" strokeWidth={1.5} opacity={0.6} />
        <line x1={LX} y1={GY - 380 * guides} x2={LX} y2={GY + 380 * guides} stroke="#C9A46A" strokeWidth={1.5} opacity={0.6} />
        {[150, 230, 310].map((r, k) => {
          const L = 2 * Math.PI * r;
          return <circle key={k} cx={LX} cy={GY} r={r} fill="none" stroke="#C9A46A" strokeWidth={k === 1 ? 2 : 1.2} opacity={0.55 - k * 0.12} strokeDasharray={L} strokeDashoffset={L * (1 - io(0.4 + k * 0.12, 1.3 + k * 0.12))} transform={`rotate(-90 ${LX} ${GY})`} />;
        })}
        {/* radar wedge */}
        {t > 0.85 && t < 1.95 && <path d={`M${LX} ${GY} L${LX + Math.sin(sweep * Math.PI / 180) * 330} ${GY - Math.cos(sweep * Math.PI / 180) * 330} A330 330 0 0 0 ${LX + Math.sin((sweep - 40) * Math.PI / 180) * 330} ${GY - Math.cos((sweep - 40) * Math.PI / 180) * 330} Z`} fill="url(#rg)" opacity={0.55} />}
        <defs><radialGradient id="rg"><stop offset="0" stopColor="#D4B895" stopOpacity="0" /><stop offset="1" stopColor="#D4B895" stopOpacity=".9" /></radialGradient></defs>
      </svg>
      {/* shockwave ring */}
      {shock > 0 && shock < 1 && <div style={{position: 'absolute', left: LX - 200 - shock * 500, top: GY - 200 - shock * 500, width: 400 + shock * 1000, height: 400 + shock * 1000, borderRadius: '50%', border: `${3 * (1 - shock) + 0.5}px solid rgba(201,164,106,${0.7 * (1 - shock)})`}} />}
      {/* logo revealed by the radar sweep */}
      <div style={{position: 'absolute', left: LX - LW / 2, top: logoY - LH / 2, width: LW, height: LH, transform: `scale(${logoS})`,
        WebkitMaskImage: `conic-gradient(from 0deg at 50% 50%, #000 ${sweep}deg, transparent ${sweep}deg)`, maskImage: `conic-gradient(from 0deg at 50% 50%, #000 ${sweep}deg, transparent ${sweep}deg)`,
        filter: bloom > 0.02 ? `drop-shadow(0 0 ${bloom * 40}px rgba(212,170,110,.9))` : undefined}}>
        <Img src={staticFile('codech-logo-crop.png')} style={{width: LW, height: LH}} />
      </div>
      {/* headline + contacts */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 690, display: 'flex', justifyContent: 'center'}}><Headline lines={[["Let's", 'build', {gold: 'yours.'}]]} start={2.55} size={84} /></div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 820, display: 'flex', justifyContent: 'center', gap: 18}}>
        {[['web', 'codech.co', '#0B0D12', '#fff'], ['✉', 'codech.co@gmail.com', '#EFE7DA', C.goldText], ['✆', '+6013-9473347', '#25D366', '#fff']].map((c, i) => {
          const p = sp(2.95 + i * 0.16, {damping: 12, stiffness: 170});
          return (
            <span key={i} style={{display: 'inline-flex', alignItems: 'center', gap: 12, padding: '12px 24px 12px 12px', borderRadius: 99, background: '#fff', font: `600 26px ${INTER}`, color: C.ink, transform: `translateY(${(1 - p) * 40}px)`, opacity: clamp01(p * 2), boxShadow: '0 16px 34px -16px rgba(60,45,20,.35),0 0 0 1px rgba(0,0,0,.05)'}}>
              <span style={{width: 40, height: 40, borderRadius: 20, background: c[2], color: c[3], display: 'grid', placeItems: 'center', font: `700 20px ${INTER}`}}>{c[0] === 'web' ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.6 2.6 2.6 15.4 0 18M12 3c-2.6 2.6-2.6 15.4 0 18" /></svg> : c[0]}</span>{c[1]}
            </span>
          );
        })}
      </div>
      {/* WhatsApp QR */}
      {(() => {
        const p = sp(3.5, {damping: 13, stiffness: 150});
        return (
          <div style={{position: 'absolute', right: 90, bottom: 70, display: 'flex', alignItems: 'center', gap: 18, transform: `translateY(${(1 - p) * 50}px)`, opacity: clamp01(p * 2)}}>
            <div style={{textAlign: 'right'}}><div style={{font: `500 13px ${MONO}`, letterSpacing: '.16em', color: C.mute}}>WHATSAPP</div><div style={{font: `700 22px ${INTER}`, color: C.ink, lineHeight: 1.25}}>Scan to chat<br />with us</div></div>
            <div style={{padding: 10, borderRadius: 18, background: '#fff', boxShadow: '0 20px 40px -18px rgba(60,45,20,.4),0 0 0 1px rgba(0,0,0,.06)'}}><Img src={staticFile('qr-wa.png')} style={{width: 130, height: 130, display: 'block'}} /></div>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};
