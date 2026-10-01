"""Builds index.html for the Codech × ShingTik showcase-film storyboard from the data below.
Edit the data, run `python build.py`, then republish index.html with the frames (frames/v*.jpg come from the Remotion render)."""
import pathlib
D = pathlib.Path(__file__).parent
G = lambda t: f'<em class="g">{t}</em>'
VERSION = 'Draft v8 · For review'
LENGTH = '~1:43'

SCRIPT = [
 ('0:00', f'ShingTik {G("Vegetarian")}', 'Project opener: Codech × ShingTik lockup, "A Codech case study", the three pillars.'),
 ('0:03', f'Orders never {G("stop.")}', 'A distributor\'s WhatsApp at 11:47 PM: orders flood in as text, photos and voice notes.'),
 ('0:08', f'One team. {G("Hundreds of chats.")}', 'Problem: the CS inbox overflows while one agent tries to keep up.'),
 ('0:10', f'Every order, {G("retyped by hand.")}', 'Problem: each order is retyped into SQL Account, picking from 1,800 look-alike products.'),
 ('0:13', f'Reading. Retyping. {G("Checking.")}', 'Problem summary in kinetic type: every single order, every single day.'),
 ('0:17', f'Meet your {G("AI agent.")}', 'The flood swirls into the AI orb: the AI ordering agent Codech built.'),
 ('0:22', f'Just {G("type")} it.', 'A Chinese text order becomes a matched cart and a Sales Order.'),
 ('0:28', f'Snap a {G("photo.")}', 'A product photo is scanned and matched to the catalogue.'),
 ('0:33', f'Or just {G("say")} it.', 'A voice note becomes a transcript, then a booked order.'),
 ('0:38', f'Matched. Priced. {G("Booked.")}', 'Colour-flip beat on WhatsApp green.'),
 ('0:40', f'Booked in {G("seconds.")}', 'Orders land in SQL Account at all hours.'),
 ('0:44', f'Plugs into your {G("systems.")}', 'The AI System wired to 8 systems: WhatsApp, respond.io, n8n, OpenAI, Groq, SQL Account, PostgreSQL, Google Sheets.'),
 ('0:49', f'Your team steps {G("in.")}', 'A CS agent replies and the AI pauses itself.'),
 ('0:53', f'AI handles the {G("routine.")}', 'Payoff of problem 1: routine orders go to AI, exceptions to your team.'),
 ('0:56', f'Reorder in {G("one tap.")}', 'The Order Page: usual items prefilled, confirm, back to WhatsApp.'),
 ('1:03', f'And inside the {G("office…")}', 'Ink colour flip into the second story.'),
 ('1:04', f'The answers are in your data. {G("Somewhere.")}', 'Problem: thousands of rows, questions nobody can answer quickly.'),
 ('1:07', f'Generic AI {G("doesn’t know you.")}', 'Problem: a generic chatbot cannot answer "How much 斋鹅 did E395 order?"'),
 ('1:10', f'So we built an AI that {G("knows your business.")}', 'Your customers, products, numbers, SOPs and roles flow into one AI.'),
 ('1:14', f'AI for your {G("whole team.")}', 'The real company AI portal dashboard; KPI cards and an alert lift off.'),
 ('1:18', f'Ask your {G("data.")}', 'AI Chat answers "Top 5 products" with a table and a chart.'),
 ('1:22', f'One source of {G("truth.")}', 'The Knowledge Base: SOPs the AI cites in its answers.'),
 ('1:26', f'Capture. Verify. {G("Deliver.")}', 'PO Intake, Payment Reconciliation, Delivery Runs, Alerts.'),
 ('1:30', f"~90% of ShingTik's sales orders, {G('booked by AI.')}", 'The proof: ~90% (Sep 2026), 3,840 orders, 14 weeks to live.'),
 ('1:35', f"Let's build {G('yours.')}", 'Codech end card on the cream + gold theme, with contacts and WhatsApp QR.'),
]
NEW = {'vA', 'vB', 'vC', 'vD', 'vE', 'vF', 'vG', 'v00'}

# chapters: (anchor, number, title, time, goal, [scenes]); scene = (frame, id, time, title, onscreen, sub, alt, camera, action, motion, transition, sound)
CH = [
 ('c0', 0, 'Opener', '0:00 – 0:03', 'Name the project and frame it as a Codech case study before anything else.', [
  ('v00', '0.1', '0:00 – 0:03', 'Project opener', f'ShingTik {G("Vegetarian")}', 'A CODECH CASE STUDY · AI ordering agent · System integration · Company AI portal',
   'Codech and ShingTik logos with a gold line, the title ShingTik Vegetarian and three pillars', 'Locked-off, centred, dot-grid canvas.',
   'A warm glow blooms. The Codech and ShingTik logos rise from masks with a spinning "×". A gold line draws beneath them, "A CODECH CASE STUDY" fades up, the title rises word by word, and three pillars spring in.',
   'Mask reveals, spring pops, underline wipe.', 'Zoom-through toward camera into "Orders".', 'Soft intro and a bell.')]),
 ('c1', 1, 'The problem: orders', '0:03 – 0:17', 'Show why the WhatsApp AI agent exists: customer service is overwhelmed and every order is retyped by hand.', [
  ('v11', '1.1', '0:03 – 0:08', 'A phone that never stops', f'Orders never {G("stop.")}', 'Kicker: Built for ShingTik Vegetarian · 11:47 PM',
   'Phone with an overflowing WhatsApp chat list and order bubbles bursting out', 'Kinetic cold open, then a low hero on the phone.',
   '"Orders" slams in at centre and the headline morphs to the corner. The phone flies in, chat rows cascade, the badge punches 12 → 47 → 99+, banners stack and bubbles burst out of the screen.',
   'Spring physics, zoom punches on each badge jump, motion blur on the bubbles.', 'Cut to the inbox.', 'Pops building on the beat.'),
  ('vA', '1.2', '0:08 – 0:10', 'Customer service overwhelmed', f'One team. {G("Hundreds of chats.")}', '',
   'respond.io inbox overflowing with chats and a swamped CS agent card', 'Front ¾ on the inbox.',
   'New chats stack in faster than one agent can answer; the "waiting" counter climbs and the agent card shakes as it keeps typing.',
   'Rows drop in every 0.16 s; red highlight on each new chat.', 'Zoom-blur out.', 'Notification pings stacking.'),
  ('vB', '1.3', '0:10 – 0:13', 'Retyped by hand', f'Every order, {G("retyped by hand.")}', 'Chips: 1,800 look-alike products · Voice notes: 1 in 4 messages',
   'WhatsApp order beside a SQL Account order form with four look-alike products and a wrong item flagged', 'Flat, slight turn on the form.',
   'The WhatsApp order flows into a SQL Account form. The item code types slowly, four near-identical 香菇头 products appear, the cursor hesitates and the wrong one flashes red.',
   'Typewriter, hover highlight, red flash.', 'Slide out left.', 'Keyboard clicks, an error blip.'),
  ('vC', '1.4', '0:13 – 0:17', 'The daily grind', f'Reading. Retyping. {G("Checking.")}', 'Every single order. Every single day.',
   'Three words struck through with gold lines', 'Locked-off kinetic type.',
   'Each word snaps up and is struck through by a gold line; the tagline fades in. Then cut back to the order flood.',
   'Strike-through wipes on the beat.', 'Back to the flood, which swirls into the AI orb.', 'Three hard hits.')]),
 ('c2', 2, 'Meet', '0:17 – 0:22', 'Introduce the solution Codech built, the AI ordering agent, as a capable team member.', [
  ('v21', '2.1', '0:17 – 0:22', 'Inputs → agent → skills', f'Meet your {G("AI agent.")}', 'Card: AI Ordering Agent · On WhatsApp · built by Codech',
   'AI Ordering Agent card with an orange glass orb, inputs on the left and skill callouts on the right', 'Front-on with a gentle 10° turn.',
   'The orb shrinks into the card avatar and the card grows out of it. The title types on, 3,840 counts up, inputs fly in on curves, links draw with pulses and four skills spring in.',
   'Circle reveal, typewriter, count-up, bezier pulses.', 'A cursor clicks the card and the camera zooms through the orb.', 'Beat drops; a tick per skill.')]),
 ('c3', 3, 'Order on WhatsApp', '0:22 – 0:40', 'Three ways customers already order, each booked automatically.', [
  ('v31', '3.1', '0:22 – 0:28', 'Text order to cart', f'Just {G("type")} it.', '', 'Phone with a Chinese order and a cart card bursting out of it', 'Phone at a ¾ turn, headline right.',
   'The order types into the input and sends; the reply lands. The cart card bursts out of the phone, rows tick in with checks, language chips cycle and the SO stamp spins in.', 'Spring burst, staggered rows, stamp bounce.', 'Whip pan left.', 'Typing, send whoosh, confirm chime.'),
  ('v32', '3.2', '0:28 – 0:33', 'Photo to product match', f'Snap a {G("photo.")}', '', 'Overhead phone, a lifted product photo being scanned and a 98% match card', 'Overhead flat lay.',
   'Shutter flash. The photo lifts off the phone, scan brackets close in, the scan line sweeps while candidates shuffle, and the match lands with its ring counting to 98%.', 'Flash, lift, scan sweep, ring fill.', 'The scan line stretches into a gold line.', 'Shutter, scan shimmer, match tick.'),
  ('v33', '3.3', '0:33 – 0:38', 'Voice note to order', f'Or just {G("say")} it.', '', 'Side-profile phone with a giant gold waveform and a transcript card', 'Side profile.',
   'The gold line grows into a live waveform; the transcript types out character by character and the SO pill appears.', 'Waveform bars dance; gold fills as playback passes.', 'Green circle wipe.', 'Filtered voice texture.'),
  ('v34', '3.4', '0:38 – 0:40', 'Colour flip', f'Matched. Priced. {G("Booked.")}', '', 'Three words slamming in on a deep green screen', 'Full-screen kinetic type.',
   'A WhatsApp-green circle wipe; the three words slam in on the beat, "Booked." in gold.', 'Scale-down slams with blur.', 'Circle wipe out.', 'Three hits.')]),
 ('c4', 4, 'Into the system', '0:40 – 0:56', 'The payoff and Codech\'s craft: orders land in the accounting system, everything is connected, people stay in control.', [
  ('v41', '4.1', '0:40 – 0:44', 'Straight into SQL Account', f'Booked in {G("seconds.")}', '', 'SQL Account ledger with orders arriving and a live counter', 'Tilted ledger.',
   'The ledger rises; new orders arrive at the top and push the list down; the counter ticks and the pipeline pills light in sequence.', 'Row drops, gold flash per row.', 'The ledger shrinks into the hub.', 'A tick per row.'),
  ('v43', '4.2', '0:44 – 0:49', 'System integration', f'Plugs into your {G("systems.")}', '', 'AI System hub with eight logo tiles and labelled links', 'Front-on, slight turn.',
   'Tiles fly in from every edge, links draw with labels and pulses, orbit rings rotate.', 'Spring fly-ins, path drawing, looping pulses.', 'Camera dives into the respond.io tile.', 'A rising tone per connection.'),
  ('v42', '4.3', '0:49 – 0:53', 'Human takeover', f'Your team steps {G("in.")}', '', 'Inbox with a CS reply, escalation card and AI paused toggle', 'Front ¾.',
   'The inbox zooms out of the dive; a complaint arrives, the escalation card pops, the toggle flips from "AI handling" to "AI paused" and Mei replies.', 'Pops and a toggle slide.', 'Whip pan.', 'Toggle click.'),
  ('vD', '4.4', '0:53 – 0:56', 'Routine vs exceptions', f'AI handles the {G("routine.")}', 'Your team handles the exceptions.', 'A bar split into routine orders for AI and exceptions for the team', 'Locked-off.',
   'A bar fills: most of it becomes "Routine orders → AI agent · 24/7", the rest "Team". The second line lands beneath it.', 'Bar wipe, kinetic type.', 'Whip pan left.', 'A rising swell.')]),
 ('c5', 5, 'Order Page', '0:56 – 1:03', 'The fastest way to reorder: a personal page with usual items already filled in.', [
  ('v51', '5.1', '0:56 – 1:03', 'Link, tap, back to WhatsApp', f'Reorder in {G("one tap.")}', '', 'Phone showing the Aisles order page with prefilled quantities and a +1 burst', 'Phone ¾, headline right.',
   'The link card is tapped; the phone flips into the order page. Steppers tick with +1 and +4 bursts, the rail slides to 素肉, confirm is pressed and the phone flips back to WhatsApp with SO-02481.', 'Card flip, stepper bumps, bursts.', 'Ink circle wipe.', 'Stepper ticks, confirm chime.')]),
 ('c6', 6, 'The problem: data', '1:03 – 1:14', 'Show why the AI portal exists: the answers are locked in business data, and generic AI does not know the business.', [
  ('v52', '6.1', '1:03 – 1:04', 'Into the office', f'And inside the {G("office…")}', '', 'Ink screen with kinetic type', 'Full-screen kinetic type.',
   'An ink circle wipe; the line rises.', 'Mask reveals.', 'Hold on dark into the data problem.', 'Low hit.'),
  ('vE', '6.2', '1:04 – 1:07', 'Data nobody can see', f'The answers are in your data. {G("Somewhere.")}', '', 'Endless ledger rows scrolling on dark with unanswered questions', 'Tilted rows on dark.',
   'Thousands of rows scroll past; four questions float up unanswered: who stopped ordering, who is overdue, what sold most, how much 斋鹅 E395 bought.', 'Endless scroll, floating bubbles.', 'Cross-fade.', 'Data ticking.'),
  ('vF', '6.3', '1:07 – 1:10', 'Generic AI fails', f'Generic AI {G("doesn’t know you.")}', '', 'A generic chatbot replying that it has no access to company data', 'Front-on.',
   'The E395 question is typed into a generic chatbot, which replies "Sorry, I don\'t have access to your company\'s data." and greys out.', 'Typewriter, desaturate.', 'Orange orb burst.', 'A flat buzz.'),
  ('vG', '6.4', '1:10 – 1:14', 'An AI that knows your business', f'So we built an AI that {G("knows your business.")}', '', 'Orange orb with your customers, products, numbers, SOPs and team flowing in', 'Front-on.',
   'An orange orb bursts the scene back to light. Your customers, products, numbers, SOPs and team roles connect into it.', 'Burst reveal, links drawing in.', 'Zoom through the orb into the portal.', 'Swell.')]),
 ('c7', 7, 'Company AI portal', '1:14 – 1:30', 'The same AI working inside the office, on the real portal prototype screens.', [
  ('v61', '7.1', '1:14 – 1:18', 'Dashboard', f'AI for your {G("whole team.")}', '', 'Portal dashboard with KPI cards lifting off the screen', '3D window.',
   'The dashboard flies in; the four KPI cards lift toward camera, then the E395 alert lifts with a red glow.', 'Exploded UI lifts.', 'Slide left.', 'Swooshes.'),
  ('v62', '7.2', '1:18 – 1:22', 'AI Chat', f'Ask your {G("data.")}', '', 'AI Chat answer table rows lifting and the chart rising', 'Slight turn.',
   'The question types itself; answer rows lift with a gold highlight; the chart lifts out with bars revealed bottom-up.', 'Row lifts, bottom-up reveal.', 'Slide.', 'A tick per row.'),
  ('v63', '7.3', '1:22 – 1:26', 'Knowledge Base', f'One source of {G("truth.")}', '', 'Tilted KB window with the SOP and key points lifting', 'Tilted iso.',
   'The SOP entry, title, key points and "86% cited" lift off; "Cited 34× in AI answers" pops.', 'Exploded UI lifts.', 'Pull back.', 'Page swish.'),
  ('v64', '7.4', '1:26 – 1:30', 'Every module', f'Capture. Verify. {G("Deliver.")}', '', 'Four module windows in a grid', 'Flat.',
   'Four module windows fan out from a stack into a grid, then converge into a single point.', 'Fan, spread, converge.', 'Dark circle wipe.', 'Accent hits.')]),
 ('c8', 8, 'Results', '1:30 – 1:35', 'The proof from the ShingTik deployment.', [
  ('v71', '8.1', '1:30 – 1:35', '~90% of sales orders', f"~90% of ShingTik's sales orders, {G('booked by AI.')}", 'Kicker: ShingTik Vegetarian · Sep 2026', 'Dark stage with gold ~90% and glass stat cards', 'Dark stage, low angle.',
   'The counter rolls to ~90% in brushed gold; glass cards rise: 3,840 orders · 14 weeks · 3 languages.', 'Count-up, drifting bokeh.', 'Crossfade to the end card.', 'Counter ticks, final hit.')]),
 ('c9', 9, 'End card', '1:35 – 1:43', "Codech closes the pitch, on the film's own cream + gold theme.", [
  ('v81', '9.1', '1:35 – 1:43', 'Codech logo reveal', f"Let's build {G('yours.')}", 'codech.co · codech.co@gmail.com · +6013-9473347 · WhatsApp QR', 'Codech end card on cream with gold blueprint guides, logo, contacts and QR', 'Locked-off, dot-grid canvas.',
   'A circle wipe out of the dark results. Gold blueprint guides and rings draw on, a radar sweep reveals the ink-and-gold Codech logo, then a gold bloom and shockwave. “Let’s build yours.” rises with website, email and phone pills and the WhatsApp QR card.', 'Radar-sweep mask, bloom, shockwave ring, kinetic type.', 'Holds to the end.', 'Logo impact; music resolves.')]),
]
STRIP = [('c1', 'vB', '1 · Problem'), ('c2', 'v21', '2 · Meet'), ('c3', 'v31', '3 · Order'), ('c4', 'v43', '4 · Systems'), ('c6', 'vF', '6 · Data problem'), ('c7', 'v62', '7 · Portal')]

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

chapters = ''
for a, n, title, time, goal, scenes in CH:
    chapters += f'''
    <div class="chapter" id="{a}">
      <div class="ch-head"><span class="chip">Chapter {n}</span><h3>{title}</h3><span class="ch-time">{time}</span></div>
      <p class="ch-goal">{goal}</p>
{''.join(scene_html(s) for s in scenes)}    </div>
'''
nframes = sum(len(c[5]) for c in CH)
script_rows = ''.join(f'        <tr><td class="t">{t}</td><td class="l">{h}</td><td>{w}</td></tr>\n' for t, h, w in SCRIPT)
strip = ''.join(f'<a href="#{a}"><img src="frames/{f}.jpg" alt="">{l}</a>' for a, f, l in STRIP)

body = f'''
<style>.newtag{{font:700 11px var(--body);letter-spacing:.08em;text-transform:uppercase;color:#fff;background:#E8803A;border-radius:99px;padding:3px 9px;vertical-align:middle;margin-left:8px}}</style>
<header class="top"><div class="wrap">
  <div class="brand"><i>C</i>Codech · Showcase film</div>
  <nav aria-label="Sections"><a href="#idea">The idea</a><a href="#script">Script</a><a href="#storyboard">Storyboard</a><a href="#look">Look &amp; sound</a><a href="#production">Production</a><a href="#review">Review</a></nav>
  <span class="status">{VERSION}</span>
</div></header>

<main class="wrap">
  <section class="hero">
    <span class="eyebrow">Codech · Marketing film · Case study: ShingTik Vegetarian</span>
    <h1>AI that books<br>{G('the orders.')}</h1>
    <p class="lede">A {LENGTH} showcase of what Codech builds for businesses, told through one real deployment. Each solution now starts from the problem it solves: an overwhelmed customer-service team, and business data nobody can see. Built in Remotion with ClickUp-style motion: kinetic type, exploded UI, match cuts and colour flips.</p>
    <div class="hero-frame"><img src="frames/vB.jpg" alt="Problem scene: every order retyped by hand into SQL Account"></div>
    <div class="facts">
      <div class="fact"><b>{LENGTH}</b><span>film + end card</span></div>
      <div class="fact"><b>10 chapters</b><span>{nframes} key frames</span></div>
      <div class="fact"><b>2 problems</b><span>set up before each solution</span></div>
      <div class="fact"><b>7 new</b><span>scenes in this draft</span></div>
    </div>
  </section>

  <section class="sec" id="idea">
    <div class="sec-head"><span class="eyebrow">01 · The idea</span><h2>Problem first, then the AI</h2>
      <p class="lede">The film tells two short stories. Each one opens with a problem every SME recognises and ends with the AI Codech built to solve it.</p></div>
    <div class="ideas">
      <div class="idea"><span class="eyebrow">Story 1 · Customer service</span><h3>CS is overwhelmed</h3><p>Hundreds of WhatsApp chats, orders in shorthand, photos and voice notes, every one retyped by hand from 1,800 look-alike products. The WhatsApp AI agent takes the routine so the team handles only the exceptions.</p></div>
      <div class="idea"><span class="eyebrow">Story 2 · Business data</span><h3>Data nobody can see</h3><p>The answers sit in SQL Account, and generic AI does not know your customers, products or numbers. Codech builds an AI that knows the business: live data, your names, your SOPs, your roles.</p></div>
      <div class="idea"><span class="eyebrow">Positioning</span><h3>Codech is the builder</h3><p>"Your AI agent", built by Codech; the hub is the AI System. ShingTik is credited as "Built for ShingTik Vegetarian" and appears in the real chats, screens and results.</p></div>
      <div class="idea"><span class="eyebrow">Accurate</span><h3>Real flows, demo data</h3><p>Chat flows mirror the live system and the portal screens come from the delivered prototype. Problem facts (467 customers on WhatsApp, 1,800 look-alike products, voice ≈ 1 in 4 messages) come from the project brief.</p></div>
    </div>
  </section>

  <section class="sec" id="script">
    <div class="sec-head"><span class="eyebrow">02 · The script</span><h2>{len(SCRIPT)} beats, one line each</h2>
      <p class="lede">The on-screen headlines. The voiceover will follow the same beats.</p></div>
    <div class="tablewrap"><table>
      <thead><tr><th>Time</th><th>Headline</th><th>What it shows</th></tr></thead>
      <tbody>
{script_rows}      </tbody></table></div>
  </section>

  <section class="sec" id="storyboard">
    <div class="sec-head"><span class="eyebrow">03 · Storyboard</span><h2>Ten chapters, two stories</h2>
      <p class="lede">Every frame here is taken from the actual Remotion render, so it shows the film as it is now. Scenes marked New were added in this draft.</p></div>
    <div class="strip">{strip}</div>
{chapters}  </section>

  <section class="sec" id="look">
    <div class="sec-head"><span class="eyebrow">04 · Look &amp; sound</span><h2>Bright, crisp, rhythmic</h2>
      <p class="lede">The Codech light theme with champagne gold and the orange AI orb; WhatsApp green and ink for the colour-flip beats.</p></div>
    <div class="pal">
      <div><i style="background:#FAF8F4"></i><span>Canvas<small>#FAF8F4</small></span></div>
      <div><i style="background:#0B0D12"></i><span>Ink<small>#0B0D12</small></span></div>
      <div><i style="background:#D4B895"></i><span>Champagne gold<small>#D4B895</small></span></div>
      <div><i style="background:#F59443"></i><span>AI orb orange<small>#F59443</small></span></div>
      <div><i style="background:#0E5B47"></i><span>WhatsApp green<small>#0E5B47</small></span></div>
      <div><i style="background:#7A5F37"></i><span>Gold text<small>#7A5F37</small></span></div>
    </div>
    <div class="cards4" style="margin-top:16px">
      <div class="idea"><span class="eyebrow">Type</span><h3>Kinetic headlines</h3><p>Manrope ExtraBold lines snap up from masks with a gold underline wipe; strike-throughs and word slams for the problem beats.</p></div>
      <div class="idea"><span class="eyebrow">UI</span><h3>Real screens, exploded</h3><p>The photoreal phone and the real portal screens, with key panels lifting off toward the camera.</p></div>
      <div class="idea"><span class="eyebrow">Transitions</span><h3>Match cuts, not fades</h3><p>Swirl into the orb, zoom through the avatar, whip pans, gold-line wipes and colour-flip circle wipes.</p></div>
      <div class="idea"><span class="eyebrow">Sound</span><h3>Music, VO and SFX</h3><p>An original 120 BPM track with chapter bells. Voiceover and synced sound effects are the next step.</p></div>
    </div>
  </section>

  <section class="sec" id="production">
    <div class="sec-head"><span class="eyebrow">05 · Production</span><h2>Built in Remotion</h2>
      <p class="lede">Each scene is a React component animated frame by frame with spring physics, rendered to 1080p. UI text stays sharp.</p></div>
    <div class="cards3">
      <div class="idea"><span class="eyebrow">Status</span><h3>Full cut v3 rendered</h3><p>All ten chapters, the opener and the end card are built and rendered with music.</p></div>
      <div class="idea"><span class="eyebrow">Next</span><h3>Voiceover + SFX</h3><p>Pick a voice; the VO is generated per beat and the cut is re-timed to it. Then sound effects on every pop, swipe and click.</p></div>
      <div class="idea"><span class="eyebrow">Delivery</span><h3>Three cuts</h3><p>16:9 master ({LENGTH}), a 9:16 cut for Reels and TikTok, and a 15–30 s bumper.</p></div>
    </div>
  </section>

  <section class="sec" id="review">
    <div class="sec-head"><span class="eyebrow">06 · Review</span><h2>What we need from you</h2></div>
    <ol class="q">
      <li><b>Problem scenes.</b> Do the seven new scenes tell the "why" clearly? Anything to add or cut?</li>
      <li><b>Length.</b> The master is now {LENGTH}. Keep it for LinkedIn and the website, and make a ~60 s cut for social?</li>
      <li><b>Voice.</b> If yes: Holden, Ainsley or Arthur?</li>
      <li><b>Voiceover.</b> Add a voiceover, or keep the film music and sound effects only?</li>
    </ol>
  </section>
</main>
<footer><div class="wrap">Codech showcase film · ShingTik Vegetarian case study · storyboard {VERSION.split(' ·')[0].lower()} · 1 Oct 2026</div></footer>
'''
head = (D / '_head.html').read_text(encoding='utf-8')
(D / 'index.html').write_text(head + '\n' + body, encoding='utf-8')
print('built', nframes, 'frames,', len(SCRIPT), 'beats')
