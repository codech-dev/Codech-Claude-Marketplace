"""Storyboard page for a Codech marketing film (Mode C), in the otso-expo-storyboard format: idea, script, chaptered
frames with On screen / Camera / Action / Motion / Transition / Sound, look & sound, production, review questions.
Edit the DATA below (never the generated index.html), run `python build.py`, publish index.html + frames/ as an Artifact.
Frames: frames/<frame>.jpg, 1920x1080 stills pulled from the Remotion render (draft 1 can use stills of single-scene renders).
Full worked example: examples/shingtik-marketing-film/storyboard-build.py."""
import pathlib
D = pathlib.Path(__file__).parent
G = lambda t: f'<em class="g">{t}</em>'

# ------------------------------------------------------------------ DATA
CLIENT = 'Acme Trading'
TITLE = f'{CLIENT} Showcase Storyboard'   # page/tab title
VERSION = 'Draft v1 · For review'
LENGTH = '~0:26'
HERO = ('AI that books', 'the orders.')                   # h1 line 1, gold line 2
HERO_FRAME = ('phone', 'Phone scene: a WhatsApp order becomes a booked sales order')
LEDE = f'A {LENGTH} showcase of what Codech builds for businesses, told through one real deployment: problem first, then the AI that solves it.'
FACTS = [(LENGTH, 'film + end card'), ('2 chapters', 'key frames below'), ('1 problem', 'set up before the solution'), ('No VO', 'music + sound effects')]
IDEAS = [  # (eyebrow, title, text): the story, the positioning, the accuracy note
 ('Story · Customer service', 'CS is overwhelmed', 'Every order is read, retyped and checked by hand. The AI agent takes the routine; the team keeps the exceptions.'),
 ('Positioning', 'Codech is the builder', f'"Your AI agent", built by Codech. {CLIENT} is credited as the case study ("Built for {CLIENT}"), not the product name.'),
 ('Accurate', 'Real flows, demo data', 'Flows mirror the live system and screens come from the delivered product; facts come from the project brief.'),
]
SCRIPT = [  # (time, headline, what it shows): headlines of 5 words or fewer
 ('0:00', f'Acme {G("Trading")}', 'Opener: Codech × client lockup, "A Codech case study", three pillars.'),
 ('0:03', f'Reading. Retyping. {G("Checking.")}', 'Problem in kinetic type: three strike-throughs on the beat.'),
 ('0:06', f'Meet your {G("AI agent.")}', 'The orb: the agent Codech built. The music drop lands here.'),
 ('0:08', f'Just {G("type")} it.', 'A WhatsApp order becomes a booked sales order.'),
 ('0:13', f'Matched. Priced. {G("Booked.")}', 'Colour-flip beat.'),
 ('0:15', f'Ask your {G("data.")}', 'The portal dashboard; KPI panels lift off, the chart grows.'),
 ('0:19', f"Let's build {G('yours.')}", 'Codech end card: logo reveal, contacts, WhatsApp QR.'),
]
NEW = set()  # frame ids to tag "New" in revision drafts
# chapters: (anchor, number, title, time, goal, [scenes]); scene = (frame, id, time, title, onscreen, sub, alt, camera, action, motion, transition, sound)
CH = [
 ('c1', 1, 'The problem', '0:00 – 0:06', 'Why the AI exists: the team is buried in manual work.', [
  ('problem', '1.1', '0:03 – 0:06', 'The daily grind', f'Reading. Retyping. {G("Checking.")}', 'Every single order. Every single day.',
   'Three words struck through with gold lines', 'Locked-off kinetic type.',
   'Each word snaps up and a gold line strikes through it on the beat; the tagline fades in.', 'Strike-through wipes on the beat.',
   'Swirl into the AI orb.', 'Three hard hits.')]),
 ('c2', 2, 'The solution', '0:06 – 0:19', 'The AI agent Codech built, doing the job in the real product.', [
  ('phone', '2.1', '0:08 – 0:13', 'Text order to booked order', f'Just {G("type")} it.', '', 'Phone with an order and a sales-order card bursting out', 'Phone at a ¾ turn, headline right.',
   'The order types and sends; the reply lands; the sales-order card bursts out of the phone and its rows tick in.', 'Spring burst, staggered rows.',
   'Green circle wipe.', 'Typing, send pop, notification, ticks.')]),
]
STRIP = [('c1', 'problem', '1 · Problem'), ('c2', 'phone', '2 · Solution')]
PALETTE = [('#FAF8F4', 'Canvas'), ('#0B0D12', 'Ink'), ('#D4B895', 'Champagne gold'), ('#F59443', 'AI orb orange'), ('#7A5F37', 'Gold text')]
REVIEW = [('Story', 'Does the problem → solution order land? Anything to add or cut?'), ('Length', f'Keep {LENGTH}, or add a 9:16 social cut?'), ('Music', 'Pick from the soundtrack shortlist.')]
DATE = '1 Oct 2026'
# ------------------------------------------------------------------ PAGE


def scene_html(sc):
    f, sid, t, title, on, sub, alt, cam, act, mot, tr, snd = sc
    subl = f'<span style="color:var(--mute);font-size:14px">{sub}</span>' if sub else ''
    tag = ' <span class="newtag">New</span>' if f in NEW else ''
    return f'''      <div class="scene"><figure><img src="frames/{f}.jpg" alt="{alt}"><span class="id">{sid} · {t}</span></figure>
        <div class="spec"><h3>{title}{tag}</h3>
          <div class="onscreen"><span class="eyebrow">On screen</span><b>{on}</b>{subl}</div>
          <dl><dt>Camera</dt><dd>{cam}</dd>
            <dt>Action</dt><dd>{act}</dd>
            <dt>Motion &amp; FX</dt><dd>{mot}</dd>
            <dt>Transition</dt><dd>{tr}</dd>
            <dt>Sound</dt><dd>{snd}</dd></dl></div></div>
'''


chapters = ''.join(f'''
    <div class="chapter" id="{a}">
      <div class="ch-head"><span class="chip">Chapter {n}</span><h3>{title}</h3><span class="ch-time">{time}</span></div>
      <p class="ch-goal">{goal}</p>
{''.join(scene_html(s) for s in scenes)}    </div>
''' for a, n, title, time, goal, scenes in CH)
nframes = sum(len(c[5]) for c in CH)
script_rows = ''.join(f'        <tr><td class="t">{t}</td><td class="l">{h}</td><td>{w}</td></tr>\n' for t, h, w in SCRIPT)
strip = ''.join(f'<a href="#{a}"><img src="frames/{f}.jpg" alt="">{l}</a>' for a, f, l in STRIP)
facts = ''.join(f'<div class="fact"><b>{b}</b><span>{s}</span></div>' for b, s in FACTS)
ideas = ''.join(f'<div class="idea"><span class="eyebrow">{e}</span><h3>{h}</h3><p>{p}</p></div>' for e, h, p in IDEAS)
pal = ''.join(f'<div><i style="background:{c}"></i><span>{n}<small>{c}</small></span></div>' for c, n in PALETTE)
review = ''.join(f'<li><b>{k}.</b> {v}</li>' for k, v in REVIEW)

body = f'''
<style>.newtag{{font:700 11px var(--body);letter-spacing:.08em;text-transform:uppercase;color:#fff;background:#E8803A;border-radius:99px;padding:3px 9px;vertical-align:middle;margin-left:8px}}</style>
<header class="top"><div class="wrap">
  <div class="brand"><i>C</i>Codech · Showcase film</div>
  <nav aria-label="Sections"><a href="#idea">The idea</a><a href="#script">Script</a><a href="#storyboard">Storyboard</a><a href="#look">Look &amp; sound</a><a href="#review">Review</a></nav>
  <span class="status">{VERSION}</span>
</div></header>
<main class="wrap">
  <section class="hero">
    <span class="eyebrow">Codech · Marketing film · Case study: {CLIENT}</span>
    <h1>{HERO[0]}<br>{G(HERO[1])}</h1>
    <p class="lede">{LEDE}</p>
    <div class="hero-frame"><img src="frames/{HERO_FRAME[0]}.jpg" alt="{HERO_FRAME[1]}"></div>
    <div class="facts">{facts}</div>
  </section>
  <section class="sec" id="idea">
    <div class="sec-head"><span class="eyebrow">01 · The idea</span><h2>Problem first, then the AI</h2></div>
    <div class="ideas">{ideas}</div>
  </section>
  <section class="sec" id="script">
    <div class="sec-head"><span class="eyebrow">02 · The script</span><h2>{len(SCRIPT)} beats, one line each</h2>
      <p class="lede">The on-screen headlines, in order.</p></div>
    <div class="tablewrap"><table>
      <thead><tr><th>Time</th><th>Headline</th><th>What it shows</th></tr></thead>
      <tbody>
{script_rows}      </tbody></table></div>
  </section>
  <section class="sec" id="storyboard">
    <div class="sec-head"><span class="eyebrow">03 · Storyboard</span><h2>{len(CH)} chapters, {nframes} key frames</h2>
      <p class="lede">Every frame is taken from the actual Remotion render, so it shows the film as it is now.</p></div>
    <div class="strip">{strip}</div>
{chapters}  </section>
  <section class="sec" id="look">
    <div class="sec-head"><span class="eyebrow">04 · Look &amp; sound</span><h2>Bright, crisp, rhythmic</h2>
      <p class="lede">The Codech light theme with champagne gold; kinetic type, exploded UI, match cuts and colour flips, scored to a royalty-free track with synced sound effects.</p></div>
    <div class="pal">{pal}</div>
  </section>
  <section class="sec" id="review">
    <div class="sec-head"><span class="eyebrow">05 · Review</span><h2>What we need from you</h2></div>
    <ol class="q">{review}</ol>
  </section>
</main>
<footer><div class="wrap">Codech showcase film · {CLIENT} case study · {VERSION.split(' ·')[0].lower()} · {DATE}</div></footer>
'''
head = (D / '_head.html').read_text(encoding='utf-8').replace('@TITLE', TITLE)  # --accent in _head.html = chapter chips + brand mark
(D / 'index.html').write_text(head + '\n' + body, encoding='utf-8')
print('built', nframes, 'frames,', len(SCRIPT), 'beats')
