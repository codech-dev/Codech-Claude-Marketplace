"""Storyboard page for a Codech marketing film (Mode C), in the otso-expo-storyboard format: idea, script, chaptered
frames with On screen / Camera / Action / Motion / Transition / Sound, look & sound, production, review questions.
Edit the DATA below (never the generated index.html), run `python build.py`, publish index.html + frames/ as an Artifact.
Frames: frames/<frame>.jpg, 1920x1080 stills pulled from the Remotion render (draft 1 can use stills of single-scene renders).
Full worked example: examples/shingtik-marketing-film/storyboard-build.py."""
import pathlib
D = pathlib.Path(__file__).parent
G = lambda t: f'<em class="g">{t}</em>'

# ------------------------------------------------------------------ DATA
import json as _json
_TL = _json.loads((D.parent / 'remotion' / 'src' / 'timeline.json').read_text(encoding='utf-8'))
_ST = {}
_p = None
for _e in _TL:
    _s = _p[0] + _p[1] - _e.get('overlap', 0) if _p else 0
    _ST[_e['id']] = (_s, _s + _e['dur'])
    _p = (_s, _e['dur'])
_FILM = _p[0] + _p[1]
_f = lambda s: f'{int(s // 60)}:{int(s % 60):02d}'
tm = lambda i: f'{_f(_ST[i][0])} – {_f(_ST[i][1])}'
at = lambda i: _f(_ST[i][0])
span = lambda a, b: f'{_f(_ST[a][0])} – {_f(_ST[b][1])}'

CLIENT = 'OTSO Markets'
TITLE = 'OTSO Showcase Storyboard'
VERSION = 'Draft v4.2 · Case study'
LENGTH = f'~{_f(_FILM)}'
HERO = ('An AI-powered', 'file storage platform.')
HERO_FRAME = ('meet', 'Our solution: the cobalt scan beam sweeps the archive and the glass document slabs fall into order')
LEDE = f'A {LENGTH} Codech case study. It shows who OTSO Markets is, the challenges they faced with their documents, and the solution we proposed and built for them: an AI-powered file storage platform. Then it shows how we delivered it and the results. Midnight Vault look, with focused mini UIs.'
FACTS = [(LENGTH, 'film + end card'), ('4 parts', 'challenge · solution · delivery · results'), ('28 frames', 'key frames below'), ('No VO', 'music + sound effects')]
IDEAS = [
 ('Story · Case study', 'Challenge → our solution → results', 'The client and their challenges come first: documents scattered across personal drives and email, a regulated business where nothing can slip, filename-only search, scans that can\'t be read. Then our solution, an AI-powered file storage platform, then how we delivered it and the results. A chapter tag in the corner keeps the case-study structure visible.'),
 ('Look · Midnight Vault', 'A dark archive, lit by AI', 'Deep navy space. Documents are frosted-glass slabs, the AI is a cobalt scan beam, compliance is a vault door. The product appears as focused mini UIs in OTSO\'s own styling. No subscription or price claims, no competitor names.'),
 ('Accurate', 'From the project brief', 'The challenges and numbers come from the brief, worded exactly. Every mini UI recreates a delivered OTSO feature with demo data. Team Chat is shown as production in this film (your decision). OTSO\'s consent to be named is still pending.'),
]
SCRIPT = [
 (at('opener'), f'{G("AI-powered")} file storage platform', 'A Codech case study: the beam reveals the Codech logo; the solution is the title; "Proposed for" OTSO Markets (logo) below.'),
 (at('scatter'), f'Documents {G("everywhere.")}', 'Challenge 1: KYC files, agreements and policies scattered across drives, email and chat.'),
 (at('regulated'), f'A regulated business. Nothing can {G("slip.")}', 'Challenge 2: every change audited, no leaks through links, legal holds, files kept away from AI.'),
 (at('searchfail'), f'Search by {G("filename?")}', 'Challenge 3: a real question returns 0 results.'),
 (at('invisible'), f'Scans are {G("invisible.")}', 'Challenge 4: scanned PDFs and images can\'t be searched. The beam arrives.'),
 (at('meet'), f'An {G("AI-powered")} file storage platform.', 'Our solution: the beam ignites and the archive falls into order. Music drop.'),
 (at('pillars'), f'One platform, built for {G("OTSO.")}', 'Store · Share · Manage, with AI in every step.'),
 (at('drives'), f'Every drive. {G("One place.")}', 'Store: drives and shared drives.'),
 (at('upload'), f'Staff choose what AI {G("sees.")}', 'Store: staged upload, one file switched out of AI.'),
 (at('versions'), f'Every version {G("kept.")}', 'Store: version history and a word-level compare.'),
 (at('search'), f'Search by {G("meaning.")}', 'Find: results by meaning, from a scan and in Chinese.'),
 (at('pipeline'), f'Every file, {G("understood.")}', 'Find: four gates, from text to an AI summary.'),
 (at('summary'), f'AI reads it {G("first.")}', 'Find: AI reads a scan; summary, tags, key facts.'),
 (at('langs'), f'Four {G("languages.")}', 'Find: English, 中文, Tiếng Việt, Bahasa Indonesia.'),
 (at('share'), f'Nothing {G("leaks.")}', 'Share: classification steps to Restricted; links lock.'),
 (at('copies'), f'Chat apps send {G("copies.")}', 'Share: the problem with sending files in chat.'),
 (at('send'), f'Send the {G("real file.")}', 'Share: send a folder; the courtesy check offers to share.'),
 (at('chat'), f'Files stay {G("documents.")}', 'Share: team chat; a restricted file stays locked.'),
 (at('assist'), f'Answers, with {G("sources.")}', 'AI assistant: answers from the AML policy and cites it.'),
 (at('confirm'), f'A person {G("confirms.")}', 'AI assistant: proposed action → Confirm → Done.'),
 (at('vault'), f'Audited. Held. {G("Locked.")}', 'Manage: the vault door bolts shut.'),
 (at('audit'), f'Compliance by {G("default.")}', 'Manage: append-only events stream in; legal hold on.'),
 (at('own'), f"In OTSO's own {G('cloud.')}", 'The platform as a glass server stack in OTSO\'s own cloud (Singapore region).'),
 (at('stack'), f'Plugs into your {G("stack.")}', 'Constellation of the systems it connects to.'),
 (at('grows'), f'Built to {G("grow.")}', 'Team chat added on the same platform; a dashed slot for the next module.'),
 (at('process'), f'Prototype first. Then {G("built.")}', 'How we delivered: requirements → clickable prototype approved by OTSO → production tested against it.'),
 (at('results'), f'37 days, to {G("production.")}', 'The results: 37 / 130 / 4 / +58% / 1,700+.'),
 (at('end'), f"Let's build {G('yours.')}", 'Codech end card: the beam reveals the logo; contacts, QR.'),
]
NEW = {'opener', 'regulated', 'meet', 'pillars', 'upload', 'confirm', 'own', 'grows', 'process'}
S = lambda *a: a
CH = [
 ('c1', 1, 'Opener', tm('opener'), 'The solution as the title, proposed for OTSO Markets.', [
  S('opener', '1.1', tm('opener'), 'Opener', f'{G("AI-powered")} file storage platform', 'A Codech case study · Proposed for OTSO Markets · AI document search · AI assistant · Team chat',
    'Codech logo alone at the top; the solution as the title; the OTSO logo in the subtitle below', 'Locked-off, centred.', 'The cobalt beam sweeps across and reveals the Codech logo; A CODECH CASE STUDY; the title lands with a light sweep through "AI-powered"; "Proposed for [OTSO logo] OTSO Markets" fades up; three glass pills rise. The client sits under the solution, not beside Codech, so it reads as our work for them rather than a partnership.', 'Beam reveal, mask snaps.', 'Zoom-through blur.', 'Low drone, beam whoosh, logo hits.'),
 ]),
 ('c2', 2, 'The challenge', span('scatter', 'invisible'), 'What OTSO was facing, from the project brief.', [
  S('scatter', '2.1', tm('scatter'), 'Documents everywhere', f'Documents {G("everywhere.")}', 'Found by nobody. (struck out in red)',
    'Glass slabs tumbling, tagged DOWNLOADS, EMAIL, WHATSAPP, LAPTOP', 'Locked-off, slabs drifting in depth.', 'KYC files, agreements and policies fly in from personal drives, email and chat; "Found by nobody." is struck through.', 'Springs, tumble, red strike.', 'Whip left.', 'Glassy ticks, hit on the strike.'),
  S('regulated', '2.2', tm('regulated'), 'A regulated business', f'A regulated business. Nothing can {G("slip.")}', 'Every change audited · No leaks through share links · Legal holds block deletion · Any file kept away from AI',
    'Four glass REQUIRED cards stacking in', 'Locked-off.', 'The headline lands; four requirements slide in tagged REQUIRED.', 'Staggered slide-ins.', 'Whip left.', 'Four stamp hits.'),
  S('searchfail', '2.3', tm('searchfail'), 'Filename-only search', f'Search by {G("filename?")}', '0 results',
    'Glass search box with a red 0 results', 'Front ¾.', 'A real question types in; the box shakes; 0 results.', 'Typewriter, shake.', 'Collapse to a point of light.', 'Typing, error buzz.'),
  S('invisible', '2.4', tm('invisible'), 'Invisible scans', f'Scans are {G("invisible.")}', "Search can't read a photo of a page.",
    'Blank glass scans tagged NO TEXT; the beam arrives at the edge', 'Locked-off.', 'Blank scans fade in; the beam slides in from the right, about to read them.', 'Beam entrance.', 'The beam ignites into the solution.', 'Hollow tone, beam hum rising.'),
 ]),
 ('c3', 3, 'Our solution', span('meet', 'pillars'), 'What Codech proposed and built: an AI-powered file storage platform.', [
  S('meet', '3.1', tm('meet'), 'The solution', f'An {G("AI-powered")} file storage platform.', 'Our solution · Built by Codech for OTSO Markets',
    'The beam sweeps the archive; slabs snap into one lit row', 'Locked-off, floor glow.', 'A flash; the beam ignites and sweeps; every slab it passes lights and snaps into line; OUR SOLUTION, then the headline.', 'Flash, beam sweep, snaps.', 'Cut on the bar.', 'Music drop on the flash; beam whoosh; chimes.'),
  S('pillars', '3.2', tm('pillars'), 'Store · Share · Manage', f'One platform, built for {G("OTSO.")}', 'With AI in every step',
    'Three glass pillars: Store, Share, Manage', 'Locked-off, low angle.', 'Three glass cards rise and tip upright one after another.', 'Rise + tilt springs.', 'Whip left into the product.', 'Three rising hits.'),
 ]),
 ('c4', 4, 'Solution · Store', span('drives', 'versions'), 'Every document in one place, on OTSO\'s terms.', [
  S('drives', '4.1', tm('drives'), 'Every drive', f'Every drive. {G("One place.")}', '',
    'Mini UI: navy sidebar, Home with four drive cards, the New menu open', 'Front ¾ from the right.', 'Shared drives list in; four drive cards pop in; the cursor clicks New and the menu opens.', 'Staggered pops, click.', 'Whip left.', 'Pops, click, menu swish.'),
  S('upload', '4.2', tm('upload'), 'Staff choose what AI sees', f'Staff choose what AI {G("sees.")}', 'Nothing uploads until you click.',
    'Mini UI: three staged files with AI toggles; one switched off', 'Low hero angle from the left.', 'Files stage ("nothing sent yet"); the passport scan is switched out of AI; Upload 3 files → progress → Uploaded.', 'Toggle, progress bars.', 'Whip left.', 'Toggle click, whirr, tick.'),
  S('versions', '4.3', tm('versions'), 'Every version kept', f'Every version {G("kept.")}', 'Compare any two, word by word.',
    'Mini UI: version history with faces; a v2 → v3 word compare', 'Front ¾, slight overhead.', 'Versions list in; "April" strikes red, "March" lands green.', 'Diff pops.', 'Whip left.', 'Soft ticks.'),
 ]),
 ('c5', 5, 'Solution · Find', span('search', 'langs'), 'Search by meaning, and AI that reads even scans, in four languages.', [
  S('search', '5.1', tm('search'), 'Search by meaning', f'Search by {G("meaning.")}', 'English, 中文 and scanned PDFs.',
    'Mini UI: semantic search with three results and match %', 'Front ¾ from the right.', 'The question types; three results land (the weekly notes by meaning, the scanned KYC PDF, a Chinese policy); the top hit lifts.', 'Typewriter, results, lift.', 'Whip right.', 'Typing, ticks, ding.'),
  S('pipeline', '5.2', tm('pipeline'), 'The AI pipeline', f'Every file, {G("understood.")}', 'In the background · uploads never wait',
    'A slab rides the beam through four glass gates', 'Locked-off, side on.', 'Lights at Extract, splits at Chunk, becomes vectors at Embed, leaves Analyse as a summary card.', 'Gate flares, morphs.', 'Zoom into the last gate.', 'Four gate pulses.'),
  S('summary', '5.3', tm('summary'), 'AI reads it first', f'AI reads it {G("first.")}', 'Summary, tags and key facts, even from a scan.',
    'Mini UI: a scanned KYC PDF; "AI is reading…" → summary, tags, key facts', 'Lying back, from the left.', 'A shimmer while AI reads; the summary types out; tags and four key facts pop in.', 'Shimmer, typewriter, pops.', 'Whip left.', 'Shimmer hum, ticks.'),
  S('langs', '5.4', tm('langs'), 'Four languages', f'Four {G("languages.")}', 'English · 中文 · Tiếng Việt · Bahasa Indonesia',
    'Mini UI: one Home card relabelling in four languages', 'Overhead flat card.', 'The active chip walks through four languages; the card relabels each time.', 'Blur swaps.', 'Whip left.', 'A click per language.'),
 ]),
 ('c6', 6, 'Solution · Share', span('share', 'chat'), 'Sharing that follows the rules, and a chat where files stay documents.', [
  S('share', '6.1', tm('share'), 'Nothing leaks', f'Nothing {G("leaks.")}', "Sharing follows each file's classification.",
    'Mini UI: share dialog with faces, classification chips, external link', 'Front ¾ from the left.', 'The classification steps to Restricted; the link turns red and laser bars seal it.', 'Chip steps, laser draw.', 'Whip left.', 'Clicks, laser zap, lock.'),
  S('copies', '6.2', tm('copies'), 'Chat apps send copies', f'Chat apps send {G("copies.")}', 'No classification. No audit trail. No way back.',
    'Agreement (1)…(7).pdf slabs multiplying', 'Locked-off.', 'Copies stack up, each tagged SENT / FWD / ???.', 'Stagger pops.', 'Cut.', 'Rapid pops.'),
  S('send', '6.3', tm('send'), 'Send the real file', f'Send the {G("real file.")}', 'Not a copy. Access checked first.',
    'Mini UI: Send file / folder with the courtesy check', 'Front ¾ from the right.', 'Pick Client Agreements; an amber check says 2 people can\'t open it; Share with them → green; Send.', 'Check, warning, buttons.', 'Whip left.', 'Click, warning tone, chime.'),
  S('chat', '6.4', tm('chat'), 'Team chat', f'Files stay {G("documents.")}', 'Permissions checked on every click',
    'Mini UI: #deals-desk with photo avatars; a CONFIDENTIAL file and a locked RESTRICTED one', 'Front ¾, slight tilt.', 'Messages pop in; the agreement keeps its badge; the restricted file shows "You don\'t have access".', 'Message pops.', 'Whip left.', 'Pops, lock click.'),
 ]),
 ('c7', 7, 'Solution · AI assistant', span('assist', 'confirm'), 'Answers with sources, and changes only after a person confirms.', [
  S('assist', '7.1', tm('assist'), 'Answers with sources', f'Answers, with {G("sources.")}', 'Only from files the user can access.',
    'Mini UI: OTSO Assistant panel: question, answer bullets, referenced file', 'Front ¾ from the right.', 'The question types and sends; "Searched your documents"; three bullets; the cited AML & CFT Policy 2026.pdf glows.', 'Typewriter, pops, glow.', 'Hard cut.', 'Typing, send, ding.'),
  S('confirm', '7.2', tm('confirm'), 'A person confirms', f'A person {G("confirms.")}', 'The AI proposes. Staff decide.',
    'Mini UI: proposed-action card; cursor on Confirm', 'Front, card tilted.', 'A "Create folder" proposal swings in; Confirm → Done.', 'Swing, click.', 'Zoom through into the vault.', 'Click, chime.'),
 ]),
 ('c8', 8, 'Solution · Manage', span('vault', 'grows'), 'Compliance by default, in OTSO\'s own cloud, built to grow.', [
  S('vault', '8.1', tm('vault'), 'The vault door', f'Audited. Held. {G("Locked.")}', '',
    'A giant round vault door', 'Locked-off, push in.', 'Rings spin; twelve bolts slam shut; three words slam in.', 'Rotation, bolt slam, shake.', 'Straight into the audit trail.', 'Spin, three clunks.'),
  S('audit', '8.2', tm('audit'), 'Audit trail', f'Compliance by {G("default.")}', 'Append-only, enforced by the database',
    'Mini UI: audit trail; events stream in; legal hold on', 'Front ¾, slight overhead.', 'KPI tiles pop; five events stream in from the top; Legal hold switches on; four controls tick in.', 'Stream, toggle, ticks.', 'Whip left.', 'Ticks, toggle.'),
  S('own', '8.3', tm('own'), "OTSO's own cloud", f"In OTSO's own {G('cloud.')}", 'Runs in their own cloud account · Microsoft sign-in · their classification levels · their drives · four languages',
    'A glass server stack labelled OTSO CLOUD · SINGAPORE REGION', 'Slow orbit.', 'The stack rises with blinking lights; five chips spring out around it.', 'Rise, chip springs.', 'Whip left.', 'Server hum, pops.'),
  S('stack', '8.4', tm('stack'), 'Plugs into the stack', f'Plugs into your {G("stack.")}', '',
    'Constellation: the AI Workspace star linked to seven system tiles', 'Locked-off.', 'Lines of light draw out to Microsoft Entra SSO, OpenAI, PostgreSQL + pgvector, Redis, Docker, Tencent Cloud, CI.', 'Line draws, travelling light.', 'Cut.', 'Pop per tile.'),
  S('grows', '8.5', tm('grows'), 'Built to grow', f'Built to {G("grow.")}', 'Team chat added on the same platform.',
    'Four glass module tiles; the last dashed: Next module', 'Tilted floor.', 'Documents & AI search, AI assistant and Team chat drop in; a dashed slot appears for the next module.', 'Drop-in springs.', 'Cut.', 'Three drops, shimmer.'),
 ]),
 ('c9', 9, 'How we delivered + results', span('process', 'end'), 'Prototype-first delivery, the measured results, and the call to action.', [
  S('process', '9.1', tm('process'), 'How we delivered', f'Prototype first. Then {G("built.")}', 'Requirements → clickable prototype, approved by OTSO → production, every screen tested against the prototype',
    'Three numbered steps on a beam of light', 'Locked-off.', 'The line draws; Requirements, Clickable prototype and Production spring in.', 'Line draw, step springs.', 'Push into the results.', 'Three rising hits.'),
  S('results', '9.2', tm('results'), 'The results', f'37 days, to {G("production.")}', '130 staff accounts · 4 languages · +58% faster downloads for staff in China · 1,700+ automated tests',
    'A huge glass-cobalt 37 days; four glass stat cards', 'Low hero angle.', 'A circle wipe opens on 37 counting up; four cards rise.', 'Count-up, cards.', 'Circle wipe to the end card.', 'Count ticks, big hit.'),
  S('end', '9.3', tm('end'), 'End card', f"Let's build {G('yours.')}", 'codech.co · codech.co@gmail.com · +6013-9473347 · WhatsApp QR',
    'The beam sweeps the Codech logo on; contacts and QR', 'Locked-off.', 'Rings draw around the C mark; the beam reveals the logo; headline, contacts and QR spring in.', 'Beam reveal, springs.', 'Hold.', 'Shimmer, logo hit, outro.'),
 ]),
]
STRIP = [('c1', 'opener', '1 · Opener'), ('c2', 'regulated', '2 · Challenge'), ('c3', 'meet', '3 · Solution'), ('c4', 'upload', '4 · Store'), ('c5', 'search', '5 · Find'), ('c6', 'send', '6 · Share'), ('c7', 'assist', '7 · Assistant'), ('c8', 'vault', '8 · Manage'), ('c9', 'results', '9 · Results')]
PALETTE = [('#070B18', 'Midnight'), ('#0D1836', 'Deep navy'), ('#3D7BFF', 'Cobalt beam'), ('#9DBBFF', 'Ice'), ('#FFFFFF', 'Mini-UI cards (OTSO styling)'), ('#D4B895', 'Codech gold (logo only)')]
REVIEW = [
 ('Case study', 'Challenge → our solution → how we delivered → results. Does it read as a case study now?'),
 ('Challenges', 'Four challenges from the brief: scattered documents, a regulated business, filename-only search, unreadable scans. Right ones?'),
 ('Length', f'{LENGTH} now. Trim to ~1:20 by cutting e.g. "Chat apps send copies" and "Plugs into your stack"?'),
 ('Team Chat', 'Shown as production with no label, per your call. The case-study page still says "In build".'),
 ('Consent', 'OTSO consent is still unconfirmed: the film can be finished but not posted until they approve.'),
 ('Next', 'After your OK: scene-by-scene animation polish, silent cut, then a dark cinematic electronic Mixkit shortlist, then SFX.'),
]
DATE = '3 Oct 2026'
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
